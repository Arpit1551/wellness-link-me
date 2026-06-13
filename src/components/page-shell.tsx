import { SiteHeader } from "./site-header";

export function PageShell({ children }: { children: React.ReactNode }) {
  return <><SiteHeader /><main className="min-h-screen pt-20">{children}</main></>;
}