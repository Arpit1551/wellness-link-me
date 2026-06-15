import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Brain, Dumbbell, Sparkles, Users } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { createBooking } from "@/lib/clinic.functions";

export const Route = createFileRoute("/purchase")({
  validateSearch: (s: Record<string, unknown>) => ({
    product: typeof s.product === "string" ? s.product : "30-Day Foundation Protocol",
  }),
  head: () => ({
    meta: [
      { title: "Get Instant Access | Luka Moves" },
      { name: "description", content: "Unlock Luka Moves programs and communities instantly." },
    ],
  }),
  component: Purchase,
});

const META: Record<string, { price: number; cadence: string; icon: typeof Dumbbell; desc: string }> = {
  "30-Day Foundation Protocol": {
    price: 97,
    cadence: "one-time",
    icon: Dumbbell,
    desc: "Lifetime access to Luka's foundation programming. Daily templates, video breakdowns, mobility flows.",
  },
  "Beginners Handstand Course": {
    price: 39.97,
    cadence: "one-time",
    icon: Sparkles,
    desc: "Progression-based handstand course with drills, demos, and feedback structures.",
  },
  "Join The Handstand Community": {
    price: 29.99,
    cadence: "/month",
    icon: Users,
    desc: "Live weekly Q&As, accountability cohorts, and a private form-check feed.",
  },
  "The Discipline & Mindset Community": {
    price: 29.99,
    cadence: "/month",
    icon: Brain,
    desc: "Weekly mindset workshops, journaling prompts, and a tight accountability circle.",
  },
};

function Purchase() {
  const { product } = Route.useSearch();
  const navigate = useNavigate();
  const create = useServerFn(createBooking);
  const meta = META[product] ?? META["30-Day Foundation Protocol"];
  const Icon = meta.icon;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
      const meta: any = data.user?.user_metadata;
      if (meta?.name) setName(meta.name);
    });
  }, []);

  const buy = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const appt = await create({
        data: {
          patientName: name,
          patientEmail: email,
          patientPhone: phone,
          service: product,
          appointmentDate: today,
          appointmentTime: "12:00",
          notes: "Digital product / community access",
        },
      });
      navigate({ to: "/payment", search: { appointment: appt.id } });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to start checkout";
      setError(msg.includes("Unauthorized") ? "Please sign in to continue." : msg);
      if (msg.includes("Unauthorized"))
        setTimeout(() => window.location.assign(`/auth?next=/purchase`), 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <section className="booking-wash grid min-h-[calc(100vh-5rem)] place-items-center px-5 py-12">
        <div className="grid w-full max-w-4xl gap-6 lg:grid-cols-[1.1fr_1fr]">
          <aside className="rounded-3xl border border-border bg-card p-7">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Icon />
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold leading-tight">{product}</h1>
            <p className="mt-3 text-muted-foreground">{meta.desc}</p>
            <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total</p>
              <p className="price-tag mt-1 text-4xl text-primary">
                ${meta.price.toFixed(2)}
                <span className="text-base font-medium text-muted-foreground"> {meta.cadence}</span>
              </p>
            </div>
          </aside>
          <form onSubmit={buy} className="rounded-3xl border border-border bg-card p-7">
            <h2 className="font-display text-xl font-bold">Your details</h2>
            <p className="text-sm text-muted-foreground">Used to deliver access.</p>
            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" className="mt-2 h-11" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" className="mt-2 h-11" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" className="mt-2 h-11" value={phone} onChange={(e) => setPhone(e.target.value)} required minLength={7} />
              </div>
            </div>
            {error && <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
            <Button variant="hero" size="xl" className="mt-6 w-full" disabled={loading}>
              {loading ? "Preparing checkout…" : "Continue to secure checkout"}
            </Button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
