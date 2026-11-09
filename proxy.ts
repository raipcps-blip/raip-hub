import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPublicSupabaseConfig } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";

const protectedPrefixes = [
  "/dashboard",
  "/empresas",
  "/contatos",
  "/oportunidades",
  "/propostas",
  "/projetos",
  "/financeiro",
  "/relatorios",
  "/configuracoes",
];

type PendingCookie = { name: string; value: string; options: CookieOptions };

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function withCookies(response: NextResponse, pendingCookies: PendingCookie[]) {
  pendingCookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
  return response;
}

export async function proxy(request: NextRequest) {
  const config = getPublicSupabaseConfig();
  const { pathname, search } = request.nextUrl;

  if (!config) {
    if (process.env.NODE_ENV !== "production" || pathname === "/configuration-required") {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/configuration-required", request.url));
  }

  const pendingCookies: PendingCookie[] = [];
  const supabase = createServerClient<Database>(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          pendingCookies.push({ name, value, options });
        });
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user && isProtectedPath(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return withCookies(NextResponse.redirect(loginUrl), pendingCookies);
  }

  if (user && pathname === "/login") {
    return withCookies(NextResponse.redirect(new URL("/dashboard", request.url)), pendingCookies);
  }

  return withCookies(NextResponse.next({ request }), pendingCookies);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
