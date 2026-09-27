// Shared Transaction History (both roles): filters, summary bar, detail modal,
// CSV export. Role comes from auth — structure is identical for Worker/Company.
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useFinance } from '../../context/FinanceContext.jsx'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import {
  typeMeta,
  statusStyles,
  signedAmount,
  formatDate,
  formatDateTime,
  typeFilters,
} from './txMeta.jsx'
import { Download, Search } from 'lucide-react'

const rangeOptions = [
  { key: '30d', label: 'Last 30 days', days: 30 },
  { key: '3m', label: 'Last 3 months', days: 90 },
  { key: 'all', label: 'All time', days: null },
]

const statusOptions = [
  { key: 'all', label: 'All' },
  { key: 'completed', label: 'Completed' },
  { key: 'pending', label: 'Pending' },
  { key: 'failed', label: 'Failed' },
]

export default function TransactionHistoryPage() {
  const { user, role } = useAuth()
  const { getTransactionsByRole } = useFinance()

  const activeRole = role === 'worker' ? 'worker' : 'company'
  const [range, setRange] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [detail, setDetail] = useState(null)

  const pageSize = 10

  const filtered = useMemo(() => {
    let list = getTransactionsByRole(activeRole)
    const rangeDef = rangeOptions.find((r) => r.key === range)
    if (rangeDef?.days) {
      // Data-driven cutoff (latest tx time) keeps the filter pure — no Date.now() in render
      const latest = list.reduce(
        (max, t) => Math.max(max, new Date(t.createdAt).getTime()),
        0,
      )
      const cutoff = latest - rangeDef.days * 86400000
      list = list.filter((t) => new Date(t.createdAt).getTime() >= cutoff)
    }
    if (typeFilter !== 'all') list = list.filter((t) => t.type === typeFilter)
    if (statusFilter !== 'all') list = list.filter((t) => t.status === statusFilter)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(
        (t) =>
          t.projectTitle.toLowerCase().includes(q) ||
          t.counterparty.toLowerCase().includes(q),
      )
    }
    return list
  }, [getTransactionsByRole, activeRole, range, typeFilter, statusFilter, query])

  // Summary bar for the selected range (role-aware labels per page spec)
  const summaryStats = useMemo(() => {
    const completed = filtered.filter((t) => t.status === 'completed')
    if (activeRole === 'worker') {
      return [
        {
          label: 'Total Earned',
          value: completed
            .filter((t) => t.type === 'released')
            .reduce((s, t) => s + t.amount, 0),
        },
        {
          label: 'Total Withdrawn',
          value: filtered
            .filter((t) => t.type === 'withdrawal')
            .reduce((s, t) => s + t.amount, 0),
        },
      ]
    }
    return [
      {
        label: 'Total Spent',
        value: completed
          .filter((t) => t.type === 'funded' || t.type === 'released')
          .reduce((s, t) => s + t.amount, 0),
      },
      {
        label: 'Total Added',
        value: completed
          .filter((t) => t.type === 'deposit')
          .reduce((s, t) => s + t.amount, 0),
      },
    ]
  }, [filtered, activeRole])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  // Mock CSV export of the current filtered set
  const handleExport = () => {
    const header = 'date,type,project,counterparty,amount,status\n'
    const rows = filtered
      .map((t) =>
        [
          t.createdAt,
          t.type,
          `"${t.projectTitle}"`,
          `"${t.counterparty}"`,
          signedAmount(t, activeRole),
          t.status,
        ].join(','),
      )
      .join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions-${activeRole}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const resetPage = (fn) => (v) => {
    fn(v)
    setPage(1)
  }

  return (
    <DashboardLayout role={activeRole}>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Transaction History</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {activeRole === 'worker'
              ? 'Your private earning and payout records.'
              : 'Your private funding and spending records.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={range}
            onChange={resetPage(setRange)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            {rangeOptions.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-neutral-300 bg-white px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          {typeFilters.map((f) => (
            <button
              key={f.key}
              onClick={resetPage(() => setTypeFilter(f.key))}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                typeFilter === f.key
                  ? 'bg-primary text-white'
                  : 'border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select
          value={statusFilter}
          onChange={resetPage(setStatusFilter)}
          className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
        >
          {statusOptions.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label === 'All' ? 'Status: All' : s.label}
            </option>
          ))}
        </select>
        <div className="relative ml-auto">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={resetPage(setQuery)}
            placeholder="Search project or name…"
            className="w-48 rounded-lg border border-neutral-300 py-1.5 pl-8 pr-3 text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Summary bar */}
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        {summaryStats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-neutral-300 bg-white p-5">
            <p className="text-sm text-neutral-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900">${s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Transaction list */}
      {pageItems.length === 0 ? (
        <div className="rounded-2xl border border-neutral-300 bg-white p-12 text-center">
          <p className="text-lg font-semibold text-neutral-900">No transactions found</p>
          <p className="mt-2 text-sm text-neutral-500">
            No {typeFilter === 'all' ? '' : typeMeta[typeFilter]?.label.toLowerCase() + ' '}
            transactions in the selected range or filter.
          </p>
          <button
            onClick={() => {
              setTypeFilter('all')
              setStatusFilter('all')
              setRange('all')
              setQuery('')
              setPage(1)
            }}
            className="mt-4 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-300 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Project / Job</th>
                <th className="px-4 py-3 font-medium">Counterparty</th>
                <th className="px-4 py-3 font-medium text-right">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {pageItems.map((tx) => {
                const meta = typeMeta[tx.type]
                const Icon = meta.icon
                const signed = signedAmount(tx, activeRole)
                return (
                  <tr
                    key={tx.id}
                    onClick={() => setDetail(tx)}
                    className="cursor-pointer hover:bg-neutral-50"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-neutral-600">
                      {formatDate(tx.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2">
                        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${meta.color}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-neutral-700">{meta.label}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {tx.contractId ? (
                        <Link
                          to={`/contracts/${tx.contractId}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-medium text-neutral-900 hover:text-primary"
                        >
                          {tx.projectTitle}
                        </Link>
                      ) : (
                        <span className="font-medium text-neutral-900">{tx.projectTitle}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{tx.counterparty}</td>
                    <td
                      className={`whitespace-nowrap px-4 py-3 text-right font-semibold ${
                        signed >= 0 ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {signed >= 0 ? '+' : '−'}${Math.abs(signed).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[tx.status]}`}
                      >
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-neutral-500">
          <span>
            Showing {pageItems.length} of {filtered.length} transactions
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-2 py-1.5">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setDetail(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${typeMeta[detail.type].color}`}
              >
                {(() => {
                  const Icon = typeMeta[detail.type].icon
                  return <Icon className="h-5 w-5" />
                })()}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  {typeMeta[detail.type].label}
                </h3>
                <p className="text-xs text-neutral-500">{formatDateTime(detail.createdAt)}</p>
              </div>
            </div>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-500">Amount</dt>
                <dd className="font-semibold text-neutral-900">
                  ${detail.amount.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Platform fee</dt>
                <dd className="font-medium text-neutral-900">
                  ${Math.round(detail.amount * 0.05).toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-2">
                <dt className="text-neutral-500">Net {activeRole === 'worker' ? 'received' : 'paid'}</dt>
                <dd className="font-semibold text-neutral-900">
                  $
                  {(
                    activeRole === 'worker' && detail.type === 'released'
                      ? detail.amount - Math.round(detail.amount * 0.05)
                      : detail.amount
                  ).toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Project</dt>
                <dd className="font-medium text-neutral-900">{detail.projectTitle}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Counterparty</dt>
                <dd className="font-medium text-neutral-900">{detail.counterparty}</dd>
              </div>
              {detail.contractId && (
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Contract</dt>
                  <dd>
                    <Link
                      to={`/contracts/${detail.contractId}`}
                      className="font-medium text-primary hover:underline"
                    >
                      View contract →
                    </Link>
                  </dd>
                </div>
              )}
              {detail.milestoneTitle && (
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Milestone</dt>
                  <dd className="font-medium text-neutral-900">{detail.milestoneTitle}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-neutral-500">Payment method</dt>
                <dd className="font-medium text-neutral-900">{detail.method}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Status</dt>
                <dd>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[detail.status]}`}
                  >
                    {detail.status}
                  </span>
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setDetail(null)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const text = `Receipt ${detail.id}\n${typeMeta[detail.type].label}\nAmount: $${detail.amount}\nProject: ${detail.projectTitle}\nDate: ${formatDateTime(detail.createdAt)}`
                  const blob = new Blob([text], { type: 'text/plain' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `receipt-${detail.id}.txt`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                Download receipt
              </button>
            </div>
          </div>
        </div>
      )}
      {user && null}
    </DashboardLayout>
  )
}
