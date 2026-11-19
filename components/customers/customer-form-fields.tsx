"use client";

import { useState, type MouseEvent } from "react";
import { LoaderCircle, MapPin, Search } from "lucide-react";

type AddressResponse = {
  city: string;
  complement: string;
  neighborhood: string;
  postalCode: string;
  state: string;
  street: string;
};

export type CustomerFormValues = {
  address_complement: string | null;
  city: string | null;
  customer_type: string;
  email: string | null;
  neighborhood: string | null;
  notes: string | null;
  phone: string | null;
  postal_code: string | null;
  state: string | null;
  street: string | null;
  street_number: string | null;
  tax_id: string | null;
  trade_name: string;
  whatsapp: string | null;
};

function setFormValue(form: HTMLFormElement, name: string, value: string) {
  const field = form.elements.namedItem(name);
  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.value = value;
}

export function CustomerFormFields({
  autoFocusName = false,
  defaultValues,
}: {
  autoFocusName?: boolean;
  defaultValues?: CustomerFormValues;
}) {
  const [customerType, setCustomerType] = useState<"PF" | "PJ">(defaultValues?.customer_type === "PF" ? "PF" : "PJ");
  const [cepMessage, setCepMessage] = useState("");
  const [searchingCep, setSearchingCep] = useState(false);

  async function searchPostalCode(event: MouseEvent<HTMLButtonElement>) {
    const form = event.currentTarget.form;
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

  return <>
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
          <input name="taxId" defaultValue={defaultValues?.tax_id ?? ""} inputMode="numeric" maxLength={customerType === "PF" ? 14 : 18} placeholder={customerType === "PF" ? "000.000.000-00" : "00.000.000/0000-00"} required />
        </label>
        <label className="form-field full-width">
          <span>Nome *</span>
          <input name="name" defaultValue={defaultValues?.trade_name ?? ""} minLength={2} maxLength={160} autoFocus={autoFocusName} required />
        </label>
      </div>
    </fieldset>

    <fieldset className="form-section">
      <legend>Contato</legend>
      <div className="form-grid three-columns">
        <label className="form-field"><span>Telefone</span><input name="phone" defaultValue={defaultValues?.phone ?? ""} type="tel" autoComplete="tel" maxLength={30} /></label>
        <label className="form-field"><span>WhatsApp</span><input name="whatsapp" defaultValue={defaultValues?.whatsapp ?? ""} type="tel" maxLength={30} /></label>
        <label className="form-field"><span>E-mail</span><input name="email" defaultValue={defaultValues?.email ?? ""} type="email" autoComplete="email" maxLength={254} /></label>
      </div>
    </fieldset>

    <fieldset className="form-section">
      <legend><MapPin aria-hidden="true" /> Endereço</legend>
      <div className="form-grid two-columns">
        <div className="form-field full-width">
          <span>CEP</span>
          <div className="field-action-row">
            <input name="postalCode" defaultValue={defaultValues?.postal_code ?? ""} inputMode="numeric" maxLength={10} placeholder="00000-000" />
            <button className="button" type="button" onClick={searchPostalCode} disabled={searchingCep}>
              {searchingCep ? <LoaderCircle className="spin" aria-hidden="true" /> : <Search aria-hidden="true" />}
              {searchingCep ? "Buscando..." : "Buscar CEP"}
            </button>
          </div>
          <small className="field-feedback" aria-live="polite">{cepMessage}</small>
        </div>
        <label className="form-field full-width"><span>Endereço</span><input name="street" defaultValue={defaultValues?.street ?? ""} maxLength={240} /></label>
        <label className="form-field"><span>Número</span><input name="streetNumber" defaultValue={defaultValues?.street_number ?? ""} maxLength={30} /></label>
        <label className="form-field"><span>Complemento</span><input name="addressComplement" defaultValue={defaultValues?.address_complement ?? ""} maxLength={160} /></label>
        <label className="form-field"><span>Bairro</span><input name="neighborhood" defaultValue={defaultValues?.neighborhood ?? ""} maxLength={120} /></label>
        <label className="form-field"><span>Cidade</span><input name="city" defaultValue={defaultValues?.city ?? ""} maxLength={120} /></label>
        <label className="form-field"><span>UF</span><input name="state" defaultValue={defaultValues?.state ?? ""} maxLength={2} autoCapitalize="characters" placeholder="SP" /></label>
        <label className="form-field full-width"><span>Observações</span><textarea name="notes" defaultValue={defaultValues?.notes ?? ""} maxLength={2000} rows={4} /></label>
      </div>
    </fieldset>
  </>;
}
