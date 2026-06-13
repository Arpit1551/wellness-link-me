import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useClinicData<T>(
  table: "appointments" | "payments" | "meetings" | "clinic_settings",
  select = "*",
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    const result = await supabase
      .from(table)
      .select(select)
      .order("created_at", { ascending: false });
    setData((result.data ?? []) as T[]);
    setLoading(false);
  }, [table, select]);
  useEffect(() => {
    load();
    const channel =
      table === "clinic_settings"
        ? null
        : supabase
            .channel(`${table}-admin`)
            .on("postgres_changes", { event: "*", schema: "public", table }, load)
            .subscribe();
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [load, table]);
  return { data, loading, reload: load };
}
