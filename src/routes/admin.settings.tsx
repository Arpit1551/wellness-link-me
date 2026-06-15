import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, MessageSquare, Save } from "lucide-react";
import { AdminLoading } from "@/components/admin-loading";
import { AdminShell } from "@/components/admin-shell";
import { AuthGuard } from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Coach Settings | Luka Moves Admin" }] }),
  component: SettingsPage,
});

type Reminders = {
  emailClient: boolean;
  emailCoach: boolean;
  smsClient: boolean;
  smsCoach: boolean;
  leadHours: number;
};

const DEFAULT_REMINDERS: Reminders = {
  emailClient: true,
  emailCoach: true,
  smsClient: true,
  smsCoach: false,
  leadHours: 24,
};

function SettingsPage() {
  const [id, setId] = useState("");
  const [form, setForm] = useState({
    clinic_name: "",
    doctor_name: "",
    specialty: "",
    bio: "",
    email: "",
    phone: "",
    appointment_duration: 45,
    consultation_fee: 199,
  });
  const [reminders, setReminders] = useState<Reminders>(DEFAULT_REMINDERS);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("luka_reminders");
      if (raw) setReminders({ ...DEFAULT_REMINDERS, ...JSON.parse(raw) });
    } catch {}
    supabase
      .from("clinic_settings")
      .select("*")
      .limit(1)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setLoadError(error?.message ?? "Coach settings were not found.");
          setLoading(false);
          return;
        }
        setId(data.id);
        setForm({
          clinic_name: data.clinic_name,
          doctor_name: data.doctor_name,
          specialty: data.specialty,
          bio: data.bio,
          email: data.email,
          phone: data.phone,
          appointment_duration: data.appointment_duration,
          consultation_fee: data.consultation_fee,
        });
        setLoading(false);
      });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setSaving(true);
    const { error } = await supabase.from("clinic_settings").update(form).eq("id", id);
    localStorage.setItem("luka_reminders", JSON.stringify(reminders));
    setMessage(error ? error.message : "Settings saved successfully.");
    setSaving(false);
  };

  return (
    <AuthGuard>
      <AdminShell title="Settings" subtitle="Manage your coach profile, session defaults, and reminders">
        {loading ? (
          <div className="max-w-4xl rounded-2xl border border-border bg-card">
            <AdminLoading />
          </div>
        ) : loadError ? (
          <div className="max-w-4xl rounded-2xl border border-border bg-card p-10 text-center">
            <p className="font-semibold text-destructive">Coach settings could not be loaded.</p>
            <p className="mt-2 text-sm text-muted-foreground">{loadError}</p>
          </div>
        ) : (
          <form onSubmit={save} className="max-w-4xl space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold">Coach & brand profile</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {[
                  ["Brand name", "clinic_name", "text"],
                  ["Coach name", "doctor_name", "text"],
                  ["Specialty", "specialty", "text"],
                  ["Email", "email", "email"],
                  ["Phone", "phone", "tel"],
                  ["Session duration (minutes)", "appointment_duration", "number"],
                  ["Default session fee (USD)", "consultation_fee", "number"],
                ].map(([label, key, type]) => (
                  <div key={key}>
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                      type={type}
                      className="mt-2 h-11"
                      value={String(form[key as keyof typeof form])}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [key]: type === "number" ? Number(e.target.value) : e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <Label htmlFor="bio">Coach bio</Label>
                  <Textarea
                    id="bio"
                    className="mt-2 min-h-28"
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    maxLength={1000}
                  />
                </div>
                <div className="rounded-xl bg-muted/60 p-4 md:col-span-2">
                  <p className="font-semibold">Coaching hours</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Mon–Fri, 9:00 AM–5:00 PM · Sat, 9:00 AM–1:00 PM · Sun closed
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Bell />
                </span>
                <div>
                  <h2 className="font-display text-xl font-bold">Automated reminders</h2>
                  <p className="text-sm text-muted-foreground">
                    Fired to both Coach Luka and the client before each scheduled session.
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <ReminderRow
                  label="Email reminder to client"
                  desc="Sent to the athlete's inbox before the session."
                  icon={<MessageSquare className="size-4" />}
                  checked={reminders.emailClient}
                  onChange={(v) => setReminders({ ...reminders, emailClient: v })}
                />
                <ReminderRow
                  label="Email reminder to Luka"
                  desc="Coach gets a pre-session brief."
                  icon={<MessageSquare className="size-4" />}
                  checked={reminders.emailCoach}
                  onChange={(v) => setReminders({ ...reminders, emailCoach: v })}
                />
                <ReminderRow
                  label="SMS reminder to client"
                  desc="Text alert with the meeting link."
                  icon={<Bell className="size-4" />}
                  checked={reminders.smsClient}
                  onChange={(v) => setReminders({ ...reminders, smsClient: v })}
                />
                <ReminderRow
                  label="SMS reminder to Luka"
                  desc="Text alert when a session starts soon."
                  icon={<Bell className="size-4" />}
                  checked={reminders.smsCoach}
                  onChange={(v) => setReminders({ ...reminders, smsCoach: v })}
                />
                <div className="sm:col-span-2">
                  <Label htmlFor="lead">Send reminders this many hours before session</Label>
                  <Input
                    id="lead"
                    type="number"
                    min={1}
                    max={168}
                    className="mt-2 h-11 max-w-xs"
                    value={reminders.leadHours}
                    onChange={(e) =>
                      setReminders({ ...reminders, leadHours: Number(e.target.value) || 24 })
                    }
                  />
                </div>
              </div>
            </div>

            {message && (
              <p
                className={`rounded-xl p-3 text-sm ${message.includes("success") ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}
              >
                {message}
              </p>
            )}
            <Button size="lg" disabled={saving}>
              <Save />
              {saving ? "Saving…" : "Save settings"}
            </Button>
          </form>
        )}
      </AdminShell>
    </AuthGuard>
  );
}

function ReminderRow({
  label,
  desc,
  icon,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  icon: React.ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-background/40 p-4">
      <div className="flex gap-3">
        <span className="mt-0.5 text-primary">{icon}</span>
        <div>
          <p className="font-semibold">{label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
