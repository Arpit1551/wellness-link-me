import { createFileRoute } from "@tanstack/react-router";
import { CircleDollarSign, Repeat, TriangleAlert, ReceiptText, CreditCard } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { AuthGuard } from "@/components/auth-guard";
import { StatusBadge } from "@/components/status-badge";
import { AdminLoading } from "@/components/admin-loading";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClinicData } from "@/hooks/use-clinic-data";

type Payment = {
  id: string;
  appointment_id: string;
  razorpay_payment_id: string | null;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
};
type Appt = { id: string; service: string; patient_name: string };

const RECURRING = new Set([
  "Join The Handstand Community",
  "The Discipline & Mindset Community",
]);

export const Route = createFileRoute("/admin/payments")({
  head: () => ({ meta: [{ title: "Payments & MRR | Luka Moves Admin" }] }),
  component: Payments,
});
function Payments() {
  const { data, loading, error, reload } = useClinicData<Payment>("payments");
  const { data: appts } = useClinicData<Appt>("appointments");
  const apptById = new Map(appts.map((a) => [a.id, a]));
  const successful = data.filter((p) => p.status === "SUCCESS");
  const mrr = successful
    .filter((p) => RECURRING.has(apptById.get(p.appointment_id)?.service ?? ""))
    .reduce((s, p) => s + Number(p.amount), 0);
  const oneTime = successful
    .filter((p) => !RECURRING.has(apptById.get(p.appointment_id)?.service ?? ""))
    .reduce((s, p) => s + Number(p.amount), 0);
  return (
    <AuthGuard>
      <AdminShell title="Payments & MRR" subtitle="Track one-time sales and recurring community revenue">
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {[
            [CircleDollarSign, "One-time sales", `$${oneTime.toFixed(2)}`],
            [Repeat, "Monthly recurring revenue", `$${mrr.toFixed(2)}`],
            [TriangleAlert, "Pending or failed", data.length - successful.length],
          ].map(([Icon, label, value]) => {
            const I = Icon as typeof CreditCard;
            return (
              <div className="metric-card" key={label as string}>
                <span className="metric-icon"><I /></span>
                <p>{label as string}</p>
                <strong>{value as string | number}</strong>
              </div>
            );
          })}
        </div>
        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          {loading ? (
            <AdminLoading />
          ) : error ? (
            <div className="p-10 text-center">
              <p className="font-semibold text-destructive">Payments could not be loaded.</p>
              <Button className="mt-4" variant="outline" onClick={reload}>Try again</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Athlete</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((p) => {
                  const a = apptById.get(p.appointment_id);
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">
                        {p.razorpay_payment_id ?? "Pending"}
                      </TableCell>
                      <TableCell className="font-semibold">{a?.patient_name ?? "—"}</TableCell>
                      <TableCell className="text-sm">
                        {a?.service ?? "—"}
                        {a && RECURRING.has(a.service) && (
                          <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                            Recurring
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold">${Number(p.amount).toFixed(2)}</TableCell>
                      <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <StatusBadge status={p.status} />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!data.length && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No transactions yet.
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
