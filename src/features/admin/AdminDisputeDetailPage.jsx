// Admin dispute detail: both sides' evidence + decision tools (Admin_Panel.docx §3).
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import {
  useDisputes,
  disputeStatuses,
  disputeCategories,
} from '../../context/DisputeContext.jsx'
import { useNotifications } from '../../context/NotificationContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const actionLabels = {
  opened: 'Opened',
  notified: 'Notified',
  responded: 'Responded',
  evidence_added: 'Evidence added',
  mutual_proposed: 'Mutual proposed',
  mutual_agreed: 'Mutual agreed',
  escalated: 'Escalated to admin',
  review_started: 'Admin review started',
  admin_decision: 'Admin decision',
  closed: 'Closed',
}

export default function AdminDisputeDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { getDisputeById, adminDecide } = useDisputes()
  const { addNotification } = useNotifications()
  const [decision, setDecision] = useState('release')
  const [note, setNote] = useState('')

  const dispute = getDisputeById(id)

  if (!dispute) {
    return (
      <DashboardLayout role="admin">
        <div className="mx-auto max-w-2xl rounded-2xl border border-neutral-300 bg-white p-12 text-center">
          <p className="text-lg font-semibold text-neutral-900">Dispute not found</p>
          <Link to="/dashboard/admin/disputes" className="mt-4 inline-block text-sm text-primary hover:underline">
            Back to disputes
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const categoryLabel = disputeCategories.find((c) => c.value === dispute.category)?.label || dispute.category

  const handleDecision = () => {
    if (!note.trim() && decision !== 'escalate') {
      window.alert('Add a decision note (outcome copy should be human-reviewed).')
      return
    }
    const resolutionType =
      decision === 'split' ? 'split' : decision === 'refund' ? 'refund' : decision === 'override' ? 'override' : 'release'
    adminDecide({
      disputeId: dispute.id,
      adminName: user?.name || 'Admin',
      now: '2026-09-24T15:00:00Z',
      decision,
      resolution: {
        type: resolutionType,
        amount: dispute.contractTitle ? undefined : undefined,
        note: note.trim(),
      },
      note: note.trim() || `Admin decision: ${decision}`,
    })
    // Notify both parties
    addNotification({
      type: 'system',
      title: 'Dispute resolved by admin',
      body: `${dispute.contractTitle}: ${note.trim() || decision}`,
      link: `/disputes/${dispute.id}`,
      recipientId: dispute.openerId,
      recipientRole: dispute.openerRole,
    })
    addNotification({
      type: 'system',
      title: 'Dispute resolved by admin',
      body: `${dispute.contractTitle}: ${note.trim() || decision}`,
      link: `/disputes/${dispute.id}`,
      recipientId: dispute.responderId,
      recipientRole: dispute.responderRole,
    })
    setNote('')
  }

  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/dashboard/admin/disputes"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary"
        >
          ← Back to disputes
        </Link>

        {/* Header */}
        <div className="mb-6 rounded-2xl border border-neutral-300 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-neutral-900">{dispute.contractTitle}</h1>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${disputeStatuses[dispute.status]?.badge}`}>
                  {disputeStatuses[dispute.status]?.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-neutral-500">
                #{dispute.id} · {categoryLabel} · Opened by {dispute.openerName} ({dispute.openerRole})
              </p>
              <p className="mt-2 text-sm text-neutral-700">{dispute.description}</p>
              <Link
                to={`/contracts/${dispute.contractId}`}
                className="mt-2 inline-block text-sm text-primary hover:underline"
              >
                View contract →
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Both parties' evidence */}
          <div className="rounded-2xl border border-neutral-300 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">Evidence (both parties)</h2>
            <div className="space-y-3">
              {dispute.evidence.map((e) => (
                <div key={e.id} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      {e.byRole} · {e.byName}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {new Date(e.at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-neutral-900">{e.label}</p>
                  <p className="mt-1 text-sm text-neutral-600">{e.content}</p>
                </div>
              ))}
              {dispute.evidence.length === 0 && (
                <p className="text-sm text-neutral-500">No evidence submitted yet.</p>
              )}
            </div>
            <div className="mt-4 rounded-xl bg-neutral-100 p-3 text-xs text-neutral-600">
              Chat history reference:{' '}
              <Link to="/messages" className="text-primary hover:underline">
                open messages
              </Link>{' '}
              (dispute-linked threads).
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border border-neutral-300 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">Timeline</h2>
            <ol className="space-y-3">
              {dispute.timeline.map((t, i) => (
                <li key={`${t.at}-${i}`} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm text-neutral-900">
                      {actionLabels[t.action] || t.action}{' '}
                      <span className="text-neutral-500">— {t.actorName}</span>
                    </p>
                    <p className="text-xs text-neutral-500">{t.note}</p>
                    <p className="text-xs text-neutral-400">{new Date(t.at).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Decision tools */}
        {dispute.status !== 'resolved' && dispute.status !== 'closed' && (
          <div className="mt-6 rounded-2xl border border-warning/30 bg-warning/5 p-6">
            <h2 className="text-lg font-semibold text-neutral-900">Admin decision tools</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Approve resolution, override, split payment, or escalate further. Outcome copy should be human-reviewed.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-neutral-700">
                Decision
                <select
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="release">Approve — release escrow to worker</option>
                  <option value="refund">Approve — refund company</option>
                  <option value="split">Split payment</option>
                  <option value="override">Override (manual note)</option>
                  <option value="escalate">Escalate further</option>
                </select>
              </label>
              <label className="text-sm text-neutral-700">
                Decision note (required)
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Human-reviewed outcome explanation…"
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </label>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleDecision}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                Apply decision
              </button>
            </div>
          </div>
        )}

        {dispute.resolution && (
          <div className="mt-6 rounded-2xl border border-success/30 bg-success/5 p-6">
            <h2 className="text-lg font-semibold text-neutral-900">Resolution</h2>
            <p className="mt-1 text-sm text-neutral-700 capitalize">
              Type: {dispute.resolution.type}
              {dispute.resolution.amount ? ` · $${dispute.resolution.amount.toLocaleString()}` : ''}
            </p>
            <p className="mt-1 text-sm text-neutral-600">{dispute.resolution.note}</p>
            {dispute.adminDecision && (
              <p className="mt-2 text-xs text-neutral-500">Admin decision code: {dispute.adminDecision}</p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
