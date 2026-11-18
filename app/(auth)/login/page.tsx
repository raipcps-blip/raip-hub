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
      <p className="auth-description">Entre com sua conta Google ou com o usuário exclusivo do Supabase da RAIP.</p>
      {erro === "convite-invalido" ? (
        <p className="form-message" role="alert">
          Este convite expirou, já foi utilizado ou é inválido. Solicite um novo convite.
        </p>
      ) : null}
      {erro === "google-indisponivel" ? (
        <p className="form-message" role="alert">
          O acesso com Google ainda não está disponível. Verifique a configuração do provedor no Supabase da RAIP.
        </p>
      ) : null}
      {erro === "google-falhou" ? (
        <p className="form-message" role="alert">
          Não foi possível concluir o acesso com Google. Tente novamente.
        </p>
      ) : null}
      {erro === "acesso-nao-autorizado" ? (
        <p className="form-message" role="alert">
          Acesso não autorizado. Use uma conta previamente cadastrada no RAIP Hub.
        </p>
      ) : null}
      <LoginForm nextPath={next} />
      <p className="auth-footnote">Ambiente independente · dados e credenciais não compartilhados</p>
    </section>
  );
}
