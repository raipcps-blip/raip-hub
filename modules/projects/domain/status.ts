export const PROJECT_STATUSES = ["NAO_INICIADO", "EM_ANDAMENTO", "AGUARDANDO_CLIENTE", "CONCLUIDO", "CANCELADO"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  NAO_INICIADO: "Não iniciado", EM_ANDAMENTO: "Em andamento", AGUARDANDO_CLIENTE: "Aguardando cliente",
  CONCLUIDO: "Concluído", CANCELADO: "Cancelado",
};
