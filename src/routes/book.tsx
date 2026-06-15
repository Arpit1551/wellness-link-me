import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, Check, Clock, Flame, Video } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBooking } from "@/lib/clinic.functions";

export const Route = createFileRoute("/book")({
  validateSearch: (s: Record<string, unknown>) => ({
    service: typeof s.service === "string" ? s.service : "",
  }),
  head: () => ({
    meta: [
      { title: "Book a Coaching Session | Luka Moves" },
      {
        name: "description",
        content:
          "Reserve a 1-1 coaching call or 12-week mobility plan assessment with Coach Luka.",
      },
    ],
  }),
  component: Booking,
});

const services = [
  {
    name: "1-1 Coaching Call with Luka",
    icon: Video,
    desc: "45-min video session with Coach Luka",
    price: "$199.99",
  },
  {
    name: "Custom 12-Week Mobility & Flexibility Plan",
    icon: Flame,
    desc: "Premium onboarding · starts with assessment",
    price: "$499",
  },
];

const times = ["09:00", "09:30", "10:00", "10:30", "11:30", "14:00", "14:30", "15:30"];

function Booking() {
  const navigate = useNavigate();
  const { service: preselected } = Route.useSearch();
  const create = useServerFn(createBooking);
  const [step, setStep] = useState(1);
  const [service, setService] = useState(
    services.find((s) => s.name === preselected)?.name ?? services[0].name,
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const minDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const next = () => {
    setError("");
    if (step === 1 && !service) return;
    if (step === 2 && (!date || !time)) {
      setError("Pick a date and time to continue.");
      return;
    }
    setStep(step + 1);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const appt = await create({
        data: {
          patientName: name,
          patientEmail: email,
          patientPhone: phone,
          service,
          appointmentDate: date,
          appointmentTime: time,
          notes,
        },
      });
      navigate({ to: "/payment", search: { appointment: appt.id } });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to book";
      setError(message.includes("Unauthorized") ? "Please sign in before booking." : message);
      if (message.includes("Unauthorized"))
        setTimeout(() => window.location.assign("/auth?next=/book"), 900);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <section className="booking-wash min-h-[calc(100vh-5rem)] px-5 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto mb-10 flex max-w-lg items-start justify-between">
            {["Program", "Schedule", "Details"].map((label, i) => (
              <div key={label} className="relative flex flex-1 flex-col items-center gap-2">
                <span
                  className={`z-10 grid size-10 place-items-center rounded-full border-4 border-background font-bold shadow-sm ${step > i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {step > i + 1 ? <Check className="size-4" /> : i + 1}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">{label}</span>
                {i < 2 && (
                  <span
                    className={`absolute left-1/2 top-5 h-0.5 w-full ${step > i + 1 ? "bg-primary" : "bg-border"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-primary/10">
            <div className="border-b border-border px-6 py-6 md:px-9">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-primary">
                Step {step} of 3
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold">
                {step === 1
                  ? "Pick your coaching tier"
                  : step === 2
                    ? "Choose a session time"
                    : "Tell us about you"}
              </h1>
            </div>
            <div className="p-6 md:p-9">
              {step === 1 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {services.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => setService(s.name)}
                      className={`group rounded-2xl border p-5 text-left transition-all ${service === s.name ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/40"}`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                          <s.icon />
                        </span>
                        <span className="price-tag text-lg">{s.price}</span>
                      </div>
                      <h2 className="mt-5 font-display text-lg font-bold">{s.name}</h2>
                      <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                    </button>
                  ))}
                </div>
              )}
              {step === 2 && (
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <Label htmlFor="date">Session date</Label>
                    <div className="relative mt-2">
                      <CalendarDays className="absolute left-3 top-3 size-5 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        min={minDate}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="h-11 pl-11"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Available times</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {times.map((t) => (
                        <Button
                          key={t}
                          type="button"
                          variant={time === t ? "default" : "outline"}
                          onClick={() => setTime(t)}
                        >
                          <Clock className="size-4" />
                          {t}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {step === 3 && (
                <form id="booking-form" onSubmit={submit} className="grid gap-5 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" className="mt-2 h-11" value={name} onChange={(e) => setName(e.target.value)} minLength={2} maxLength={100} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" className="mt-2 h-11" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" className="mt-2 h-11" value={phone} onChange={(e) => setPhone(e.target.value)} minLength={7} maxLength={30} required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="notes">
                      Goals or anything Luka should know?{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Textarea id="notes" className="mt-2" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={1000} />
                  </div>
                </form>
              )}
              {error && (
                <p className="mt-5 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </p>
              )}
              <div className="mt-9 flex items-center justify-between border-t border-border pt-6">
                <Button variant="ghost" disabled={step === 1 || loading} onClick={() => setStep(step - 1)}>
                  Back
                </Button>
                {step < 3 ? (
                  <Button size="lg" onClick={next}>
                    Continue
                  </Button>
                ) : (
                  <Button form="booking-form" size="lg" disabled={loading}>
                    {loading ? "Reserving slot…" : "Proceed to payment"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
