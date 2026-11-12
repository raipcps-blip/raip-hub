# Arquitetura - RAIP Hub

## Princípios

- Projeto independente: repositório, Supabase, Vercel, usuários, Storage e secrets próprios.
- Regra de negócio por domínio, com validação no servidor.
- Autorização em duas camadas: aplicação e Row Level Security.
- Valores monetários em centavos inteiros.
- Aprovação comercial transacional e idempotente.
- Histórico por snapshots imutáveis e auditoria append-only.
- Nenhum dado ou credential da A Marcenaria entra neste projeto.

## Domínios do MVP

```text
Empresas -> Contatos -> Oportunidades -> Propostas -> Aprovação
                                                   -> Projeto
                                                   -> Contas a receber
                                                   -> Recebimentos
```

## Stack

- Next.js App Router, React e TypeScript strict.
- Supabase Auth e PostgreSQL.
- RLS em todas as tabelas de aplicação.
- Vercel como destino previsto de hospedagem.
- Vitest para regras de domínio.

### Fluxo de convites

- Convites e recuperações usam `TokenHash` em `/auth/confirm`; a sessão SSR é persistida em cookies antes do redirecionamento.
- Enquanto o projeto usar o e-mail padrão do Supabase, a raiz também aceita o retorno legado com tokens no fragmento, persiste a sessão em cookie e remove os tokens da URL antes de encaminhar o usuário.
- Usuários convidados definem a senha em `/definir-senha`, que exige uma sessão Supabase válida.

## Identidade visual

- Fundo padrão: `#000000`.
- Texto e ações primárias: `#FFFFFF`.
- Ciano `#00FFFF`: foco, linhas, luz e hover.
- Magenta `#FF00FF`: fim do degradê, traços e ícones.
- Ciano e magenta não são usados como grandes blocos ou fundos de botão.

## Estado atual

- Interface responsiva e migration de fundação prontas.
- Login, sessão SSR e proteção de rotas preparados para o Supabase exclusivo da RAIP.
- Migration aplicada no projeto Supabase exclusivo da RAIP e tipos TypeScript gerados a partir do schema remoto.
- Em desenvolvimento, a interface pode ser visualizada sem chaves; em produção, a ausência das variáveis do Supabase bloqueia o ERP.
- Empresas, contatos, oportunidades, propostas, contas e lançamentos financeiros já usam consultas e criações reais, autenticadas e protegidas pela RLS do Supabase RAIP.
