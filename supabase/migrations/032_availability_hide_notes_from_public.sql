-- The public (anon) key could read every column of `availability`, including
-- `note` and `source_inquiry_id`. Notes are written by the admin and by the
-- reservation function ("Iz upita RNT-..."), and a hand-written note may name
-- a customer. The site only needs to know which days are taken.
--
-- Row access stays as it is (policy "public_read_availability", migration
-- 017). This narrows the columns: anon may read the four the calendars use
-- and nothing else. Logged-in admins (role authenticated) and the service
-- role are not affected.
--
-- Undo: GRANT SELECT ON public.availability TO anon;

REVOKE SELECT ON public.availability FROM anon;
GRANT SELECT (id, product_id, date, qty_booked) ON public.availability TO anon;
