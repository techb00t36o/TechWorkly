// Company's team list with status, seat progress, and entry points per team.
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTeams } from '../../context/TeamContext.jsx'
import DashboardLayout from '../../components/DashboardLayout.jsx'

const statusStyles = {
  open: 'bg-success/10 text-success',
  filling: 'bg-warning/10 text-warning',
  filled: 'bg-neutral-200 text-neutral-600',
  in_progress: 'bg-primary-light text-primary',
  completed: 'bg-success/10 text-success',
}

export default function ManageTeamsPage() {
  const { user } = useAuth()
  const { getTeamsByCompany, getApplicationsByTeam } = useTeams()

  const teams = getTeamsByCompany(user?.id)

  return (
    <DashboardLayout role="company">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Teams</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Track role seats, review applicants, and open workspaces.
          </p>
        </div>
        <Link
          to="/dashboard/company/teams/new"
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          + Create a Team
        </Link>
      </div>

      {teams.length === 0 ? (
        <div className="rounded-2xl border border-neutral-300 bg-white p-12 text-center">
          <p className="text-lg font-semibold text-neutral-900">No teams yet</p>
          <p className="mt-2 text-sm text-neutral-500">
            Assemble a multi-role pod under one project — define roles, budgets, and escrow in one listing.
          </p>
          <Link
            to="/dashboard/company/teams/new"
            className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Create your first team
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {teams.map((team) => {
            const filled = team.roles.reduce((s, r) => s + r.filled, 0)
            const total = team.roles.reduce((s, r) => s + Number(r.quantity), 0)
            const pending = getApplicationsByTeam(team.id).filter((a) => a.status === 'pending').length
            return (
              <div
                key={team.id}
                className="rounded-2xl border border-neutral-300 bg-white p-6 transition hover:border-primary/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-semibold text-neutral-900">{team.title}</h2>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[team.status]}`}>
                        {team.status.replace('_', ' ').charAt(0).toUpperCase() + team.status.replace('_', ' ').slice(1)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">
                      {filled}/{total} seats · {team.roles.length} roles · {team.projectType}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {team.roles.map((r) => (
                        <span
                          key={r.id}
                          className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-600"
                        >
                          {r.title} {r.filled}/{r.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {pending > 0 && (
                      <span className="rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning">
                        {pending} pending applicant{pending !== 1 ? 's' : ''}
                      </span>
                    )}
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link
                        to={`/dashboard/company/teams/${team.id}/applicants`}
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark"
                      >
                        Review Applicants
                      </Link>
                      <Link
                        to={`/teams/${team.id}/workspace`}
                        className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                      >
                        Workspace
                      </Link>
                      <Link
                        to={`/teams/${team.id}`}
                        className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                      >
                        Listing
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
