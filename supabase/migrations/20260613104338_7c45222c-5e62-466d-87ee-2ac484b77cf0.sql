REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM authenticated;
DROP POLICY IF EXISTS "Only doctors assign roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only doctors update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only doctors delete roles" ON public.user_roles;