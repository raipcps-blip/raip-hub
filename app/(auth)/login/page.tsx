import Image from "next/image";
import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; erro?: string }>;
}) {
  const { next, erro } = await searchParams;

  return (
    <section className="auth-card">
      <div className="auth-brand" aria-label="RAIP Hub">
        <Image src="/brand/raip-wordmark-gradient.png" alt="RAIP" width={160} height={160} priority />
        <span>Hub</span>
      </div>
      <div className="accent-rule" />
      <p className="eyebrow">Acesso seguro</p>
      <h1>Bem-vindo de volta.</h1>
      <p className="auth-description">Entre com o usuário criado exclusivamente no Supabase da RAIP.</p>
      {erro === "convite-invalido" ? (
        <p className="form-message" role="alert">
          Este convite expirou, já foi utilizado ou é inválido. Solicite um novo convite.
        </p>
      ) : null}
      <LoginForm nextPath={next} />
      <p className="auth-footnote">Ambiente independente · dados e credenciais não compartilhados</p>
    </section>
  );
}
