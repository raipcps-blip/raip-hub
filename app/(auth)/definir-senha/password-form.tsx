"use client";

import { useActionState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { definePassword, type PasswordState } from "./actions";

const initialState: PasswordState = {};

export function PasswordForm() {
  const [state, action, pending] = useActionState(definePassword, initialState);

  return (
    <form action={action} className="auth-form" noValidate>
      <label className="field-label" htmlFor="password">Nova senha</label>
      <input
        className="form-control"
        id="password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
        aria-describedby="password-hint password-error"
      />
      <p className="field-hint" id="password-hint">Use pelo menos 8 caracteres.</p>
      <p className="field-error" id="password-error">{state.fieldErrors?.password?.[0]}</p>

      <label className="field-label" htmlFor="passwordConfirmation">Confirmar senha</label>
      <input
        className="form-control"
        id="passwordConfirmation"
        name="passwordConfirmation"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
        aria-describedby="password-confirmation-error"
      />
      <p className="field-error" id="password-confirmation-error">
        {state.fieldErrors?.passwordConfirmation?.[0]}
      </p>

      {state.message ? <p className="form-message" role="alert">{state.message}</p> : null}
      <button className="button primary auth-submit" type="submit" disabled={pending}>
        {pending ? <LoaderCircle className="spin" aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
        {pending ? "Salvando..." : "Definir senha e entrar"}
      </button>
    </form>
  );
}
