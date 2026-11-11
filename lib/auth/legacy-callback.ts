export type LegacyAuthSession = {
  accessToken: string;
  refreshToken: string;
  type: string | null;
};

export function readLegacyAuthSession(hash: string): LegacyAuthSession | null {
  const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (!accessToken || !refreshToken) return null;

  return {
    accessToken,
    refreshToken,
    type: params.get("type"),
  };
}

export function authCallbackDestination(type: string | null) {
  return type === "invite" || type === "recovery" ? "/definir-senha" : "/dashboard";
}
