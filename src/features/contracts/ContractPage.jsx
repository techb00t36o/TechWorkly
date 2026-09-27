// Offer/Contract detail page: accept/decline offers, escrow status, milestone tracker.
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useContracts } from '../../context/ContractContext.jsx'
import { useMessages } from '../../context/MessageContext.jsx'
import { useNotifications } from '../../context/NotificationContext.jsx'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import MilestoneTracker from './components/MilestoneTracker.jsx'
import EscrowPanel from './components/EscrowPanel.jsx'
import { MessageSquare, Star, FileText, AlertTriangle } from 'lucide-react'
import { useReviews } from '../../context/ReviewContext.jsx'
import { useDisputes } from '../../context/DisputeContext.jsx'

// Contract status → badge classes
const statusStyles = {
  pending: 'bg-warning/10 text-warning',
  active: 'bg-primary-light text-primary',
  completed: 'bg-success/10 text-success',
  declined: 'bg-danger/10 text-danger',
}

export default function ContractPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, role } = useAuth()
  const { getContractById, acceptOffer, declineOffer } = useContracts()
  const { findOrCreateConversation } = useMessages()
  const { addNotification } = useNotifications()
  const { hasReview } = useReviews()
  const { getDisputeForContract, getDisputesByRole } = useDisputes()
  const contract = getContractById(id)

  if (!contract) {
    return (
      <DashboardLayout role={role || 'company'}>
        <div className="mx-auto max-w-2xl rounded-2xl border border-neutral-300 bg-white p-12 text-center">
          <p className="text-lg font-semibold text-neutral-900">Contract not found</p>
          <Link
            to={role === 'worker' ? '/dashboard/worker/contracts' : '/dashboard/company/contracts'}
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            Back to contracts
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  // Derived permission flags: only the two participants can act on the contract
  const isWorker = role === 'worker' && String(user?.id) === String(contract.workerId)
  const isCompany = role === 'company' && String(user?.id) === String(contract.companyId)
  const isParticipant = isWorker || isCompany
  const listPath = role === 'worker' ? '/dashboard/worker/contracts' : '/dashboard/company/contracts'
  const openDispute = getDisputeForContract(contract.id)
  const myDisputes = isParticipant
    ? getDisputesByRole(role).filter((d) => d.contractId === contract.id)
    : []
  const activeDispute = openDispute || myDisputes[0] || null
  const canOpenDispute =
    isParticipant &&
    !openDispute &&
    (contract.status === 'active' || contract.status === 'completed')

  const handleAccept = () => {
    acceptOffer(contract.id)
    // Notify the company that the worker accepted
    addNotification({
      type: 'application',
      title: 'Offer accepted',
      body: `${contract.workerName} accepted your offer for ${contract.jobTitle}.`,
      link: `/contracts/${contract.id}`,
      recipientId: contract.companyId,
    })
  }
  const handleDecline = () => {
    if (window.confirm('Decline this offer? This cannot be undone.')) {
      declineOffer(contract.id)
      addNotification({
        type: 'application',
        title: 'Offer declined',
        body: `${contract.workerName} declined your offer for ${contract.jobTitle}.`,
        link: `/contracts/${contract.id}`,
        recipientId: contract.companyId,
      })
    }
  }

  // Open (or reuse) the contract's conversation thread
  const handleMessage = () => {
    const conversationId = findOrCreateConversation({
      contractId: contract.id,
      jobId: contract.jobId || contract.teamId,
      workerId: contract.workerId,
      workerName: contract.workerName,
      companyId: contract.companyId,
      companyName: contract.companyName,
    })
    navigate(`/messages/${conversationId}`)
  }

  return (
    <DashboardLayout role={role || 'company'}>
      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <Link
          to={listPath}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Contracts
        </Link>

        {/* Header card */}
        <div className="mb-6 rounded-2xl border border-neutral-300 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-semibold text-white">
                  {contract.companyName[0]}
                </div>
                <div>
                  <p className="text-sm text-neutral-500">{contract.companyName}</p>
                  <p className="text-xs text-neutral-400">→ {contract.workerName}</p>
                </div>
              </div>
              <h1 className="mt-4 text-2xl font-bold text-neutral-900">{contract.jobTitle}</h1>
              <p className="mt-1 text-sm text-neutral-500">
                Contract #{contract.id} · Created {new Date(contract.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[contract.status]}`}
                >
                  {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                </span>
                {isParticipant && (
                  <button
                    onClick={handleMessage}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Message
                  </button>
                )}
                {canOpenDispute && (
                  <Link
                    to={`/disputes/new?contractId=${contract.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-danger/30 px-3 py-1 text-xs font-medium text-danger hover:bg-danger/10"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Open Dispute
                  </Link>
                )}
                {activeDispute && (
                  <Link
                    to={`/disputes/${activeDispute.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-warning/30 px-3 py-1 text-xs font-medium text-warning hover:bg-warning/10"
                  >
                    View Dispute
                  </Link>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-500">Contract value</p>
                <p className="text-xl font-bold text-neutral-900">
                  ${contract.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {contract.message && (
            <div className="mt-4 rounded-xl bg-neutral-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Offer message
              </p>
              <p className="mt-1 text-sm text-neutral-700">{contract.message}</p>
            </div>
          )}

          {/* Original source: job / team / gig (unified contract model) */}
          {contract.sourceType === 'TEAM_ROLE' ? (
            <Link
              to={`/teams/${contract.teamId}`}
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              View team listing →
            </Link>
          ) : contract.sourceType === 'GIG_ORDER' ? (
            <Link
              to={`/gigs/${contract.gigId}`}
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              View gig listing →
            </Link>
          ) : (
            <Link
              to={`/jobs/${contract.jobId}`}
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              View original job posting →
            </Link>
          )}
        </div>

        {/* Pending offer: worker accept/decline actions */}
        {contract.status === 'pending' && isWorker && (
          <div className="mb-6 rounded-2xl border border-warning/30 bg-warning/5 p-6">
            <h2 className="text-lg font-semibold text-neutral-900">Pending Offer</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Review the terms above. Accepting creates an active contract; you can then submit
              milestones once escrow is funded.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleAccept}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                Accept Offer
              </button>
              <button
                onClick={handleDecline}
                className="rounded-lg border border-danger/30 px-6 py-2.5 text-sm font-medium text-danger hover:bg-danger/10"
              >
                Decline
              </button>
            </div>
          </div>
        )}

        {contract.status === 'pending' && isCompany && (
          <div className="mb-6 rounded-2xl border border-neutral-300 bg-white p-6 text-center">
            <p className="font-semibold text-neutral-900">Awaiting response</p>
            <p className="mt-1 text-sm text-neutral-500">
              {contract.workerName} has not responded to this offer yet.
            </p>
          </div>
        )}

        {contract.status === 'declined' && (
          <div className="mb-6 rounded-2xl border border-danger/30 bg-danger/5 p-6 text-center">
            <p className="font-semibold text-danger">Offer declined</p>
            <p className="mt-1 text-sm text-neutral-600">
              This offer was declined and is no longer actionable.
            </p>
          </div>
        )}

        {/* Active contract: escrow + milestones */}
        {contract.status === 'active' && isParticipant && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <MilestoneTracker contract={contract} />
            </div>
            <div>
              <EscrowPanel contract={contract} />
            </div>
          </div>
        )}

        {/* Completed: summary + review/completion CTAs (PRD 5.10) */}
        {contract.status === 'completed' && (
          <div className="mb-6 rounded-2xl border border-success/30 bg-success/5 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-neutral-900">Contract completed</p>
                <p className="text-sm text-neutral-600">
                  All ${contract.totalAmount.toLocaleString()} released across{' '}
                  {contract.milestones.length} milestone{contract.milestones.length !== 1 ? 's' : ''}.
                </p>
              </div>
            </div>

            {isParticipant && (
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to={`/contracts/${contract.id}/summary`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  <FileText className="h-4 w-4" />
                  Completion Summary
                </Link>
                <Link
                  to={`/contracts/${contract.id}/review`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  <Star className="h-4 w-4" />
                  {hasReview(contract.id, isWorker ? 'worker' : 'company')
                    ? 'View My Review'
                    : 'Leave a Review'}
                </Link>
              </div>
            )}

            <div className="mt-4">
              <MilestoneTracker contract={contract} />
            </div>
          </div>
        )}

        {/* Non-participants get a read-only notice */}
        {!isParticipant && contract.status !== 'declined' && (
          <div className="rounded-2xl border border-neutral-300 bg-white p-6 text-center">
            <p className="text-sm text-neutral-500">
              You are not a participant in this contract. Contact support if you believe this is an
              error.
            </p>
            <div className="mt-3 flex justify-center gap-3">
              <button
                onClick={() => navigate(listPath)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                Back to my contracts
              </button>
              <Link
                to="/help/contact"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
