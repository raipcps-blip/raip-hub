import Image from "next/image";

export default function ConfigurationRequiredPage() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-brand" aria-label="RAIP Hub">
          <Image src="/brand/raip-wordmark-gradient.png" alt="RAIP" width={160} height={160} priority />
          <span>Hub</span>
        </div>
        <div className="accent-rule" />
        <p className="eyebrow">Configuração protegida</p>
        <h1>Ambiente ainda não conectado.</h1>
        <p className="auth-description">
          Esta publicação não libera o ERP até receber a URL e a chave publicável do projeto Supabase exclusivo da RAIP.
        </p>
      </section>
    </main>
  );
}
