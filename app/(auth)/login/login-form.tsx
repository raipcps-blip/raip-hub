"use client";

import { useActionState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm({ nextPath }: { nextPath?: string }) {
  const [state, action, pending] = useActionState(login, initialState);

  return (
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
  );
}
