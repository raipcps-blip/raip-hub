"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requirePublicSupabaseConfig } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";

export function createBrowserSupabaseClient() {
  const { url, publishableKey } = requirePublicSupabaseConfig();

  return createBrowserClient<Database>(url, publishableKey, {
    auth: { detectSessionInUrl: false },
  });
}
