"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { LoaderCircle, MapPin, Plus, Search, X } from "lucide-react";
import { createCustomer, type EntityActionState } from "@/app/(erp)/actions";

type AddressResponse = {
  city: string;
  complement: string;
  neighborhood: string;
  postalCode: string;
  state: string;
  street: string;
};

const initialState: EntityActionState = {};

function setFormValue(form: HTMLFormElement, name: string, value: string) {
  const field = form.elements.namedItem(name);
  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.value = value;
}

export function CustomerCreateDialog() {
  const [state, formAction, pending] = useActionState(createCustomer, initialState);
  const [customerType, setCustomerType] = useState<"PF" | "PJ">("PJ");
  const [cepMessage, setCepMessage] = useState("");
  const [searchingCep, setSearchingCep] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.createdId) return;
    formRef.current?.reset();
    dialogRef.current?.close();
  }, [state.createdId]);

  async function searchPostalCode() {
    const form = formRef.current;
    if (!form) return;

    const postalCodeField = form.elements.namedItem("postalCode");
    const postalCode = postalCodeField instanceof HTMLInputElement
      ? postalCodeField.value.replace(/\D/g, "")
      : "";

    if (postalCode.length !== 8) {
      setCepMessage("Informe um CEP com 8 dígitos.");
      return;
    }

    setSearchingCep(true);
    setCepMessage("Buscando endereço...");

    try {
      const response = await fetch(`/api/cep/${postalCode}`);
      const payload = await response.json() as AddressResponse & { message?: string };
      if (!response.ok) throw new Error(payload.message || "CEP não encontrado.");

      setFormValue(form, "postalCode", payload.postalCode);
      setFormValue(form, "street", payload.street);
      setFormValue(form, "addressComplement", payload.complement);
      setFormValue(form, "neighborhood", payload.neighborhood);
      setFormValue(form, "city", payload.city);
      setFormValue(form, "state", payload.state);
      setCepMessage("Endereço preenchido. Informe o número e revise os dados.");

      const numberField = form.elements.namedItem("streetNumber");
      if (numberField instanceof HTMLInputElement) numberField.focus();
    } catch (error) {
      setCepMessage(error instanceof Error ? error.message : "Não foi possível buscar o CEP.");
    } finally {
      setSearchingCep(false);
    }
  }

  return (
    <>
      <button
        className="button primary"
        type="button"
        onClick={() => {
          setCustomerType("PJ");
          setCepMessage("");
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
          <button className="dialog-close" type="button" aria-label="Fechar" onClick={() => dialogRef.current?.close()}>
            <X aria-hidden="true" />
          </button>
        </div>

        <form action={formAction} className="entity-form" ref={formRef}>
          <fieldset className="form-section">
            <legend>Identificação</legend>
            <div className="form-grid two-columns">
              <label className="form-field">
                <span>Tipo *</span>
                <select name="customerType" value={customerType} onChange={(event) => setCustomerType(event.target.value as "PF" | "PJ")}>
                  <option value="PJ">Pessoa jurídica</option>
                  <option value="PF">Pessoa física</option>
                </select>
              </label>
              <label className="form-field">
                <span>{customerType === "PF" ? "CPF *" : "CNPJ *"}</span>
                <input
                  name="taxId"
                  inputMode="numeric"
                  maxLength={customerType === "PF" ? 14 : 18}
                  placeholder={customerType === "PF" ? "000.000.000-00" : "00.000.000/0000-00"}
                  required
                />
              </label>
              <label className="form-field full-width">
                <span>Nome *</span>
                <input name="name" minLength={2} maxLength={160} autoFocus required />
              </label>
            </div>
          </fieldset>

          <fieldset className="form-section">
            <legend>Contato</legend>
            <div className="form-grid three-columns">
              <label className="form-field"><span>Telefone</span><input name="phone" type="tel" autoComplete="tel" maxLength={30} /></label>
              <label className="form-field"><span>WhatsApp</span><input name="whatsapp" type="tel" maxLength={30} /></label>
              <label className="form-field"><span>E-mail</span><input name="email" type="email" autoComplete="email" maxLength={254} /></label>
            </div>
          </fieldset>

          <fieldset className="form-section">
            <legend><MapPin aria-hidden="true" /> Endereço</legend>
            <div className="form-grid two-columns">
              <div className="form-field full-width">
                <span>CEP</span>
                <div className="field-action-row">
                  <input name="postalCode" inputMode="numeric" maxLength={10} placeholder="00000-000" />
                  <button className="button" type="button" onClick={searchPostalCode} disabled={searchingCep}>
                    {searchingCep ? <LoaderCircle className="spin" aria-hidden="true" /> : <Search aria-hidden="true" />}
                    {searchingCep ? "Buscando..." : "Buscar CEP"}
                  </button>
                </div>
                <small className="field-feedback" aria-live="polite">{cepMessage}</small>
              </div>
              <label className="form-field full-width"><span>Endereço</span><input name="street" maxLength={240} /></label>
              <label className="form-field"><span>Número</span><input name="streetNumber" maxLength={30} /></label>
              <label className="form-field"><span>Complemento</span><input name="addressComplement" maxLength={160} /></label>
              <label className="form-field"><span>Bairro</span><input name="neighborhood" maxLength={120} /></label>
              <label className="form-field"><span>Cidade</span><input name="city" maxLength={120} /></label>
              <label className="form-field"><span>UF</span><input name="state" maxLength={2} autoCapitalize="characters" placeholder="SP" /></label>
              <label className="form-field full-width"><span>Observações</span><textarea name="notes" maxLength={2000} rows={4} /></label>
            </div>
          </fieldset>

          {state.message ? <p className="form-message" role="alert">{state.message}</p> : null}
          <div className="dialog-actions">
            <button className="button" type="button" onClick={() => dialogRef.current?.close()}>Cancelar</button>
            <button className="button primary" type="submit" disabled={pending}>
              {pending ? <LoaderCircle className="spin" aria-hidden="true" /> : null}
              {pending ? "Salvando..." : "Cadastrar cliente"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
