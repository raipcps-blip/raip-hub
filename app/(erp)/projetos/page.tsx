import { BriefcaseBusiness, Plus } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { ListToolbar } from "@/components/ui/list-toolbar";
import { PageHeader } from "@/components/ui/page-header";
import { PROJECT_STATUS_LABELS } from "@/modules/projects/domain/status";

export default function ProjectsPage() {
  return <><PageHeader eyebrow="Operação" title="Projetos" description="Vendas ganhas transformadas em projetos com responsáveis, prazos e entregáveis." action={<button className="button"><Plus aria-hidden="true" /> Novo projeto</button>} /><ListToolbar placeholder="Buscar por projeto, empresa ou responsável" options={Object.values(PROJECT_STATUS_LABELS)} /><section className="panel"><EmptyState icon={BriefcaseBusiness} title="Nenhum projeto aberto" description="A aprovação de uma proposta criará o projeto automaticamente. Criações manuais serão exceções auditadas." /></section></>;
}
