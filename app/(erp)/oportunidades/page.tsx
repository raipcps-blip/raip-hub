import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { OPPORTUNITY_STAGE_LABELS, OPEN_OPPORTUNITY_STAGES } from "@/modules/crm/domain/opportunity";

export default function OpportunitiesPage() {
  return <><PageHeader eyebrow="Pipeline comercial" title="Oportunidades" description="Cada negociação tem sua própria etapa, responsável, valor e próxima ação." action={<button className="button primary"><Plus aria-hidden="true" /> Nova oportunidade</button>} /><section className="kanban" aria-label="Funil de oportunidades">{OPEN_OPPORTUNITY_STAGES.map((stage) => <article className="kanban-column" key={stage}><header className="kanban-column-header"><span><span className="status-dot" />{OPPORTUNITY_STAGE_LABELS[stage]}</span><span className="count-badge">0</span></header><div className="kanban-empty">As oportunidades nesta etapa aparecerão aqui.</div></article>)}</section></>;
}
