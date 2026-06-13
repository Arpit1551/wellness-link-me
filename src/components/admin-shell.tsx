import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, CreditCard, LayoutDashboard, LogOut, Menu, Settings, Stethoscope, Video, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const items = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Appointments", to: "/admin/appointments", icon: CalendarDays },
  { label: "Payments", to: "/admin/payments", icon: CreditCard },
  { label: "Meetings", to: "/admin/meetings", icon: Video },
  { label: "Settings", to: "/admin/settings", icon: Settings },
] as const;

export function AdminShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const logout = async () => { await supabase.auth.signOut(); window.location.assign("/auth"); };
  return <div className="min-h-screen bg-muted/35">
    {open && <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-6"><Link to="/" className="flex items-center gap-3 font-display font-bold"><span className="grid size-9 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground"><Stethoscope className="size-5" /></span>BrightSmile</Link><Button className="lg:hidden" variant="ghost" size="icon" onClick={() => setOpen(false)}><X /></Button></div>
      <nav className="flex-1 space-y-1 p-4">{items.map((item) => { const active = pathname === item.to; return <Link key={item.label} to={item.to} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${active ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`}><item.icon className="size-4" />{item.label}</Link>; })}</nav>
      <div className="border-t border-sidebar-border p-4"><Button variant="ghost" className="w-full justify-start" onClick={logout}><LogOut />Sign out</Button></div>
    </aside>
    <div className="lg:pl-64"><header className="flex min-h-20 items-center gap-4 border-b border-border bg-background px-5 lg:px-8"><Button className="lg:hidden" variant="outline" size="icon" onClick={() => setOpen(true)}><Menu /></Button><div><h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1><p className="text-sm text-muted-foreground">{subtitle}</p></div></header><main className="p-5 lg:p-8">{children}</main></div>
  </div>;
}