import { NextResponse, type NextRequest } from "next/server";
import { safeInternalPath } from "@/lib/auth/redirect";
import { getAppUrl } from "@/server/auth/app-url";
import { createServerSupabaseClient } from "@/server/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const nextPath = safeInternalPath(request.nextUrl.searchParams.get("next"), "/dashboard");
  const origin = getAppUrl();

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const { data: assignedRole, error: roleError } = await supabase
        .from("profile_roles")
        .select("role_id")
        .eq("profile_id", data.user.id)
        .limit(1)
        .maybeSingle();

      if (!roleError && assignedRole) {
        return NextResponse.redirect(`${origin}${nextPath}`);
      }

      await supabase.auth.signOut({ scope: "global" });
      return NextResponse.redirect(`${origin}/login?erro=acesso-nao-autorizado`);
    }
  }

  return NextResponse.redirect(`${origin}/login?erro=google-falhou`);
}
