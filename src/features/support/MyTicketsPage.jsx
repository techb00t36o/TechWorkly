// My Tickets list with status badges (Help_Support_Center.docx §6).
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout.jsx'
import { useSupport, ticketStatuses } from '../../context/SupportContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function MyTicketsPage() {
  const { user } = useAuth()
  const { getTicketsByUser } = useSupport()
  const tickets = getTicketsByUser(user?.id ?? 1)

  return (
    <AppLayout>
      <main className="mx-auto w-full max-w-3xl px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">My Tickets</h1>
            <p className="mt-1 text-sm text-neutral-500">Open, in progress, and resolved support requests.</p>
          </div>
          <Link
            to="/help/contact"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            + New ticket
          </Link>
        </div>

        <div className="mt-6 space-y-4">
          {tickets.length === 0 && (
            <div className="rounded-2xl border border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
              No tickets yet.{' '}
              <Link to="/help/contact" className="text-primary hover:underline">
                Contact support
              </Link>
            </div>
          )}
          {tickets.map((t) => (
            <Link
              key={t.id}
              to={`/help/tickets/${t.id}`}
              className="block rounded-2xl border border-neutral-300 bg-white p-6 hover:border-primary"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">{t.subject}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ticketStatuses[t.status]?.badge}`}>
                      {ticketStatuses[t.status]?.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{t.description}</p>
                  <p className="mt-2 text-xs text-neutral-400">
                    #{t.id} · {t.category} · Updated {new Date(t.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm text-primary">Open →</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </AppLayout>
  )
}
