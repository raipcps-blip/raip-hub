# RAIP — Mapeamento do negócio e definição de módulos

**Status:** proposta inicial para validação  
**Data:** 03/11/2026  
**Referência estrutural analisada:** ERP A Marcenaria, branch informada `codex/admin-master-quotes`, commit informado `022f975`  
**Regra de isolamento:** nenhum dado, usuário, credencial, arquivo de ambiente ou recurso de infraestrutura da A Marcenaria será reutilizado.

## 1. Resumo do negócio

A RAIP é uma plataforma B2B de crescimento para pequenas e médias empresas, com quatro frentes de serviço:

1. Estrutura comercial e CRM;
2. Microssistemas sob medida;
3. Marca e comunicação;
4. Crescimento digital.

O ciclo essencial informado é:

```text
Empresa/contato → oportunidade → orçamento/proposta → envio → negociação
→ venda ganha → projeto/contrato → contas a receber → recebimento
```

O público informado — homens de 25 a 35 anos — é tratado neste documento como **persona do cliente**, e não como perfil de acesso ao ERP. Os papéis internos do sistema ainda precisam de validação.

## 2. Decisão central de modelagem

O “status do cliente” não deve ficar diretamente no cadastro da empresa. O cadastro representa uma organização ou pessoa; a etapa comercial pertence à **oportunidade**. Isso permite que um mesmo cliente tenha várias negociações simultâneas ou históricas.

### Entidades comerciais propostas

- **Empresas:** organizações atendidas ou prospectadas pela RAIP.
- **Contatos:** pessoas ligadas a uma empresa, com cargo e dados de contato.
- **Oportunidades:** cada negociação, com responsável, frente de serviço, etapa, valor estimado, origem e próxima ação.
- **Propostas:** versões comerciais enviadas ao cliente, com escopo, itens, preço e condições.
- **Vendas/Projetos:** registro criado quando uma proposta é aprovada.

### Funil inicial proposto

```text
NOVO LEAD → CONTATO REALIZADO → DIAGNÓSTICO → PROPOSTA EM PREPARAÇÃO
→ PROPOSTA ENVIADA → NEGOCIAÇÃO → GANHO | PERDIDO
```

As etapas devem ser configuráveis posteriormente. Para o MVP, podem nascer como catálogo controlado para reduzir complexidade.

## 3. Inventário da base A Marcenaria

A base analisada contém:

- fundação Next.js/TypeScript e componentes de interface;
- autenticação Supabase, recuperação de senha e MFA;
- RBAC, RLS e autorização server-side;
- clientes;
- fornecedores;
- orçamentos, versionamento, PDF, link público e aceite;
- pedidos;
- contratos;
- compras;
- financeiro: contas a receber, contas a pagar, contas financeiras, categorias, lançamentos e fluxo de caixa;
- documentos privados;
- dashboard, relatórios e exportação CSV;
- auditoria;
- configurações de empresa, usuários e segurança;
- testes unitários, de segurança, banco e concorrência.

A estrutura é tecnicamente aproveitável, mas contém regras específicas de marcenaria, como tipos de ambiente, medidas, compras de materiais, fornecedores e contrato de obra. Essas regras não devem entrar no domínio RAIP.

## 4. Matriz de decisão dos módulos existentes

| Módulo da base | Decisão RAIP | Prioridade | Adaptação necessária |
|---|---|---:|---|
| Fundação Next.js/TypeScript | **Manter** | MVP | Novo nome, identidade visual, metadados e configuração independente. |
| Autenticação Supabase | **Manter** | MVP | Novo projeto Supabase e novos usuários; nenhum usuário será migrado. |
| RBAC/RLS/autorização | **Manter e adaptar** | MVP | Redefinir papéis e permissões para a operação RAIP. |
| Dashboard | **Adaptar** | MVP | Pipeline, propostas abertas, taxa de conversão, vendas e recebíveis. |
| Clientes | **Adaptar profundamente** | MVP | Separar Empresas e Contatos; acrescentar origem, segmento, porte e responsáveis. |
| Orçamentos | **Manter e adaptar** | MVP | Renomear conceitualmente para Propostas; trocar tipos de projeto pelas quatro frentes RAIP. |
| PDF e versionamento de orçamento | **Manter** | MVP | Novo layout e linguagem comercial; preservar snapshot imutável por versão. |
| Link público e aceite | **Manter** | MVP | Página com marca RAIP, confirmação do decisor e registro auditável. |
| Pedidos | **Adaptar profundamente** | MVP | Tornar Venda/Projeto, criado automaticamente após aprovação. |
| Contratos | **Adaptar profundamente** | Fase 2 | Remover obra, endereço de instalação e garantias de marcenaria; incluir escopo, entregáveis, prazos e responsabilidades. |
| Contas a receber | **Manter e adaptar** | MVP | Gerar parcelas a partir da proposta aprovada; prever cobrança recorrente depois. |
| Contas financeiras | **Manter** | MVP | Cadastro vazio em infraestrutura própria. |
| Lançamentos/ledger | **Manter** | MVP | Categorias RAIP e histórico auditável de recebimentos/estornos. |
| Visão geral e fluxo de caixa | **Adaptar** | Fase 2 | Indicadores compatíveis com serviços e receitas recorrentes. |
| Contas a pagar | **Adiar** | Fase 2 | Útil para gestão completa, mas não é necessária ao primeiro ciclo informado. |
| Resultado por pedido | **Adaptar** | Fase 2 | Resultado e margem por projeto/cliente/frente de serviço. |
| Fornecedores | **Remover do MVP** | Futuro | Só reintroduzir se houver gestão relevante de terceiros e parceiros. |
| Compras | **Remover do MVP** | Futuro | Não faz parte do fluxo essencial informado. |
| Documentos privados | **Manter e adaptar** | Fase 2 | Propostas, contratos, anexos e entregáveis. |
| Relatórios | **Adaptar** | Fase 2 | Funil, conversão, receita, inadimplência e desempenho por frente. |
| Auditoria | **Manter** | MVP técnico | Registrar ações críticas e alterações de status. |
| Empresa/branding | **Manter e adaptar** | MVP | Dados, logotipos e textos exclusivamente RAIP. |
| Usuários e segurança | **Manter e adaptar** | MVP | Novos usuários e política de MFA própria. |

## 5. Novos módulos necessários

### 5.1 CRM e oportunidades — MVP

Não existe como domínio próprio na base atual e é essencial para a RAIP.

Campos mínimos da oportunidade:

- empresa e contato principal;
- título da oportunidade;
- frente de serviço;
- etapa do funil;
- responsável comercial;
- origem do lead;
- valor estimado;
- probabilidade opcional;
- próxima ação e data;
- motivo de perda;
- observações e histórico de mudanças.

### 5.2 Catálogo de serviços — MVP

Substitui os tipos e unidades específicos de marcenaria. Deve permitir:

- frente de serviço;
- nome e descrição do serviço;
- unidade comercial, como projeto, mensalidade, hora, pacote ou unidade;
- preço sugerido opcional;
- serviço ativo/inativo.

Uma proposta pode combinar itens de mais de uma frente.

### 5.3 Atividades comerciais — MVP enxuto

Registro de ligação, reunião, mensagem, tarefa e próximo contato. No MVP, uma lista e uma próxima ação por oportunidade são suficientes; automações e integrações ficam para depois.

### 5.4 Projetos e entrega — Fase 2

A venda ganha deve abrir um projeto. O modelo inicial pode conter:

- frente principal e serviços contratados;
- responsável;
- status: não iniciado, em andamento, aguardando cliente, concluído ou cancelado;
- datas planejadas e realizadas;
- entregáveis e marcos;
- anexos e observações internas.

## 6. Fluxo funcional do MVP

1. Usuário cadastra uma empresa e um ou mais contatos.
2. Usuário abre uma oportunidade e informa a frente de serviço.
3. A oportunidade avança pelo funil e registra a próxima ação.
4. Usuário cria uma proposta vinculada à oportunidade.
5. O sistema gera uma versão imutável e disponibiliza PDF/link público.
6. O cliente aprova pelo link ou a equipe registra a aprovação interna.
7. Em uma única operação transacional, o sistema:
   - marca a oportunidade como ganha;
   - congela a versão aprovada;
   - cria a venda/projeto;
   - gera as contas a receber conforme as condições de pagamento.
8. O financeiro registra o recebimento e o ledger preserva o histórico.

## 7. Navegação proposta para o MVP

```text
Principal
  Dashboard

Comercial
  Empresas
  Contatos
  Oportunidades
  Propostas
  Vendas/Projetos

Financeiro
  Visão geral
  Contas a receber
  Entradas e saídas
  Contas financeiras
  Categorias

Gestão
  Relatórios (primeira versão enxuta)
  Auditoria

Sistema
  Empresa
  Usuários
  Segurança
```

Fornecedores, compras e contas a pagar ficam fora da navegação inicial.

## 8. Papéis de acesso propostos

| Papel | Escopo inicial |
|---|---|
| Administrador mestre | Configuração total, usuários, segurança e administração técnica. |
| Administrador | Gestão do negócio e acesso amplo, sem poderes técnicos exclusivos do mestre. |
| Comercial | Empresas, contatos, oportunidades e propostas. |
| Operação | Projetos, entregáveis e dados necessários à execução; sem margens ou contas financeiras. |
| Financeiro | Contas a receber, movimentações, contas e relatórios financeiros. |

Esta matriz é provisória. O público “homens de 25 a 35 anos” não altera permissões internas.

## 9. Indicadores iniciais

### Dashboard do MVP

- oportunidades por etapa;
- valor do pipeline;
- propostas enviadas, aprovadas, perdidas e expiradas;
- vendas do período;
- contas a receber pendentes e atrasadas;
- recebimentos do período.

### Fase 2

- conversão por origem e responsável;
- ticket médio;
- ciclo médio de venda;
- receita por frente de serviço;
- margem por projeto;
- recorrência e retenção.

## 10. Isolamento técnico obrigatório

O novo ERP deverá ter:

- repositório Git próprio, sem remote da A Marcenaria;
- projeto Supabase próprio;
- bancos e ambientes de desenvolvimento, staging e produção próprios;
- projeto Vercel próprio;
- domínio, SMTP e integrações próprios;
- usuários do Supabase Auth criados do zero;
- buckets de Storage vazios e próprios;
- secrets gerados do zero;
- arquivos `.env` novos, nunca copiados;
- migrations iniciais RAIP revisadas, sem seeds ou dados de demonstração da A Marcenaria;
- identidade visual e textos RAIP;
- verificações automáticas contra vazamento de secrets no bundle.

O código da A Marcenaria permanece somente como referência estrutural. Nenhuma operação de banco, deploy ou alteração será executada nele.

## 11. Recorte recomendado

### MVP funcional

- autenticação e papéis;
- empresa/branding;
- empresas e contatos;
- oportunidades e funil;
- catálogo de serviços;
- propostas, versões, PDF e link público;
- aprovação e criação automática de venda/projeto;
- contas a receber e recebimentos;
- dashboard essencial;
- auditoria e segurança.

### Fase 2

- contratos adaptados;
- gestão detalhada de projetos e entregáveis;
- contas a pagar e fluxo de caixa completo;
- relatórios avançados;
- recorrência financeira;
- integrações de comunicação, marketing ou tarefas.

### Fora do escopo atual

- estoque;
- logística;
- produção industrial;
- fornecedores e compras;
- migração de dados, usuários ou documentos da A Marcenaria;
- reutilização de credenciais ou infraestrutura.

## 12. Pontos que ainda precisam de decisão

1. Quem serão os usuários internos e quantas pessoas existem em Comercial, Operação e Financeiro?
2. A RAIP vende projetos pontuais, mensalidades recorrentes ou ambos?
3. Uma proposta pode reunir várias das quatro frentes no mesmo contrato?
4. O cliente precisa apenas aprovar a proposta ou também assinar contrato eletronicamente?
5. Quais dados devem ser registrados sobre a empresa: porte, segmento, faturamento, número de funcionários e origem?
6. Quais motivos de perda e origens de lead devem existir inicialmente?
7. O módulo de projetos precisa entrar no primeiro lançamento ou basta criar o registro da venda?
8. Haverá acesso externo do cliente a um portal, além do link público de proposta?

