// Worker Earnings Dashboard (private): Available / In Escrow / Total Earned,
// withdraw flow, escrow list, breakdown, condensed transaction preview.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useFinance } from '../../context/FinanceContext.jsx'
import { useNotifications } from '../../context/NotificationContext.jsx'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import { typeMeta, statusStyles, signedAmount, formatDate } from '../payments/txMeta.jsx'
import { Wallet, Lock, TrendingUp, Download, CreditCard } from 'lucide-react'

export default function WorkerEarningsPage() {
  const { user } = useAuth()
  const { getSummary, getBreakdown, getTransactionsByRole, withdraw } =
    useFinance()
  const { addNotification } = useNotifications()

  const summary = getSummary('worker')
  const breakdown = getBreakdown('worker')
  const recent = getTransactionsByRole('worker').slice(0, 5)

  const [showWithdraw, setShowWithdraw] = useState(false)
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState(summary.payoutMethod)
  const [requestedTxId, setRequestedTxId] = useState(null)
  const [done, setDone] = useState(false)

  const amountNum = Number(amount) || 0
  const canWithdraw = amountNum > 0 && amountNum <= summary.available

  const handleWithdraw = (e) => {
    e.preventDefault()
    if (!canWithdraw) return
    withdraw(amountNum, method)
    addNotification({
      type: 'payment',
      title: 'Withdrawal requested',
      body: `$${amountNum.toLocaleString()} withdrawal to ${method} is processing.`,
      link: '/dashboard/worker/earnings',
      recipientId: user?.id || 1,
    })
    // Demo: flip pending → completed so the strip feels alive
    setRequestedTxId('recent')
    setDone(true)
    setAmount('')
    setTimeout(() => {
      setShowWithdraw(false)
      setDone(false)
      setRequestedTxId(null)
    }, 1600)
  }

  return (
    <DashboardLayout role="worker">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Earnings</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Private view — only you can see these balances.
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
          <p className="mt-1 text-xs text-success">Withdrawable now</p>
        </div>
        <div className="rounded-2xl border border-neutral-300 bg-white p-6">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Lock className="h-4 w-4" />
            In Escrow (pending)
          </div>
          <p className="mt-2 text-3xl font-bold text-neutral-900">
            ${summary.inEscrow.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-neutral-400">Releases on milestone approval</p>
        </div>
        <div className="rounded-2xl border border-neutral-300 bg-white p-6">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <TrendingUp className="h-4 w-4" />
            Total Earned
          </div>
          <p className="mt-2 text-3xl font-bold text-neutral-900">
            ${summary.totalEarned.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-neutral-400">Lifetime</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Available Balance + withdraw CTA */}
        <div className="rounded-2xl border border-neutral-300 bg-white p-6">
          <h2 className="text-sm font-semibold text-neutral-900">Available Balance</h2>
          <p className="mt-3 text-4xl font-bold text-neutral-900">
            ${summary.available.toLocaleString()}
          </p>
          <button
            onClick={() => setShowWithdraw(true)}
            className="mt-4 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            <span className="inline-flex items-center gap-2">
              <Download className="h-4 w-4" />
              Withdraw Funds
            </span>
          </button>
          <div className="mt-4 flex items-center justify-between rounded-lg bg-neutral-100 px-3 py-2.5">
            <div className="flex items-center gap-2 text-sm text-neutral-700">
              <CreditCard className="h-4 w-4 text-neutral-400" />
              {summary.payoutMethod}
            </div>
            <Link to="/account/settings" className="text-xs font-medium text-primary hover:underline">
              Change
            </Link>
          </div>
        </div>

        {/* In Escrow list */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-300 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">In Escrow (Pending)</h2>
            <span className="text-sm font-semibold text-neutral-900">
              ${summary.inEscrow.toLocaleString()}
            </span>
          </div>
          {summary.positions.length === 0 ? (
            <p className="py-6 text-center text-sm text-neutral-500">
              No funds currently locked in escrow.
            </p>
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
                  <p className="shrink-0 text-sm font-bold text-neutral-900">
                    ${p.amount.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Earnings breakdown */}
        <div className="rounded-2xl border border-neutral-300 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-neutral-900">Earnings Breakdown</h2>
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
          <div className="mt-5 rounded-lg bg-neutral-100 p-3 text-xs text-neutral-600">
            <p>
              Total withdrawn:{' '}
              <span className="font-semibold text-neutral-900">
                ${summary.totalWithdrawn.toLocaleString()}
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
              const signed = signedAmount(tx, 'worker')
              return (
                <div key={tx.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.color}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-900">
                        {meta.label}
                        {tx.milestoneTitle ? ` — ${tx.milestoneTitle}` : ''}
                      </p>
                      <p className="truncate text-xs text-neutral-500">
                        {tx.projectTitle} · {formatDate(tx.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[tx.status]}`}>
                      {tx.status}
                    </span>
                    <span
                      className={`text-sm font-semibold ${signed >= 0 ? 'text-success' : 'text-danger'}`}
                    >
                      {signed >= 0 ? '+' : '−'}${Math.abs(signed).toLocaleString()}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Withdraw modal */}
      {showWithdraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleWithdraw} className="w-full max-w-md rounded-2xl bg-white p-6">
            <h3 className="text-lg font-semibold text-neutral-900">Withdraw Funds</h3>
            {done ? (
              <div className="mt-6 rounded-xl bg-success/10 p-6 text-center">
                <p className="font-semibold text-success">Withdrawal Requested</p>
                <p className="mt-1 text-sm text-neutral-600">
                  Processing typically takes 1–3 business days.
                </p>
              </div>
            ) : (
              <>
                <p className="mt-1 text-sm text-neutral-500">
                  Available: ${summary.available.toLocaleString()}
                </p>
                <label className="mt-4 block text-sm font-medium text-neutral-700">Amount (USD)</label>
                <input
                  type="number"
                  min="1"
                  max={summary.available}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAmount(String(summary.available))}
                    className="rounded-lg border border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                  >
                    Full balance
                  </button>
                </div>
                <label className="mt-4 block text-sm font-medium text-neutral-700">Payout method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                >
                  <option>Bank •••• 4821</option>
                  <option>PayPal •••• user@mail.com</option>
                </select>
                <p className="mt-3 text-xs text-neutral-500">
                  Processing time: 1–3 business days after approval.
                </p>
                <div className="mt-5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowWithdraw(false)}
                    className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!canWithdraw}
                    className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-40"
                  >
                    Confirm Withdrawal
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      )}
      {requestedTxId && null}
    </DashboardLayout>
  )
}
