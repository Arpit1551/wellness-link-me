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
