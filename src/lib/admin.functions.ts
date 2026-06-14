import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const bootstrapAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existingDoctors } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("role", "DOCTOR")
      .limit(1);

    if (existingDoctors && existingDoctors.length > 0) {
      return { ok: false, message: "An admin already exists. Contact them for access." };
    }

    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "DOCTOR" });

    if (error) throw error;
    return { ok: true, message: "You are now the clinic admin." };
  });

export const getDoctorCount = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count, error } = await supabaseAdmin
    .from("user_roles")
    .select("id", { count: "exact", head: true })
    .eq("role", "DOCTOR");
  if (error) throw error;
  return { count: count ?? 0 };
});
