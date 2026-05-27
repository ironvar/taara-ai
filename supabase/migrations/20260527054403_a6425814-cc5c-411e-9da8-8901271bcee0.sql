
-- Subscriptions: one row per user, tracks current plan
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','premium','pro')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','canceled','past_due','trialing')),
  current_period_end TIMESTAMPTZ,
  provider TEXT,
  provider_customer_id TEXT,
  provider_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own subscription" ON public.subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own subscription" ON public.subscriptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own subscription" ON public.subscriptions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Daily usage counters: one row per (user, day, kind)
CREATE TABLE public.usage_counters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('chat','image','video')),
  day DATE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, kind, day)
);
CREATE INDEX usage_counters_user_day_idx ON public.usage_counters (user_id, day);
GRANT SELECT ON public.usage_counters TO authenticated;
GRANT ALL ON public.usage_counters TO service_role;
ALTER TABLE public.usage_counters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own usage" ON public.usage_counters FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER usage_counters_updated_at BEFORE UPDATE ON public.usage_counters FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Payment events log (for invoices / history)
CREATE TABLE public.payment_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  amount_cents INTEGER,
  currency TEXT,
  status TEXT,
  raw JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.payment_events TO authenticated;
GRANT ALL ON public.payment_events TO service_role;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own payments" ON public.payment_events FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Plan limits constants (server reads these in RPC)
-- Atomic check + increment. Returns:
--   { allowed: bool, plan: text, used: int, limit: int, remaining: int }
CREATE OR REPLACE FUNCTION public.check_and_increment_usage(_kind TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid UUID := auth.uid();
  _plan TEXT;
  _limit INT;
  _today DATE := (now() AT TIME ZONE 'utc')::date;
  _used INT;
BEGIN
  IF _uid IS NULL THEN
    RETURN jsonb_build_object('allowed', false, 'error', 'unauthenticated');
  END IF;
  IF _kind NOT IN ('chat','image','video') THEN
    RETURN jsonb_build_object('allowed', false, 'error', 'bad_kind');
  END IF;

  SELECT plan INTO _plan FROM public.subscriptions WHERE user_id = _uid;
  IF _plan IS NULL THEN
    INSERT INTO public.subscriptions (user_id, plan) VALUES (_uid, 'free')
      ON CONFLICT (user_id) DO NOTHING;
    _plan := 'free';
  END IF;

  -- Limits per plan (NULL = unlimited)
  _limit := CASE _plan
    WHEN 'free'    THEN CASE _kind WHEN 'chat' THEN 20 WHEN 'image' THEN 5  WHEN 'video' THEN 3  END
    WHEN 'premium' THEN CASE _kind WHEN 'chat' THEN 50 WHEN 'image' THEN 20 WHEN 'video' THEN 15 END
    WHEN 'pro'     THEN CASE _kind WHEN 'chat' THEN NULL WHEN 'image' THEN 50 WHEN 'video' THEN 30 END
  END;

  -- Upsert today's counter and increment atomically
  INSERT INTO public.usage_counters (user_id, kind, day, count)
  VALUES (_uid, _kind, _today, 0)
  ON CONFLICT (user_id, kind, day) DO NOTHING;

  IF _limit IS NOT NULL THEN
    SELECT count INTO _used FROM public.usage_counters WHERE user_id=_uid AND kind=_kind AND day=_today FOR UPDATE;
    IF _used >= _limit THEN
      RETURN jsonb_build_object('allowed', false, 'plan', _plan, 'used', _used, 'limit', _limit, 'remaining', 0, 'error', 'limit_reached');
    END IF;
  END IF;

  UPDATE public.usage_counters
    SET count = count + 1
    WHERE user_id=_uid AND kind=_kind AND day=_today
    RETURNING count INTO _used;

  RETURN jsonb_build_object(
    'allowed', true,
    'plan', _plan,
    'used', _used,
    'limit', _limit,
    'remaining', CASE WHEN _limit IS NULL THEN NULL ELSE _limit - _used END
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.check_and_increment_usage(TEXT) TO authenticated, service_role;

-- Read helper: returns today's usage for current user across all kinds + plan
CREATE OR REPLACE FUNCTION public.get_my_usage_summary()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid UUID := auth.uid();
  _plan TEXT;
  _today DATE := (now() AT TIME ZONE 'utc')::date;
  _chat INT; _image INT; _video INT;
BEGIN
  IF _uid IS NULL THEN
    RETURN jsonb_build_object('error','unauthenticated');
  END IF;
  SELECT plan INTO _plan FROM public.subscriptions WHERE user_id=_uid;
  IF _plan IS NULL THEN _plan := 'free'; END IF;
  SELECT COALESCE(count,0) INTO _chat  FROM public.usage_counters WHERE user_id=_uid AND kind='chat'  AND day=_today;
  SELECT COALESCE(count,0) INTO _image FROM public.usage_counters WHERE user_id=_uid AND kind='image' AND day=_today;
  SELECT COALESCE(count,0) INTO _video FROM public.usage_counters WHERE user_id=_uid AND kind='video' AND day=_today;
  RETURN jsonb_build_object(
    'plan', _plan,
    'day', _today,
    'chat', COALESCE(_chat,0),
    'image', COALESCE(_image,0),
    'video', COALESCE(_video,0)
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_my_usage_summary() TO authenticated, service_role;
