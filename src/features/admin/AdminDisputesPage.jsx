// Admin dispute list with category/status filters (Admin_Panel.docx §3).
import { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import { useDisputes, disputeStatuses, disputeCategories } from '../../context/DisputeContext.jsx'

export default function AdminDisputesPage() {
  const { disputes } = useDisputes()
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')

  const list = disputes.filter(
    (d) =>
      (status === 'all' || d.status === status) &&
      (category === 'all' || d.category === category),
  )

  const categoryLabel = (v) => disputeCategories.find((c) => c.value === v)?.label || v

  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Dispute Management</h1>
          <p className="mt-1 text-sm text-neutral-500">
            All disputes across jobs, teams, and gig contracts.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-neutral-600">
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">All</option>
              {Object.entries(disputeStatuses).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-600">
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">All</option>
              {disputeCategories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="space-y-4">
          {list.length === 0 && (
            <div className="rounded-2xl border border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
              No disputes match these filters.
            </div>
          )}
          {list.map((d) => (
            <Link
              key={d.id}
              to={`/dashboard/admin/disputes/${d.id}`}
              className="block rounded-2xl border border-neutral-300 bg-white p-6 hover:border-primary"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">{d.contractTitle}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${disputeStatuses[d.status]?.badge}`}>
                      {disputeStatuses[d.status]?.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">
                    {categoryLabel(d.category)} · {d.openerName} → {d.responderName}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{d.description}</p>
                  <p className="mt-2 text-xs text-neutral-400">
                    #{d.id} · Opened {new Date(d.createdAt).toLocaleDateString()} · {d.evidence.length} evidence item(s)
                  </p>
                </div>
                <span className="text-sm text-primary">Review →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
