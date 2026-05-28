
-- 1) Remove client-writable policies on subscriptions (plan upgrades must come from backend)
DROP POLICY IF EXISTS "Users insert own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users update own subscription" ON public.subscriptions;

-- 2) Restrict SECURITY DEFINER helper functions to authenticated callers only
REVOKE ALL ON FUNCTION public.check_and_increment_usage(text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_my_usage_summary() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_and_increment_usage(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_usage_summary() TO authenticated;

-- 3) handle_new_user is a trigger function only — should not be callable via API
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
