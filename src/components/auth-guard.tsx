import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (!data.user) window.location.assign("/auth?next=/admin"); else setReady(true); });
  }, []);
  if (!ready) return <div className="grid min-h-screen place-items-center bg-muted/40"><div className="size-9 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-label="Loading" /></div>;
  return children;
}