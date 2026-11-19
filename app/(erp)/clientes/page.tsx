import Link from "next/link";
import { Search, UsersRound } from "lucide-react";
import { CustomerCreateDialog } from "@/components/customers/customer-create-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { createServerSupabaseClient } from "@/server/supabase/server";

function formatDocument(value: string | null, type: string) {
  const digits = value?.replace(/\D/g, "") ?? "";
  if (type === "PF" && digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  if (type === "PJ" && digits.length === 14) {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }
  return value || "—";
}

function searchableText(customer: {
  city: string | null;
  email: string | null;
  phone: string | null;
  state: string | null;
  tax_id: string | null;
  trade_name: string;
  whatsapp: string | null;
}) {
  return [customer.trade_name, customer.tax_id, customer.email, customer.phone, customer.whatsapp, customer.city, customer.state]
    .filter(Boolean)
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const queryValue = (await searchParams).q;
  const query = (Array.isArray(queryValue) ? queryValue[0] : queryValue)?.trim() ?? "";
  const normalizedQuery = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
  const supabase = await createServerSupabaseClient();
  const { data: customerData } = await supabase
    .from("companies")
    .select("id, customer_type, trade_name, tax_id, city, state, email, phone, whatsapp, archived_at")
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  const customers = (customerData ?? []).filter((customer) => !normalizedQuery || searchableText(customer).includes(normalizedQuery));
  const createDialog = <CustomerCreateDialog />;

  return <>
    <PageHeader eyebrow="Comercial" title="Clientes" description="Cadastro central de pessoas físicas e jurídicas atendidas ou prospectadas pela RAIP." action={createDialog} />

    <form className="toolbar customer-toolbar" method="get">
      <label className="search-box">
        <span className="sr-only">Buscar clientes</span>
        <Search aria-hidden="true" />
        <input className="input" name="q" defaultValue={query} placeholder="Pesquisar por nome, CPF, CNPJ, telefone ou cidade" type="search" />
      </label>
      {query ? <Link className="button" href="/clientes">Limpar</Link> : null}
      <button className="button" type="submit">Pesquisar</button>
    </form>

    <section className="panel customer-panel">
      {customers.length === 0 ? (
        query
          ? <div className="customer-no-results"><h2>Nenhum cliente encontrado</h2><p>Revise o termo pesquisado ou limpe o filtro.</p></div>
          : <EmptyState icon={UsersRound} title="Cadastre o primeiro cliente" description="O cadastro reúne identificação, contato e endereço para sustentar oportunidades, propostas e o financeiro." action={createDialog} />
      ) : (
        <div className="customer-table-wrap">
          <table className="customer-table">
            <thead><tr><th>Nome</th><th>Documento</th><th>Tipo</th><th>Cidade/UF</th><th>Contato</th><th>Situação</th></tr></thead>
            <tbody>{customers.map((customer) => (
              <tr key={customer.id}>
                <td><strong>{customer.trade_name}</strong><span>{customer.email || "E-mail não informado"}</span></td>
                <td>{formatDocument(customer.tax_id, customer.customer_type)}</td>
                <td>{customer.customer_type === "PF" ? "Pessoa física" : "Pessoa jurídica"}</td>
                <td>{[customer.city, customer.state].filter(Boolean).join(" / ") || "—"}</td>
                <td>{customer.whatsapp || customer.phone || "—"}</td>
                <td><span className="status-pill">Ativo</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </section>
  </>;
}
