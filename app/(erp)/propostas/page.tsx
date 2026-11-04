import { FileText, Plus } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { ListToolbar } from "@/components/ui/list-toolbar";
import { PageHeader } from "@/components/ui/page-header";
import { PROPOSAL_STATUS_LABELS } from "@/modules/proposals/domain/status";

export default function ProposalsPage() {
  return <><PageHeader eyebrow="Comercial" title="Propostas" description="Escopo, investimento, condições comerciais, versões e aprovação do cliente." action={<button className="button primary"><Plus aria-hidden="true" /> Nova proposta</button>} /><ListToolbar placeholder="Buscar por número, empresa ou oportunidade" options={Object.values(PROPOSAL_STATUS_LABELS)} /><section className="panel"><EmptyState icon={FileText} title="Crie a primeira proposta" description="A proposta poderá reunir itens de várias frentes RAIP e gerar uma versão imutável para envio e aprovação pública." action={<button className="button primary"><Plus aria-hidden="true" /> Nova proposta</button>} /></section></>;
}
