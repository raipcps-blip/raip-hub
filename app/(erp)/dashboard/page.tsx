import Link from "next/link";
import { ArrowUpRight, Braces, ChartSpline, Megaphone, Plus, Route } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { OPPORTUNITY_STAGE_LABELS, OPEN_OPPORTUNITY_STAGES } from "@/modules/crm/domain/opportunity";
import { SERVICE_LINE_LABELS, SERVICE_LINES } from "@/modules/shared/domain/service-lines";

const serviceIcons = [Route, Braces, Megaphone, ChartSpline] as const;

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Visão geral"
        title="Crescimento em movimento."
        description="Acompanhe o pipeline comercial, as propostas, as vendas e os recebimentos da RAIP em um único lugar."
        action={<Link className="button primary" href="/oportunidades"><Plus aria-hidden="true" /> Nova oportunidade</Link>}
      />
      <section className="metric-grid" aria-label="Indicadores principais">
        <article className="metric-card"><div className="metric-label">Pipeline aberto</div><div className="metric-value">R$ 0</div><div className="metric-detail">Nenhuma oportunidade cadastrada</div></article>
        <article className="metric-card magenta"><div className="metric-label">Propostas em negociação</div><div className="metric-value">0</div><div className="metric-detail">Aguardando o primeiro envio</div></article>
        <article className="metric-card"><div className="metric-label">Vendas no mês</div><div className="metric-value">R$ 0</div><div className="metric-detail">Período atual</div></article>
        <article className="metric-card magenta"><div className="metric-label">A receber</div><div className="metric-value">R$ 0</div><div className="metric-detail">Sem parcelas pendentes</div></article>
      </section>
      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-header"><div><h2 className="panel-title">Funil comercial</h2><p className="panel-subtitle">Distribuição das oportunidades abertas por etapa.</p></div><Link className="button" href="/oportunidades">Ver pipeline <ArrowUpRight aria-hidden="true" /></Link></div>
          <div className="pipeline-list">
            {OPEN_OPPORTUNITY_STAGES.map((stage) => (
              <div className="pipeline-row" key={stage}><span>{OPPORTUNITY_STAGE_LABELS[stage]}</span><div className="pipeline-track"><div className="pipeline-fill" style={{ width: "2px" }} /></div><span className="pipeline-count">0</span></div>
            ))}
          </div>
        </article>
        <article className="panel">
          <div className="panel-header"><div><h2 className="panel-title">Frentes RAIP</h2><p className="panel-subtitle">Serviços que alimentam propostas e projetos.</p></div></div>
          <div className="service-list">
            {SERVICE_LINES.map((line, index) => {
              const Icon = serviceIcons[index];
              return <div className="service-card" key={line}><div><strong>{SERVICE_LINE_LABELS[line]}</strong><span>Catálogo pronto para configuração</span></div><div className="service-icon"><Icon aria-hidden="true" /></div></div>;
            })}
          </div>
        </article>
      </section>
    </>
  );
}
