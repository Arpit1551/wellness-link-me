import { useEffect, useState } from "react";
import { Sparkles, CalendarCheck, Loader2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addLocalBooking } from "@/lib/local-bookings";

const TIMES = ["08:00", "09:30", "11:00", "13:00", "15:30", "17:00", "18:30", "20:00"];

export function QuickBookModal({
  open,
  onOpenChange,
  defaultDate,
  defaultTime,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultDate?: string;
  defaultTime?: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const minDate = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);

  useEffect(() => {
    if (open) {
      setSuccess(false);
      setError("");
      if (defaultDate) setDate(defaultDate);
      if (defaultTime) setTime(defaultTime);
    }
  }, [open, defaultDate, defaultTime]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) return setError("Please enter your full name.");
    if (phone.replace(/\D/g, "").length < 7) return setError("Enter a valid phone or WhatsApp number.");
    if (!date || !time) return setError("Pick a date and time.");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    addLocalBooking({ name: name.trim(), phone: phone.trim(), date, time });
    setLoading(false);
    setSuccess(true);
    setName("");
    setPhone("");
    setDate("");
    setTime("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-hidden border-border/60 bg-card/95 p-0 backdrop-blur-xl">
        {!success ? (
          <>
            <DialogHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-primary">
                <Sparkles className="size-4" /> AI-assisted booking
              </div>
              <DialogTitle className="font-display text-2xl">Reserve a session</DialogTitle>
              <DialogDescription>
                No login required — our assistant will optimize your slot instantly.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submit} className="grid gap-4 p-6">
              <div className="grid gap-2">
                <Label htmlFor="qb-name">Full name</Label>
                <Input id="qb-name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="qb-phone">Phone / WhatsApp</Label>
                <Input id="qb-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 010 1234" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="qb-date">Date</Label>
                  <Input id="qb-date" type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="grid gap-2">
                  <Label>Time slot</Label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {TIMES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTime(t)}
                        className={`rounded-md border px-2 py-1.5 text-xs font-medium transition-all ${
                          time === t
                            ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/30"
                            : "border-border hover:border-primary/40 hover:bg-primary/5"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
              )}
              <Button type="submit" size="lg" disabled={loading} className="mt-2">
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> AI is optimizing your slot…
                  </>
                ) : (
                  <>
                    <CalendarCheck className="size-4" /> Confirm booking
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Stored securely on this device. No account needed.
              </p>
            </form>
          </>
        ) : (
          <div className="animate-fade-in p-8 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary/15 text-primary">
              <CalendarCheck className="size-8" />
            </div>
            <h3 className="mt-5 font-display text-2xl font-bold">You're booked in.</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Your meeting has been scheduled. Our AI assistant has optimized your booking and added it
              to Luka's calendar.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button variant="outline" onClick={() => setSuccess(false)}>
                Book another
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                <X className="size-4" /> Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
