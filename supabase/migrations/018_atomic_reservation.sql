-- ============================================================
-- rentanje.com — Atomic reservation + atomic counters
-- ============================================================
-- 1) reserve_inquiry_availability: closes the overbooking race in
--    /api/inquiry. The previous flow checked availability and then
--    inserted rows in separate round-trips, so two concurrent
--    inquiries for the last unit could both pass the check. This
--    function locks the affected product rows (FOR UPDATE), re-checks
--    remaining stock per (product, date) and inserts the reservation
--    rows in ONE transaction. With p_force = true (admin re-sync) the
--    check is skipped and rows are written unconditionally.
--
-- 2) increment_promo_usage / increment_product_view: replace
--    read-then-write counter bumps in the API routes with single
--    atomic UPDATE statements so concurrent requests don't lose hits.
-- ============================================================

CREATE OR REPLACE FUNCTION public.reserve_inquiry_availability(
  p_inquiry_id     uuid,
  p_inquiry_number text,
  p_items          jsonb,
  p_force          boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conflicts jsonb := '[]'::jsonb;
BEGIN
  -- Serialize concurrent reservations that touch the same products.
  -- Ordered by id so two overlapping carts always lock in the same
  -- order and cannot deadlock each other.
  PERFORM 1
  FROM products p
  WHERE p.id IN (
    SELECT DISTINCT (item->>'productId')::uuid
    FROM jsonb_array_elements(p_items) AS item
  )
  ORDER BY p.id
  FOR UPDATE;

  IF NOT p_force THEN
    -- Per-(product, date) demand from the cart vs. remaining stock after
    -- summing every existing availability row (manual blocks + other
    -- inquiries). Rows belonging to THIS inquiry are excluded so a
    -- re-run for the same inquiry stays idempotent.
    SELECT COALESCE(
             jsonb_agg(
               jsonb_build_object(
                 'productId',   c.product_id,
                 'productName', c.product_name,
                 'dates',       c.dates
               )
             ),
             '[]'::jsonb
           )
    INTO v_conflicts
    FROM (
      SELECT d.product_id,
             p.name AS product_name,
             jsonb_agg(to_char(d.date, 'YYYY-MM-DD') ORDER BY d.date) AS dates
      FROM (
        SELECT (item->>'productId')::uuid AS product_id,
               gs.day::date               AS date,
               SUM(GREATEST(COALESCE((item->>'qty')::int, 1), 1)) AS demand
        FROM jsonb_array_elements(p_items) AS item
        CROSS JOIN LATERAL generate_series(
          (item->>'rentalStart')::date,
          (item->>'rentalEnd')::date,
          interval '1 day'
        ) AS gs(day)
        GROUP BY 1, 2
      ) d
      JOIN products p ON p.id = d.product_id
      LEFT JOIN LATERAL (
        SELECT COALESCE(SUM(a.qty_booked), 0) AS booked
        FROM availability a
        WHERE a.product_id = d.product_id
          AND a.date = d.date
          AND a.source_inquiry_id IS DISTINCT FROM p_inquiry_id
      ) b ON true
      WHERE p.stock_qty - b.booked < d.demand
      GROUP BY d.product_id, p.name
    ) c;

    IF v_conflicts <> '[]'::jsonb THEN
      -- Nothing inserted: the caller decides what to do with the inquiry.
      RETURN v_conflicts;
    END IF;
  END IF;

  -- Idempotent: clear any prior rows from this inquiry, then write fresh.
  DELETE FROM availability WHERE source_inquiry_id = p_inquiry_id;

  INSERT INTO availability (product_id, date, qty_booked, note, source_inquiry_id)
  SELECT d.product_id,
         d.date,
         d.demand,
         'Iz upita ' || p_inquiry_number,
         p_inquiry_id
  FROM (
    SELECT (item->>'productId')::uuid AS product_id,
           gs.day::date               AS date,
           SUM(GREATEST(COALESCE((item->>'qty')::int, 1), 1)) AS demand
    FROM jsonb_array_elements(p_items) AS item
    CROSS JOIN LATERAL generate_series(
      (item->>'rentalStart')::date,
      (item->>'rentalEnd')::date,
      interval '1 day'
    ) AS gs(day)
    GROUP BY 1, 2
  ) d;

  RETURN '[]'::jsonb;
END;
$$;

REVOKE ALL ON FUNCTION public.reserve_inquiry_availability(uuid, text, jsonb, boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_inquiry_availability(uuid, text, jsonb, boolean) TO service_role;

-- Atomic usage_count bump (replaces read-then-write in /api/inquiry).
CREATE OR REPLACE FUNCTION public.increment_promo_usage(p_promotion_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE promotions
  SET usage_count = COALESCE(usage_count, 0) + 1
  WHERE id = p_promotion_id;
$$;

REVOKE ALL ON FUNCTION public.increment_promo_usage(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_promo_usage(uuid) TO service_role;

-- Atomic view_count bump (replaces read-then-write in /api/track-view).
CREATE OR REPLACE FUNCTION public.increment_product_view(p_product_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE products
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = p_product_id;
$$;

REVOKE ALL ON FUNCTION public.increment_product_view(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_product_view(uuid) TO service_role;
