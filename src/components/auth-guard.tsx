import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { bootstrapAdmin, getDoctorCount } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { ShieldPlus } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "ready" | "forbidden">("loading");
  const [doctorCount, setDoctorCount] = useState(0);
  const [bootMsg, setBootMsg] = useState("");
  const [booting, setBooting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data, error }) => {
      if (error) {
        setState("forbidden");
        return;
      }
      if (!data.user) {
        window.location.assign("/auth?next=/admin");
        return;
      }
      const { data: role, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "DOCTOR")
        .maybeSingle();
      if (role && !roleError) {
        setState("ready");
        return;
      }
      try {
        const { count } = await getDoctorCount();
        setDoctorCount(count);
      } catch {
        setDoctorCount(999);
      }
      setState("forbidden");
    });
  }, []);

  const handleBootstrap = async () => {
    setBooting(true);
    try {
      const result = await bootstrapAdmin();
      if (result.ok) {
        window.location.reload();
      } else {
        setBootMsg(result.message);
      }
    } catch (e: any) {
      setBootMsg(e.message || "Failed to create coach admin");
    } finally {
      setBooting(false);
    }
  };

  if (state === "loading")
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div
          className="size-9 animate-spin rounded-full border-2 border-primary border-t-transparent"
          aria-label="Loading"
        />
      </div>
    );

  if (state === "forbidden")
    return (
      <div className="grid min-h-screen place-items-center bg-background p-5 text-center">
        <div className="max-w-sm">
          <h1 className="font-display text-3xl font-bold">Coach access required</h1>
          <p className="mt-3 text-muted-foreground">
            This area is restricted to the Luka Moves coach account.
          </p>
          {doctorCount === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">
                No coach admin exists yet. You can bootstrap yourself as the first coach.
              </p>
              <Button className="mt-4 w-full" onClick={handleBootstrap} disabled={booting}>
                <ShieldPlus className="mr-2 size-4" />
                {booting ? "Setting up…" : "Become Coach Admin"}
              </Button>
              {bootMsg && <p className="mt-3 text-sm text-destructive">{bootMsg}</p>}
            </div>
          )}
          <a className="mt-6 inline-block font-semibold text-primary" href="/">
            Return home
          </a>
        </div>
      </div>
    );

  return children;
}
