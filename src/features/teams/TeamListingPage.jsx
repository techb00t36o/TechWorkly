// Public team listing: per-role cards with escrow indicators and apply CTAs.
import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTeams } from '../../context/TeamContext.jsx'
import { useNotifications } from '../../context/NotificationContext.jsx'
import AppLayout from '../../components/AppLayout.jsx'
import { BadgeCheck, Users, CalendarDays, Wallet } from 'lucide-react'

const statusStyles = {
  open: 'bg-success/10 text-success',
  filling: 'bg-warning/10 text-warning',
  filled: 'bg-neutral-200 text-neutral-600',
  in_progress: 'bg-primary-light text-primary',
  completed: 'bg-success/10 text-success',
}

function timeAgo(dateString) {
  const days = Math.floor((Date.now() - new Date(dateString)) / 86400000)
  if (days < 1) return 'Today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

export default function TeamListingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getTeamById, applyToRole, hasApplied, getApplicationsByTeam } = useTeams()
  const { addNotification } = useNotifications()
  const [coverForRole, setCoverForRole] = useState(null)
  const [coverMessage, setCoverMessage] = useState('')

  const team = getTeamById(id)

  if (!team) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-2xl rounded-2xl border border-neutral-300 bg-white p-12 text-center">
          <p className="text-lg font-semibold text-neutral-900">Team not found</p>
          <Link to="/browse-companies" className="mt-4 inline-block text-sm text-primary hover:underline">
            Browse companies
          </Link>
        </div>
      </AppLayout>
    )
  }

  const isOwner = String(team.companyId) === String(user?.id)
  const filledSeats = team.roles.reduce((s, r) => s + r.filled, 0)
  const totalSeats = team.roles.reduce((s, r) => s + Number(r.quantity), 0)
  const teamApplications = getApplicationsByTeam(team.id)

  const handleApply = (role) => {
    if (!user) {
      navigate('/login')
      return
    }
    if (role !== 'worker') {
      // Companies manage their own teams; workers apply per role
      if (isOwner) {
        navigate(`/dashboard/company/teams/${team.id}/applicants`)
      }
      return
    }
    if (!coverMessage.trim()) return
    applyToRole({
      teamId: team.id,
      roleId: coverForRole.id,
      workerId: user.id,
      workerName: user.name || 'Worker',
      skills: coverForRole.skills,
      coverMessage: coverMessage.trim(),
    })
    addNotification({
      type: 'application',
      title: 'Team application received',
      body: `You applied for ${coverForRole.title} on ${team.title}.`,
      link: `/teams/${team.id}`,
      recipientId: team.companyId,
    })
    setCoverForRole(null)
    setCoverMessage('')
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 rounded-2xl border border-neutral-300 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-semibold text-white">
                  {team.companyName[0]}
                </div>
                <div>
                  <Link
                    to={`/companies/${team.companyName.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center gap-1 text-sm font-medium text-neutral-700 hover:text-primary"
                  >
                    {team.companyName}
                    <BadgeCheck className="h-4 w-4 text-primary" />
                  </Link>
                  <p className="text-xs text-neutral-400">Posted {timeAgo(team.createdAt)}</p>
                </div>
              </div>
              <h1 className="mt-4 text-2xl font-bold text-neutral-900">{team.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[team.status]}`}>
                  {team.status.replace('_', ' ').charAt(0).toUpperCase() + team.status.replace('_', ' ').slice(1)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {filledSeats}/{totalSeats} seats filled
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  {team.startDate} → {team.deadline}
                </span>
              </div>
            </div>
            {isOwner && (
              <div className="flex flex-col gap-2">
                <Link
                  to={`/dashboard/company/teams/${team.id}/applicants`}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  Review Applicants ({teamApplications.filter((a) => a.status === 'pending').length})
                </Link>
                <Link
                  to={`/teams/${team.id}/workspace`}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Open Workspace
                </Link>
              </div>
            )}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600">{team.description}</p>
          <p className="mt-3 text-xs text-neutral-500">
            {team.projectType} · {team.title}
          </p>
        </div>

        {/* Roles Needed */}
        <div className="mb-6 rounded-2xl border border-neutral-300 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Roles Needed</h2>
          <div className="space-y-4">
            {team.roles.map((role) => {
              const filled = role.filled >= role.quantity
              const applied = user && hasApplied(team.id, role.id, user.id)
              return (
                <div
                  key={role.id}
                  className={`rounded-xl border p-5 transition ${
                    filled ? 'border-neutral-200 bg-neutral-50' : 'border-neutral-300 hover:border-primary/40'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-neutral-900">{role.title}</h3>
                        {role.subCategory && (
                          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                            {role.subCategory}
                          </span>
                        )}
                        <span className="text-xs text-neutral-500">
                          {role.filled} of {role.quantity} filled
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">{role.experience} level</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {role.skills.map((s) => (
                          <span
                            key={s}
                            className="rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-medium text-primary"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1 text-sm font-semibold text-neutral-900">
                        <Wallet className="h-4 w-4 text-neutral-400" />
                        ${Number(role.budget).toLocaleString()}
                        {role.budgetType === 'hourly' ? '/hr' : ''}
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          role.escrowFunded ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                        }`}
                      >
                        {role.escrowFunded ? 'Escrow funded' : 'Escrow pending'}
                      </span>
                      {!filled && !isOwner && (
                        applied ? (
                          <span className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-500">
                            Applied
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              if (!user) {
                                navigate('/login')
                                return
                              }
                              setCoverForRole(role)
                              setCoverMessage('')
                            }}
                            className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark"
                          >
                            Apply for this Role
                          </button>
                        )
                      )}
                      {!filled && isOwner && (
                        <span className="text-xs font-medium text-primary">
                          {teamApplications.filter((a) => a.roleId === role.id && a.status === 'pending').length} pending
                        </span>
                      )}
                      {!filled && isOwner && (
                        <span className="text-xs font-medium text-primary">
                          {teamApplications.filter((a) => a.roleId === role.id && a.status === 'pending').length} pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Team Formed So Far */}
        {team.members.length > 0 && (
          <div className="mb-6 rounded-2xl border border-neutral-300 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">Team Formed So Far</h2>
            <div className="flex flex-wrap gap-3">
              {team.members.map((m) => (
                <div
                  key={`${m.workerId}-${m.roleId}`}
                  className="flex items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
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
              ))}
            </div>
          </div>
        )}

        {/* Apply modal */}
        {coverForRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6">
              <h3 className="text-lg font-semibold text-neutral-900">
                Apply — {coverForRole.title}
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                Tell the company why you're a fit for this seat on {team.title}.
              </p>
              <textarea
                value={coverMessage}
                onChange={(e) => setCoverMessage(e.target.value)}
                rows={5}
                placeholder="Cover message..."
                className="mt-4 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
              />
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setCoverForRole(null)}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApply('worker')}
                  disabled={!coverMessage.trim()}
                  className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-40"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
