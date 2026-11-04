import { ContactRound, Plus } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { ListToolbar } from "@/components/ui/list-toolbar";
import { PageHeader } from "@/components/ui/page-header";

export default function ContactsPage() {
  return <><PageHeader eyebrow="CRM" title="Contatos" description="Decisores, influenciadores e pontos de contato associados às empresas." action={<button className="button primary"><Plus aria-hidden="true" /> Novo contato</button>} /><ListToolbar placeholder="Buscar por nome, empresa, cargo ou e-mail" /><section className="panel"><EmptyState icon={ContactRound} title="Nenhum contato cadastrado" description="Cadastre contatos depois de criar a empresa correspondente. Cada oportunidade poderá indicar um contato principal." action={<button className="button"><Plus aria-hidden="true" /> Novo contato</button>} /></section></>;
}
