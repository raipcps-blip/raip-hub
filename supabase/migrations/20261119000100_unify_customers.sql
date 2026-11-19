-- Unifica a experiencia comercial de empresas e pessoas na entidade de clientes.
-- A tabela companies permanece como raiz para preservar os vínculos existentes
-- de oportunidades, propostas e projetos.

alter table public.companies
  add column customer_type text not null default 'PJ'
    check (customer_type in ('PF', 'PJ')),
  add column whatsapp text,
  add column postal_code text,
  add column street text,
  add column street_number text,
  add column address_complement text,
  add column neighborhood text;

comment on table public.companies is
  'Clientes PF e PJ atendidos ou prospectados pela RAIP.';
comment on column public.companies.trade_name is
  'Nome do cliente ou nome fantasia.';
comment on column public.companies.tax_id is
  'CPF para pessoa fisica ou CNPJ para pessoa juridica.';

create index companies_customer_type_idx
  on public.companies(customer_type)
  where archived_at is null;
