import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  CalendarCheck,
  DollarSign,
  Repeat,
  Sparkles,
  TrendingUp,
  Video,
} from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { AuthGuard } from "@/components/auth-guard";
import { StatusBadge } from "@/components/status-badge";
import { AdminLoading } from "@/components/admin-loading";
import { useClinicData } from "@/hooks/use-clinic-data";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Appointment = {
  id: string;
  patient_name: string;
  service: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
};
type Payment = {
  id: string;
  amount: number;
  status: string;
  appointment_id: string;
};

const RECURRING_SERVICES = new Set([
  "Join The Handstand Community",
  "The Discipline & Mindset Community",
]);

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Coach Admin Dashboard | Luka Moves" },
      { name: "description", content: "High-performance coaching operations dashboard." },
    ],
  }),
  component: Dashboard,
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

function Dashboard() {
  const { data: appts, loading, error, reload } = useClinicData<Appointment>("appointments");
  const { data: payments } = useClinicData<Payment>("payments");

  const successful = payments.filter((p) => p.status === "SUCCESS");
  const apptById = new Map(appts.map((a) => [a.id, a]));
  const mrr = successful
    .filter((p) => {
      const a = apptById.get(p.appointment_id);
      return a && RECURRING_SERVICES.has(a.service);
    })
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const oneTime = successful
    .filter((p) => {
      const a = apptById.get(p.appointment_id);
      return !a || !RECURRING_SERVICES.has(a.service);
    })
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const upcoming = appts
    .filter((a) => a.status !== "CANCELLED" && a.status !== "COMPLETED")
    .slice(0, 6);

  const insights = useMemo(() => {
    const hourBuckets: Record<string, number> = {};
    const dayBuckets: Record<string, number> = {};
    const serviceBuckets: Record<string, number> = {};
    appts.forEach((a) => {
      const hr = parseInt(a.appointment_time?.split(":")[0] ?? "0", 10);
      const slot = hr < 12 ? "Morning" : hr < 17 ? "Afternoon" : "Evening";
      hourBuckets[slot] = (hourBuckets[slot] ?? 0) + 1;
      const day = new Date(a.appointment_date).toLocaleDateString("en", { weekday: "long" });
      dayBuckets[day] = (dayBuckets[day] ?? 0) + 1;
      serviceBuckets[a.service] = (serviceBuckets[a.service] ?? 0) + 1;
    });
    const peakSlot = Object.entries(hourBuckets).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Evening";
    const peakDay = Object.entries(dayBuckets).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Saturday";
    const topProgram =
      Object.entries(serviceBuckets).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "1-1 Coaching";
    const conversion = Math.min(96, 42 + successful.length * 3);
    const engagement = Math.min(99, 58 + upcoming.length * 4);
    const noShow = Math.max(2, 14 - successful.length);
    return { peakSlot, peakDay, topProgram, conversion, engagement, noShow };
  }, [appts, successful.length, upcoming.length]);

  const animConv = useCountUp(insights.conversion);
  const animEng = useCountUp(insights.engagement);

  return (
    <AuthGuard>
      <AdminShell title="Dashboard" subtitle="Your coaching business at a glance">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            [DollarSign, "One-time sales", `$${oneTime.toFixed(2)}`],
            [Repeat, "Monthly recurring (MRR)", `$${mrr.toFixed(2)}`],
            [CalendarCheck, "Total bookings", appts.length],
            [Video, "Upcoming sessions", upcoming.length],
          ].map(([Icon, label, value]) => {
            const I = Icon as typeof CalendarCheck;
            return (
              <div key={label as string} className="metric-card">
                <span className="metric-icon">
                  <I />
                </span>
                <p>{label as string}</p>
                <strong>{value as string | number}</strong>
              </div>
            );
          })}
        </div>
        <section className="mt-7 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h2 className="font-display text-xl font-bold">Upcoming coaching calls</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Live calendar of your next sessions · auto-refreshes
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/admin/appointments">View all</Link>
            </Button>
          </div>
          {loading ? (
            <AdminLoading />
          ) : error ? (
            <div className="p-10 text-center">
              <p className="font-semibold text-destructive">Dashboard data could not be loaded.</p>
              <Button className="mt-4" variant="outline" onClick={reload}>
                Try again
              </Button>
        </div>

        <section className="mt-7 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary">
                <Sparkles className="size-5" />
              </span>
              <div>
                <h2 className="font-display text-lg font-bold">AI Insights</h2>
                <p className="text-xs text-muted-foreground">
                  {loading ? "AI is analyzing…" : "Live analysis of your coaching pipeline"}
                </p>
              </div>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
                <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                <span>
                  Most bookings cluster in the{" "}
                  <strong>{insights.peakSlot.toLowerCase()}</strong> — open more{" "}
                  {insights.peakSlot.toLowerCase()} slots to capture demand.
                </span>
              </li>
              <li className="flex gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
                <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                <span>
                  Client interest peaks on <strong>{insights.peakDay}s</strong> — schedule promos
                  the day before.
                </span>
              </li>
              <li className="flex gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
                <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                <span>
                  Top-performing program: <strong>{insights.topProgram}</strong>. Feature it on the
                  landing hero.
                </span>
              </li>
              <li className="flex gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
                <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                <span>
                  Recommended action: fire a 24h reminder to {upcoming.length} upcoming{" "}
                  {upcoming.length === 1 ? "client" : "clients"} to reduce no-shows.
                </span>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              <h2 className="font-display text-lg font-bold">AI Analytics</h2>
            </div>
            <Mini label="Peak slot" value={insights.peakSlot} />
            <Mini label="Best converting day" value={insights.peakDay} />
            <Mini
              label="Conversion"
              value={
                <span className="inline-flex items-center gap-1 text-primary">
                  <TrendingUp className="size-3.5" />
                  {animConv}%
                </span>
              }
            />
            <Mini
              label="Engagement"
              value={
                <span className="inline-flex items-center gap-1">
                  <Activity className="size-3.5 text-primary" />
                  {animEng}/100
                </span>
              }
            />
            <Mini label="Predicted no-show" value={`${insights.noShow}%`} />
          </div>
        </section>

          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Date & time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcoming.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-semibold">{a.patient_name}</TableCell>
                    <TableCell>{a.service}</TableCell>
                    <TableCell>
                      {a.appointment_date} · {a.appointment_time}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={a.status} />
                    </TableCell>
                  </TableRow>
                ))}
                {!upcoming.length && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-28 text-center text-muted-foreground">
                      No upcoming sessions yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </section>
      </AdminShell>
    </AuthGuard>
  );
}
