import { BadgeDollarSign, Landmark } from "lucide-react";
import { createFinancialAccount, createFinancialTransaction } from "@/app/(erp)/actions";
import { CreateFormDialog } from "@/components/ui/create-form-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { formatCurrencyCents, formatDate } from "@/lib/format";
import { createServerSupabaseClient } from "@/server/supabase/server";

const ACCOUNT_TYPE_LABELS = { BANCO: "Banco", CAIXA: "Caixa", CARTEIRA_DIGITAL: "Carteira digital", OUTRO: "Outro" } as const;

export default async function FinancialPage() {
  const supabase = await createServerSupabaseClient();
  const [{ data: accountsData }, { data: transactionsData }, { data: receivablesData }] = await Promise.all([
    supabase.from("financial_accounts").select("id, name, account_type, initial_balance_cents").eq("active", true).order("name"),
    supabase.from("financial_transactions").select("id, description, amount_cents, transaction_type, transaction_date, financial_accounts(name)").order("transaction_date", { ascending: false }).limit(50),
    supabase.from("receivables").select("amount_cents, due_date, status, received_at"),
  ]);
  const accounts = accountsData ?? [];
  const transactions = transactionsData ?? [];
  const receivables = receivablesData ?? [];

  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7);
  const pending = receivables.filter((item) => item.status === "PENDENTE");
  const overdue = pending.filter((item) => item.due_date < today);
  const receivedThisMonth = receivables.filter((item) => item.status === "RECEBIDO" && item.received_at?.startsWith(currentMonth));
  const transactionBalance = transactions.reduce((sum, item) => sum + (item.transaction_type === "ENTRADA" ? item.amount_cents : -item.amount_cents), 0);
  const registeredBalance = accounts.reduce((sum, account) => sum + account.initial_balance_cents, 0) + transactionBalance;

  const accountDialog = (
    <CreateFormDialog action={createFinancialAccount} title="Criar conta financeira" description="Cadastre um banco, caixa ou carteira para receber os lançamentos." triggerLabel="Nova conta" submitLabel="Criar conta" triggerVariant="default">
      <div className="form-grid two-columns">
        <label className="form-field full-width"><span>Nome da conta *</span><input name="name" required minLength={2} maxLength={120} autoFocus placeholder="Ex.: Banco principal" /></label>
        <label className="form-field"><span>Tipo *</span><select name="accountType" defaultValue="BANCO" required>{Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
        <label className="form-field"><span>Saldo inicial</span><input name="initialBalance" inputMode="decimal" placeholder="0,00" /></label>
      </div>
    </CreateFormDialog>
  );

  const transactionDialog = (
    <CreateFormDialog action={createFinancialTransaction} title="Novo lançamento" description="Registre uma entrada ou saída na conta financeira selecionada." triggerLabel="Novo lançamento" submitLabel="Registrar lançamento">
      <div className="form-grid two-columns">
        <label className="form-field full-width"><span>Conta financeira *</span><select name="accountId" required defaultValue=""><option value="" disabled>Selecione uma conta</option>{accounts.map((account) => <option value={account.id} key={account.id}>{account.name}</option>)}</select>{accounts.length === 0 ? <small>Crie uma conta financeira antes de registrar o lançamento.</small> : null}</label>
        <label className="form-field"><span>Tipo *</span><select name="transactionType" defaultValue="ENTRADA" required><option value="ENTRADA">Entrada</option><option value="SAIDA">Saída</option></select></label>
        <label className="form-field"><span>Valor *</span><input name="amount" required inputMode="decimal" placeholder="0,00" /></label>
        <label className="form-field"><span>Data *</span><input name="transactionDate" type="date" required defaultValue={today} /></label>
        <label className="form-field full-width"><span>Descrição *</span><input name="description" required minLength={3} maxLength={240} placeholder="Motivo do lançamento" /></label>
      </div>
    </CreateFormDialog>
  );

  return <>
    <PageHeader eyebrow="Gestão financeira" title="Financeiro" description="Recebíveis, entradas, contas financeiras e visão de caixa em uma trilha auditável." action={<div className="action-group">{accountDialog}{transactionDialog}</div>} />
    <section className="metric-grid">
      <article className="metric-card"><div className="metric-label">A receber</div><div className="metric-value">{formatCurrencyCents(pending.reduce((sum, item) => sum + item.amount_cents, 0))}</div><div className="metric-detail">{pending.length} parcela(s) pendente(s)</div></article>
      <article className="metric-card magenta"><div className="metric-label">Vencido</div><div className="metric-value">{formatCurrencyCents(overdue.reduce((sum, item) => sum + item.amount_cents, 0))}</div><div className="metric-detail">{overdue.length} parcela(s) vencida(s)</div></article>
      <article className="metric-card"><div className="metric-label">Recebido no mês</div><div className="metric-value">{formatCurrencyCents(receivedThisMonth.reduce((sum, item) => sum + item.amount_cents, 0))}</div><div className="metric-detail">Período atual</div></article>
      <article className="metric-card magenta"><div className="metric-label">Saldo registrado</div><div className="metric-value">{formatCurrencyCents(registeredBalance)}</div><div className="metric-detail">{accounts.length} conta(s) ativa(s)</div></article>
    </section>
    <section className="dashboard-grid">
      <div className="panel">
        <div className="panel-header"><div><h2 className="panel-title">Últimos lançamentos</h2><p className="panel-subtitle">Entradas e saídas registradas manualmente.</p></div></div>
        {transactions.length === 0 ? <EmptyState icon={BadgeDollarSign} title="Nenhum lançamento registrado" description="Crie uma conta financeira e registre a primeira entrada ou saída." action={accounts.length === 0 ? accountDialog : transactionDialog} /> : (
          <div className="transaction-list">{transactions.map((transaction) => <article className="transaction-row" key={transaction.id}><div><strong>{transaction.description}</strong><span>{transaction.financial_accounts?.name ?? "Conta"} · {formatDate(transaction.transaction_date)}</span></div><b className={transaction.transaction_type === "ENTRADA" ? "amount-positive" : "amount-negative"}>{transaction.transaction_type === "ENTRADA" ? "+" : "−"} {formatCurrencyCents(transaction.amount_cents)}</b></article>)}</div>
        )}
      </div>
      <div className="panel">
        <div className="panel-header"><div><h2 className="panel-title">Contas financeiras</h2><p className="panel-subtitle">Destinos disponíveis para os lançamentos.</p></div></div>
        {accounts.length === 0 ? <EmptyState icon={Landmark} title="Configure a primeira conta" description="Cadastre onde a RAIP movimenta seus recursos." action={accountDialog} /> : <div className="account-list">{accounts.map((account) => <article className="service-card" key={account.id}><div><strong>{account.name}</strong><span>{ACCOUNT_TYPE_LABELS[account.account_type as keyof typeof ACCOUNT_TYPE_LABELS] ?? account.account_type}</span></div><b>{formatCurrencyCents(account.initial_balance_cents)}</b></article>)}</div>}
      </div>
    </section>
  </>;
}
