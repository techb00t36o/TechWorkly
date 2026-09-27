// Milestone list with role-based submit/approve actions and escrow progress.
import { CheckCircle, Clock, Upload, ThumbsUp, Lock } from 'lucide-react'
import { useContracts } from '../../../context/ContractContext.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useNotifications } from '../../../context/NotificationContext.jsx'
import { useGigs } from '../../../context/GigContext.jsx'

// Maps milestone status to Tailwind badge classes
const statusStyles = {
  pending: 'bg-neutral-200 text-neutral-600',
  submitted: 'bg-warning/10 text-warning',
  released: 'bg-success/10 text-success',
}

const statusLabels = {
  pending: 'Pending',
  submitted: 'Submitted',
  released: 'Released',
}

export default function MilestoneTracker({ contract }) {
  const { submitMilestone, approveMilestone, requestRevision } = useContracts()
  const { updateOrderStatus } = useGigs()
  const { user, role } = useAuth()
  const { addNotification } = useNotifications()

  const isWorker = role === 'worker' && String(user?.id) === String(contract.workerId)
  const isCompany = role === 'company' && String(user?.id) === String(contract.companyId)
  const isGigOrder = contract.sourceType === 'GIG_ORDER'

  const total = contract.totalAmount
  const released = contract.milestones
    .filter((m) => m.status === 'released')
    .reduce((sum, m) => sum + m.amount, 0)
  const releasedCount = contract.milestones.filter((m) => m.status === 'released').length
  const canSubmit = contract.status === 'active' && contract.escrow.funded

  const handleSubmit = (milestone) => {
    submitMilestone(contract.id, milestone.id)
    // Keep the thin gig-order metadata in sync with the contract lifecycle
    if (isGigOrder) updateOrderStatus(contract.id, 'submitted')
    // Company needs to know a milestone is waiting for approval
    addNotification({
      type: 'application',
      title: isGigOrder ? 'Gig delivery submitted' : 'Milestone submitted',
      body: `${contract.workerName} submitted "${milestone.title}" for ${contract.jobTitle}.`,
      link: `/contracts/${contract.id}`,
      recipientId: contract.companyId,
    })
  }

  const handleApprove = (milestone) => {
    approveMilestone(contract.id, milestone.id)
    if (isGigOrder) updateOrderStatus(contract.id, 'completed')
    // Worker gets paid-adjacent confirmation when a milestone releases
    addNotification({
      type: 'payment',
      title: isGigOrder ? 'Gig accepted — payment released' : 'Milestone released',
      body: `$${milestone.amount.toLocaleString()} released for "${milestone.title}".`,
      link: `/contracts/${contract.id}`,
      recipientId: contract.workerId,
    })

    // Would this release complete the contract? (state updates async after dispatch)
    const remaining = contract.milestones.filter(
      (m) => m.id !== milestone.id && m.status !== 'released',
    ).length
    if (remaining === 0) {
      addNotification({
        type: 'system',
        title: 'Project completed',
        body: `Rate your experience with ${contract.companyName} for ${contract.jobTitle}.`,
        link: `/contracts/${contract.id}/review`,
        recipientId: contract.workerId,
      })
      addNotification({
        type: 'system',
        title: 'Project completed',
        body: `Rate your experience with ${contract.workerName} for ${contract.jobTitle}.`,
        link: `/contracts/${contract.id}/summary`,
        recipientId: contract.companyId,
      })
    }
  }

  // Gig order: company can send delivery back for rework (Order_a_Gig §7)
  const handleRevision = (milestone) => {
    if (!window.confirm('Request a revision? The delivery returns to the worker.')) return
    requestRevision(contract.id, milestone.id)
    if (isGigOrder) updateOrderStatus(contract.id, 'active')
    addNotification({
      type: 'application',
      title: 'Revision requested',
      body: `${contract.companyName} requested revisions on "${milestone.title}".`,
      link: `/contracts/${contract.id}`,
      recipientId: contract.workerId,
    })
  }

  return (
    <div className="rounded-2xl border border-neutral-300 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900">Milestones</h2>
        <span className="text-sm text-neutral-500">
          <span className="font-semibold text-neutral-900">{releasedCount}</span> of{' '}
          {contract.milestones.length} released
        </span>
      </div>

      {/* Progress bar: green fill = released amount / total */}
      <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full bg-success transition-all"
          style={{ width: `${total > 0 ? (released / total) * 100 : 0}%` }}
        />
      </div>
      <p className="mb-6 text-xs text-neutral-500">
        ${released.toLocaleString()} released of ${total.toLocaleString()}
      </p>

      <div className="space-y-4">
        {contract.milestones.map((m, i) => (
          <div
            key={m.id}
            className="rounded-xl border border-neutral-200 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    m.status === 'released'
                      ? 'bg-success text-white'
                      : m.status === 'submitted'
                        ? 'bg-warning text-white'
                        : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{m.title}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    ${m.amount.toLocaleString()} · Due {m.dueDate}
                  </p>
                  {m.releasedAt && (
                    <p className="mt-1 text-xs text-success">
                      Released {new Date(m.releasedAt).toLocaleDateString()}
                    </p>
                  )}
                  {m.submittedAt && m.status === 'submitted' && (
                    <p className="mt-1 text-xs text-warning">
                      Submitted {new Date(m.submittedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[m.status]}`}
                >
                  {statusLabels[m.status]}
                </span>

                {/* Worker: submit pending milestones once escrow is funded */}
                {isWorker && canSubmit && m.status === 'pending' && (
                  <button
                    onClick={() => handleSubmit(m)}
                    className="inline-flex items-center gap-1 rounded-lg border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary-light"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Submit
                  </button>
                )}

                {/* Company: approve submitted milestones to release escrow for that amount */}
                {isCompany && m.status === 'submitted' && (
                  <div className="flex flex-col items-end gap-1.5">
                    <button
                      onClick={() => handleApprove(m)}
                      className="inline-flex items-center gap-1 rounded-lg border border-success/30 px-3 py-1.5 text-xs font-medium text-success hover:bg-success/10"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {isGigOrder ? 'Accept Delivery' : 'Approve & Release'}
                    </button>
                    {isGigOrder && (
                      <button
                        onClick={() => handleRevision(m)}
                        className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                      >
                        Request Revision
                      </button>
                    )}
                  </div>
                )}

                {/* Placeholder hints when no action is available */}
                {!canSubmit && m.status === 'pending' && contract.status === 'active' && (
                  <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
                    <Lock className="h-3 w-3" />
                    Awaiting escrow
                  </span>
                )}
                {m.status === 'pending' && contract.status === 'pending' && (
                  <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
                    <Clock className="h-3 w-3" />
                    Offer pending
                  </span>
                )}
                {m.status === 'released' && (
                  <CheckCircle className="h-4 w-4 text-success" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
