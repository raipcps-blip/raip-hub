"use client";

import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import {
  authCallbackDestination,
  readLegacyAuthSession,
} from "@/lib/auth/legacy-callback";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

function goTo(path: string) {
  window.location.replace(path);
}

export function AuthLanding() {
  useEffect(() => {
    let active = true;

    async function finishAuthentication() {
      const supabase = createBrowserSupabaseClient();
      const callbackSession = readLegacyAuthSession(window.location.hash);

      if (callbackSession) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);

        const { error } = await supabase.auth.setSession({
          access_token: callbackSession.accessToken,
          refresh_token: callbackSession.refreshToken,
        });

        if (!active) return;
        goTo(error ? "/login?erro=convite-invalido" : authCallbackDestination(callbackSession.type));
        return;
      }

      const hasCallbackError = new URLSearchParams(window.location.hash.slice(1)).has("error");
      if (hasCallbackError) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
        goTo("/login?erro=convite-invalido");
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!active) return;
      goTo(data.session ? "/dashboard" : "/login");
    }

    void finishAuthentication();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="auth-shell">
      <section className="auth-card auth-loading" aria-live="polite" aria-busy="true">
        <LoaderCircle className="spin" aria-hidden="true" />
        <p>Validando seu acesso ao RAIP Hub...</p>
      </section>
    </main>
  );
}
