// Company view: role tabs + applicant cards with shortlist / reject / hire.
// Hire confirms role + escrow, creates a TEAM_ROLE contract, and fills the seat.
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTeams } from '../../context/TeamContext.jsx'
import { useContracts } from '../../context/ContractContext.jsx'
import { useNotifications } from '../../context/NotificationContext.jsx'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import { BadgeCheck, Star, Briefcase } from 'lucide-react'

const statusStyles = {
  pending: 'bg-warning/10 text-warning',
  shortlisted: 'bg-primary-light text-primary',
  rejected: 'bg-danger/10 text-danger',
  hired: 'bg-success/10 text-success',
}

export default function ApplicantsReviewPage() {
  const { id } = useParams()
  const {
    getTeamById,
    getApplicationsByRole,
    updateApplicationStatus,
    hireApplication,
    fundRoleEscrow,
  } = useTeams()
  const { createOffer } = useContracts()
  const { addNotification } = useNotifications()

  const [activeRoleId, setActiveRoleId] = useState(null)
  const [sortBy, setSortBy] = useState('newest')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [hireTarget, setHireTarget] = useState(null) // { application, role }
  const [expandedId, setExpandedId] = useState(null)

  const team = getTeamById(id)

  if (!team) {
    return (
      <DashboardLayout role="company">
        <div className="mx-auto max-w-2xl rounded-2xl border border-neutral-300 bg-white p-12 text-center">
          <p className="text-lg font-semibold text-neutral-900">Team not found</p>
          <Link to="/dashboard/company/teams" className="mt-4 inline-block text-sm text-primary hover:underline">
            Back to teams
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const filledSeats = team.roles.reduce((s, r) => s + r.filled, 0)
  const totalSeats = team.roles.reduce((s, r) => s + Number(r.quantity), 0)
  const selectedRole = activeRoleId
    ? team.roles.find((r) => r.id === activeRoleId)
    : team.roles[0]
  const applications = selectedRole ? getApplicationsByRole(team.id, selectedRole.id) : []

  // Sort + filter within the active role tab
  let sorted = [...applications]
  if (verifiedOnly) sorted = sorted.filter((a) => a.verified)
  if (sortBy === 'rating') sorted.sort((a, b) => b.rating - a.rating)
  else if (sortBy === 'experience') sorted.sort((a, b) => b.jobsCompleted - a.jobsCompleted)
  else sorted.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))

  const handleShortlist = (app) => {
    updateApplicationStatus(app.id, 'shortlisted')
    addNotification({
      type: 'application',
      title: 'Shortlisted',
      body: `You were shortlisted for ${selectedRole.title} on ${team.title}.`,
      link: `/teams/${team.id}`,
      recipientId: app.workerId,
    })
  }

  const handleReject = (app) => {
    if (!window.confirm(`Reject ${app.workerName}'s application?`)) return
    updateApplicationStatus(app.id, 'rejected')
  }

  const confirmHire = () => {
    const { application, role } = hireTarget
    // Escrow-first: fund the role seat if not already funded
    if (!role.escrowFunded) fundRoleEscrow(team.id, role.id)

    const contractId = createOffer({
      sourceType: 'TEAM_ROLE',
      teamId: team.id,
      teamRoleId: role.id,
      jobId: team.id,
      jobTitle: `${role.title} — ${team.title}`,
      companyId: team.companyId,
      companyName: team.companyName,
      workerId: application.workerId,
      workerName: application.workerName,
      totalAmount: Number(role.budget),
      status: 'active',
      escrow: { funded: true, fundedAt: new Date().toISOString() },
      milestones: [
        {
          id: `tm-hire-${application.id}`,
          title: `${role.title} — full engagement`,
          amount: Number(role.budget),
          dueDate: team.deadline,
          status: 'pending',
          submittedAt: null,
          releasedAt: null,
        },
      ],
      message: `Hired for the ${role.title} seat on ${team.title}. Escrow funded — welcome to the team.`,
    })

    hireApplication(application.id, contractId)
    addNotification({
      type: 'application',
      title: 'Hired for team role',
      body: `You were hired as ${role.title} on ${team.title}. Escrow is funded.`,
      link: `/contracts/${contractId}`,
      recipientId: application.workerId,
    })
    setHireTarget(null)
  }

  const openHire = (app, role) => {
    if (role.filled >= role.quantity) {
      if (!window.confirm('This role is already full. Hire anyway (overfill)?')) return
    }
    setHireTarget({ application: app, role })
  }

  return (
    <DashboardLayout role="company">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            to="/dashboard/company/teams"
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Teams
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">{team.title}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {filledSeats} of {totalSeats} roles filled
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/teams/${team.id}/workspace`}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Team Workspace
          </Link>
          <Link
            to={`/teams/${team.id}`}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            View Listing
          </Link>
        </div>
      </div>

      {/* Role tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {team.roles.map((role) => {
          const pendingCount = getApplicationsByRole(team.id, role.id).filter(
            (a) => a.status === 'pending' || a.status === 'shortlisted',
          ).length
          const isActive = selectedRole?.id === role.id
          return (
            <button
              key={role.id}
              onClick={() => setActiveRoleId(role.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-primary text-white'
                  : 'border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {role.title} ({role.filled}/{role.quantity})
              {pendingCount > 0 && (
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-primary-light text-primary'
                  }`}
                >
                  {pendingCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-4 rounded-xl border border-neutral-300 bg-white px-4 py-3">
        <label className="flex items-center gap-2 text-sm text-neutral-600">
          Sort
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-neutral-300 px-2 py-1 text-sm focus:border-primary focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="rating">Highest Rated</option>
            <option value="experience">Most Experienced</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-600">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
          />
          Verified only
        </label>
      </div>

      {/* Applicant list */}
      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-neutral-300 bg-white p-12 text-center">
          <p className="text-lg font-semibold text-neutral-900">No applicants yet</p>
          <p className="mt-2 text-sm text-neutral-500">
            Applications for {selectedRole?.title} will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((app) => (
            <div key={app.id} className="rounded-2xl border border-neutral-300 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                    {app.workerName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-neutral-900">{app.workerName}</p>
                      {app.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[app.status]}`}
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-warning" />
                        {app.rating}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" />
                        {app.jobsCompleted} jobs
                      </span>
                      <span>{app.rate}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {app.skills.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-primary-light px-2 py-0.5 text-[11px] font-medium text-primary"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    {expandedId === app.id ? 'Hide' : 'View Details'}
                  </button>
                  {app.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleShortlist(app)}
                        className="rounded-lg border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary-light"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleReject(app)}
                        className="rounded-lg border border-danger/30 px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/10"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {app.status !== 'hired' && app.status !== 'rejected' && (
                    <button
                      onClick={() => openHire(app, selectedRole)}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark"
                    >
                      Hire for {selectedRole.title}
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded detail */}
              {expandedId === app.id && (
                <div className="mt-4 border-t border-neutral-200 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Cover message
                  </p>
                  <p className="mt-1 text-sm text-neutral-700">{app.coverMessage}</p>
                  <div className="mt-3 flex gap-6 text-sm">
                    <div>
                      <p className="text-xs text-neutral-500">Proposed rate</p>
                      <p className="font-semibold text-neutral-900">{app.rate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Applied</p>
                      <p className="font-semibold text-neutral-900">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Role budget</p>
                      <p className="font-semibold text-neutral-900">
                        ${Number(selectedRole.budget).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/workers/${app.workerName.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')}`}
                    className="mt-3 inline-block text-sm text-primary hover:underline"
                  >
                    View full profile →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Hire confirmation */}
      {hireTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h3 className="text-lg font-semibold text-neutral-900">Confirm hire</h3>
            <div className="mt-4 space-y-3 rounded-xl bg-neutral-100 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Role</span>
                <span className="font-semibold text-neutral-900">{hireTarget.role.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Worker</span>
                <span className="font-semibold text-neutral-900">
                  {hireTarget.application.workerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Rate</span>
                <span className="font-semibold text-neutral-900">
                  {hireTarget.application.rate}
                </span>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-2">
                <span className="text-neutral-500">Escrow for this seat</span>
                <span className="font-semibold text-success">
                  ${Number(hireTarget.role.budget).toLocaleString()}
                  {hireTarget.role.escrowFunded ? ' (already funded)' : ' (will fund now)'}
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-neutral-500">
              Hiring creates a TEAM_ROLE contract, fills one seat, and adds the worker to the Team Workspace.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setHireTarget(null)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmHire}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                Confirm & Hire
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
