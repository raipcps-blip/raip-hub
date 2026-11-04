import { describe, expect, it } from "vitest";
import { canTransitionOpportunity, OPEN_OPPORTUNITY_STAGES } from "@/modules/crm/domain/opportunity";

describe("opportunity pipeline", () => {
  it("keeps won and lost stages out of the open pipeline", () => {
    expect(OPEN_OPPORTUNITY_STAGES).not.toContain("GANHO");
    expect(OPEN_OPPORTUNITY_STAGES).not.toContain("PERDIDO");
  });
  it("allows commercial progression and blocks stage no-op", () => {
    expect(canTransitionOpportunity("NOVO_LEAD", "CONTATO_REALIZADO")).toBe(true);
    expect(canTransitionOpportunity("NEGOCIACAO", "GANHO")).toBe(true);
    expect(canTransitionOpportunity("NEGOCIACAO", "NEGOCIACAO")).toBe(false);
  });
  it("requires a proposal to be sent before a direct win", () => {
    expect(canTransitionOpportunity("NOVO_LEAD", "GANHO")).toBe(false);
    expect(canTransitionOpportunity("PROPOSTA_ENVIADA", "GANHO")).toBe(true);
  });
});
