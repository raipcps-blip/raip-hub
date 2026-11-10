import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { safeInternalPath } from "@/lib/auth/redirect";
import { getPublicSupabaseConfig } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/server/supabase/server";

const acceptedOtpTypes = new Set<EmailOtpType>(["invite", "recovery"]);

function isAcceptedOtpType(value: string | null): value is EmailOtpType {
  return value !== null && acceptedOtpTypes.has(value as EmailOtpType);
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const nextPath = safeInternalPath(
    requestUrl.searchParams.get("next"),
    type === "invite" || type === "recovery" ? "/definir-senha" : "/dashboard",
  );

  if (!getPublicSupabaseConfig()) {
    return NextResponse.redirect(new URL("/configuration-required", request.url));
  }

  if (tokenHash && isAcceptedOtpType(type)) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });

    if (!error) {
      return NextResponse.redirect(new URL(nextPath, request.url));
    }
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("erro", "convite-invalido");
  return NextResponse.redirect(loginUrl);
}
