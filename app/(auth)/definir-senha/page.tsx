import Image from "next/image";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/server/auth/session";
import { PasswordForm } from "./password-form";

export const metadata: Metadata = { title: "Definir senha" };

export default async function DefinePasswordPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login?erro=convite-invalido");
  }

  return (
    <section className="auth-card">
      <div className="auth-brand" aria-label="RAIP Hub">
        <Image src="/brand/raip-wordmark-gradient.png" alt="RAIP" width={160} height={160} priority />
        <span>Hub</span>
      </div>
      <div className="accent-rule" />
      <p className="eyebrow">Primeiro acesso</p>
      <h1>Defina sua senha.</h1>
      <p className="auth-description">
        O convite foi validado para <strong>{user.email}</strong>. Crie sua senha para acessar o ERP.
      </p>
      <PasswordForm />
      <p className="auth-footnote">Conta exclusiva do Supabase RAIP · acesso ADMIN_MESTRE</p>
    </section>
  );
}
