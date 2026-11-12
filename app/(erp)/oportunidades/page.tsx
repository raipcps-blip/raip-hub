import { createOpportunity } from "@/app/(erp)/actions";
import { CreateFormDialog } from "@/components/ui/create-form-dialog";
import { PageHeader } from "@/components/ui/page-header";
import { formatCurrencyCents } from "@/lib/format";
import { OPEN_OPPORTUNITY_STAGES, OPPORTUNITY_STAGE_LABELS } from "@/modules/crm/domain/opportunity";
import { SERVICE_LINES, SERVICE_LINE_LABELS } from "@/modules/shared/domain/service-lines";
import { createServerSupabaseClient } from "@/server/supabase/server";

export default async function OpportunitiesPage() {
  const supabase = await createServerSupabaseClient();
  const [{ data: companiesData }, { data: opportunitiesData }] = await Promise.all([
    supabase.from("companies").select("id, trade_name").is("archived_at", null).order("trade_name"),
    supabase.from("opportunities").select("id, title, stage, service_line, estimated_value_cents, next_action, companies(trade_name)").is("archived_at", null).order("created_at", { ascending: false }),
  ]);
  const companies = companiesData ?? [];
  const opportunities = opportunitiesData ?? [];

  const createDialog = (
    <CreateFormDialog action={createOpportunity} title="Criar oportunidade" description="Registre uma negociação e sua próxima ação no pipeline comercial." triggerLabel="Nova oportunidade" submitLabel="Criar oportunidade">
      <div className="form-grid two-columns">
        <label className="form-field full-width"><span>Empresa *</span><select name="companyId" required defaultValue=""><option value="" disabled>Selecione uma empresa</option>{companies.map((company) => <option value={company.id} key={company.id}>{company.trade_name}</option>)}</select>{companies.length === 0 ? <small>Cadastre uma empresa antes de criar a oportunidade.</small> : null}</label>
        <label className="form-field full-width"><span>Nome da oportunidade *</span><input name="title" required minLength={3} maxLength={180} autoFocus /></label>
        <label className="form-field"><span>Frente RAIP *</span><select name="serviceLine" required defaultValue={SERVICE_LINES[0]}>{SERVICE_LINES.map((line) => <option value={line} key={line}>{SERVICE_LINE_LABELS[line]}</option>)}</select></label>
        <label className="form-field"><span>Valor estimado</span><input name="estimatedValue" inputMode="decimal" placeholder="0,00" /></label>
        <label className="form-field"><span>Origem</span><input name="source" maxLength={120} placeholder="Indicação, site, prospecção..." /></label>
        <label className="form-field"><span>Data da próxima ação</span><input name="nextActionDate" type="date" /></label>
        <label className="form-field full-width"><span>Próxima ação</span><input name="nextAction" maxLength={240} placeholder="Ex.: Agendar diagnóstico" /></label>
      </div>
    </CreateFormDialog>
  );

  return <>
    <PageHeader eyebrow="Pipeline comercial" title="Oportunidades" description="Cada negociação tem sua própria etapa, responsável, valor e próxima ação." action={createDialog} />
    {companies.length === 0 ? <p className="inline-notice">Cadastre uma empresa para habilitar o primeiro negócio.</p> : null}
    <section className="kanban" aria-label="Funil de oportunidades">
      {OPEN_OPPORTUNITY_STAGES.map((stage) => {
        const stageItems = opportunities.filter((item) => item.stage === stage);
        return <article className="kanban-column" key={stage}>
          <header className="kanban-column-header"><span><span className="status-dot" />{OPPORTUNITY_STAGE_LABELS[stage]}</span><span className="count-badge">{stageItems.length}</span></header>
          {stageItems.length === 0 ? <div className="kanban-empty">As oportunidades nesta etapa aparecerão aqui.</div> : (
            <div className="kanban-cards">{stageItems.map((item) => <article className="opportunity-card" key={item.id}>
              <p>{item.companies?.trade_name ?? "Empresa"}</p><h2>{item.title}</h2><span>{SERVICE_LINE_LABELS[item.service_line]}</span><strong>{formatCurrencyCents(item.estimated_value_cents)}</strong>{item.next_action ? <small>Próxima: {item.next_action}</small> : null}
            </article>)}</div>
          )}
        </article>;
      })}
    </section>
  </>;
}
