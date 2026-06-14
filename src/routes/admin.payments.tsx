import { createFileRoute } from "@tanstack/react-router";
import { CircleDollarSign, CreditCard, ReceiptText, TriangleAlert } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { AuthGuard } from "@/components/auth-guard";
import { StatusBadge } from "@/components/status-badge";
import { AdminLoading } from "@/components/admin-loading";
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
export const Route = createFileRoute("/admin/payments")({
  head: () => ({ meta: [{ title: "Payments | BrightSmile Admin" }] }),
  component: Payments,
});
function Payments() {
  const { data, loading, error, reload } = useClinicData<Payment>("payments");
  const successful = data.filter((payment) => payment.status === "SUCCESS");
  const total = successful.reduce((sum, payment) => sum + payment.amount, 0);
  return (
    <AuthGuard>
      <AdminShell title="Payments" subtitle="Track consultation transactions">
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {[
            [CircleDollarSign, "Revenue collected", `₹${total.toLocaleString()}`],
            [ReceiptText, "Successful payments", successful.length],
            [TriangleAlert, "Pending or failed", data.length - successful.length],
          ].map(([Icon, label, value]) => {
            const MetricIcon = Icon as typeof CreditCard;
            return (
              <div className="metric-card" key={label as string}>
                <span className="metric-icon"><MetricIcon /></span>
                <p>{label as string}</p>
                <strong>{value as string | number}</strong>
              </div>
            );
          })}
        </div>
        <section className="overflow-hidden rounded-2xl border border-border bg-background">
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
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Appointment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">
                      {p.razorpay_payment_id ?? "Pending"}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {p.appointment_id.slice(0, 8)}…
                    </TableCell>
                    <TableCell className="font-semibold">₹{p.amount.toLocaleString()}</TableCell>
                    <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <StatusBadge status={p.status} />
                    </TableCell>
                  </TableRow>
                ))}
                {!data.length && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
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
