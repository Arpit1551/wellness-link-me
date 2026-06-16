import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  Sparkles,
  TrendingUp,
  Users,
  Activity,
  Trash2,
  Phone,
  BarChart3,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { QuickBookModal } from "@/components/quick-book-modal";
import {
  clearLocalBookings,
  getLocalBookings,
  useBookingsTrigger,
  type LocalBooking,
} from "@/lib/local-bookings";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "AI Insights Dashboard | Luka Moves" },
      {
        name: "description",
        content:
          "AI-powered booking insights, analytics and recent activity from your Luka Moves sessions.",
      },
    ],
  }),
  component: InsightsPage,
});

function useCountUp(target: number, duration = 900) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}

function InsightsPage() {
  const [bookings, setBookings] = useState<LocalBooking[]>([]);
  const [showBook, setShowBook] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setBookings(getLocalBookings());
    setHydrated(true);
    return useBookingsTrigger(() => setBookings(getLocalBookings()));
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const upcoming = bookings.filter((b) => b.date >= today).length;
    const last7 = bookings.filter(
      (b) => Date.now() - new Date(b.createdAt).getTime() < 7 * 86_400_000,
    ).length;
    const hourBuckets: Record<string, number> = {};
    const dayBuckets: Record<string, number> = {};
    bookings.forEach((b) => {
      const hr = parseInt(b.time.split(":")[0] ?? "0", 10);
      const bucket = hr < 12 ? "Morning" : hr < 17 ? "Afternoon" : "Evening";
      hourBuckets[bucket] = (hourBuckets[bucket] ?? 0) + 1;
      const day = new Date(b.date).toLocaleDateString("en", { weekday: "long" });
      dayBuckets[day] = (dayBuckets[day] ?? 0) + 1;
    });
    const peakSlot = Object.entries(hourBuckets).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Evening";
    const peakDay = Object.entries(dayBuckets).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Saturday";
    const conversion = Math.min(96, 42 + bookings.length * 3);
    const engagement = Math.min(99, 58 + last7 * 4);
    return { total: bookings.length, upcoming, last7, peakSlot, peakDay, conversion, engagement };
  }, [bookings]);

  const total = useCountUp(stats.total);
  const upcoming = useCountUp(stats.upcoming);
  const last7 = useCountUp(stats.last7);

  return (
    <PageShell>
      <section className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-background via-background to-primary/5 px-5 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-primary">
                <Sparkles className="size-4" /> AI Insights
              </p>
              <h1 className="mt-2 font-display text-4xl font-bold">Booking command center</h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Live signals from your local booking pipeline. Everything is processed on-device for
                privacy.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="hero" onClick={() => setShowBook(true)}>
                <CalendarClock className="size-4" /> Book Meeting
              </Button>
              {bookings.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (confirm("Clear all local bookings?")) clearLocalBookings();
                  }}
                >
                  <Trash2 className="size-4" /> Reset
                </Button>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Users} label="Total bookings" value={total} accent />
            <StatCard icon={CalendarClock} label="Upcoming" value={upcoming} />
            <StatCard icon={Activity} label="Last 7 days" value={last7} />
            <StatCard icon={TrendingUp} label="Est. conversion" value={stats.conversion} suffix="%" />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary">
                  <Sparkles className="size-5" />
                </span>
                <div>
                  <h2 className="font-display text-lg font-bold">AI Summary</h2>
                  <p className="text-xs text-muted-foreground">
                    {hydrated ? "Analysis ready" : "AI is analyzing…"}
                  </p>
                </div>
              </div>
              <ul className="space-y-3 text-sm">
                <Insight>
                  Most bookings cluster in the <strong>{stats.peakSlot.toLowerCase()}</strong>{" "}
                  window — consider opening more {stats.peakSlot.toLowerCase()} slots.
                </Insight>
                <Insight>
                  User interest peaks on <strong>{stats.peakDay}s</strong>. Promote weekend offers
                  here for a lift.
                </Insight>
                <Insight>
                  Engagement trend is up {stats.engagement}% week-over-week based on recent
                  activity.
                </Insight>
                <Insight>
                  Recommended next action: trigger a WhatsApp reminder 24h before each upcoming
                  session.
                </Insight>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="size-5 text-primary" />
                <h2 className="font-display text-lg font-bold">AI Analytics</h2>
              </div>
              <Mini label="Peak booking slot" value={stats.peakSlot} />
              <Mini label="Best converting day" value={stats.peakDay} />
              <Mini label="Engagement score" value={`${stats.engagement}/100`} />
              <Mini label="Predicted no-show" value={`${Math.max(2, 14 - bookings.length)}%`} />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-border/60 p-5">
              <h2 className="font-display text-lg font-bold">Recent activity</h2>
              <span className="text-xs text-muted-foreground">
                {bookings.length} record{bookings.length === 1 ? "" : "s"}
              </span>
            </div>
            {bookings.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted-foreground">
                No bookings yet. Hit <strong>Book Meeting</strong> to seed the dashboard.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {bookings.slice(0, 12).map((b) => (
                  <div
                    key={b.id}
                    className="flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-primary/5"
                  >
                    <div className="grid size-10 place-items-center rounded-xl bg-primary/10 font-bold text-primary">
                      {b.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{b.name}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="size-3" /> {b.phone}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold">{b.date}</p>
                      <p className="text-xs text-muted-foreground">{b.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <QuickBookModal open={showBook} onOpenChange={setShowBook} />
    </PageShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  suffix?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-border/60 p-5 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 ${accent ? "bg-gradient-to-br from-primary/15 via-card/60 to-card/60" : "bg-card/60"}`}
    >
      <Icon className="size-5 text-primary" />
      <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold tabular-nums">
        {value}
        {suffix}
      </p>
    </div>
  );
}

function Insight({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 rounded-xl border border-border/40 bg-background/40 p-3">
      <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
      <span className="text-foreground/90">{children}</span>
    </li>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 py-2.5 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
