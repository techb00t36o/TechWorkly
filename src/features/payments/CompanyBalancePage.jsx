// Company Balance & Billing Dashboard (private): Available / In Escrow /
// Total Funded, add-funds flow, escrow list, spending breakdown, billing info.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useFinance } from '../../context/FinanceContext.jsx'
import { useNotifications } from '../../context/NotificationContext.jsx'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import { typeMeta, statusStyles, signedAmount, formatDate } from '../payments/txMeta.jsx'
import { Wallet, Lock, TrendingUp, Plus, CreditCard, Receipt } from 'lucide-react'

export default function CompanyBalancePage() {
  const { user } = useAuth()
  const { getSummary, getBreakdown, getTransactionsByRole, addFunds } = useFinance()
  const { addNotification } = useNotifications()

  const summary = getSummary('company')
  const breakdown = getBreakdown('company')
  const recent = getTransactionsByRole('company').slice(0, 5)

  const [showAdd, setShowAdd] = useState(false)
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState(summary.paymentMethod)
  const [done, setDone] = useState(false)

  const amountNum = Number(amount) || 0
  const canAdd = amountNum > 0

  const handleAdd = (e) => {
    e.preventDefault()
    if (!canAdd) return
    addFunds(amountNum, method)
    addNotification({
      type: 'payment',
      title: 'Funds added',
      body: `$${amountNum.toLocaleString()} added to your available balance.`,
      link: '/dashboard/company/balance',
      recipientId: user?.id || 1,
    })
    setDone(true)
    setAmount('')
    setTimeout(() => {
      setShowAdd(false)
      setDone(false)
    }, 1600)
  }

  return (
    <DashboardLayout role="company">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Balance &amp; Billing</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Private view — only your account can see these balances.
          </p>
        </div>
        <Link
          to="/dashboard/transactions"
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
        >
          Transaction History
        </Link>
      </div>

      {/* Summary strip */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-neutral-300 bg-white p-6">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Wallet className="h-4 w-4" />
            Available Balance
          </div>
          <p className="mt-2 text-3xl font-bold text-neutral-900">
            ${summary.available.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-success">Usable for new hires</p>
        </div>
        <div className="rounded-2xl border border-neutral-300 bg-white p-6">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Lock className="h-4 w-4" />
            In Escrow
          </div>
          <p className="mt-2 text-3xl font-bold text-neutral-900">
            ${summary.inEscrow.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-neutral-400">Locked across active contracts</p>
        </div>
        <div className="rounded-2xl border border-neutral-300 bg-white p-6">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <TrendingUp className="h-4 w-4" />
            Total Funded
          </div>
          <p className="mt-2 text-3xl font-bold text-neutral-900">
            ${summary.totalFunded.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-neutral-400">Lifetime</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Available + add funds */}
        <div className="rounded-2xl border border-neutral-300 bg-white p-6">
          <h2 className="text-sm font-semibold text-neutral-900">Available Balance</h2>
          <p className="mt-3 text-4xl font-bold text-neutral-900">
            ${summary.available.toLocaleString()}
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="mt-4 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Funds
            </span>
          </button>
          <div className="mt-4 flex items-center justify-between rounded-lg bg-neutral-100 px-3 py-2.5">
            <div className="flex items-center gap-2 text-sm text-neutral-700">
              <CreditCard className="h-4 w-4 text-neutral-400" />
              {summary.paymentMethod}
            </div>
            <span className="text-xs text-neutral-400">Default</span>
          </div>
          <Link
            to="/account/settings"
            className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
          >
            Manage payment methods →
          </Link>
        </div>

        {/* In Escrow */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-300 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">In Escrow</h2>
            <span className="text-sm font-semibold text-neutral-900">
              ${summary.inEscrow.toLocaleString()}
            </span>
          </div>
          {summary.positions.length === 0 ? (
            <p className="py-6 text-center text-sm text-neutral-500">No funds currently in escrow.</p>
          ) : (
            <div className="space-y-3">
              {summary.positions.map((p) => (
                <Link
                  key={p.contractId}
                  to={`/contracts/${p.contractId}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 p-4 hover:border-primary/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-neutral-900">{p.title}</p>
                    <p className="text-xs text-neutral-500">
                      {p.counterparty} · {p.releaseTrigger}
                    </p>
                    {p.sourceType === 'TEAM_ROLE' && (
                      <span className="mt-1 inline-block rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-medium text-primary">
                        Team role
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-neutral-900">${p.amount.toLocaleString()}</p>
                    <span className="text-[11px] text-primary">Milestones →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Spending breakdown */}
        <div className="rounded-2xl border border-neutral-300 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-neutral-900">Spending Breakdown</h2>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-xs text-neutral-500">
                <span>Individual Jobs</span>
                <span className="font-semibold text-neutral-900">
                  ${breakdown.jobs.toLocaleString()}
                </span>
              </div>
              <div className="h-2 rounded-full bg-neutral-200">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{
                    width: `${breakdown.jobs + breakdown.teams > 0 ? (breakdown.jobs / (breakdown.jobs + breakdown.teams)) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs text-neutral-500">
                <span>Team Projects</span>
                <span className="font-semibold text-neutral-900">
                  ${breakdown.teams.toLocaleString()}
                </span>
              </div>
              <div className="h-2 rounded-full bg-neutral-200">
                <div
                  className="h-2 rounded-full bg-success"
                  style={{
                    width: `${breakdown.jobs + breakdown.teams > 0 ? (breakdown.teams / (breakdown.jobs + breakdown.teams)) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mt-5 space-y-2 rounded-lg bg-neutral-100 p-3 text-xs text-neutral-600">
            <p>
              Total added:{' '}
              <span className="font-semibold text-neutral-900">
                ${summary.totalAdded.toLocaleString()}
              </span>
            </p>
            <p>
              Total spent (escrow):{' '}
              <span className="font-semibold text-neutral-900">
                ${summary.totalSpent.toLocaleString()}
              </span>
            </p>
          </div>
        </div>

        {/* Condensed transactions */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-300 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Transactions</h2>
            <Link to="/dashboard/transactions" className="text-sm font-medium text-primary hover:underline">
              View All Transactions →
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {recent.map((tx) => {
              const meta = typeMeta[tx.type]
              const Icon = meta.icon
              const signed = signedAmount(tx, 'company')
              return (
                <div key={tx.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.color}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-900">{meta.label}</p>
                      <p className="truncate text-xs text-neutral-500">
                        {tx.projectTitle} · {tx.counterparty} · {formatDate(tx.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[tx.status]}`}>
                      {tx.status}
                    </span>
                    <span className={`text-sm font-semibold ${signed >= 0 ? 'text-success' : 'text-danger'}`}>
                      {signed >= 0 ? '+' : '−'}${Math.abs(signed).toLocaleString()}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Billing info */}
        <div className="rounded-2xl border border-neutral-300 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-900">
            <Receipt className="h-4 w-4" />
            Billing Info
          </h2>
          <ul className="space-y-3">
            <li className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2.5">
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <CreditCard className="h-4 w-4 text-neutral-400" />
                Visa •••• 9910
              </div>
              <span className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-medium text-primary">
                Default
              </span>
            </li>
            <li className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2.5">
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <CreditCard className="h-4 w-4 text-neutral-400" />
                Mastercard •••• 2204
              </div>
              <button className="text-xs font-medium text-primary hover:underline">Set default</button>
            </li>
          </ul>
          <button className="mt-3 w-full rounded-lg border border-dashed border-neutral-300 py-2 text-xs font-medium text-neutral-600 hover:border-primary hover:text-primary">
            + Add payment method
          </button>
          <div className="mt-5 border-t border-neutral-200 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Invoices
            </p>
            <button className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-left text-xs text-neutral-700 hover:bg-neutral-100">
              INV-2026-09 · September escrow · Download
            </button>
            <button className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 text-left text-xs text-neutral-700 hover:bg-neutral-100">
              INV-2026-08 · August escrow · Download
            </button>
          </div>
        </div>
      </div>

      {/* Add funds modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleAdd} className="w-full max-w-md rounded-2xl bg-white p-6">
            <h3 className="text-lg font-semibold text-neutral-900">Add Funds</h3>
            {done ? (
              <div className="mt-6 rounded-xl bg-success/10 p-6 text-center">
                <p className="font-semibold text-success">Funds added</p>
                <p className="mt-1 text-sm text-neutral-600">Available balance updated.</p>
              </div>
            ) : (
              <>
                <label className="mt-4 block text-sm font-medium text-neutral-700">Amount (USD)</label>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
                <div className="mt-2 flex gap-2">
                  {[1000, 5000, 10000].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setAmount(String(n))}
                      className="rounded-lg border border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                    >
                      ${n.toLocaleString()}
                    </button>
                  ))}
                </div>
                <label className="mt-4 block text-sm font-medium text-neutral-700">Payment method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                >
                  <option>Visa •••• 9910</option>
                  <option>Mastercard •••• 2204</option>
                </select>
                <div className="mt-5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!canAdd}
                    className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-40"
                  >
                    Confirm Deposit
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      )}
    </DashboardLayout>
  )
}
