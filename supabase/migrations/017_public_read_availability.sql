-- ============================================================
-- rentanje.com — Public read access to availability
-- ============================================================
-- The public product page reads `availability` with the anon/publishable
-- key (src/lib/supabase/server.ts) to render the booking calendar. But
-- `availability` never got a public SELECT policy in 001 — only admin
-- policies exist — so RLS returned ZERO rows to anonymous visitors. The
-- calendar therefore always showed every date as free, while the inquiry
-- submit (service-role client, bypasses RLS) correctly saw the booking and
-- rejected the dates. Net effect: dates look available but fail on submit.
--
-- Add the missing public read policy, mirroring every other public_read_*
-- policy. Exposed columns (date, qty_booked, and the internal note /
-- source_inquiry_id) carry no customer PII — only which dates are taken,
-- which is exactly what a public availability calendar must show.
-- ============================================================

DROP POLICY IF EXISTS "public_read_availability" ON availability;
CREATE POLICY "public_read_availability"
  ON availability FOR SELECT USING (true);
