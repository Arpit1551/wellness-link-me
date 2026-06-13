CREATE POLICY "Browser role creation is denied" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY "Browser role changes are denied" ON public.user_roles FOR UPDATE TO authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Browser role removal is denied" ON public.user_roles FOR DELETE TO authenticated USING (false);