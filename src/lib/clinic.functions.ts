import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const bookingSchema = z.object({
  patientName: z.string().trim().min(2).max(100),
  patientEmail: z.string().trim().email().max(255),
  patientPhone: z.string().trim().min(7).max(30),
  service: z.string().trim().min(2).max(100),
  appointmentDate: z.string().date(),
  appointmentTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  notes: z.string().trim().max(1000).optional(),
});

export const createBooking = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => bookingSchema.parse(input)).handler(async ({ data, context }) => {
  const { data: setting } = await context.supabase.from("clinic_settings").select("appointment_duration").limit(1).maybeSingle();
  const { data: appointment, error } = await context.supabase.from("appointments").insert({ patient_id: context.userId, patient_name: data.patientName, patient_email: data.patientEmail, patient_phone: data.patientPhone, service: data.service, appointment_date: data.appointmentDate, appointment_time: data.appointmentTime, duration: setting?.appointment_duration ?? 15, notes: data.notes || null }).select("id").single();
  if (error || !appointment) throw new Error(error?.message || "Unable to create appointment");
  return appointment;
});

export const completeTestPayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => z.object({ appointmentId: z.string().uuid() }).parse(input)).handler(async ({ data, context }) => {
  const { data: appointment, error } = await context.supabase.from("appointments").select("*").eq("id", data.appointmentId).eq("patient_id", context.userId).single();
  if (error || !appointment) throw new Error("Appointment not found");
  const { data: setting } = await context.supabase.from("clinic_settings").select("consultation_fee").limit(1).single();
  const start = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
  const end = new Date(start.getTime() + appointment.duration * 60_000);
  const meetLink = `https://meet.google.com/lookup/brightsmile-${appointment.id.slice(0, 8)}`;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const paymentId = `pay_test_${crypto.randomUUID().replaceAll("-", "").slice(0, 16)}`;
  const { error: paymentError } = await supabaseAdmin.from("payments").upsert({ appointment_id: appointment.id, razorpay_order_id: `order_test_${appointment.id.slice(0, 12)}`, razorpay_payment_id: paymentId, amount: setting?.consultation_fee ?? 999, currency: "INR", status: "SUCCESS" }, { onConflict: "appointment_id" });
  if (paymentError) throw new Error(paymentError.message);
  await supabaseAdmin.from("meetings").upsert({ appointment_id: appointment.id, meet_link: meetLink, start_time: start.toISOString(), end_time: end.toISOString() }, { onConflict: "appointment_id" });
  await supabaseAdmin.from("appointments").update({ status: "PAID", meeting_link: meetLink }).eq("id", appointment.id);
  return { appointmentId: appointment.id, paymentId, meetLink };
});

export const updateAppointmentStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => z.object({ appointmentId: z.string().uuid(), status: z.enum(["COMPLETED", "CANCELLED"]) }).parse(input)).handler(async ({ data, context }) => {
  const { data: isDoctor } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "DOCTOR" });
  if (!isDoctor) throw new Error("Forbidden");
  const { error } = await context.supabase.from("appointments").update({ status: data.status }).eq("id", data.appointmentId);
  if (error) throw new Error(error.message);
  return { ok: true };
});