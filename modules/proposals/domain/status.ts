export const PROPOSAL_STATUSES = ["RASCUNHO", "ENVIADA", "EM_NEGOCIACAO", "APROVADA", "RECUSADA", "EXPIRADA", "CANCELADA"] as const;
export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number];
export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  RASCUNHO: "Rascunho", ENVIADA: "Enviada", EM_NEGOCIACAO: "Em negociação", APROVADA: "Aprovada",
  RECUSADA: "Recusada", EXPIRADA: "Expirada", CANCELADA: "Cancelada",
};
