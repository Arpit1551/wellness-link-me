import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  Dumbbell,
  Flame,
  Brain,
  Sparkles,
  Star,
  Users,
  Video,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Luka Moves — Calisthenics, Mobility & Discipline Coaching" },
      {
        name: "description",
        content:
          "Train 1-1 with Coach Luka. Custom mobility plans, handstand and discipline communities, and digital protocols built for serious athletes.",
      },
    ],
  }),
  component: Home,
});

const heroImage =
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1400&q=80";
const coachImage =
  "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=900&q=80";

type Product = {
  tag: string;
  name: string;
  desc: string;
  price: string;
  cadence?: string;
  cta: string;
  href: string;
  search?: Record<string, string>;
  icon: typeof Dumbbell;
  featured?: boolean;
};

const oneToOne: Product[] = [
  {
    tag: "1-1 Coaching",
    name: "1-1 Coaching Call with Luka",
    desc: "A focused 45-minute video session — technique review, programming feedback, and a clear next-step plan.",
    price: "$199.99",
    cta: "Book your call",
    href: "/book",
    search: { service: "1-1 Coaching Call with Luka" },
    icon: Video,
  },
  {
    tag: "Premium onboarding",
    name: "Custom 12-Week Mobility & Flexibility Plan",
    desc: "Begins with a structural assessment session. Fully personalized programming, weekly check-ins, and direct feedback for 12 weeks.",
    price: "$499",
    cta: "Start with assessment",
    href: "/book",
    search: { service: "Custom 12-Week Mobility & Flexibility Plan" },
    icon: Flame,
    featured: true,
  },
];

const digital: Product[] = [
  {
    tag: "Digital protocol",
    name: "30-Day Foundation Protocol",
    desc: "The exact daily template Luka uses to build a movement base — strength, mobility, and consistency from day one.",
    price: "$97",
    cta: "Get instant access",
    href: "/purchase",
    search: { product: "30-Day Foundation Protocol" },
    icon: Dumbbell,
  },
  {
    tag: "Course",
    name: "Beginners Handstand Course",
    desc: "Step-by-step progressions, drills, and video breakdowns to take you from wall holds to your first freestanding handstand.",
    price: "$39.97",
    cta: "Buy course",
    href: "/purchase",
    search: { product: "Beginners Handstand Course" },
    icon: Sparkles,
  },
];

const communities: Product[] = [
  {
    tag: "Community",
    name: "The Handstand Community",
    desc: "Live weekly Q&As, accountability cohorts, and a private feed for daily form checks with Luka and other athletes.",
    price: "$29.99",
    cadence: "/mo",
    cta: "Join community",
    href: "/purchase",
    search: { product: "Join The Handstand Community" },
    icon: Users,
  },
  {
    tag: "Community",
    name: "The Discipline & Mindset Community",
    desc: "A weekly framework for training the mind like a muscle — habits, journaling prompts, and live mindset workshops.",
    price: "$29.99",
    cadence: "/mo",
    cta: "Join community",
    href: "/purchase",
    search: { product: "The Discipline & Mindset Community" },
    icon: Brain,
  },
];

function ProductCard({ p }: { p: Product }) {
  return (
    <article
      className={`service-card relative ${p.featured ? "glow-ring" : ""}`}
    >
      {p.featured && (
        <span className="absolute right-5 top-5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
          Most popular
        </span>
      )}
      <span className="service-icon">
        <p.icon />
      </span>
      <p className="mt-5 text-[11px] font-bold uppercase tracking-[.18em] text-primary">{p.tag}</p>
      <h3>{p.name}</h3>
      <p>{p.desc}</p>
      <div className="mt-auto flex items-end justify-between pt-6">
        <p className="price-tag text-2xl">
          {p.price}
          {p.cadence && (
            <span className="text-sm font-medium text-muted-foreground">{p.cadence}</span>
          )}
        </p>
        <Button asChild size="sm" variant={p.featured ? "hero" : "outline"}>
          <Link to={p.href} search={p.search as never}>
            {p.cta} <ArrowRight />
          </Link>
        </Button>
      </div>
    </article>
  );
}

function Home() {
  return (
    <PageShell>
      {/* HERO */}
      <section className="hero-wash overflow-hidden px-5 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:px-3">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              <Zap className="size-4" />
              Now coaching · limited slots
            </span>
            <h1 className="mt-7 max-w-3xl font-display text-5xl font-bold leading-[1.02] tracking-[-0.045em] md:text-6xl">
              Build a body that <span className="text-primary">moves like it was built for it.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              1-on-1 calisthenics & mobility coaching with Coach Luka. Strength, discipline, and the
              kind of movement quality that takes years off the clock.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button variant="hero" size="xl" asChild>
                <Link to="/book">
                  Book a coaching call <ArrowRight />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="#programs">Explore programs</a>
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
              Trusted by 2,000+ athletes worldwide
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="overflow-hidden rounded-[2rem] border border-border shadow-2xl shadow-primary/20 rotate-1">
              <img
                src={heroImage}
                alt="Athlete training calisthenics outdoors"
                className="h-[540px] w-full object-cover"
              />
            </div>
            <div className="absolute bottom-8 left-[-2rem] flex items-center gap-3 rounded-2xl border border-border bg-card/90 p-4 shadow-xl backdrop-blur">
              <span className="grid size-11 place-items-center rounded-xl bg-success/15 text-success">
                <Dumbbell />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Programming since 2016</p>
                <p className="font-bold">10 yrs · 10k+ sessions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COACH */}
      <section className="px-5 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
          <div className="relative mx-auto max-w-md">
            <img
              src={coachImage}
              alt="Coach Luka, calisthenics & movement coach"
              className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-xl"
            />
            <blockquote className="absolute -bottom-6 -right-6 max-w-xs rounded-2xl border border-border bg-card p-5 shadow-xl">
              <p className="font-display text-xl font-bold text-primary">
                "Master the basics. Outwork your excuses."
              </p>
              <footer className="mt-2 text-sm text-muted-foreground">— Coach Luka</footer>
            </blockquote>
          </div>
          <div>
            <p className="eyebrow">Meet your coach</p>
            <h2 className="section-title">
              A decade of coaching strength, mobility, and discipline.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Luka has coached pro athletes, weekend warriors, and total beginners through the same
              progressions — built around honest movement standards, not gimmicks.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="stat-panel">
                <strong>10k+</strong>
                <span>sessions coached</span>
              </div>
              <div className="stat-panel">
                <strong>10+</strong>
                <span>years experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section id="programs" className="border-y border-border bg-card/30 px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">1-1 Coaching</p>
            <h2 className="section-title">Train directly with Luka</h2>
            <p className="mt-4 text-muted-foreground">
              Premium 1-on-1 coaching tiers — every slot is hand-coached.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {oneToOne.map((p) => (
              <ProductCard key={p.name} p={p} />
            ))}
          </div>

          <div className="mx-auto mt-20 max-w-2xl text-center">
            <p className="eyebrow">Self-paced</p>
            <h2 className="section-title">Digital programs & protocols</h2>
            <p className="mt-4 text-muted-foreground">
              Lifetime access. Train on your schedule.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {digital.map((p) => (
              <ProductCard key={p.name} p={p} />
            ))}
          </div>

          <div className="mx-auto mt-20 max-w-2xl text-center">
            <p className="eyebrow">Communities</p>
            <h2 className="section-title">Train with the tribe</h2>
            <p className="mt-4 text-muted-foreground">
              Monthly memberships. Cancel anytime.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {communities.map((p) => (
              <ProductCard key={p.name} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="eyebrow">How it works</p>
            <h2 className="section-title">From booking to coaching in four steps</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              [CalendarCheck, "Pick a slot", "Choose a program and a time."],
              [ShieldCheck, "Secure checkout", "Pay safely — Stripe/Razorpay ready."],
              [Video, "Get your link", "Your private meeting link is generated."],
              [Dumbbell, "Show up & train", "Meet Coach Luka and put in the work."],
            ].map(([Icon, title, text], i) => {
              const StepIcon = Icon as typeof Video;
              return (
                <div key={title as string} className="text-center">
                  <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
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

      {/* TESTIMONIALS */}
      <section className="border-t border-border bg-card/30 px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="section-title text-center">What athletes are saying</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              [
                "Luka rebuilt my squat and hip mobility in 8 weeks. I'm 41 and moving better than my 20s.",
                "James L.",
              ],
              [
                "The handstand course is unreal. Clear progressions, zero fluff — first freestanding hold in 6 weeks.",
                "Sarah K.",
              ],
              [
                "The discipline community changed my mornings. Best $30/mo I spend.",
                "Michael R.",
              ],
            ].map(([quote, name]) => (
              <figure
                key={name}
                className="rounded-3xl border border-border bg-card p-7 shadow-sm"
              >
                <div className="flex gap-1 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-5 leading-7 text-muted-foreground">"{quote}"</blockquote>
                <figcaption className="mt-6 border-t border-border pt-5 font-bold">
                  {name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-primary px-6 py-16 text-center text-primary-foreground shadow-2xl shadow-primary/25">
          <h2 className="font-display text-4xl font-bold tracking-tight">
            Ready to move differently?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Book a 1-1 coaching call and walk away with a clear plan.
          </p>
          <Button className="mt-8" variant="inverse" size="xl" asChild>
            <Link to="/book">Schedule a session</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <p>© 2026 Luka Moves — Calisthenics & Movement Coaching</p>
          <p>Train hard · Move well · Stay disciplined</p>
        </div>
      </footer>
    </PageShell>
  );
}
