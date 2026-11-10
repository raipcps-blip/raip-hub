import { describe, expect, it } from "vitest";
import { safeInternalPath } from "@/lib/auth/redirect";

describe("safeInternalPath", () => {
  it("preserva caminhos internos", () => {
    expect(safeInternalPath("/dashboard?origem=convite", "/login")).toBe(
      "/dashboard?origem=convite",
    );
  });

  it("bloqueia URLs externas e caminhos protocol-relative", () => {
    expect(safeInternalPath("https://evil.example", "/dashboard")).toBe("/dashboard");
    expect(safeInternalPath("//evil.example", "/dashboard")).toBe("/dashboard");
  });

  it("usa fallback quando o caminho não existe", () => {
    expect(safeInternalPath(undefined, "/dashboard")).toBe("/dashboard");
  });
});
