import { Link } from "@tanstack/react-router";
import { Menu, Stethoscope } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const nav = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/" },
  { label: "Contact", to: "/contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="flex items-center gap-3 font-display text-lg font-bold">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Stethoscope className="size-5" />
          </span>
          <span>
            BrightSmile<span className="text-primary"> Virtual</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {nav.map((item) =>
            item.label === "Services" ? (
              <a
                key={item.label}
                href="/#services"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ),
          )}
          <Link
            to="/admin"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Doctor login
          </Link>
          <Button variant="hero" asChild>
            <Link to="/book">Book appointment</Link>
          </Button>
        </nav>
        <Button
          className="md:hidden"
          variant="ghost"
          size="icon"
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
        >
          <Menu />
        </Button>
      </div>
      {open && (
        <nav className="grid gap-2 border-t border-border bg-background p-5 md:hidden">
          {nav.map((item) =>
            item.label === "Services" ? (
              <a
                key={item.label}
                href="/#services"
                className="rounded-lg px-3 py-2 text-sm font-medium"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className="rounded-lg px-3 py-2 text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ),
          )}
          <Button asChild>
            <Link to="/book">Book appointment</Link>
          </Button>
        </nav>
      )}
    </header>
  );
}
