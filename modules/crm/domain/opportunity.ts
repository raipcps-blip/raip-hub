export const OPPORTUNITY_STAGES = [
  "NOVO_LEAD", "CONTATO_REALIZADO", "DIAGNOSTICO", "PROPOSTA_PREPARACAO",
  "PROPOSTA_ENVIADA", "NEGOCIACAO", "GANHO", "PERDIDO",
] as const;

export type OpportunityStage = (typeof OPPORTUNITY_STAGES)[number];

export const OPEN_OPPORTUNITY_STAGES = OPPORTUNITY_STAGES.filter(
  (stage): stage is Exclude<OpportunityStage, "GANHO" | "PERDIDO"> => stage !== "GANHO" && stage !== "PERDIDO",
);

export const OPPORTUNITY_STAGE_LABELS: Record<OpportunityStage, string> = {
  NOVO_LEAD: "Novo lead",
  CONTATO_REALIZADO: "Contato realizado",
  DIAGNOSTICO: "Diagnóstico",
  PROPOSTA_PREPARACAO: "Proposta em preparação",
  PROPOSTA_ENVIADA: "Proposta enviada",
  NEGOCIACAO: "Negociação",
  GANHO: "Ganho",
  PERDIDO: "Perdido",
};

const ALLOWED_TRANSITIONS: Record<OpportunityStage, readonly OpportunityStage[]> = {
  NOVO_LEAD: ["CONTATO_REALIZADO", "PERDIDO"],
  CONTATO_REALIZADO: ["NOVO_LEAD", "DIAGNOSTICO", "PERDIDO"],
  DIAGNOSTICO: ["CONTATO_REALIZADO", "PROPOSTA_PREPARACAO", "PERDIDO"],
  PROPOSTA_PREPARACAO: ["DIAGNOSTICO", "PROPOSTA_ENVIADA", "PERDIDO"],
  PROPOSTA_ENVIADA: ["PROPOSTA_PREPARACAO", "NEGOCIACAO", "GANHO", "PERDIDO"],
  NEGOCIACAO: ["PROPOSTA_ENVIADA", "GANHO", "PERDIDO"],
  GANHO: ["NEGOCIACAO"],
  PERDIDO: ["CONTATO_REALIZADO", "DIAGNOSTICO", "PROPOSTA_PREPARACAO", "PROPOSTA_ENVIADA", "NEGOCIACAO"],
};

export function canTransitionOpportunity(from: OpportunityStage, to: OpportunityStage): boolean {
  return from !== to && ALLOWED_TRANSITIONS[from].includes(to);
}
