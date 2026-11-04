import { describe, expect, it } from "vitest";
import { SERVICE_LINE_LABELS, SERVICE_LINES } from "@/modules/shared/domain/service-lines";

describe("RAIP service lines", () => {
  it("contains the four approved operational fronts", () => {
    expect(SERVICE_LINES).toHaveLength(4);
    expect(Object.keys(SERVICE_LINE_LABELS)).toEqual([...SERVICE_LINES]);
  });
});
