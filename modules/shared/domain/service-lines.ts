export const SERVICE_LINES = [
  "ESTRUTURA_COMERCIAL_CRM",
  "MICROSSISTEMAS_SOB_MEDIDA",
  "MARCA_COMUNICACAO",
  "CRESCIMENTO_DIGITAL",
] as const;

export type ServiceLine = (typeof SERVICE_LINES)[number];

export const SERVICE_LINE_LABELS: Record<ServiceLine, string> = {
  ESTRUTURA_COMERCIAL_CRM: "Estrutura comercial e CRM",
  MICROSSISTEMAS_SOB_MEDIDA: "Microssistemas sob medida",
  MARCA_COMUNICACAO: "Marca e comunicação",
  CRESCIMENTO_DIGITAL: "Crescimento digital",
};
