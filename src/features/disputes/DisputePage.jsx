// Dispute detail for participants: status, timeline, respond, mutual, escalate.
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useContracts } from '../../context/ContractContext.jsx'
import {
  useDisputes,
  disputeCategories,
} from '../../context/DisputeContext.jsx'
import { useNotifications } from '../../context/NotificationContext.jsx'

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

export default function DisputePage() {
  const { id } = useParams()
  const { user, role } = useAuth()
  const { getContractById } = useContracts()
  const {
    getDisputeById,
    addEvidence,
    respondToDispute,
    proposeMutual,
    agreeMutual,
    escalateToAdmin,
    disputeStatuses: statuses,
  } = useDisputes()
  const { addNotification } = useNotifications()

  const dispute = getDisputeById(id)
  const contract = dispute ? getContractById(dispute.contractId) : null

  const [responseNote, setResponseNote] = useState('')
  const [mutualNote, setMutualNote] = useState('')
  const [evLabel, setEvLabel] = useState('')
  const [evContent, setEvContent] = useState('')

  if (!dispute) {
    return (
      <DashboardLayout role={role || 'worker'}>
        <div className="mx-auto max-w-2xl rounded-2xl border border-neutral-300 bg-white p-12 text-center">
          <p className="text-lg font-semibold text-neutral-900">Dispute not found</p>
          <Link to="/help" className="mt-4 inline-block text-sm text-primary hover:underline">
            Visit Help Center
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const isOpener = role === dispute.openerRole && String(user?.id) === String(dispute.openerId)
  const isResponder = role === dispute.responderRole && String(user?.id) === String(dispute.responderId)
  const isParticipant = isOpener || isResponder
  const actorName = role === 'worker' ? dispute.openerName : dispute.responderName
  const isOpenish = dispute.status === 'open' || dispute.status === 'awaiting_response'
  const categoryLabel = disputeCategories.find((c) => c.value === dispute.category)?.label || dispute.category

  const notifyOther = (title, body) => {
    const targetId = isOpener ? dispute.responderId : dispute.openerId
    const targetRole = isOpener ? dispute.responderRole : dispute.openerRole
    addNotification({
      type: 'system',
      title,
      body,
      link: `/disputes/${dispute.id}`,
      recipientId: targetId,
      recipientRole: targetRole,
    })
  }

  const handleRespond = () => {
    if (!responseNote.trim()) return
    respondToDispute({
      disputeId: dispute.id,
      actorRole: role,
      actorName,
      note: responseNote.trim(),
      now: '2026-09-24T12:00:00Z',
    })
    if (evContent.trim()) {
      addEvidence({
        disputeId: dispute.id,
        actorRole: role,
        actorName,
        evidence: {
          id: `ev-live-${dispute.evidence.length + 1}`,
          byRole: role,
          byName: actorName,
          kind: 'text',
          label: evLabel.trim() || 'Response note',
          content: evContent.trim(),
          at: '2026-09-24T12:00:00Z',
        },
        now: '2026-09-24T12:00:00Z',
      })
    }
    notifyOther('Dispute response submitted', `${actorName} responded on ${dispute.contractTitle}.`)
    setResponseNote('')
    setEvLabel('')
    setEvContent('')
  }

  const handlePropose = () => {
    if (!mutualNote.trim()) return
    proposeMutual({
      disputeId: dispute.id,
      actorRole: role,
      actorName,
      note: mutualNote.trim(),
      now: '2026-09-24T12:00:00Z',
    })
    notifyOther('Mutual resolution proposed', mutualNote.trim())
    setMutualNote('')
  }

  const handleAgree = () => {
    agreeMutual({
      disputeId: dispute.id,
      actorRole: role,
      actorName,
      resolution: { type: 'split', amount: undefined, note: mutualNote || 'Both parties agreed.' },
      now: '2026-09-24T12:00:00Z',
    })
    notifyOther('Dispute resolved (mutual)', `${dispute.contractTitle} resolved by agreement.`)
  }

  const handleEscalate = () => {
    escalateToAdmin({
      disputeId: dispute.id,
      actorRole: role,
      actorName,
      now: '2026-09-24T12:00:00Z',
    })
    addNotification({
      type: 'system',
      title: 'Dispute escalated',
      body: `${dispute.contractTitle} escalated to admin review.`,
      link: `/dashboard/admin/disputes/${dispute.id}`,
      recipientId: 1,
      recipientRole: 'admin',
    })
  }

  return (
    <DashboardLayout role={role || 'worker'}>
      <div className="mx-auto max-w-4xl">
        <Link
          to={contract ? `/contracts/${contract.id}` : isParticipant ? '/dashboard/worker/contracts' : '/help'}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary"
        >
          ← Back
        </Link>

        {/* Header */}
        <div className="mb-6 rounded-2xl border border-neutral-300 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-neutral-900">{dispute.contractTitle}</h1>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statuses[dispute.status]?.badge}`}>
                  {statuses[dispute.status]?.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-neutral-500">
                #{dispute.id} · {categoryLabel} · Opened by {dispute.openerName}
              </p>
              <p className="mt-2 text-sm text-neutral-700">{dispute.description}</p>
              {contract && (
                <Link to={`/contracts/${contract.id}`} className="mt-2 inline-block text-sm text-primary hover:underline">
                  View contract →
                </Link>
              )}
            </div>
            <div className="text-right text-xs text-neutral-500">
              <p>Response deadline</p>
              <p className="font-semibold text-neutral-900">
                {new Date(dispute.responseDeadline).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Evidence */}
          <div className="rounded-2xl border border-neutral-300 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">Evidence</h2>
            <div className="space-y-3">
              {dispute.evidence.map((e) => (
                <div key={e.id} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-neutral-500">
                      {e.byRole} · {e.byName}
                    </span>
                    <span className="text-xs text-neutral-400">{new Date(e.at).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-neutral-900">{e.label}</p>
                  <p className="mt-1 text-sm text-neutral-600">{e.content}</p>
                </div>
              ))}
            </div>

            {isParticipant && isOpenish && (
              <div className="mt-4 space-y-2 border-t border-neutral-200 pt-4">
                <input
                  type="text"
                  placeholder="Evidence label"
                  value={evLabel}
                  onChange={(e) => setEvLabel(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <textarea
                  placeholder="Evidence details…"
                  value={evContent}
                  onChange={(e) => setEvContent(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
            )}
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

        {/* Participant actions */}
        {isParticipant && isOpenish && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-neutral-300 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">Respond with your side</h2>
              <textarea
                value={responseNote}
                onChange={(e) => setResponseNote(e.target.value)}
                rows={3}
                placeholder="Your response + any evidence added above…"
                className="mt-3 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
              <button
                onClick={handleRespond}
                className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                Submit response
              </button>
            </div>

            <div className="rounded-2xl border border-neutral-300 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">Resolution options</h2>
              <textarea
                value={mutualNote}
                onChange={(e) => setMutualNote(e.target.value)}
                rows={2}
                placeholder="Proposed mutual outcome (e.g. partial release)…"
                className="mt-3 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={handlePropose}
                  className="rounded-lg border border-primary/30 px-4 py-2 text-sm font-medium text-primary hover:bg-primary-light"
                >
                  Propose mutual
                </button>
                <button
                  onClick={handleAgree}
                  className="rounded-lg border border-success/30 px-4 py-2 text-sm font-medium text-success hover:bg-success/10"
                >
                  Agree & resolve
                </button>
                <button
                  onClick={handleEscalate}
                  className="rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                  Escalate to Admin
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resolution outcome */}
        {dispute.resolution && (
          <div className="mt-6 rounded-2xl border border-success/30 bg-success/5 p-6">
            <h2 className="text-lg font-semibold text-neutral-900">Resolution outcome</h2>
            <p className="mt-1 text-sm text-neutral-700 capitalize">
              {dispute.resolution.type}
              {dispute.resolution.amount ? ` · $${dispute.resolution.amount.toLocaleString()}` : ''}
            </p>
            <p className="mt-1 text-sm text-neutral-600">{dispute.resolution.note}</p>
            <p className="mt-2 text-xs text-neutral-500">
              Both parties notified · Linked back to contract record.
            </p>
            {contract && (
              <Link
                to={`/contracts/${contract.id}/summary`}
                className="mt-3 inline-block text-sm text-primary hover:underline"
              >
                Project Completion Summary →
              </Link>
            )}
          </div>
        )}

        {!isParticipant && (
          <div className="mt-6 rounded-2xl border border-neutral-300 bg-white p-6 text-center text-sm text-neutral-500">
            You are not a participant in this dispute. Contact support if you believe this is an error.
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
