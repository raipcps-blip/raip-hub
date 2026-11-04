import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { getPublicSupabaseConfig } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/server/supabase/server";

export const getAuthenticatedUser = cache(async () => {
  if (!getPublicSupabaseConfig()) return null;

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) return null;
  return data.user;
});

export async function requireAuthenticatedUser() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");
  return user;
}
