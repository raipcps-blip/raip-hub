import { FileText } from "lucide-react";
import { createProposal } from "@/app/(erp)/actions";
import { CreateFormDialog } from "@/components/ui/create-form-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ListToolbar } from "@/components/ui/list-toolbar";
import { PageHeader } from "@/components/ui/page-header";
import { formatCurrencyCents, formatDate } from "@/lib/format";
import { PROPOSAL_STATUS_LABELS } from "@/modules/proposals/domain/status";
import { createServerSupabaseClient } from "@/server/supabase/server";

export default async function ProposalsPage() {
  const supabase = await createServerSupabaseClient();
  const [{ data: opportunitiesData }, { data: proposalsData }] = await Promise.all([
    supabase.from("opportunities").select("id, title, stage, companies(trade_name)").is("archived_at", null).not("stage", "eq", "PERDIDO").order("created_at", { ascending: false }),
    supabase.from("proposals").select("id, number, title, status, total_cents, issue_date, valid_until, companies(trade_name)").is("archived_at", null).order("created_at", { ascending: false }),
  ]);
  const opportunities = opportunitiesData ?? [];
  const proposals = proposalsData ?? [];

  const createDialog = (
    <CreateFormDialog action={createProposal} title="Criar proposta" description="Abra uma proposta comercial vinculada a uma oportunidade existente." triggerLabel="Nova proposta" submitLabel="Criar proposta">
      <div className="form-grid two-columns">
        <label className="form-field full-width"><span>Oportunidade *</span><select name="opportunityId" required defaultValue=""><option value="" disabled>Selecione uma oportunidade</option>{opportunities.map((opportunity) => <option value={opportunity.id} key={opportunity.id}>{opportunity.companies?.trade_name ?? "Empresa"} — {opportunity.title}</option>)}</select>{opportunities.length === 0 ? <small>Crie uma oportunidade antes de abrir a proposta.</small> : null}</label>
        <label className="form-field full-width"><span>Título da proposta *</span><input name="title" required minLength={3} maxLength={180} autoFocus /></label>
        <label className="form-field"><span>Investimento *</span><input name="subtotal" required inputMode="decimal" placeholder="0,00" /></label>
        <label className="form-field"><span>Desconto</span><input name="discount" inputMode="decimal" placeholder="0,00" /></label>
        <label className="form-field"><span>Válida até</span><input name="validUntil" type="date" /></label>
        <label className="form-field full-width"><span>Escopo inicial</span><textarea name="scope" rows={5} maxLength={5000} placeholder="Descreva entregas, limites e premissas." /></label>
      </div>
    </CreateFormDialog>
  );

  return <>
    <PageHeader eyebrow="Comercial" title="Propostas" description="Escopo, investimento, condições comerciais, versões e aprovação do cliente." action={createDialog} />
    {opportunities.length === 0 ? <p className="inline-notice">Crie uma oportunidade para habilitar a primeira proposta.</p> : null}
    <ListToolbar placeholder="Buscar por número, empresa ou oportunidade" options={Object.values(PROPOSAL_STATUS_LABELS)} />
    <section className="panel">
      {proposals.length === 0 ? <EmptyState icon={FileText} title="Crie a primeira proposta" description="A proposta reúne o investimento e o escopo inicial vinculados à oportunidade comercial." action={createDialog} /> : (
        <div className="record-list">{proposals.map((proposal) => <article className="record-card" key={proposal.id}>
          <div><p className="record-kicker">{proposal.number}</p><h2>{proposal.title}</h2><p>{proposal.companies?.trade_name ?? "Empresa"}</p></div>
          <dl className="record-meta"><div><dt>Status</dt><dd>{PROPOSAL_STATUS_LABELS[proposal.status]}</dd></div><div><dt>Total</dt><dd>{formatCurrencyCents(proposal.total_cents)}</dd></div><div><dt>Validade</dt><dd>{formatDate(proposal.valid_until || proposal.issue_date)}</dd></div></dl>
        </article>)}</div>
      )}
    </section>
  </>;
}
