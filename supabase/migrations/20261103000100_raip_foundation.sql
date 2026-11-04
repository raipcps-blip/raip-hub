-- RAIP Hub - foundation schema
-- New project only. Contains no data, users or credentials from A Marcenaria.

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create type public.opportunity_stage as enum (
  'NOVO_LEAD', 'CONTATO_REALIZADO', 'DIAGNOSTICO', 'PROPOSTA_PREPARACAO',
  'PROPOSTA_ENVIADA', 'NEGOCIACAO', 'GANHO', 'PERDIDO'
);
create type public.service_line as enum (
  'ESTRUTURA_COMERCIAL_CRM', 'MICROSSISTEMAS_SOB_MEDIDA',
  'MARCA_COMUNICACAO', 'CRESCIMENTO_DIGITAL'
);
create type public.proposal_status as enum (
  'RASCUNHO', 'ENVIADA', 'EM_NEGOCIACAO', 'APROVADA', 'RECUSADA', 'EXPIRADA', 'CANCELADA'
);
create type public.project_status as enum (
  'NAO_INICIADO', 'EM_ANDAMENTO', 'AGUARDANDO_CLIENTE', 'CONCLUIDO', 'CANCELADO'
);
create type public.receivable_status as enum ('PENDENTE', 'RECEBIDO', 'CANCELADO');
create type public.transaction_type as enum ('ENTRADA', 'SAIDA', 'ESTORNO');

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text not null,
  created_at timestamptz not null default now()
);

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profile_roles (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete restrict,
  assigned_at timestamptz not null default now(),
  assigned_by uuid references public.profiles(id),
  primary key (profile_id, role_id)
);

create or replace function public.has_permission(p_permission text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles pr
    join public.profile_roles ur on ur.profile_id = pr.id
    join public.role_permissions rp on rp.role_id = ur.role_id
    join public.permissions pe on pe.id = rp.permission_id
    where pr.id = auth.uid() and pr.active and pe.code = p_permission
  );
$$;

revoke all on function public.has_permission(text) from public;
grant execute on function public.has_permission(text) to authenticated;

create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), ''));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create table public.company_settings (
  singleton boolean primary key default true check (singleton),
  trade_name text not null default 'RAIP',
  legal_name text,
  tax_id text,
  email text,
  phone text,
  website text,
  address jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

insert into public.company_settings (singleton) values (true);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  legal_name text,
  trade_name text not null,
  tax_id text,
  tax_id_normalized text generated always as (regexp_replace(coalesce(tax_id, ''), '[^0-9]', '', 'g')) stored,
  segment text,
  company_size text,
  employee_count integer check (employee_count is null or employee_count >= 0),
  estimated_revenue_cents bigint check (estimated_revenue_cents is null or estimated_revenue_cents >= 0),
  origin text,
  website text,
  phone text,
  email text,
  city text,
  state char(2),
  notes text,
  owner_id uuid references public.profiles(id),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  created_by uuid not null references public.profiles(id),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

create unique index companies_active_tax_id_unique on public.companies(tax_id_normalized)
where archived_at is null and tax_id_normalized <> '';
create index companies_trade_name_trgm on public.companies using gin (trade_name gin_trgm_ops);
create index companies_owner_idx on public.companies(owner_id) where archived_at is null;

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id),
  full_name text not null,
  role_title text,
  email text,
  phone text,
  whatsapp text,
  is_primary boolean not null default false,
  notes text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  created_by uuid not null references public.profiles(id),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

create index contacts_company_idx on public.contacts(company_id) where archived_at is null;
create index contacts_name_trgm on public.contacts using gin (full_name gin_trgm_ops);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  service_line public.service_line not null,
  name text not null,
  description text,
  billing_unit text not null check (billing_unit in ('PROJETO', 'MENSALIDADE', 'HORA', 'PACOTE', 'UNIDADE')),
  suggested_price_cents bigint check (suggested_price_cents is null or suggested_price_cents >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid not null references public.profiles(id),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id),
  primary_contact_id uuid references public.contacts(id),
  title text not null,
  service_line public.service_line not null,
  stage public.opportunity_stage not null default 'NOVO_LEAD',
  owner_id uuid not null references public.profiles(id),
  source text,
  estimated_value_cents bigint check (estimated_value_cents is null or estimated_value_cents >= 0),
  probability smallint check (probability is null or probability between 0 and 100),
  next_action text,
  next_action_at timestamptz,
  loss_reason text,
  closed_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  created_by uuid not null references public.profiles(id),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id),
  check (stage <> 'PERDIDO' or nullif(trim(loss_reason), '') is not null)
);

create index opportunities_company_idx on public.opportunities(company_id) where archived_at is null;
create index opportunities_owner_stage_idx on public.opportunities(owner_id, stage) where archived_at is null;
create index opportunities_next_action_idx on public.opportunities(next_action_at) where archived_at is null and next_action_at is not null;

create table public.opportunity_activities (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id),
  activity_type text not null check (activity_type in ('LIGACAO', 'REUNIAO', 'MENSAGEM', 'EMAIL', 'TAREFA', 'NOTA')),
  title text not null,
  notes text,
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  created_by uuid not null references public.profiles(id)
);

create index opportunity_activities_opportunity_idx on public.opportunity_activities(opportunity_id, created_at desc);

create table public.document_sequences (
  prefix text not null,
  year integer not null,
  last_value integer not null default 0,
  primary key (prefix, year)
);

create or replace function public.next_document_number(p_prefix text)
returns text language plpgsql security definer set search_path = '' as $$
declare
  v_year integer := extract(year from current_date)::integer;
  v_value integer;
  v_prefix text := upper(trim(p_prefix));
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;

  if v_prefix = 'PROP' and not public.has_permission('proposals.write') then
    raise exception 'permission denied: proposals.write required';
  elsif v_prefix = 'PRJ' and not public.has_permission('proposals.approve') then
    raise exception 'permission denied: proposals.approve required';
  elsif v_prefix not in ('PROP', 'PRJ') then
    raise exception 'unsupported document prefix';
  end if;

  insert into public.document_sequences(prefix, year, last_value)
  values (v_prefix, v_year, 1)
  on conflict (prefix, year) do update set last_value = public.document_sequences.last_value + 1
  returning last_value into v_value;
  return v_prefix || '-' || v_year::text || '-' || lpad(v_value::text, 4, '0');
end;
$$;

revoke all on function public.next_document_number(text) from public;
grant execute on function public.next_document_number(text) to authenticated;

create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  opportunity_id uuid not null references public.opportunities(id),
  company_id uuid not null references public.companies(id),
  primary_contact_id uuid references public.contacts(id),
  owner_id uuid not null references public.profiles(id),
  title text not null,
  status public.proposal_status not null default 'RASCUNHO',
  issue_date date not null default current_date,
  valid_until date,
  scope text,
  commercial_notes text,
  subtotal_cents bigint not null default 0 check (subtotal_cents >= 0),
  discount_cents bigint not null default 0 check (discount_cents >= 0),
  total_cents bigint not null default 0 check (total_cents >= 0),
  approved_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  created_by uuid not null references public.profiles(id),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id),
  check (discount_cents <= subtotal_cents),
  check (total_cents = subtotal_cents - discount_cents)
);

create index proposals_opportunity_idx on public.proposals(opportunity_id) where archived_at is null;
create index proposals_company_idx on public.proposals(company_id) where archived_at is null;
create index proposals_status_idx on public.proposals(status) where archived_at is null;

create table public.proposal_items (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  position integer not null check (position > 0),
  service_id uuid references public.services(id),
  service_line public.service_line not null,
  description text not null,
  quantity numeric(12, 3) not null check (quantity > 0),
  unit text not null,
  unit_price_cents bigint not null check (unit_price_cents >= 0),
  total_cents bigint not null check (total_cents >= 0),
  notes text,
  unique (proposal_id, position)
);

create table public.proposal_payment_terms (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  sequence integer not null check (sequence > 0),
  description text,
  amount_cents bigint not null check (amount_cents > 0),
  due_date date,
  days_after_approval integer check (days_after_approval is null or days_after_approval >= 0),
  unique (proposal_id, sequence),
  check ((due_date is not null)::integer + (days_after_approval is not null)::integer = 1)
);

create table public.proposal_versions (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id),
  version integer not null check (version > 0),
  generated_for_status public.proposal_status not null,
  snapshot jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  unique (proposal_id, version)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  proposal_id uuid not null unique references public.proposals(id),
  proposal_version_id uuid not null references public.proposal_versions(id),
  opportunity_id uuid not null references public.opportunities(id),
  company_id uuid not null references public.companies(id),
  title text not null,
  primary_service_line public.service_line not null,
  status public.project_status not null default 'NAO_INICIADO',
  owner_id uuid references public.profiles(id),
  planned_start date,
  planned_end date,
  actual_start date,
  actual_end date,
  internal_notes text,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

create index projects_company_idx on public.projects(company_id);
create index projects_owner_status_idx on public.projects(owner_id, status);

create table public.financial_accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  account_type text not null check (account_type in ('BANCO', 'CAIXA', 'CARTEIRA_DIGITAL', 'OUTRO')),
  initial_balance_cents bigint not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid not null references public.profiles(id),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

create table public.receivables (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id),
  proposal_payment_term_id uuid references public.proposal_payment_terms(id),
  sequence integer not null check (sequence > 0),
  description text,
  amount_cents bigint not null check (amount_cents > 0),
  due_date date not null,
  status public.receivable_status not null default 'PENDENTE',
  received_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  unique (project_id, sequence)
);

create index receivables_due_status_idx on public.receivables(status, due_date);

create table public.financial_transactions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.financial_accounts(id),
  receivable_id uuid references public.receivables(id),
  transaction_type public.transaction_type not null,
  amount_cents bigint not null check (amount_cents > 0),
  transaction_date date not null,
  description text not null,
  reversal_of_id uuid unique references public.financial_transactions(id),
  created_at timestamptz not null default now(),
  created_by uuid not null references public.profiles(id),
  check ((transaction_type = 'ESTORNO') = (reversal_of_id is not null))
);

create index financial_transactions_account_date_idx on public.financial_transactions(account_id, transaction_date desc);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  before_data jsonb,
  after_data jsonb,
  reason text,
  created_at timestamptz not null default now()
);

create index audit_logs_entity_idx on public.audit_logs(entity_type, entity_id, created_at desc);
create index audit_logs_actor_idx on public.audit_logs(actor_id, created_at desc);

create or replace function public.write_audit_log(
  p_action text, p_entity_type text, p_entity_id text,
  p_before jsonb default null, p_after jsonb default null, p_reason text default null
) returns void language sql security definer set search_path = '' as $$
  insert into public.audit_logs(actor_id, action, entity_type, entity_id, before_data, after_data, reason)
  values (auth.uid(), p_action, p_entity_type, p_entity_id, p_before, p_after, p_reason);
$$;

revoke all on function public.write_audit_log(text, text, text, jsonb, jsonb, text) from public;
grant execute on function public.write_audit_log(text, text, text, jsonb, jsonb, text) to authenticated;

-- Approval is atomic: snapshot, win, project and receivables are one transaction.
create or replace function public.approve_proposal(p_proposal_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_proposal public.proposals;
  v_version public.proposal_versions;
  v_project public.projects;
  v_version_number integer;
  v_terms_total bigint;
begin
  if auth.uid() is null
    or not public.has_permission('proposals.approve')
    or not public.has_permission('opportunities.close') then
    raise exception 'permission denied: proposals.approve and opportunities.close required';
  end if;

  select * into v_proposal from public.proposals where id = p_proposal_id and archived_at is null for update;
  if not found then raise exception 'proposal not found'; end if;

  if v_proposal.status = 'APROVADA' then
    select * into v_project from public.projects where proposal_id = v_proposal.id;
    return v_project.id;
  end if;
  if v_proposal.status not in ('ENVIADA', 'EM_NEGOCIACAO') then
    raise exception 'proposal cannot be approved from status %', v_proposal.status;
  end if;
  if v_proposal.valid_until is not null and v_proposal.valid_until < current_date then
    raise exception 'proposal expired';
  end if;

  select coalesce(sum(amount_cents), 0) into v_terms_total
  from public.proposal_payment_terms where proposal_id = v_proposal.id;
  if v_terms_total not in (0, v_proposal.total_cents) then
    raise exception 'payment terms total differs from proposal total';
  end if;

  select coalesce(max(version), 0) + 1 into v_version_number
  from public.proposal_versions where proposal_id = v_proposal.id;

  insert into public.proposal_versions(proposal_id, version, generated_for_status, snapshot, created_by)
  values (
    v_proposal.id, v_version_number, 'APROVADA',
    jsonb_build_object(
      'proposal', to_jsonb(v_proposal),
      'items', coalesce((select jsonb_agg(to_jsonb(i) order by i.position) from public.proposal_items i where i.proposal_id = v_proposal.id), '[]'::jsonb),
      'paymentTerms', coalesce((select jsonb_agg(to_jsonb(t) order by t.sequence) from public.proposal_payment_terms t where t.proposal_id = v_proposal.id), '[]'::jsonb)
    ), auth.uid()
  ) returning * into v_version;

  perform set_config('raip.approval_proposal_id', v_proposal.id::text, true);
  update public.proposals set status = 'APROVADA', approved_at = now(), updated_at = now(), updated_by = auth.uid()
  where id = v_proposal.id;
  update public.opportunities set stage = 'GANHO', closed_at = now(), updated_at = now(), updated_by = auth.uid()
  where id = v_proposal.opportunity_id;

  insert into public.projects(
    number, proposal_id, proposal_version_id, opportunity_id, company_id,
    title, primary_service_line, owner_id, created_by
  )
  select public.next_document_number('PRJ'), v_proposal.id, v_version.id, v_proposal.opportunity_id,
    v_proposal.company_id, v_proposal.title, o.service_line, o.owner_id, auth.uid()
  from public.opportunities o where o.id = v_proposal.opportunity_id
  returning * into v_project;

  if v_terms_total = 0 then
    insert into public.receivables(project_id, sequence, description, amount_cents, due_date, created_by)
    values (v_project.id, 1, 'Parcela única', v_proposal.total_cents, current_date, auth.uid());
  else
    insert into public.receivables(project_id, proposal_payment_term_id, sequence, description, amount_cents, due_date, created_by)
    select v_project.id, t.id, t.sequence, t.description, t.amount_cents,
      coalesce(t.due_date, current_date + t.days_after_approval), auth.uid()
    from public.proposal_payment_terms t where t.proposal_id = v_proposal.id order by t.sequence;
  end if;

  perform public.write_audit_log(
    'PROPOSAL_APPROVED', 'proposals', v_proposal.id::text,
    jsonb_build_object('status', v_proposal.status),
    jsonb_build_object('status', 'APROVADA', 'project_id', v_project.id, 'version_id', v_version.id),
    'Aprovação comercial'
  );
  return v_project.id;
end;
$$;

revoke all on function public.approve_proposal(uuid) from public;
grant execute on function public.approve_proposal(uuid) to authenticated;

-- Workflow guards keep direct table updates from bypassing domain invariants.
create or replace function public.guard_opportunity_stage_transition()
returns trigger language plpgsql set search_path = '' as $$
declare
  v_allowed boolean := false;
begin
  if new.stage = old.stage then return new; end if;

  v_allowed := case old.stage
    when 'NOVO_LEAD' then new.stage in ('CONTATO_REALIZADO', 'PERDIDO')
    when 'CONTATO_REALIZADO' then new.stage in ('NOVO_LEAD', 'DIAGNOSTICO', 'PERDIDO')
    when 'DIAGNOSTICO' then new.stage in ('CONTATO_REALIZADO', 'PROPOSTA_PREPARACAO', 'PERDIDO')
    when 'PROPOSTA_PREPARACAO' then new.stage in ('DIAGNOSTICO', 'PROPOSTA_ENVIADA', 'PERDIDO')
    when 'PROPOSTA_ENVIADA' then new.stage in ('PROPOSTA_PREPARACAO', 'NEGOCIACAO', 'GANHO', 'PERDIDO')
    when 'NEGOCIACAO' then new.stage in ('PROPOSTA_ENVIADA', 'GANHO', 'PERDIDO')
    when 'GANHO' then new.stage = 'NEGOCIACAO'
    when 'PERDIDO' then new.stage in ('CONTATO_REALIZADO', 'DIAGNOSTICO', 'PROPOSTA_PREPARACAO', 'PROPOSTA_ENVIADA', 'NEGOCIACAO')
    else false
  end;

  if not v_allowed then
    raise exception 'invalid opportunity transition: % -> %', old.stage, new.stage;
  end if;

  if (old.stage in ('GANHO', 'PERDIDO') or new.stage in ('GANHO', 'PERDIDO'))
    and not public.has_permission('opportunities.close') then
    raise exception 'permission denied: opportunities.close required';
  end if;

  if new.stage in ('GANHO', 'PERDIDO') then
    new.closed_at = coalesce(new.closed_at, now());
  else
    new.closed_at = null;
  end if;

  return new;
end;
$$;

create or replace function public.guard_proposal_status_transition()
returns trigger language plpgsql set search_path = '' as $$
declare
  v_allowed boolean := false;
begin
  if new.status = old.status then return new; end if;

  v_allowed := case old.status
    when 'RASCUNHO' then new.status in ('ENVIADA', 'CANCELADA')
    when 'ENVIADA' then new.status in ('RASCUNHO', 'EM_NEGOCIACAO', 'APROVADA', 'RECUSADA', 'EXPIRADA', 'CANCELADA')
    when 'EM_NEGOCIACAO' then new.status in ('ENVIADA', 'APROVADA', 'RECUSADA', 'EXPIRADA', 'CANCELADA')
    else false
  end;

  if not v_allowed then
    raise exception 'invalid proposal transition: % -> %', old.status, new.status;
  end if;

  if new.status = 'APROVADA'
    and current_setting('raip.approval_proposal_id', true) is distinct from new.id::text then
    raise exception 'proposal approval must use approve_proposal()';
  end if;

  return new;
end;
$$;

create or replace function public.guard_proposal_children_mutation()
returns trigger language plpgsql set search_path = '' as $$
declare
  v_proposal_id uuid := case when tg_op = 'DELETE' then old.proposal_id else new.proposal_id end;
  v_status public.proposal_status;
begin
  select status into v_status from public.proposals where id = v_proposal_id;

  if v_status in ('APROVADA', 'RECUSADA', 'EXPIRADA', 'CANCELADA') then
    raise exception 'proposal content is immutable in status %', v_status;
  end if;

  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create trigger opportunities_stage_guard
before update of stage on public.opportunities
for each row execute function public.guard_opportunity_stage_transition();
create trigger proposals_status_guard
before update of status on public.proposals
for each row execute function public.guard_proposal_status_transition();
create trigger proposal_items_mutation_guard
before insert or update or delete on public.proposal_items
for each row execute function public.guard_proposal_children_mutation();
create trigger proposal_terms_mutation_guard
before insert or update or delete on public.proposal_payment_terms
for each row execute function public.guard_proposal_children_mutation();

-- Updated-at triggers.
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger companies_updated_at before update on public.companies for each row execute function public.set_updated_at();
create trigger contacts_updated_at before update on public.contacts for each row execute function public.set_updated_at();
create trigger services_updated_at before update on public.services for each row execute function public.set_updated_at();
create trigger opportunities_updated_at before update on public.opportunities for each row execute function public.set_updated_at();
create trigger proposals_updated_at before update on public.proposals for each row execute function public.set_updated_at();
create trigger projects_updated_at before update on public.projects for each row execute function public.set_updated_at();
create trigger financial_accounts_updated_at before update on public.financial_accounts for each row execute function public.set_updated_at();

-- Structural authorization catalog. No business/user data is seeded.
insert into public.roles(code, name) values
  ('ADMIN_MESTRE', 'Administrador mestre'),
  ('ADMIN', 'Administrador'),
  ('COMERCIAL', 'Comercial'),
  ('OPERACAO', 'Operação'),
  ('FINANCEIRO', 'Financeiro');

insert into public.permissions(code, description) values
  ('dashboard.read', 'Ver dashboard'),
  ('companies.read', 'Ver empresas'), ('companies.write', 'Criar e editar empresas'),
  ('contacts.read', 'Ver contatos'), ('contacts.write', 'Criar e editar contatos'),
  ('opportunities.read', 'Ver oportunidades'), ('opportunities.write', 'Criar e editar oportunidades'), ('opportunities.close', 'Ganhar ou perder oportunidades'),
  ('proposals.read', 'Ver propostas'), ('proposals.write', 'Criar e editar propostas'), ('proposals.approve', 'Aprovar propostas'),
  ('projects.read', 'Ver projetos'), ('projects.write', 'Atualizar projetos'),
  ('financial.read', 'Ver financeiro'), ('financial.write', 'Operar financeiro'),
  ('reports.read', 'Ver relatórios'), ('audit.read', 'Ver auditoria'),
  ('service_catalog.manage', 'Gerenciar catálogo de serviços'),
  ('users.manage', 'Gerenciar usuários e papéis'), ('company.manage', 'Gerenciar dados da RAIP'), ('security.manage', 'Gerenciar segurança');

insert into public.role_permissions(role_id, permission_id)
select r.id, p.id from public.roles r cross join public.permissions p where r.code = 'ADMIN_MESTRE';
insert into public.role_permissions(role_id, permission_id)
select r.id, p.id from public.roles r cross join public.permissions p where r.code = 'ADMIN' and p.code <> 'security.manage';
insert into public.role_permissions(role_id, permission_id)
select r.id, p.id from public.roles r cross join public.permissions p
where r.code = 'COMERCIAL' and p.code in (
  'dashboard.read','companies.read','companies.write','contacts.read','contacts.write',
  'opportunities.read','opportunities.write','opportunities.close','proposals.read','proposals.write','proposals.approve','projects.read','reports.read'
);
insert into public.role_permissions(role_id, permission_id)
select r.id, p.id from public.roles r cross join public.permissions p
where r.code = 'OPERACAO' and p.code in ('dashboard.read','companies.read','contacts.read','proposals.read','projects.read','projects.write');
insert into public.role_permissions(role_id, permission_id)
select r.id, p.id from public.roles r cross join public.permissions p
where r.code = 'FINANCEIRO' and p.code in ('dashboard.read','companies.read','proposals.read','projects.read','financial.read','financial.write','reports.read');

-- RLS is mandatory on every application table.
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.profiles enable row level security;
alter table public.profile_roles enable row level security;
alter table public.company_settings enable row level security;
alter table public.companies enable row level security;
alter table public.contacts enable row level security;
alter table public.services enable row level security;
alter table public.opportunities enable row level security;
alter table public.opportunity_activities enable row level security;
alter table public.document_sequences enable row level security;
alter table public.proposals enable row level security;
alter table public.proposal_items enable row level security;
alter table public.proposal_payment_terms enable row level security;
alter table public.proposal_versions enable row level security;
alter table public.projects enable row level security;
alter table public.financial_accounts enable row level security;
alter table public.receivables enable row level security;
alter table public.financial_transactions enable row level security;
alter table public.audit_logs enable row level security;

revoke all on all tables in schema public from anon;
grant select on public.roles, public.permissions, public.role_permissions, public.profiles, public.profile_roles to authenticated;
grant update on public.profiles to authenticated;
grant insert, delete on public.profile_roles to authenticated;
grant select, insert, update on public.company_settings, public.companies, public.contacts, public.services, public.opportunities, public.opportunity_activities, public.proposals, public.projects, public.financial_accounts, public.receivables to authenticated;
grant select, insert, update, delete on public.proposal_items, public.proposal_payment_terms to authenticated;
grant select on public.proposal_versions, public.financial_transactions, public.audit_logs to authenticated;
grant insert on public.financial_transactions to authenticated;

create policy roles_manage_select on public.roles for select to authenticated using (public.has_permission('users.manage'));
create policy permissions_manage_select on public.permissions for select to authenticated using (public.has_permission('users.manage'));
create policy role_permissions_manage_select on public.role_permissions for select to authenticated using (public.has_permission('users.manage'));
create policy profiles_self_or_manage_select on public.profiles for select to authenticated using (id = auth.uid() or public.has_permission('users.manage'));
create policy profile_roles_self_or_manage_select on public.profile_roles for select to authenticated using (profile_id = auth.uid() or public.has_permission('users.manage'));
create policy profiles_manage_update on public.profiles for update to authenticated using (public.has_permission('users.manage')) with check (public.has_permission('users.manage'));
create policy profile_roles_manage_insert on public.profile_roles for insert to authenticated with check (public.has_permission('users.manage') and assigned_by = auth.uid());
create policy profile_roles_manage_delete on public.profile_roles for delete to authenticated using (public.has_permission('users.manage'));

create policy company_settings_select on public.company_settings for select to authenticated using (public.has_permission('dashboard.read'));
create policy company_settings_update on public.company_settings for update to authenticated using (public.has_permission('company.manage')) with check (public.has_permission('company.manage'));

create policy companies_select on public.companies for select to authenticated using (public.has_permission('companies.read'));
create policy companies_insert on public.companies for insert to authenticated with check (public.has_permission('companies.write') and created_by = auth.uid());
create policy companies_update on public.companies for update to authenticated using (public.has_permission('companies.write')) with check (public.has_permission('companies.write'));
create policy contacts_select on public.contacts for select to authenticated using (public.has_permission('contacts.read'));
create policy contacts_insert on public.contacts for insert to authenticated with check (public.has_permission('contacts.write') and created_by = auth.uid());
create policy contacts_update on public.contacts for update to authenticated using (public.has_permission('contacts.write')) with check (public.has_permission('contacts.write'));

create policy services_select on public.services for select to authenticated using (public.has_permission('proposals.read'));
create policy services_insert on public.services for insert to authenticated with check (public.has_permission('service_catalog.manage') and created_by = auth.uid());
create policy services_update on public.services for update to authenticated using (public.has_permission('service_catalog.manage')) with check (public.has_permission('service_catalog.manage'));

create policy opportunities_select on public.opportunities for select to authenticated using (public.has_permission('opportunities.read'));
create policy opportunities_insert on public.opportunities for insert to authenticated with check (public.has_permission('opportunities.write') and created_by = auth.uid());
create policy opportunities_update on public.opportunities for update to authenticated using (public.has_permission('opportunities.write')) with check (public.has_permission('opportunities.write'));
create policy opportunity_activities_select on public.opportunity_activities for select to authenticated using (public.has_permission('opportunities.read'));
create policy opportunity_activities_insert on public.opportunity_activities for insert to authenticated with check (public.has_permission('opportunities.write') and created_by = auth.uid());
create policy opportunity_activities_update on public.opportunity_activities for update to authenticated using (public.has_permission('opportunities.write')) with check (public.has_permission('opportunities.write'));

create policy proposals_select on public.proposals for select to authenticated using (public.has_permission('proposals.read'));
create policy proposals_insert on public.proposals for insert to authenticated with check (public.has_permission('proposals.write') and created_by = auth.uid());
create policy proposals_update on public.proposals for update to authenticated using (public.has_permission('proposals.write')) with check (public.has_permission('proposals.write'));
create policy proposal_items_select on public.proposal_items for select to authenticated using (public.has_permission('proposals.read'));
create policy proposal_items_write on public.proposal_items for all to authenticated using (public.has_permission('proposals.write')) with check (public.has_permission('proposals.write'));
create policy proposal_terms_select on public.proposal_payment_terms for select to authenticated using (public.has_permission('proposals.read'));
create policy proposal_terms_write on public.proposal_payment_terms for all to authenticated using (public.has_permission('proposals.write')) with check (public.has_permission('proposals.write'));
create policy proposal_versions_select on public.proposal_versions for select to authenticated using (public.has_permission('proposals.read'));

create policy projects_select on public.projects for select to authenticated using (public.has_permission('projects.read'));
create policy projects_insert on public.projects for insert to authenticated with check (public.has_permission('projects.write'));
create policy projects_update on public.projects for update to authenticated using (public.has_permission('projects.write')) with check (public.has_permission('projects.write'));
create policy financial_accounts_select on public.financial_accounts for select to authenticated using (public.has_permission('financial.read'));
create policy financial_accounts_insert on public.financial_accounts for insert to authenticated with check (public.has_permission('financial.write') and created_by = auth.uid());
create policy financial_accounts_update on public.financial_accounts for update to authenticated using (public.has_permission('financial.write')) with check (public.has_permission('financial.write'));
create policy receivables_select on public.receivables for select to authenticated using (public.has_permission('financial.read'));
create policy receivables_insert on public.receivables for insert to authenticated with check (public.has_permission('financial.write'));
create policy receivables_update on public.receivables for update to authenticated using (public.has_permission('financial.write')) with check (public.has_permission('financial.write'));
create policy transactions_select on public.financial_transactions for select to authenticated using (public.has_permission('financial.read'));
create policy transactions_insert on public.financial_transactions for insert to authenticated with check (public.has_permission('financial.write') and created_by = auth.uid());
create policy audit_select on public.audit_logs for select to authenticated using (public.has_permission('audit.read'));

-- No direct access is granted to sequences or audit insertion; security-definer functions own those paths.
revoke all on public.document_sequences from authenticated;
revoke insert, update, delete on public.proposal_versions, public.audit_logs from authenticated;
