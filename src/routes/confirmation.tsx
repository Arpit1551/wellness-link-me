import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Copy, ExternalLink, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
export const Route = createFileRoute("/confirmation")({
  validateSearch: (s: Record<string, unknown>) => ({
    appointment: typeof s.appointment === "string" ? s.appointment : "",
  }),
  head: () => ({
    meta: [
      { title: "Appointment Confirmed | BrightSmile" },
      { name: "description", content: "Your BrightSmile virtual consultation is confirmed." },
    ],
  }),
  component: Confirmation,
});
function Confirmation() {
  const { appointment } = Route.useSearch();
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    if (appointment)
      supabase
        .from("appointments")
        .select("*")
        .eq("id", appointment)
        .single()
        .then(({ data }) => setData(data));
  }, [appointment]);
  return (
    <PageShell>
      <section className="booking-wash grid min-h-[calc(100vh-5rem)] place-items-center px-5 py-12">
        <div className="w-full max-w-2xl rounded-3xl border border-border bg-background p-7 text-center shadow-2xl shadow-primary/10 md:p-11">
          <CheckCircle2 className="mx-auto size-16 text-success" />
          <p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-success">
            Payment successful
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold">Your appointment is confirmed</h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            A confirmation has been prepared for your email. Save your private meeting link below.
          </p>
          <div className="mt-8 grid gap-4 rounded-2xl bg-muted/60 p-5 text-left sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Service
              </p>
              <p className="mt-1 font-semibold">{data?.service ?? "Virtual consultation"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Date & time
              </p>
              <p className="mt-1 font-semibold">
                {data ? `${data.appointment_date} · ${data.appointment_time}` : "Loading…"}
              </p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Video />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Google Meet link</p>
              <p className="truncate text-sm font-semibold text-primary">
                {data?.meeting_link ?? "Preparing your meeting…"}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              disabled={!data?.meeting_link}
              onClick={() => navigator.clipboard.writeText(data.meeting_link)}
              aria-label="Copy meeting link"
            >
              <Copy />
            </Button>
          </div>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              variant="hero"
              size="lg"
              disabled={!data?.meeting_link}
              asChild={Boolean(data?.meeting_link)}
            >
              {data?.meeting_link ? (
                <a href={data.meeting_link} target="_blank" rel="noreferrer">
                  Join meeting <ExternalLink />
                </a>
              ) : (
                "Preparing link…"
              )}
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
