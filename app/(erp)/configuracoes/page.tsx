import { Settings } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

export default function SettingsPage() {
  return <><PageHeader eyebrow="Sistema" title="Configurações" description="Empresa, identidade visual, catálogo, usuários, papéis e segurança." /><section className="panel"><EmptyState icon={Settings} title="Configuração inicial pendente" description="A configuração administrativa será habilitada após a criação do projeto Supabase exclusivo da RAIP e do primeiro administrador mestre." /></section></>;
}
