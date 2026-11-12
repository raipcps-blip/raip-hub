import { Building2 } from "lucide-react";
import { createCompany } from "@/app/(erp)/actions";
import { CreateFormDialog } from "@/components/ui/create-form-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ListToolbar } from "@/components/ui/list-toolbar";
import { PageHeader } from "@/components/ui/page-header";
import { createServerSupabaseClient } from "@/server/supabase/server";

export default async function CompaniesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: companiesData } = await supabase
    .from("companies")
    .select("id, trade_name, legal_name, tax_id, segment, city, state, email, phone")
    .is("archived_at", null)
    .order("created_at", { ascending: false });
  const companies = companiesData ?? [];

  const createDialog = (
    <CreateFormDialog action={createCompany} title="Cadastrar empresa" description="Crie a organização que concentrará contatos, oportunidades e propostas." triggerLabel="Nova empresa" submitLabel="Cadastrar empresa">
      <div className="form-grid two-columns">
        <label className="form-field full-width"><span>Nome da empresa *</span><input name="tradeName" required minLength={2} maxLength={160} autoFocus /></label>
        <label className="form-field full-width"><span>Razão social</span><input name="legalName" maxLength={500} /></label>
        <label className="form-field"><span>CNPJ</span><input name="taxId" inputMode="numeric" maxLength={30} placeholder="00.000.000/0000-00" /></label>
        <label className="form-field"><span>Segmento</span><input name="segment" maxLength={120} placeholder="Ex.: Serviços" /></label>
        <label className="form-field"><span>E-mail</span><input name="email" type="email" autoComplete="email" /></label>
        <label className="form-field"><span>Telefone</span><input name="phone" type="tel" autoComplete="tel" maxLength={30} /></label>
        <label className="form-field"><span>Cidade</span><input name="city" maxLength={120} /></label>
        <label className="form-field"><span>UF</span><input name="state" maxLength={2} placeholder="SP" autoCapitalize="characters" /></label>
      </div>
    </CreateFormDialog>
  );

  return <>
    <PageHeader eyebrow="CRM" title="Empresas" description="Organizações prospectadas, em negociação ou atendidas pela RAIP." action={createDialog} />
    <ListToolbar placeholder="Buscar por nome, CNPJ, segmento ou cidade" />
    <section className="panel">
      {companies.length === 0 ? <EmptyState icon={Building2} title="Cadastre a primeira empresa" description="Empresas concentram os dados do negócio. Contatos e oportunidades serão vinculados a elas sem misturar histórico comercial." action={createDialog} /> : (
        <div className="record-list">{companies.map((company) => (
          <article className="record-card" key={company.id}>
            <div><p className="record-kicker">{company.segment || "Segmento não informado"}</p><h2>{company.trade_name}</h2><p>{company.legal_name || company.tax_id || "Cadastro inicial"}</p></div>
            <dl className="record-meta"><div><dt>Local</dt><dd>{[company.city, company.state].filter(Boolean).join(" / ") || "—"}</dd></div><div><dt>Contato</dt><dd>{company.email || company.phone || "—"}</dd></div></dl>
          </article>
        ))}</div>
      )}
    </section>
  </>;
}
