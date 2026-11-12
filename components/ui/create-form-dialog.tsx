"use client";

import type { ReactNode } from "react";
import { useActionState, useEffect, useRef } from "react";
import { LoaderCircle, Plus, X } from "lucide-react";
import type { EntityActionState } from "@/app/(erp)/actions";

type EntityAction = (
  state: EntityActionState,
  formData: FormData,
) => Promise<EntityActionState>;

type CreateFormDialogProps = {
  action: EntityAction;
  children: ReactNode;
  description: string;
  submitLabel: string;
  title: string;
  triggerLabel: string;
  triggerVariant?: "default" | "primary";
};

const initialState: EntityActionState = {};

export function CreateFormDialog({
  action,
  children,
  description,
  submitLabel,
  title,
  triggerLabel,
  triggerVariant = "primary",
}: CreateFormDialogProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (state.createdId) dialogRef.current?.close();
  }, [state.createdId]);

  return (
    <>
      <button
        className={`button${triggerVariant === "primary" ? " primary" : ""}`}
        type="button"
        onClick={() => dialogRef.current?.showModal()}
      >
        <Plus aria-hidden="true" /> {triggerLabel}
      </button>

      <dialog
        className="entity-dialog"
        ref={dialogRef}
      >
        <div className="dialog-header">
          <div>
            <p className="eyebrow">Novo registro</p>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <button className="dialog-close" type="button" aria-label="Fechar" onClick={() => dialogRef.current?.close()}>
            <X aria-hidden="true" />
          </button>
        </div>

        <form action={formAction} className="entity-form">
          {children}
          {state.message ? <p className="form-message" role="alert">{state.message}</p> : null}
          <div className="dialog-actions">
            <button className="button" type="button" onClick={() => dialogRef.current?.close()}>Cancelar</button>
            <button className="button primary" type="submit" disabled={pending}>
              {pending ? <LoaderCircle className="spin" aria-hidden="true" /> : null}
              {pending ? "Salvando..." : submitLabel}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
