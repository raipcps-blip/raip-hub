import { ContactRound } from "lucide-react";
import { createContact } from "@/app/(erp)/actions";
import { CreateFormDialog } from "@/components/ui/create-form-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ListToolbar } from "@/components/ui/list-toolbar";
import { PageHeader } from "@/components/ui/page-header";
import { createServerSupabaseClient } from "@/server/supabase/server";

export default async function ContactsPage() {
  const supabase = await createServerSupabaseClient();
  const [{ data: companiesData }, { data: contactsData }] = await Promise.all([
    supabase.from("companies").select("id, trade_name").is("archived_at", null).order("trade_name"),
    supabase.from("contacts").select("id, full_name, role_title, email, phone, whatsapp, is_primary, companies(trade_name)").is("archived_at", null).order("created_at", { ascending: false }),
  ]);
  const companies = companiesData ?? [];
  const contacts = contactsData ?? [];

  const createDialog = (
    <CreateFormDialog action={createContact} title="Cadastrar contato" description="Vincule um decisor ou ponto de contato a uma empresa." triggerLabel="Novo contato" submitLabel="Cadastrar contato">
      <div className="form-grid two-columns">
        <label className="form-field full-width"><span>Empresa *</span><select name="companyId" required defaultValue=""><option value="" disabled>Selecione uma empresa</option>{companies.map((company) => <option value={company.id} key={company.id}>{company.trade_name}</option>)}</select>{companies.length === 0 ? <small>Cadastre uma empresa antes de criar o contato.</small> : null}</label>
        <label className="form-field full-width"><span>Nome completo *</span><input name="fullName" required minLength={2} maxLength={160} autoFocus /></label>
        <label className="form-field"><span>Cargo ou função</span><input name="roleTitle" maxLength={120} /></label>
        <label className="form-field"><span>E-mail</span><input name="email" type="email" autoComplete="email" /></label>
        <label className="form-field"><span>Telefone</span><input name="phone" type="tel" maxLength={30} /></label>
        <label className="form-field"><span>WhatsApp</span><input name="whatsapp" type="tel" maxLength={30} /></label>
        <label className="check-field full-width"><input name="isPrimary" type="checkbox" /><span>Contato principal da empresa</span></label>
      </div>
    </CreateFormDialog>
  );

  return <>
    <PageHeader eyebrow="CRM" title="Contatos" description="Decisores, influenciadores e pontos de contato associados às empresas." action={createDialog} />
    {companies.length === 0 ? <p className="inline-notice">Cadastre uma empresa para habilitar o primeiro contato.</p> : null}
    <ListToolbar placeholder="Buscar por nome, empresa, cargo ou e-mail" />
    <section className="panel">
      {contacts.length === 0 ? <EmptyState icon={ContactRound} title="Nenhum contato cadastrado" description="Cadastre contatos depois de criar a empresa correspondente. Cada oportunidade poderá indicar um contato principal." action={createDialog} /> : (
        <div className="record-list">{contacts.map((contact) => <article className="record-card" key={contact.id}>
          <div><p className="record-kicker">{contact.is_primary ? "Contato principal" : contact.role_title || "Contato"}</p><h2>{contact.full_name}</h2><p>{contact.companies?.trade_name ?? "Empresa"}</p></div>
          <dl className="record-meta"><div><dt>E-mail</dt><dd>{contact.email || "—"}</dd></div><div><dt>Telefone</dt><dd>{contact.whatsapp || contact.phone || "—"}</dd></div></dl>
        </article>)}</div>
      )}
    </section>
  </>;
}
