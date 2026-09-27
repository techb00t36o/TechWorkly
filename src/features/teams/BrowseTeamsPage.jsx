// Public browse of open/filling team listings (entry into Team-Based Hiring).
import { Link } from 'react-router-dom'
import { useTeams } from '../../context/TeamContext.jsx'
import AppLayout from '../../components/AppLayout.jsx'
import { Users, CalendarDays, BadgeCheck } from 'lucide-react'

export default function BrowseTeamsPage() {
  const { getOpenTeams } = useTeams()
  const teams = getOpenTeams()

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Browse Teams</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Join a multi-role pod under one project — apply per role with escrow-protected contracts.
          </p>
        </div>

        {teams.length === 0 ? (
          <div className="rounded-2xl border border-neutral-300 bg-white p-12 text-center">
            <p className="text-lg font-semibold text-neutral-900">No open teams right now</p>
            <p className="mt-2 text-sm text-neutral-500">Check back soon for new squad openings.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {teams.map((team) => {
              const filled = team.roles.reduce((s, r) => s + r.filled, 0)
              const total = team.roles.reduce((s, r) => s + Number(r.quantity), 0)
              return (
                <Link
                  key={team.id}
                  to={`/teams/${team.id}`}
                  className="rounded-2xl border border-neutral-300 bg-white p-6 transition hover:border-primary hover:shadow-sm"
                >
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
                      {team.companyName[0]}
                    </span>
                    {team.companyName}
                    <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <h2 className="mt-2 text-lg font-semibold text-neutral-900">{team.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{team.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {filled}/{total} seats
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {team.startDate} → {team.deadline}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {team.roles.map((r) => (
                      <span
                        key={r.id}
                        className="rounded-full bg-primary-light px-2 py-0.5 text-[11px] font-medium text-primary"
                      >
                        {r.title}
                      </span>
                    ))}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
