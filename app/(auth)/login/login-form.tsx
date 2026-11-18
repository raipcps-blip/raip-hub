"use client";

import { useActionState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { login, loginWithGoogle, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm({ nextPath }: { nextPath?: string }) {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <div>
      <form action={loginWithGoogle}>
        <input type="hidden" name="next" value={nextPath ?? "/dashboard"} />
        <button className="button auth-google" type="submit">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.91h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.4Z" />
            <path fill="#34A853" d="M12 22c2.7 0 4.98-.9 6.63-2.43l-3.24-2.54c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z" />
            <path fill="#FBBC05" d="M6.39 13.86A6.01 6.01 0 0 1 6.07 12c0-.65.11-1.28.32-1.86V7.52H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.48l3.35-2.62Z" />
            <path fill="#EA4335" d="M12 6.01c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.65 9.65 0 0 0 12 2a10 10 0 0 0-8.96 5.52l3.35 2.62C7.18 7.77 9.39 6.01 12 6.01Z" />
          </svg>
          Continuar com Google
        </button>
      </form>
      <div className="auth-divider"><span>ou entre com e-mail</span></div>
      <form action={action} className="auth-form" noValidate>
        <input type="hidden" name="next" value={nextPath ?? "/dashboard"} />
        <label className="field-label" htmlFor="email">E-mail</label>
        <input className="form-control" id="email" name="email" type="email" autoComplete="email" required aria-describedby="email-error" />
        <p className="field-error" id="email-error">{state.fieldErrors?.email?.[0]}</p>

        <label className="field-label" htmlFor="password">Senha</label>
        <input className="form-control" id="password" name="password" type="password" autoComplete="current-password" required aria-describedby="password-error" />
        <p className="field-error" id="password-error">{state.fieldErrors?.password?.[0]}</p>

        {state.message ? <p className="form-message" role="alert">{state.message}</p> : null}
        <button className="button primary auth-submit" type="submit" disabled={pending}>
          {pending ? <LoaderCircle className="spin" aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
          {pending ? "Entrando..." : "Entrar no Hub"}
        </button>
      </form>
    </div>
  );
}
