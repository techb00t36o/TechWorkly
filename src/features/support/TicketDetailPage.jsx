// Ticket detail thread — chat-like conversation with Support.
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AppLayout from '../../components/AppLayout.jsx'
import { useSupport, ticketStatuses } from '../../context/SupportContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function TicketDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { getTicketById, addTicketMessage } = useSupport()
  const [body, setBody] = useState('')

  const ticket = getTicketById(id)

  if (!ticket) {
    return (
      <AppLayout>
        <main className="mx-auto max-w-2xl px-6 py-16 text-center">
          <p className="text-lg font-semibold text-neutral-900">Ticket not found</p>
          <Link to="/help/tickets" className="mt-4 inline-block text-sm text-primary hover:underline">
            Back to tickets
          </Link>
        </main>
      </AppLayout>
    )
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!body.trim()) return
    addTicketMessage({
      ticketId: ticket.id,
      from: 'user',
      fromName: user?.name || ticket.userName,
      body: body.trim(),
      now: '2026-09-24T12:00:00Z',
    })
    setBody('')
  }

  return (
    <AppLayout>
      <main className="mx-auto w-full max-w-2xl px-6 py-12">
        <Link to="/help/tickets" className="text-sm text-neutral-500 hover:text-primary">
          ← My Tickets
        </Link>

        <div className="mt-6 rounded-2xl border border-neutral-300 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-neutral-900">{ticket.subject}</h1>
              <p className="mt-1 text-sm text-neutral-500">
                #{ticket.id} · {ticket.category} · Opened {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${ticketStatuses[ticket.status]?.badge}`}>
              {ticketStatuses[ticket.status]?.label}
            </span>
          </div>

          {/* Thread */}
          <div className="mt-6 space-y-4">
            {ticket.messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-xl p-4 ${
                  m.from === 'support'
                    ? 'bg-primary-light'
                    : 'bg-neutral-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-700">
                    {m.from === 'support' ? 'Support' : m.fromName}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {new Date(m.at).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-sm text-neutral-800">{m.body}</p>
              </div>
            ))}
          </div>

          {ticket.status !== 'resolved' && (
            <form onSubmit={handleSend} className="mt-6 flex gap-2">
              <input
                type="text"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Reply to support…"
                className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                Send
              </button>
            </form>
          )}
        </div>
      </main>
    </AppLayout>
  )
}
