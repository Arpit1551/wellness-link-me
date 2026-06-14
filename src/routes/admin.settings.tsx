import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { AdminLoading } from "@/components/admin-loading";
import { AdminShell } from "@/components/admin-shell";
import { AuthGuard } from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Clinic Settings | BrightSmile Admin" }] }),
  component: SettingsPage,
});
function SettingsPage() {
  const [id, setId] = useState("");
  const [form, setForm] = useState({
    clinic_name: "",
    doctor_name: "",
    specialty: "",
    bio: "",
    email: "",
    phone: "",
    appointment_duration: 15,
    consultation_fee: 999,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    supabase
      .from("clinic_settings")
      .select("*")
      .limit(1)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setLoadError(error?.message ?? "Clinic settings were not found.");
          setLoading(false);
          return;
        }
        if (data) {
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
        }
        setLoading(false);
      });
  }, []);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setSaving(true);
    const { error } = await supabase.from("clinic_settings").update(form).eq("id", id);
    setMessage(error ? error.message : "Settings saved successfully.");
    setSaving(false);
  };
  return (
    <AuthGuard>
      <AdminShell title="Settings" subtitle="Manage your clinic profile and appointment defaults">
        {loading ? (
          <div className="max-w-4xl rounded-2xl border border-border bg-background"><AdminLoading /></div>
        ) : loadError ? (
          <div className="max-w-4xl rounded-2xl border border-border bg-background p-10 text-center">
            <p className="font-semibold text-destructive">Clinic settings could not be loaded.</p>
            <p className="mt-2 text-sm text-muted-foreground">{loadError}</p>
          </div>
        ) : <form
          onSubmit={save}
          className="max-w-4xl rounded-2xl border border-border bg-background p-6 shadow-sm"
        >
          <h2 className="font-display text-xl font-bold">Doctor & clinic profile</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {[
              ["Clinic name", "clinic_name", "text"],
              ["Doctor name", "doctor_name", "text"],
              ["Specialty", "specialty", "text"],
              ["Email", "email", "email"],
              ["Phone", "phone", "tel"],
              ["Appointment duration (minutes)", "appointment_duration", "number"],
              ["Consultation fee (₹)", "consultation_fee", "number"],
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
              <Label htmlFor="bio">Doctor bio</Label>
              <Textarea
                id="bio"
                className="mt-2 min-h-28"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                maxLength={1000}
              />
            </div>
            <div className="rounded-xl bg-muted/60 p-4 md:col-span-2">
              <p className="font-semibold">Working hours</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Monday–Friday, 9:00 AM–5:00 PM · Saturday, 9:00 AM–1:00 PM · Sunday closed
              </p>
            </div>
          </div>
          {message && (
            <p
              className={`mt-5 rounded-xl p-3 text-sm ${message.includes("success") ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}
            >
              {message}
            </p>
          )}
          <Button className="mt-6" size="lg" disabled={saving}>
            <Save />
            {saving ? "Saving…" : "Save settings"}
          </Button>
        </form>}
      </AdminShell>
    </AuthGuard>
  );
}
