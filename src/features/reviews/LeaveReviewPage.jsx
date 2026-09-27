// Leave Review (PRD 5.10): dual Company↔Worker categories, optional team/peer
// ratings, public-vs-private visibility, confirmation then redirect summary.
import { useState } from 'react'
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useContracts } from '../../context/ContractContext.jsx'
import { useReviews } from '../../context/ReviewContext.jsx'
import { useNotifications } from '../../context/NotificationContext.jsx'
import { useTeams } from '../../context/TeamContext.jsx'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import StarRatingInput from './components/StarRatingInput.jsx'
import { EyeOff, Users, CheckCircle2, ArrowRight } from 'lucide-react'

// Directional category labels (Leave Review §2)
const categoryLabels = {
  quality: 'Quality of work',
  communication: 'Communication',
  timeliness: 'Timeliness',
  clarity: 'Clarity of requirements',
  paymentPromptness: 'Payment promptness',
}

export default function LeaveReviewPage() {
  const { contractId } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()
  const { getContractById } = useContracts()
  const { submitReview, hasReview, companyCategories, workerCategories } =
    useReviews()
  const { addNotification } = useNotifications()
  const { getTeamById } = useTeams()

  const contract = getContractById(contractId)
  const activeRole = role === 'worker' ? 'worker' : 'company'
  const isCompany = activeRole === 'company'

  const categories = isCompany ? companyCategories : workerCategories
  const revieweeName = isCompany ? contract?.workerName : contract?.companyName
  const revieweeRole = isCompany ? 'worker' : 'company'
  const alreadyReviewed = contract ? hasReview(contract.id, activeRole) : false

  const [ratings, setRatings] = useState({})
  const [comment, setComment] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [teamRating, setTeamRating] = useState(0)
  const [peerRatings, setPeerRatings] = useState({})
  const [done, setDone] = useState(false)

  // Team-specific block only for TEAM_ROLE contracts (Leave Review §4)
  const team =
    contract?.sourceType === 'TEAM_ROLE' ? getTeamById(contract.teamId) : null
  const teammates = team
    ? team.members.filter((m) => String(m.workerId) !== String(contract.workerId))
    : []

  if (!contract) {
    return (
      <DashboardLayout role={activeRole}>
        <div className="mx-auto max-w-2xl rounded-2xl border border-neutral-300 bg-white p-12 text-center">
          <p className="text-lg font-semibold text-neutral-900">Contract not found</p>
          <Link
            to={
              activeRole === 'worker'
                ? '/dashboard/worker/contracts'
                : '/dashboard/company/contracts'
            }
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            Back to contracts
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  // Only completed contracts accept reviews (trigger context §1)
  if (contract.status !== 'completed') {
    return <Navigate to={`/contracts/${contract.id}`} replace />
  }

  const overall =
    categories.length && categories.every((c) => ratings[c] > 0)
      ? Math.round(
          (categories.reduce((s, c) => s + ratings[c], 0) / categories.length) *
            10,
        ) / 10
      : 0

  const canSubmit = overall > 0 && !alreadyReviewed && !done

  const setCat = (key, val) => setRatings((prev) => ({ ...prev, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return

    submitReview({
      contractId: contract.id,
      sourceType: contract.sourceType || 'JOB',
      projectTitle: contract.jobTitle,
      reviewerRole: activeRole,
      reviewerName: isCompany ? contract.companyName : contract.workerName,
      revieweeRole,
      revieweeName,
      ratings: { ...ratings, overall },
      comment,
      visibility: isPrivate ? 'private' : 'public',
      teamRating: team && teamRating > 0 ? teamRating : null,
      peerRatings: Object.entries(peerRatings)
        .filter(([, v]) => v > 0)
        .map(([workerId, rating]) => {
          const mate = team?.members.find((m) => String(m.workerId) === workerId)
          return { workerId, workerName: mate?.workerName || 'Teammate', rating }
        }),
    })

    // Counterparty notified; private reviews skip the public praise path
    if (!isPrivate) {
      addNotification({
        type: 'system',
        title: 'New review received',
        body: `${isCompany ? contract.companyName : contract.workerName} left you a ${overall}-star review for ${contract.jobTitle}.`,
        link: `/contracts/${contract.id}/summary`,
        recipientId: isCompany ? contract.workerId : contract.companyId,
      })
    }

    setDone(true)
  }

  // ─── Confirmation screen ───
  if (done) {
    return (
      <DashboardLayout role={activeRole}>
        <div className="mx-auto max-w-xl rounded-2xl border border-success/30 bg-success/5 p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success text-white">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-neutral-900">
            Review Submitted
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            {isPrivate
              ? 'Your feedback was shared privately with the platform for quality tracking.'
              : `Your review is now public on ${revieweeName}’s profile.`}
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() => navigate(`/contracts/${contract.id}/summary`)}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              View Completion Summary
            </button>
            <button
              onClick={() => navigate('/dashboard/worker')}
              className="rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role={activeRole}>
      <div className="mx-auto max-w-2xl">
        <Link
          to={`/contracts/${contract.id}/summary`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary"
        >
          ← Completion summary
        </Link>

        {/* Header — Rate your experience with [Name] */}
        <div className="mb-6 rounded-2xl border border-neutral-300 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Rate your experience with
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-semibold text-white">
              {revieweeName?.[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900">{revieweeName}</h1>
              <p className="text-sm text-neutral-500">
                {contract.jobTitle}
                {team ? ' · Team project' : ' · Individual job'}
              </p>
            </div>
          </div>
          <p className="mt-4 flex items-start gap-2 rounded-lg bg-neutral-100 p-3 text-xs text-neutral-600">
            <EyeOff className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-500" />
            {isPrivate
              ? 'This review will only be visible to the platform (internal quality tracking).'
              : 'Your review will be public on their profile.'}
          </p>
        </div>

        {alreadyReviewed ? (
          <div className="rounded-2xl border border-success/30 bg-success/5 p-6 text-center">
            <p className="font-semibold text-success">You already submitted a review</p>
            <p className="mt-1 text-sm text-neutral-600">
              One review per contract per side — see it on the completion summary.
            </p>
            <Link
              to={`/contracts/${contract.id}/summary`}
              className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              View Completion Summary
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating categories */}
            <div className="rounded-2xl border border-neutral-300 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-neutral-900">
                {isCompany
                  ? 'Rate this worker'
                  : 'Rate this company'}
              </h2>
              <div className="space-y-4">
                {categories.map((c) => (
                  <StarRatingInput
                    key={c}
                    label={categoryLabels[c]}
                    value={ratings[c] || 0}
                    onChange={(v) => setCat(c, v)}
                  />
                ))}
                <div className="mt-2 border-t border-neutral-200 pt-4">
                  <StarRatingInput
                    label="Overall rating (auto-averaged)"
                    value={overall}
                    onChange={() => {}}
                  />
                </div>
              </div>
            </div>

            {/* Written feedback (optional) */}
            <div className="rounded-2xl border border-neutral-300 bg-white p-6">
              <label
                htmlFor="review-comment"
                className="mb-2 block text-sm font-semibold text-neutral-900"
              >
                Written feedback{' '}
                <span className="font-normal text-neutral-400">(optional)</span>
              </label>
              <p className="mb-3 text-xs text-neutral-500">
                Tagged automatically to:{' '}
                <span className="font-medium text-neutral-700">
                  {contract.jobTitle} — {revieweeName}
                </span>
              </p>
              <textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="What went well? What could be better?"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
              />
            </div>

            {/* Team-specific options (§4) */}
            {team && (
              <div className="rounded-2xl border border-neutral-300 bg-white p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Team experience
                  </h2>
                </div>
                <StarRatingInput
                  label="Rate the overall team experience"
                  value={teamRating}
                  onChange={setTeamRating}
                />
                {teammates.length > 0 && (
                  <div className="mt-5 border-t border-neutral-200 pt-4">
                    <p className="mb-3 text-sm font-medium text-neutral-700">
                      Rate individual teammates (optional peer rating)
                    </p>
                    <div className="space-y-3">
                      {teammates.map((mate) => (
                        <StarRatingInput
                          key={mate.workerId}
                          label={mate.workerName}
                          value={peerRatings[String(mate.workerId)] || 0}
                          onChange={(v) =>
                            setPeerRatings((prev) => ({
                              ...prev,
                              [String(mate.workerId)]: v,
                            }))
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Visibility toggle (§5) */}
            <div className="rounded-2xl border border-neutral-300 bg-white p-6">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary-light"
                />
                <span>
                  <span className="block text-sm font-semibold text-neutral-900">
                    Submit privately to the platform only
                  </span>
                  <span className="mt-0.5 block text-xs text-neutral-500">
                    Flag for internal quality tracking — not shown publicly on their profile.
                  </span>
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-neutral-500">
                {overall > 0
                  ? `Overall: ${overall}/5`
                  : 'Select category stars to enable submit'}
              </p>
              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                Submit Review
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  )
}
