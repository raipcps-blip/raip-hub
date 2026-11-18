import "server-only";

/** URL canônica usada em callbacks de autenticação. */
export function getAppUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL;

  if (!configured) {
    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
      return "http://localhost:3000";
    }

    throw new Error("NEXT_PUBLIC_APP_URL não configurada para callbacks de autenticação.");
  }

  const url = new URL(configured);
  const isLocalHttp = url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname);

  if (url.protocol !== "https:" && !isLocalHttp) {
    throw new Error("NEXT_PUBLIC_APP_URL deve usar HTTPS fora do ambiente local.");
  }

  return url.origin;
}
