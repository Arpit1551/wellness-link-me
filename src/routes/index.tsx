import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Star,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Online Dentist Consultation | BrightSmile" },
      {
        name: "description",
        content:
          "Book a private online dental consultation with Dr. Sarah Mitchell. Secure video visits and expert advice from home.",
      },
      { property: "og:title", content: "BrightSmile Virtual Dental Care" },
      {
        property: "og:description",
        content: "Professional dental advice from the comfort of home.",
      },
    ],
  }),
  component: Home,
});

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCT1QJhUemtfcw5OFHhqxW801z8NbfvyclwCpVJLP0MOpx6W97RGnozbSlkKhkQbDB_kaqj-XhRS35JyeOXZJ3zp2IjEzsMHCmsmXhhXdqk8Mq-Dam_6RRCPT00kc2tYKSqa2jsiBsAj816o_7R3RHtCzG0zIxKjkPHM--feHYgd3_jeDWvp9Wh96ZkXuANDoVZ-2K5uV0ZCscAX57AmFXqJysab-Gqi25kdwHGQtCmDLwLT8MV6Dd5ZTBanzxD8d4Ns8HvCP7n2pF8";
const doctorImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB12iX4bopxqKlUJ5WgCwGlOrtwoSqtzpKQYohbtjBhbcauBDzvIWQNKvJb-IvnLwcLJ1FRze_iQyGIytHKGcQW1Mne08qypZewM7D3QeBoAllMh8GsAnEkGmGU8uB98FXq1NJiOZlh7onOT15YdKwqe16_5oQoxPdBLPmOb4aaxPFX_DQDOKTyo7bq8D_lJ5UPmzIKFdJdxJnnmx5WYCRJ6FKQrQk4hj0SrgR_1h8hMKx7bXoyv4mI8tEtBJqg3Fcf98DaTPVN9eQ8";

function Home() {
  return (
    <PageShell>
      <section className="hero-wash overflow-hidden px-5 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:px-3">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1.5 text-sm font-semibold text-primary">
              <Video className="size-4" />
              Virtual care now available
            </span>
            <h1 className="mt-7 max-w-3xl font-display text-5xl font-bold leading-[1.08] tracking-[-0.045em] md:text-6xl">
              Consult a dentist online —{" "}
              <span className="text-primary">from the comfort of home.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Book a private 1-on-1 video consultation in minutes. Thoughtful clinical advice
              without the travel.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button variant="hero" size="xl" asChild>
                <Link to="/book">
                  Book virtual consultation <ArrowRight />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="#services">View services</a>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {["A", "M", "R"].map((v) => (
                  <span
                    key={v}
                    className="grid size-9 place-items-center rounded-full border-2 border-background bg-secondary font-bold text-secondary-foreground"
                  >
                    {v}
                  </span>
                ))}
              </div>
              Trusted by 2,000+ happy patients
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="overflow-hidden rounded-[2rem] border-8 border-background shadow-2xl shadow-primary/15 rotate-1">
              <img
                src={heroImage}
                alt="Dentist conducting a virtual video consultation"
                className="h-[540px] w-full object-cover"
              />
            </div>
            <div className="absolute bottom-8 left-[-2rem] flex items-center gap-3 rounded-2xl border border-border bg-background/90 p-4 shadow-xl backdrop-blur">
              <span className="grid size-11 place-items-center rounded-xl bg-success/12 text-success">
                <BadgeCheck />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Clinical accuracy</p>
                <p className="font-bold">99.8% satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-5 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
          <div className="relative mx-auto max-w-md">
            <img
              src={doctorImage}
              alt="Dr. Sarah Mitchell, virtual dentist"
              className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-xl"
            />
            <blockquote className="absolute -bottom-6 -right-6 max-w-xs rounded-2xl border border-border bg-background p-5 shadow-xl">
              <p className="font-display text-xl font-bold text-primary">
                “Precise care, everywhere.”
              </p>
              <footer className="mt-2 text-sm text-muted-foreground">
                — Dr. Sarah Mitchell, DDS
              </footer>
            </blockquote>
          </div>
          <div>
            <p className="eyebrow">Meet your doctor</p>
            <h2 className="section-title">Ten years of clinical care, now available anywhere.</h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Dr. Mitchell pairs evidence-based dentistry with a calm, human approach. Get practical
              next steps, second opinions, and preventative guidance in one focused visit.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="stat-panel">
                <strong>10k+</strong>
                <span>patients treated</span>
              </div>
              <div className="stat-panel">
                <strong>10+</strong>
                <span>years experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="services" className="bg-muted/50 px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Specialist services</p>
            <h2 className="section-title">Focused guidance for healthier smiles</h2>
            <p className="mt-4 text-muted-foreground">
              High-precision dental guidance from your phone or laptop.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              [
                Video,
                "Virtual consultation",
                "A focused assessment for dental concerns, emergencies, and second opinions.",
              ],
              [
                Sparkles,
                "Whitening advice",
                "Personal recommendations designed for safe results and sensitive teeth.",
              ],
              [
                HeartPulse,
                "Oral health guidance",
                "Preventative care planning and habits for lifelong oral health.",
              ],
            ].map(([Icon, title, text]) => {
              const ServiceIcon = Icon as typeof Video;
              return (
                <article key={title as string} className="service-card">
                  <span className="service-icon">
                    <ServiceIcon />
                  </span>
                  <h3>{title as string}</h3>
                  <p>{text as string}</p>
                  <Link
                    to="/book"
                    className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-bold text-primary"
                  >
                    Book this service <ArrowRight className="size-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="eyebrow">Simple by design</p>
            <h2 className="section-title">From booking to consultation in four steps</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              [CalendarCheck, "Book", "Choose a service and time."],
              [ShieldCheck, "Pay", "Complete a secure test payment."],
              [Video, "Receive link", "Your private meeting link appears."],
              [HeartPulse, "Join", "Meet Dr. Mitchell online."],
            ].map(([Icon, title, text], i) => {
              const StepIcon = Icon as typeof Video;
              return (
                <div key={title as string} className="text-center">
                  <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    <StepIcon />
                  </span>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-primary">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold">{title as string}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{text as string}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-muted/50 px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="section-title text-center">What patients say</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              [
                "The most professional virtual consultation I’ve had. Clear, calm advice when I needed it.",
                "James L.",
              ],
              [
                "Thorough guidance and practical recommendations that worked perfectly for my sensitive teeth.",
                "Sarah K.",
              ],
              [
                "Ideal for a busy parent. I had answers and a clear plan without spending an afternoon travelling.",
                "Michael R.",
              ],
            ].map(([quote, name]) => (
              <figure
                key={name}
                className="rounded-3xl border border-border bg-background p-7 shadow-sm"
              >
                <div className="flex gap-1 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-5 leading-7 text-muted-foreground">“{quote}”</blockquote>
                <figcaption className="mt-6 border-t border-border pt-5 font-bold">
                  {name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-primary px-6 py-16 text-center text-primary-foreground shadow-2xl shadow-primary/20">
          <h2 className="font-display text-4xl font-bold tracking-tight">
            Ready for clear, professional advice?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/75">
            Choose a convenient time and meet your dentist from wherever you are.
          </p>
          <Button className="mt-8" variant="inverse" size="xl" asChild>
            <Link to="/book">Schedule appointment</Link>
          </Button>
        </div>
      </section>
      <footer className="border-t border-border px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <p>© 2026 BrightSmile Virtual Dental</p>
          <p>Private care · Secure consultations</p>
        </div>
      </footer>
    </PageShell>
  );
}
