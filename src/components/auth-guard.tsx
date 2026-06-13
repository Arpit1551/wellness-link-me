import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "ready" | "forbidden">("loading");
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { window.location.assign("/auth?next=/admin"); return; }
      const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).eq("role", "DOCTOR").maybeSingle();
      setState(role ? "ready" : "forbidden");
    });
  }, []);
  if (state === "loading") return <div className="grid min-h-screen place-items-center bg-muted/40"><div className="size-9 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-label="Loading" /></div>;
  if (state === "forbidden") return <div className="grid min-h-screen place-items-center bg-muted/40 p-5 text-center"><div><h1 className="font-display text-3xl font-bold">Doctor access required</h1><p className="mt-3 text-muted-foreground">This area is restricted to the clinic owner account.</p><a className="mt-6 inline-block font-semibold text-primary" href="/">Return home</a></div></div>;
  return children;
}