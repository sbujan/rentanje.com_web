-- ============================================================
-- rentanje.com — Rate limiting table
-- Replaces the in-memory Map that did not survive serverless
-- function restarts or distribute across instances on Vercel.
-- ============================================================

CREATE TABLE IF NOT EXISTS rate_limit_hits (
  id         bigserial PRIMARY KEY,
  ip         text NOT NULL,
  endpoint   text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_hits_lookup
  ON rate_limit_hits (endpoint, ip, created_at DESC);

ALTER TABLE rate_limit_hits ENABLE ROW LEVEL SECURITY;

-- No anon/auth policies: only the service role (which bypasses RLS) can
-- read and write this table from the API routes.

-- Helper: count hits for (endpoint, ip) inside a time window and record a
-- new hit in one round-trip. Returns the count *before* recording so the
-- caller can compare against its own limit.
CREATE OR REPLACE FUNCTION public.record_rate_limit_hit(
  p_ip       text,
  p_endpoint text,
  p_window_s integer
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  hit_count integer;
BEGIN
  SELECT count(*) INTO hit_count
  FROM rate_limit_hits
  WHERE endpoint = p_endpoint
    AND ip = p_ip
    AND created_at > now() - make_interval(secs => p_window_s);

  INSERT INTO rate_limit_hits (ip, endpoint) VALUES (p_ip, p_endpoint);
  RETURN hit_count;
END;
$$;

REVOKE ALL ON FUNCTION public.record_rate_limit_hit(text, text, integer) FROM PUBLIC;
-- Only service_role (used by our API routes) should call this.
GRANT EXECUTE ON FUNCTION public.record_rate_limit_hit(text, text, integer) TO service_role;

-- Housekeeping: delete hits older than a day. Call from a Supabase cron or
-- from any request occasionally (best-effort).
CREATE OR REPLACE FUNCTION public.prune_rate_limit_hits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM rate_limit_hits WHERE created_at < now() - interval '1 day';
$$;

REVOKE ALL ON FUNCTION public.prune_rate_limit_hits() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.prune_rate_limit_hits() TO service_role;
