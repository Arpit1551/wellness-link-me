import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Luka Moves" },
      { name: "description", content: "Get in touch with Coach Luka about coaching and programs." },
    ],
  }),
  component: Contact,
});
function Contact() {
  return (
    <PageShell>
      <section className="hero-wash px-5 py-20 text-center">
        <p className="eyebrow">Contact</p>
        <h1 className="section-title">Get in touch with Luka</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Questions about 1-1 coaching, custom programs, or community access? Drop a note.
        </p>
      </section>
      <section className="px-5 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.6fr_1fr]">
          <form
            className="rounded-3xl border border-border bg-card p-7 shadow-sm"
            onSubmit={(e) => e.preventDefault()}
          >
            <h2 className="font-display text-2xl font-bold">Send a message</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <Label>Name</Label>
                <Input className="mt-2 h-11" required />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" className="mt-2 h-11" required />
              </div>
              <div className="sm:col-span-2">
                <Label>Message</Label>
                <Textarea className="mt-2 min-h-36" maxLength={1000} required />
              </div>
            </div>
            <Button className="mt-5" size="lg">
              Send message
            </Button>
          </form>
          <aside className="space-y-4">
            {[
              [Mail, "Email", "coach@lukamoves.example"],
              [Phone, "Phone", "+1 (555) 012-3456"],
              [MapPin, "Availability", "Online · Coaching worldwide"],
            ].map(([Icon, title, text]) => {
              const I = Icon as typeof Mail;
              return (
                <div key={title as string} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <I />
                  </span>
                  <div>
                    <p className="font-bold">{title as string}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{text as string}</p>
                  </div>
                </div>
              );
            })}
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
