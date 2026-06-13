import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "SUCCESS" || status === "PAID" || status === "COMPLETED"
      ? "success"
      : status === "FAILED" || status === "CANCELLED"
        ? "destructive"
        : status === "BOOKED" || status === "PENDING"
          ? "warning"
          : "neutral";
  return <Badge variant={variant}>{status.charAt(0) + status.slice(1).toLowerCase()}</Badge>;
}
