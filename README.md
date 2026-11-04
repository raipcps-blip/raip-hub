# RAIP Hub

ERP/CRM próprio da RAIP para gerir empresas, contatos, oportunidades, propostas, projetos e recebimentos.

## Isolamento

Este projeto não usa dados, usuários, credenciais ou infraestrutura da A Marcenaria. O projeto Supabase e o deploy Vercel deverão ser criados exclusivamente para a RAIP.

## Execução local

```bash
npm install
npm run dev
```

A interface de fundação funciona sem conexão de banco durante o desenvolvimento. Para conectar o Supabase, copie `.env.example` para `.env.local` e use apenas a URL e a chave publicável do novo projeto RAIP. Uma publicação sem essas variáveis é bloqueada por segurança.

## Validação

```bash
npm run check
```

## Documentação

- `MAPEAMENTO_NEGOCIO_E_MODULOS.md`: escopo e decisões do produto.
- `docs/ARCHITECTURE.md`: visão técnica e princípios.
- `supabase/migrations/20261103000100_raip_foundation.sql`: schema inicial independente.
