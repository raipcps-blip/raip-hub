import { describe, expect, it } from "vitest";
import {
  authCallbackDestination,
  readLegacyAuthSession,
} from "@/lib/auth/legacy-callback";

describe("readLegacyAuthSession", () => {
  it("reads an implicit Supabase session without exposing unrelated fields", () => {
    expect(
      readLegacyAuthSession("#access_token=access&refresh_token=refresh&type=invite&expires_in=3600"),
    ).toEqual({ accessToken: "access", refreshToken: "refresh", type: "invite" });
  });

  it("rejects incomplete callback fragments", () => {
    expect(readLegacyAuthSession("#access_token=access&type=invite")).toBeNull();
    expect(readLegacyAuthSession("")).toBeNull();
  });
});

describe("authCallbackDestination", () => {
  it("routes password flows to password definition", () => {
    expect(authCallbackDestination("invite")).toBe("/definir-senha");
    expect(authCallbackDestination("recovery")).toBe("/definir-senha");
  });

  it("routes other sessions to the dashboard", () => {
    expect(authCallbackDestination("signup")).toBe("/dashboard");
    expect(authCallbackDestination(null)).toBe("/dashboard");
  });
});
