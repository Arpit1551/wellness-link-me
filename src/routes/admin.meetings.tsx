import { createFileRoute } from "@tanstack/react-router";
import { Copy, ExternalLink, Video } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { AuthGuard } from "@/components/auth-guard";
import { AdminLoading } from "@/components/admin-loading";
import { Button } from "@/components/ui/button";
import { useClinicData } from "@/hooks/use-clinic-data";
type Meeting = {
  id: string;
  appointment_id: string;
  meet_link: string;
  start_time: string;
  end_time: string;
};
export const Route = createFileRoute("/admin/meetings")({
  head: () => ({ meta: [{ title: "Meetings | BrightSmile Admin" }] }),
  component: Meetings,
});
function Meetings() {
  const { data, loading, error, reload } = useClinicData<Meeting>("meetings");
  const now = Date.now();
  const upcoming = data.filter((m) => new Date(m.end_time).getTime() >= now);
  const past = data.filter((m) => new Date(m.end_time).getTime() < now);
  return (
    <AuthGuard>
      <AdminShell title="Meetings" subtitle="Join upcoming sessions and review past consultations">
        {loading ? (
          <AdminLoading />
        ) : error ? (
          <div className="rounded-2xl border border-border bg-background p-10 text-center">
            <p className="font-semibold text-destructive">Meetings could not be loaded.</p>
            <Button className="mt-4" variant="outline" onClick={reload}>Try again</Button>
          </div>
        ) : (
          <div className="space-y-8">
            <MeetingSection title="Upcoming meetings" items={upcoming} />
            <MeetingSection title="Past meetings" items={past} />
          </div>
        )}
      </AdminShell>
    </AuthGuard>
  );
}
function MeetingSection({ title, items }: { title: string; items: Meeting[] }) {
  return (
    <section>
      <h2 className="mb-4 font-display text-xl font-bold">{title}</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((m) => {
          const start = new Date(m.start_time);
          const diff = start.getTime() - Date.now();
          const countdown =
            diff > 0
              ? `${Math.floor(diff / 86400000)}d ${Math.floor((diff % 86400000) / 3600000)}h until start`
              : "Ready to join";
          return (
            <article
              key={m.id}
              className="rounded-2xl border border-border bg-background p-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Video />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">Virtual consultation</p>
                  <p className="mt-1 text-sm text-muted-foreground">{start.toLocaleString()}</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wider text-primary">
                    {countdown}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <Button size="sm" asChild>
                  <a href={m.meet_link} target="_blank" rel="noreferrer">
                    Join <ExternalLink />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(m.meet_link)}
                >
                  <Copy />
                  Copy
                </Button>
              </div>
            </article>
          );
        })}
        {!items.length && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground lg:col-span-2">
            No {title.toLowerCase()}.
          </div>
        )}
      </div>
    </section>
  );
}
