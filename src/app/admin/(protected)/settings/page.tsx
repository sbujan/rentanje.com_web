import { createClient } from "@/lib/supabase/server";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: rows } = await supabase.from("settings").select("key, value");

  const settings: Record<string, string> = {};
  for (const row of rows ?? []) {
    settings[row.key] = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Postavke</h1>
        <p className="text-gray-400 text-sm mt-1">Globalne postavke stranice.</p>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}
