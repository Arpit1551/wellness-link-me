import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "@/components/admin-shell";
import { AuthGuard } from "@/components/auth-guard";
import { StatusBadge } from "@/components/status-badge";
import { AdminLoading } from "@/components/admin-loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClinicData } from "@/hooks/use-clinic-data";
import { updateAppointmentStatus } from "@/lib/clinic.functions";
type Appt = {
  id: string;
  patient_name: string;
  patient_email: string;
  service: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  meeting_link: string | null;
};
export const Route = createFileRoute("/admin/appointments")({
  head: () => ({ meta: [{ title: "Coaching Calls | Luka Moves Admin" }] }),
  component: Appointments,
});
function Appointments() {
  const { data, loading, error, reload } = useClinicData<Appt>("appointments");
  const update = useServerFn(updateAppointmentStatus);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [updatingId, setUpdatingId] = useState("");
  const [actionError, setActionError] = useState("");
  const filtered = useMemo(
    () =>
      data.filter(
        (a) =>
          (status === "ALL" || a.status === status) &&
          `${a.patient_name} ${a.patient_email} ${a.service}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [data, query, status],
  );
  const change = async (id: string, status: "COMPLETED" | "CANCELLED") => {
    setUpdatingId(id);
    setActionError("");
    try {
      await update({ data: { appointmentId: id, status } });
      await reload();
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : "The session could not be updated.");
    } finally {
      setUpdatingId("");
    }
  };
  return (
    <AuthGuard>
      <AdminShell title="Coaching Calls" subtitle="Review and manage athlete bookings">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              className="h-10 pl-9"
              placeholder="Search athlete or program…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-10 w-full sm:w-48" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="BOOKED">Booked</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {actionError && <p className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{actionError}</p>}
        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          {loading ? (
            <AdminLoading />
          ) : error ? (
            <div className="p-10 text-center">
              <p className="font-semibold text-destructive">Sessions could not be loaded.</p>
              <Button className="mt-4" variant="outline" onClick={reload}>Try again</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Athlete</TableHead>
                  <TableHead>Date & time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Meeting</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <strong>{a.patient_name}</strong>
                      <p className="text-xs text-muted-foreground">{a.patient_email}</p>
                    </TableCell>
                    <TableCell>
                      {a.appointment_date}
                      <p className="text-xs text-muted-foreground">
                        {a.appointment_time} · {a.service}
                      </p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={a.status} />
                    </TableCell>
                    <TableCell>
                      {a.meeting_link ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(a.meeting_link ?? "")}
                        >
                          <Copy />
                          Copy link
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not generated</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Mark complete"
                          disabled={updatingId === a.id || a.status === "COMPLETED" || a.status === "CANCELLED"}
                          onClick={() => change(a.id, "COMPLETED")}
                        >
                          <Check className="text-success" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Cancel"
                          disabled={updatingId === a.id || a.status === "CANCELLED" || a.status === "COMPLETED"}
                          onClick={() => change(a.id, "CANCELLED")}
                        >
                          <X className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!filtered.length && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      No sessions found.
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
