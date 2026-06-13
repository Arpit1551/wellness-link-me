CREATE TYPE public.app_role AS ENUM ('PATIENT', 'DOCTOR');
CREATE TYPE public.appointment_status AS ENUM ('BOOKED', 'PAID', 'COMPLETED', 'CANCELLED');
CREATE TYPE public.payment_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  email text NOT NULL CHECK (char_length(email) <= 255),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 30),
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL DEFAULT 'PATIENT',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(), 'DOCTOR'));
CREATE POLICY "Users create own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone)
  VALUES (NEW.id, COALESCE(NULLIF(NEW.raw_user_meta_data->>'name',''), split_part(NEW.email, '@', 1)), NEW.email, NEW.raw_user_meta_data->>'phone');
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'PATIENT');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  patient_name text NOT NULL CHECK (char_length(patient_name) BETWEEN 2 AND 100),
  patient_email text NOT NULL CHECK (char_length(patient_email) <= 255),
  patient_phone text NOT NULL CHECK (char_length(patient_phone) <= 30),
  service text NOT NULL CHECK (char_length(service) BETWEEN 2 AND 100),
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  duration integer NOT NULL DEFAULT 15 CHECK (duration BETWEEN 5 AND 240),
  status public.appointment_status NOT NULL DEFAULT 'BOOKED',
  notes text CHECK (notes IS NULL OR char_length(notes) <= 1000),
  meeting_link text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (appointment_date, appointment_time)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients read own appointments" ON public.appointments FOR SELECT TO authenticated USING (auth.uid() = patient_id OR public.has_role(auth.uid(), 'DOCTOR'));
CREATE POLICY "Patients create own appointments" ON public.appointments FOR INSERT TO authenticated WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Doctors update appointments" ON public.appointments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'DOCTOR')) WITH CHECK (public.has_role(auth.uid(), 'DOCTOR'));
CREATE POLICY "Doctors delete appointments" ON public.appointments FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'DOCTOR'));

CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL UNIQUE REFERENCES public.appointments(id) ON DELETE CASCADE,
  razorpay_order_id text,
  razorpay_payment_id text,
  amount integer NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'INR',
  status public.payment_status NOT NULL DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients read own payments" ON public.payments FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = appointment_id AND (a.patient_id = auth.uid() OR public.has_role(auth.uid(), 'DOCTOR'))));

CREATE TABLE public.meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL UNIQUE REFERENCES public.appointments(id) ON DELETE CASCADE,
  meet_link text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.meetings TO authenticated;
GRANT ALL ON public.meetings TO service_role;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients read own meetings" ON public.meetings FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = appointment_id AND (a.patient_id = auth.uid() OR public.has_role(auth.uid(), 'DOCTOR'))));

CREATE TABLE public.clinic_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_name text NOT NULL DEFAULT 'BrightSmile Virtual Dental',
  doctor_name text NOT NULL DEFAULT 'Dr. Maya Patel',
  specialty text NOT NULL DEFAULT 'Consultant Dentist',
  bio text NOT NULL DEFAULT 'Compassionate, evidence-based dental care from the comfort of your home.',
  email text NOT NULL DEFAULT 'care@brightsmile.example',
  phone text NOT NULL DEFAULT '+91 98765 43210',
  working_hours jsonb NOT NULL DEFAULT '{"weekdays":"09:00–17:00","saturday":"09:00–13:00","sunday":"Closed"}'::jsonb,
  appointment_duration integer NOT NULL DEFAULT 15 CHECK (appointment_duration BETWEEN 5 AND 240),
  consultation_fee integer NOT NULL DEFAULT 999 CHECK (consultation_fee > 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.clinic_settings TO anon, authenticated;
GRANT UPDATE ON public.clinic_settings TO authenticated;
GRANT ALL ON public.clinic_settings TO service_role;
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clinic settings are public" ON public.clinic_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Doctors update clinic settings" ON public.clinic_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'DOCTOR')) WITH CHECK (public.has_role(auth.uid(), 'DOCTOR'));
INSERT INTO public.clinic_settings DEFAULT VALUES;

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER meetings_updated_at BEFORE UPDATE ON public.meetings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER clinic_settings_updated_at BEFORE UPDATE ON public.clinic_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX appointments_patient_idx ON public.appointments(patient_id);
CREATE INDEX appointments_schedule_idx ON public.appointments(appointment_date, appointment_time);
CREATE INDEX appointments_status_idx ON public.appointments(status);
CREATE INDEX payments_status_idx ON public.payments(status);
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.meetings;