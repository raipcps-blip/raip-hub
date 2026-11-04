import { Building2, Plus } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { ListToolbar } from "@/components/ui/list-toolbar";
import { PageHeader } from "@/components/ui/page-header";

export default function CompaniesPage() {
  return <><PageHeader eyebrow="CRM" title="Empresas" description="Organizações prospectadas, em negociação ou atendidas pela RAIP." action={<button className="button primary"><Plus aria-hidden="true" /> Nova empresa</button>} /><ListToolbar placeholder="Buscar por nome, CNPJ, segmento ou cidade" /><section className="panel"><EmptyState icon={Building2} title="Cadastre a primeira empresa" description="Empresas concentram os dados do negócio. Contatos e oportunidades serão vinculados a elas sem misturar histórico comercial." action={<button className="button primary"><Plus aria-hidden="true" /> Nova empresa</button>} /></section></>;
}
