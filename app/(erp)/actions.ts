"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Json } from "@/lib/supabase/database.types";
import { SERVICE_LINES } from "@/modules/shared/domain/service-lines";
import { requireAuthenticatedUser } from "@/server/auth/session";
import { createServerSupabaseClient } from "@/server/supabase/server";

export type EntityActionState = {
  createdId?: string;
  deletedId?: string;
  message?: string;
  updatedId?: string;
};

const customerSchema = z.object({
  customerType: z.enum(["PF", "PJ"]),
  name: z.string().trim().min(2, "Informe o nome do cliente.").max(160),
  taxId: z.string().trim().min(1, "Informe o CPF ou CNPJ.").max(30),
  email: z.union([z.literal(""), z.string().email("Informe um e-mail válido.")]).optional(),
  phone: z.string().trim().max(30).optional(),
  whatsapp: z.string().trim().max(30).optional(),
  postalCode: z.string().trim().max(10).optional(),
  street: z.string().trim().max(240).optional(),
  streetNumber: z.string().trim().max(30).optional(),
  addressComplement: z.string().trim().max(160).optional(),
  neighborhood: z.string().trim().max(120).optional(),
  city: z.string().trim().max(120).optional(),
  state: z.union([z.literal(""), z.string().trim().length(2, "Use a sigla do estado.")]).optional(),
  notes: z.string().trim().max(2000).optional(),
}).superRefine((customer, context) => {
  const document = customer.taxId.replace(/\D/g, "");
  const expectedLength = customer.customerType === "PF" ? 11 : 14;

  if (document.length !== expectedLength) {
    context.addIssue({
      code: "custom",
      path: ["taxId"],
      message: customer.customerType === "PF" ? "Informe um CPF com 11 dígitos." : "Informe um CNPJ com 14 dígitos.",
    });
  }

  const postalCode = customer.postalCode?.replace(/\D/g, "") ?? "";
  if (postalCode && postalCode.length !== 8) {
    context.addIssue({ code: "custom", path: ["postalCode"], message: "Informe um CEP com 8 dígitos." });
  }
});

const opportunitySchema = z.object({
  companyId: z.string().uuid("Selecione uma empresa."),
  title: z.string().trim().min(3, "Informe o nome da oportunidade.").max(180),
  serviceLine: z.enum(SERVICE_LINES),
  source: z.string().trim().max(120).optional(),
  estimatedValue: z.string().trim().optional(),
  nextAction: z.string().trim().max(240).optional(),
  nextActionDate: z.string().trim().optional(),
});

const contactSchema = z.object({
  companyId: z.string().uuid("Selecione uma empresa."),
  fullName: z.string().trim().min(2, "Informe o nome do contato.").max(160),
  roleTitle: z.string().trim().max(120).optional(),
  email: z.union([z.literal(""), z.string().email("Informe um e-mail válido.")]).optional(),
  phone: z.string().trim().max(30).optional(),
  whatsapp: z.string().trim().max(30).optional(),
  isPrimary: z.boolean(),
});

const proposalSchema = z.object({
  opportunityId: z.string().uuid("Selecione uma oportunidade."),
  title: z.string().trim().min(3, "Informe o título da proposta.").max(180),
  validUntil: z.string().trim().optional(),
  scope: z.string().trim().max(5000).optional(),
  subtotal: z.string().trim().min(1, "Informe o investimento."),
  discount: z.string().trim().optional(),
});

const accountSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome da conta.").max(120),
  accountType: z.enum(["BANCO", "CAIXA", "CARTEIRA_DIGITAL", "OUTRO"]),
  initialBalance: z.string().trim().optional(),
});

const transactionSchema = z.object({
  accountId: z.string().uuid("Selecione uma conta financeira."),
  transactionType: z.enum(["ENTRADA", "SAIDA"]),
  amount: z.string().trim().min(1, "Informe o valor."),
  transactionDate: z.string().trim().min(1, "Informe a data."),
  description: z.string().trim().min(3, "Informe uma descrição.").max(240),
});

function nullIfEmpty(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function parseCurrencyToCents(value: string | undefined) {
  if (!value?.trim()) return 0;

  const normalized = value
    .trim()
    .replace(/\s/g, "")
    .replace(/^R\$/i, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");
  const amount = Number(normalized);

  if (!Number.isFinite(amount) || amount < 0) return null;
  return Math.round(amount * 100);
}

async function writeAudit(
  entityType: string,
  entityId: string,
  after: Json,
) {
  await writeAuditEntry("CREATE", entityType, entityId, null, after);
}

async function writeAuditEntry(
  action: string,
  entityType: string,
  entityId: string,
  before: Json | null,
  after: Json | null,
  reason?: string,
) {
  const supabase = await createServerSupabaseClient();
  await supabase.rpc("write_audit_log", {
    p_action: action,
    p_entity_type: entityType,
    p_entity_id: entityId,
    p_before: before,
    p_after: after,
    p_reason: reason ?? undefined,
  });
}

function parseCustomerForm(formData: FormData) {
  return customerSchema.safeParse({
    customerType: formData.get("customerType"),
    name: formData.get("name"),
    taxId: formData.get("taxId"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    postalCode: formData.get("postalCode"),
    street: formData.get("street"),
    streetNumber: formData.get("streetNumber"),
    addressComplement: formData.get("addressComplement"),
    neighborhood: formData.get("neighborhood"),
    city: formData.get("city"),
    state: formData.get("state"),
    notes: formData.get("notes"),
  });
}

function customerDatabaseValues(values: z.infer<typeof customerSchema>) {
  return {
    customer_type: values.customerType,
    trade_name: values.name,
    tax_id: nullIfEmpty(values.taxId),
    email: nullIfEmpty(values.email),
    phone: nullIfEmpty(values.phone),
    whatsapp: nullIfEmpty(values.whatsapp),
    postal_code: nullIfEmpty(values.postalCode),
    street: nullIfEmpty(values.street),
    street_number: nullIfEmpty(values.streetNumber),
    address_complement: nullIfEmpty(values.addressComplement),
    neighborhood: nullIfEmpty(values.neighborhood),
    city: nullIfEmpty(values.city),
    state: nullIfEmpty(values.state)?.toUpperCase() ?? null,
    notes: nullIfEmpty(values.notes),
  };
}

export async function createCustomer(
  _state: EntityActionState,
  formData: FormData,
): Promise<EntityActionState> {
  const result = parseCustomerForm(formData);

  if (!result.success) return { message: result.error.issues[0]?.message ?? "Revise os dados." };

  const user = await requireAuthenticatedUser();
  const supabase = await createServerSupabaseClient();
  const values = result.data;
  const { data, error } = await supabase
    .from("companies")
    .insert({
      ...customerDatabaseValues(values),
      owner_id: user.id,
      created_by: user.id,
      updated_by: user.id,
    })
    .select("id, trade_name")
    .single();

  if (error || !data) {
    const duplicate = error?.code === "23505";
    return { message: duplicate ? "Já existe um cliente ativo com este CPF ou CNPJ." : "Não foi possível cadastrar o cliente." };
  }

  await writeAudit("customer", data.id, { trade_name: data.trade_name });
  revalidatePath("/clientes");
  revalidatePath("/empresas");
  revalidatePath("/oportunidades");
  return { createdId: data.id };
}

export async function updateCustomer(
  customerId: string,
  _state: EntityActionState,
  formData: FormData,
): Promise<EntityActionState> {
  const idResult = z.string().uuid().safeParse(customerId);
  if (!idResult.success) return { message: "Cliente inválido." };

  const result = parseCustomerForm(formData);
  if (!result.success) return { message: result.error.issues[0]?.message ?? "Revise os dados." };

  const user = await requireAuthenticatedUser();
  const supabase = await createServerSupabaseClient();
  const { data: existing, error: existingError } = await supabase
    .from("companies")
    .select("id, customer_type, trade_name, tax_id, email, phone, whatsapp, postal_code, street, street_number, address_complement, neighborhood, city, state, notes")
    .eq("id", idResult.data)
    .is("archived_at", null)
    .single();

  if (existingError || !existing) return { message: "Cliente não encontrado ou já excluído." };

  const { data, error } = await supabase
    .from("companies")
    .update({
      ...customerDatabaseValues(result.data),
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("id", existing.id)
    .is("archived_at", null)
    .select("id, customer_type, trade_name, tax_id, email, phone, whatsapp, postal_code, street, street_number, address_complement, neighborhood, city, state, notes")
    .single();

  if (error || !data) {
    const duplicate = error?.code === "23505";
    return { message: duplicate ? "Já existe um cliente ativo com este CPF ou CNPJ." : "Não foi possível atualizar o cliente." };
  }

  await writeAuditEntry("UPDATE", "customer", data.id, existing, data);
  revalidatePath("/clientes");
  revalidatePath("/oportunidades");
  revalidatePath("/propostas");
  return { updatedId: data.id };
}

export async function deleteCustomer(
  customerId: string,
  state: EntityActionState,
  formData: FormData,
): Promise<EntityActionState> {
  void state;
  void formData;
  const idResult = z.string().uuid().safeParse(customerId);
  if (!idResult.success) return { message: "Cliente inválido." };

  const user = await requireAuthenticatedUser();
  const supabase = await createServerSupabaseClient();
  const { data: existing, error: existingError } = await supabase
    .from("companies")
    .select("id, trade_name, tax_id")
    .eq("id", idResult.data)
    .is("archived_at", null)
    .single();

  if (existingError || !existing) return { message: "Cliente não encontrado ou já excluído." };

  const archivedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from("companies")
    .update({ archived_at: archivedAt, updated_at: archivedAt, updated_by: user.id })
    .eq("id", existing.id)
    .is("archived_at", null)
    .select("id")
    .single();

  if (error || !data) return { message: "Não foi possível excluir o cliente." };

  await writeAuditEntry("ARCHIVE", "customer", data.id, existing, { archived_at: archivedAt }, "Exclusão solicitada na tela de clientes");
  revalidatePath("/clientes");
  revalidatePath("/oportunidades");
  revalidatePath("/propostas");
  return { deletedId: data.id };
}

export async function createOpportunity(
  _state: EntityActionState,
  formData: FormData,
): Promise<EntityActionState> {
  const result = opportunitySchema.safeParse({
    companyId: formData.get("companyId"),
    title: formData.get("title"),
    serviceLine: formData.get("serviceLine"),
    source: formData.get("source"),
    estimatedValue: formData.get("estimatedValue"),
    nextAction: formData.get("nextAction"),
    nextActionDate: formData.get("nextActionDate"),
  });

  if (!result.success) return { message: result.error.issues[0]?.message ?? "Revise os dados." };

  const estimatedValueCents = parseCurrencyToCents(result.data.estimatedValue);
  if (estimatedValueCents === null) return { message: "Informe um valor estimado válido." };

  const user = await requireAuthenticatedUser();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("opportunities")
    .insert({
      company_id: result.data.companyId,
      title: result.data.title,
      service_line: result.data.serviceLine,
      source: nullIfEmpty(result.data.source),
      estimated_value_cents: estimatedValueCents || null,
      next_action: nullIfEmpty(result.data.nextAction),
      next_action_at: result.data.nextActionDate
        ? new Date(`${result.data.nextActionDate}T12:00:00-03:00`).toISOString()
        : null,
      owner_id: user.id,
      created_by: user.id,
      updated_by: user.id,
    })
    .select("id, title")
    .single();

  if (error || !data) return { message: "Não foi possível cadastrar a oportunidade." };

  await writeAudit("opportunity", data.id, { title: data.title });
  revalidatePath("/oportunidades");
  revalidatePath("/propostas");
  revalidatePath("/dashboard");
  return { createdId: data.id };
}

export async function createContact(
  _state: EntityActionState,
  formData: FormData,
): Promise<EntityActionState> {
  const result = contactSchema.safeParse({
    companyId: formData.get("companyId"),
    fullName: formData.get("fullName"),
    roleTitle: formData.get("roleTitle"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    isPrimary: formData.get("isPrimary") === "on",
  });

  if (!result.success) return { message: result.error.issues[0]?.message ?? "Revise os dados." };

  const user = await requireAuthenticatedUser();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("contacts")
    .insert({
      company_id: result.data.companyId,
      full_name: result.data.fullName,
      role_title: nullIfEmpty(result.data.roleTitle),
      email: nullIfEmpty(result.data.email),
      phone: nullIfEmpty(result.data.phone),
      whatsapp: nullIfEmpty(result.data.whatsapp),
      is_primary: result.data.isPrimary,
      created_by: user.id,
      updated_by: user.id,
    })
    .select("id, full_name")
    .single();

  if (error || !data) return { message: "Não foi possível cadastrar o contato." };

  await writeAudit("contact", data.id, { full_name: data.full_name });
  revalidatePath("/contatos");
  revalidatePath("/oportunidades");
  return { createdId: data.id };
}

export async function createProposal(
  _state: EntityActionState,
  formData: FormData,
): Promise<EntityActionState> {
  const result = proposalSchema.safeParse({
    opportunityId: formData.get("opportunityId"),
    title: formData.get("title"),
    validUntil: formData.get("validUntil"),
    scope: formData.get("scope"),
    subtotal: formData.get("subtotal"),
    discount: formData.get("discount"),
  });

  if (!result.success) return { message: result.error.issues[0]?.message ?? "Revise os dados." };

  const subtotalCents = parseCurrencyToCents(result.data.subtotal);
  const discountCents = parseCurrencyToCents(result.data.discount);
  if (subtotalCents === null || subtotalCents <= 0 || discountCents === null) {
    return { message: "Informe valores comerciais válidos." };
  }
  if (discountCents > subtotalCents) return { message: "O desconto não pode superar o investimento." };

  const user = await requireAuthenticatedUser();
  const supabase = await createServerSupabaseClient();
  const { data: opportunity, error: opportunityError } = await supabase
    .from("opportunities")
    .select("company_id, primary_contact_id, owner_id")
    .eq("id", result.data.opportunityId)
    .is("archived_at", null)
    .single();

  if (opportunityError || !opportunity) return { message: "A oportunidade selecionada não está disponível." };

  const { data: number, error: numberError } = await supabase.rpc("next_document_number", { p_prefix: "PROP" });
  if (numberError || !number) return { message: "Não foi possível gerar o número da proposta." };

  const { data, error } = await supabase
    .from("proposals")
    .insert({
      number,
      opportunity_id: result.data.opportunityId,
      company_id: opportunity.company_id,
      primary_contact_id: opportunity.primary_contact_id,
      owner_id: opportunity.owner_id,
      title: result.data.title,
      valid_until: nullIfEmpty(result.data.validUntil),
      scope: nullIfEmpty(result.data.scope),
      subtotal_cents: subtotalCents,
      discount_cents: discountCents,
      total_cents: subtotalCents - discountCents,
      created_by: user.id,
      updated_by: user.id,
    })
    .select("id, number")
    .single();

  if (error || !data) return { message: "Não foi possível criar a proposta." };

  await writeAudit("proposal", data.id, { number: data.number });
  revalidatePath("/propostas");
  revalidatePath("/dashboard");
  return { createdId: data.id };
}

export async function createFinancialAccount(
  _state: EntityActionState,
  formData: FormData,
): Promise<EntityActionState> {
  const result = accountSchema.safeParse({
    name: formData.get("name"),
    accountType: formData.get("accountType"),
    initialBalance: formData.get("initialBalance"),
  });

  if (!result.success) return { message: result.error.issues[0]?.message ?? "Revise os dados." };
  const initialBalanceCents = parseCurrencyToCents(result.data.initialBalance);
  if (initialBalanceCents === null) return { message: "Informe um saldo inicial válido." };

  const user = await requireAuthenticatedUser();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("financial_accounts")
    .insert({
      name: result.data.name,
      account_type: result.data.accountType,
      initial_balance_cents: initialBalanceCents,
      created_by: user.id,
      updated_by: user.id,
    })
    .select("id, name")
    .single();

  if (error || !data) return { message: "Não foi possível criar a conta financeira." };

  await writeAudit("financial_account", data.id, { name: data.name });
  revalidatePath("/financeiro");
  return { createdId: data.id };
}

export async function createFinancialTransaction(
  _state: EntityActionState,
  formData: FormData,
): Promise<EntityActionState> {
  const result = transactionSchema.safeParse({
    accountId: formData.get("accountId"),
    transactionType: formData.get("transactionType"),
    amount: formData.get("amount"),
    transactionDate: formData.get("transactionDate"),
    description: formData.get("description"),
  });

  if (!result.success) return { message: result.error.issues[0]?.message ?? "Revise os dados." };
  const amountCents = parseCurrencyToCents(result.data.amount);
  if (amountCents === null || amountCents <= 0) return { message: "Informe um valor maior que zero." };

  const user = await requireAuthenticatedUser();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("financial_transactions")
    .insert({
      account_id: result.data.accountId,
      transaction_type: result.data.transactionType,
      amount_cents: amountCents,
      transaction_date: result.data.transactionDate,
      description: result.data.description,
      created_by: user.id,
    })
    .select("id, description")
    .single();

  if (error || !data) return { message: "Não foi possível registrar o lançamento." };

  await writeAudit("financial_transaction", data.id, { description: data.description });
  revalidatePath("/financeiro");
  revalidatePath("/dashboard");
  return { createdId: data.id };
}
