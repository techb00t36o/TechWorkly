// Project Completion Summary (PRD 5.10): closing recap after all milestones
// release — scope, milestones, payments, team, review prompt, next steps.
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useContracts } from '../../context/ContractContext.jsx'
import { useReviews } from '../../context/ReviewContext.jsx'
import { useTeams } from '../../context/TeamContext.jsx'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import {
  CheckCircle2,
  Star,
  FileText,
  Users,
  Wallet,
  MessageSquare,
} from 'lucide-react'

// Platform fee rate for display only (no real fee logic yet)
const PLATFORM_FEE_RATE = 0.05

const typeLabel = {
  JOB: 'Individual Job',
  TEAM_ROLE: 'Team Project',
  GIG_ORDER: 'Gig Order',
}

export default function ProjectCompletionSummaryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()
  const { getContractById } = useContracts()
  const { getReviewsForContract, hasReview } = useReviews()
  const { getTeamById } = useTeams()

  const contract = getContractById(id)
  const activeRole = role === 'worker' ? 'worker' : 'company'
  const isCompany = activeRole === 'company'

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

  // Summary is the closing screen — active/pending contracts bounce back
  if (contract.status !== 'completed') {
    return (
      <DashboardLayout role={activeRole}>
        <div className="mx-auto max-w-2xl rounded-2xl border border-warning/30 bg-warning/5 p-8 text-center">
          <p className="font-semibold text-neutral-900">Project not complete yet</p>
          <p className="mt-1 text-sm text-neutral-600">
            The completion summary unlocks once every milestone has been approved
            and released.
          </p>
          <button
            onClick={() => navigate(`/contracts/${contract.id}`)}
            className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Open Contract
          </button>
        </div>
      </DashboardLayout>
    )
  }

  const released = contract.milestones.filter((m) => m.status === 'released')
  const totalReleased = released.reduce((s, m) => s + m.amount, 0)
  const fees = Math.round(totalReleased * PLATFORM_FEE_RATE)
  const finalPayout = totalReleased - fees
  const completedAt =
    released[released.length - 1]?.releasedAt || contract.createdAt
  const startDate = contract.createdAt

  const team =
    contract.sourceType === 'TEAM_ROLE' ? getTeamById(contract.teamId) : null

  const reviews = getReviewsForContract(contract.id)
  const myReviewDone = hasReview(contract.id, activeRole)
  const publicReviews = reviews.filter((r) => r.visibility === 'public')
  const projectType = typeLabel[contract.sourceType] || 'Individual Job'

  // Deliverables = released milestones (plus team files when applicable)
  const deliverables = [
    ...released.map((m) => m.title),
    ...(team?.files || []).map((f) => f.name),
  ]

  const durationDays = Math.max(
    1,
    Math.round(
      (new Date(completedAt).getTime() - new Date(startDate).getTime()) /
        86400000,
    ),
  )

  return (
    <DashboardLayout role={activeRole}>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* ─── Header ─── */}
        <div className="rounded-2xl border border-success/30 bg-success/5 p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-success px-3 py-1 text-xs font-semibold text-white">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Project Completed
              </div>
              <h1 className="text-2xl font-bold text-neutral-900">
                {contract.jobTitle}
              </h1>
              <p className="mt-2 text-sm text-neutral-600">
                {contract.companyName} · {contract.workerName}
                {team ? ` + ${Math.max(0, team.members.length - 1)} teammate(s)` : ''}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Completed {new Date(completedAt).toLocaleDateString()} ·{' '}
                {projectType} · Contract #{contract.id}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500">Total released</p>
              <p className="text-2xl font-bold text-neutral-900">
                ${totalReleased.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* ─── Project recap ─── */}
            <section className="rounded-2xl border border-neutral-300 bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900">
                <FileText className="h-4 w-4 text-primary" />
                Project Recap
              </h2>
              <p className="text-sm text-neutral-600">
                {contract.message || 'Full scope delivered across all milestones.'}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">Duration</p>
                  <p className="mt-0.5 text-sm font-semibold text-neutral-900">
                    {new Date(startDate).toLocaleDateString()} →{' '}
                    {new Date(completedAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-neutral-400">{durationDays} days</p>
                </div>
                <div className="rounded-xl bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">Type</p>
                  <p className="mt-0.5 text-sm font-semibold text-neutral-900">
                    {projectType}
                  </p>
                </div>
                <div className="rounded-xl bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-500">Participants</p>
                  <p className="mt-0.5 text-sm font-semibold text-neutral-900">
                    {contract.companyName}
                  </p>
                  <p className="text-xs text-neutral-500">{contract.workerName}</p>
                </div>
              </div>
            </section>

            {/* ─── Deliverables ─── */}
            <section className="rounded-2xl border border-neutral-300 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-neutral-900">
                Deliverables Summary
              </h2>
              <ul className="space-y-2">
                {deliverables.length === 0 ? (
                  <li className="text-sm text-neutral-500">
                    No separate files — scope covered by milestone approvals below.
                  </li>
                ) : (
                  deliverables.map((d) => (
                    <li
                      key={d}
                      className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                      {d}
                    </li>
                  ))
                )}
              </ul>
              {team && team.files.length > 0 && (
                <Link
                  to={`/teams/${team.id}/workspace`}
                  className="mt-3 inline-block text-sm text-primary hover:underline"
                >
                  Open full Files tab →
                </Link>
              )}
            </section>

            {/* ─── Milestones recap ─── */}
            <section className="rounded-2xl border border-neutral-300 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-neutral-900">
                Milestones Recap
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 text-xs uppercase tracking-wider text-neutral-500">
                      <th className="pb-2 pr-4 font-semibold">Milestone</th>
                      <th className="pb-2 pr-4 font-semibold">Status</th>
                      <th className="pb-2 pr-4 font-semibold">Released</th>
                      <th className="pb-2 text-right font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contract.milestones.map((m) => (
                      <tr key={m.id} className="border-b border-neutral-100 last:border-0">
                        <td className="py-3 pr-4 font-medium text-neutral-900">
                          {m.title}
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              m.status === 'released'
                                ? 'bg-success/10 text-success'
                                : 'bg-neutral-200 text-neutral-600'
                            }`}
                          >
                            {m.status === 'released' ? 'Approved' : m.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-neutral-500">
                          {m.releasedAt
                            ? new Date(m.releasedAt).toLocaleDateString()
                            : '—'}
                        </td>
                        <td className="py-3 text-right font-semibold text-neutral-900">
                          ${m.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ─── Team recap ─── */}
            {team && (
              <section className="rounded-2xl border border-neutral-300 bg-white p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900">
                  <Users className="h-4 w-4 text-primary" />
                  Team Recap
                </h2>
                <div className="space-y-2">
                  {team.members.map((m) => (
                    <div
                      key={m.workerId}
                      className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                          {m.workerName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">
                            {m.workerName}
                            {m.isLead && (
                              <span className="ml-2 rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-medium text-primary">
                                Team Lead
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-neutral-500">{m.roleTitle}</p>
                        </div>
                      </div>
                      <span className="text-xs text-neutral-500">
                        {m.workCount} deliverable{m.workCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ─── Review prompt ─── */}
            <section className="rounded-2xl border border-neutral-300 bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900">
                <Star className="h-4 w-4 text-amber-400" />
                Reviews
              </h2>
              {!myReviewDone ? (
                <div className="rounded-xl border border-primary/30 bg-primary-light/40 p-5">
                  <p className="text-sm font-semibold text-neutral-900">
                    How was your experience with{' '}
                    {isCompany ? contract.workerName : contract.companyName}?
                  </p>
                  <p className="mt-1 text-xs text-neutral-600">
                    Your review will be public on their profile (or submit privately
                    to the platform).
                  </p>
                  <button
                    onClick={() => navigate(`/contracts/${contract.id}/review`)}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
                  >
                    <Star className="h-4 w-4" />
                    Leave a Review
                  </button>
                </div>
              ) : (
                <p className="text-sm text-neutral-600">
                  You&apos;ve submitted your review for this project.{' '}
                  <Link to={`/contracts/${contract.id}/review`} className="text-primary hover:underline">
                    View it
                  </Link>
                  .
                </p>
              )}

              {publicReviews.length > 0 && (
                <div className="mt-4 space-y-3">
                  {publicReviews.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-xl border border-neutral-200 bg-neutral-50 p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">
                            {r.reviewerName}
                          </p>
                          <p className="text-xs text-neutral-500">
                            → {r.revieweeName}
                            {r.teamRating ? ' · Team rated' : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-bold text-neutral-900">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          {r.ratings.overall}
                        </div>
                      </div>
                      {r.comment && (
                        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                          {r.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ─── Payment summary sidebar ─── */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-neutral-300 bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900">
                <Wallet className="h-4 w-4 text-primary" />
                Payment Summary
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Total budget</dt>
                  <dd className="font-semibold text-neutral-900">
                    ${contract.totalAmount.toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Released from escrow</dt>
                  <dd className="font-semibold text-success">
                    ${totalReleased.toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Platform fees (5%)</dt>
                  <dd className="font-semibold text-neutral-900">
                    −${fees.toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-neutral-200 pt-3">
                  <dt className="font-semibold text-neutral-900">Final payout</dt>
                  <dd className="font-bold text-neutral-900">
                    ${finalPayout.toLocaleString()}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-neutral-400">
                {team
                  ? `Broken down per role in ${contract.jobTitle}.`
                  : `Paid to ${contract.workerName}.`}
              </p>
            </section>

            {/* ─── Next steps ─── */}
            <section className="rounded-2xl border border-neutral-300 bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900">
                <MessageSquare className="h-4 w-4 text-primary" />
                Next Steps
              </h2>
              <div className="space-y-3">
                {isCompany ? (
                  <>
                    <Link
                      to="/dashboard/company/jobs/new"
                      className="block rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary-dark"
                    >
                      Post a New Job
                    </Link>
                    <Link
                      to={`/workers/amina-k`}
                      className="block rounded-lg border border-neutral-300 px-4 py-2.5 text-center text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                    >
                      Hire Again — rehire this worker
                    </Link>
                    <Link
                      to="/browse-workers"
                      className="block rounded-lg border border-neutral-300 px-4 py-2.5 text-center text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                    >
                      Browse Workers
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/browse-jobs"
                      className="block rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary-dark"
                    >
                      Browse More Jobs
                    </Link>
                    <Link
                      to="/teams"
                      className="block rounded-lg border border-neutral-300 px-4 py-2.5 text-center text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                    >
                      Browse Teams
                    </Link>
                    <Link
                      to="/dashboard/worker/earnings"
                      className="block rounded-lg border border-neutral-300 px-4 py-2.5 text-center text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                    >
                      View Earnings
                    </Link>
                  </>
                )}
                <Link
                  to={`/contracts/${contract.id}`}
                  className="block text-center text-sm text-primary hover:underline"
                >
                  Back to contract →
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
