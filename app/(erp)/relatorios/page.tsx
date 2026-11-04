import { ChartNoAxesCombined } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

export default function ReportsPage() {
  return <><PageHeader eyebrow="Inteligência" title="Relatórios" description="Conversão, receita, desempenho comercial e resultados por frente de serviço." /><section className="panel"><EmptyState icon={ChartNoAxesCombined} title="Os relatórios nascem com os dados" description="Os primeiros relatórios serão liberados quando oportunidades, propostas e recebimentos estiverem conectados ao novo Supabase RAIP." /></section></>;
}
