ALTER PUBLICATION supabase_realtime DROP TABLE public.appointments;
ALTER PUBLICATION supabase_realtime DROP TABLE public.payments;
ALTER PUBLICATION supabase_realtime DROP TABLE public.meetings;

CREATE POLICY "Only doctors create payment records" ON public.payments FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'DOCTOR'));
CREATE POLICY "Only doctors update payment records" ON public.payments FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'DOCTOR')) WITH CHECK (private.has_role(auth.uid(), 'DOCTOR'));
CREATE POLICY "Only doctors delete payment records" ON public.payments FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'DOCTOR'));
CREATE POLICY "Only doctors create meetings" ON public.meetings FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'DOCTOR'));
CREATE POLICY "Only doctors update meetings" ON public.meetings FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'DOCTOR')) WITH CHECK (private.has_role(auth.uid(), 'DOCTOR'));
CREATE POLICY "Only doctors delete meetings" ON public.meetings FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'DOCTOR'));
CREATE POLICY "Only doctors assign roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'DOCTOR'));
CREATE POLICY "Only doctors update roles" ON public.user_roles FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'DOCTOR')) WITH CHECK (private.has_role(auth.uid(), 'DOCTOR'));
CREATE POLICY "Only doctors delete roles" ON public.user_roles FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'DOCTOR'));
CREATE POLICY "Users delete own profile" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = id);