"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { LoaderCircle, Plus, X } from "lucide-react";
import { createCustomer, type EntityActionState } from "@/app/(erp)/actions";
import { CustomerFormFields } from "@/components/customers/customer-form-fields";

const initialState: EntityActionState = {};

export function CustomerCreateDialog() {
  const [state, formAction, pending] = useActionState(createCustomer, initialState);
  const [formVersion, setFormVersion] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.createdId) return;
    formRef.current?.reset();
    dialogRef.current?.close();
  }, [state.createdId]);

  return <>
    <button
      className="button primary"
      type="button"
      onClick={() => {
        setFormVersion((version) => version + 1);
        dialogRef.current?.showModal();
      }}
    >
      <Plus aria-hidden="true" /> Novo cliente
    </button>

    <dialog className="entity-dialog customer-dialog" ref={dialogRef}>
      <div className="dialog-header">
        <div>
          <p className="eyebrow">Novo registro</p>
          <h2>Cadastrar cliente</h2>
          <p>Registre pessoas físicas ou jurídicas com seus dados de contato e endereço.</p>
        </div>
        <button className="dialog-close" type="button" aria-label="Fechar" onClick={() => dialogRef.current?.close()}><X aria-hidden="true" /></button>
      </div>

      <form action={formAction} className="entity-form" ref={formRef}>
        <CustomerFormFields key={formVersion} autoFocusName />
        {state.message ? <p className="form-message" role="alert">{state.message}</p> : null}
        <div className="dialog-actions">
          <button className="button" type="button" onClick={() => dialogRef.current?.close()}>Cancelar</button>
          <button className="button primary" type="submit" disabled={pending}>
            {pending ? <LoaderCircle className="spin" aria-hidden="true" /> : null}{pending ? "Salvando..." : "Cadastrar cliente"}
          </button>
        </div>
      </form>
    </dialog>
  </>;
}
