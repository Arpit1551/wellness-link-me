import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { completeTestPayment } from "@/lib/clinic.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/payment")({
  validateSearch: (s: Record<string, unknown>) => ({
    appointment: typeof s.appointment === "string" ? s.appointment : "",
  }),
  head: () => ({
    meta: [
      { title: "Secure Checkout | Luka Moves" },
      { name: "description", content: "Complete payment for your Luka Moves session." },
    ],
  }),
  component: Payment,
});

const PRICING: Record<string, number> = {
  "1-1 Coaching Call with Luka": 199.99,
  "Custom 12-Week Mobility & Flexibility Plan": 499,
  "30-Day Foundation Protocol": 97,
  "Beginners Handstand Course": 39.97,
  "Join The Handstand Community": 29.99,
  "The Discipline & Mindset Community": 29.99,
};

function Payment() {
  const { appointment } = Route.useSearch();
  const pay = useServerFn(completeTestPayment);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [service, setService] = useState("Coaching session");
  const [amount, setAmount] = useState(199.99);

  useEffect(() => {
    if (!appointment) return;
    supabase
      .from("appointments")
      .select("service")
      .eq("id", appointment)
      .single()
      .then(({ data }) => {
        if (data?.service) {
          setService(data.service);
          setAmount(PRICING[data.service] ?? 199.99);
        }
      });
  }, [appointment]);

  const process = async () => {
    if (!appointment) {
      setError("Booking reference is missing.");
      return;
    }
    setLoading(true);
    try {
      const result = await pay({ data: { appointmentId: appointment } });
      navigate({ to: "/confirmation", search: { appointment: result.appointmentId } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <section className="booking-wash grid min-h-[calc(100vh-5rem)] place-items-center px-5 py-12">
        <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-7 shadow-2xl shadow-primary/15 md:p-10">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <CreditCard />
          </span>
          <h1 className="mt-5 text-center font-display text-3xl font-bold">Secure checkout</h1>
          <p className="mt-2 text-center text-muted-foreground">{service}</p>
          <div className="my-8 rounded-2xl border border-border bg-muted/50 p-5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order subtotal</span>
              <strong>${amount.toFixed(2)}</strong>
            </div>
            <div className="my-4 h-px bg-border" />
            <div className="flex justify-between text-lg">
              <span>Total</span>
              <strong className="price-tag text-2xl text-primary">${amount.toFixed(2)}</strong>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-success/25 bg-success/5 p-4">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" />
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Safe test payment.</strong> No real card is
              charged. Stripe/Razorpay checkout activates when credentials are connected.
            </p>
          </div>
          {error && (
            <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          )}
          <Button variant="hero" size="xl" className="mt-6 w-full" disabled={loading} onClick={process}>
            {loading ? (
              "Confirming…"
            ) : (
              <>
                <LockKeyhole />
                Pay ${amount.toFixed(2)} in test mode
              </>
            )}
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Encrypted and securely processed
          </p>
        </div>
      </section>
    </PageShell>
  );
}
