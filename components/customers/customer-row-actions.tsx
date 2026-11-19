"use client";

import { useActionState, useEffect, useRef } from "react";
import { LoaderCircle, Pencil, Trash2, X } from "lucide-react";
import { deleteCustomer, updateCustomer, type EntityActionState } from "@/app/(erp)/actions";
import { CustomerFormFields, type CustomerFormValues } from "@/components/customers/customer-form-fields";

const initialState: EntityActionState = {};

export function CustomerRowActions({ customer }: { customer: CustomerFormValues & { id: string } }) {
  const editDialogRef = useRef<HTMLDialogElement>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const [editState, editAction, editing] = useActionState(updateCustomer.bind(null, customer.id), initialState);
  const [deleteState, deleteAction, deleting] = useActionState(deleteCustomer.bind(null, customer.id), initialState);

  useEffect(() => {
    if (editState.updatedId) editDialogRef.current?.close();
  }, [editState.updatedId]);

  useEffect(() => {
    if (deleteState.deletedId) deleteDialogRef.current?.close();
  }, [deleteState.deletedId]);

  return <>
    <div className="customer-actions">
      <button className="button compact" type="button" onClick={() => editDialogRef.current?.showModal()}><Pencil aria-hidden="true" /> Editar</button>
      <button className="button compact danger" type="button" onClick={() => deleteDialogRef.current?.showModal()}><Trash2 aria-hidden="true" /> Excluir</button>
    </div>

    <dialog className="entity-dialog customer-dialog" ref={editDialogRef}>
      <div className="dialog-header">
        <div><p className="eyebrow">Editar cadastro</p><h2>{customer.trade_name}</h2><p>Atualize os dados de identificação, contato e endereço do cliente.</p></div>
        <button className="dialog-close" type="button" aria-label="Fechar" onClick={() => editDialogRef.current?.close()}><X aria-hidden="true" /></button>
      </div>
      <form action={editAction} className="entity-form">
        <CustomerFormFields defaultValues={customer} autoFocusName />
        {editState.message ? <p className="form-message" role="alert">{editState.message}</p> : null}
        <div className="dialog-actions">
          <button className="button" type="button" onClick={() => editDialogRef.current?.close()}>Cancelar</button>
          <button className="button primary" type="submit" disabled={editing}>
            {editing ? <LoaderCircle className="spin" aria-hidden="true" /> : null}{editing ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </dialog>

    <dialog className="entity-dialog confirm-dialog" ref={deleteDialogRef}>
      <div className="dialog-header">
        <div><p className="eyebrow danger-eyebrow">Excluir cliente</p><h2>Confirmar exclusão?</h2><p>O cliente <strong>{customer.trade_name}</strong> deixará de aparecer nas listas ativas. O histórico comercial será preservado para auditoria.</p></div>
        <button className="dialog-close" type="button" aria-label="Fechar" onClick={() => deleteDialogRef.current?.close()}><X aria-hidden="true" /></button>
      </div>
      <form action={deleteAction} className="entity-form">
        <p className="confirm-copy">Esta ação não pode ser desfeita pela tela do ERP.</p>
        {deleteState.message ? <p className="form-message" role="alert">{deleteState.message}</p> : null}
        <div className="dialog-actions">
          <button className="button" type="button" onClick={() => deleteDialogRef.current?.close()}>Cancelar</button>
          <button className="button danger" type="submit" disabled={deleting}>
            {deleting ? <LoaderCircle className="spin" aria-hidden="true" /> : <Trash2 aria-hidden="true" />}{deleting ? "Excluindo..." : "Sim, excluir cliente"}
          </button>
        </div>
      </form>
    </dialog>
  </>;
}
