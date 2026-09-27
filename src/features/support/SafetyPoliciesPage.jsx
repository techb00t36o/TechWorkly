// Safety & policies + report a problem (Help_Support_Center.docx §7).
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../../components/AppLayout.jsx'
import { useSupport } from '../../context/SupportContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const policies = [
  { title: 'Terms of Service', desc: 'Platform rules for accounts, payments, and acceptable use.' },
  { title: 'Privacy Policy', desc: 'How we collect, use, and protect personal data.' },
  { title: 'Community Guidelines', desc: 'Behavior standards, on-platform chat rules, and moderation.' },
]

export default function SafetyPoliciesPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createTicket } = useSupport()
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleReport = (e) => {
    e.preventDefault()
    if (description.trim().length < 10) {
      setError('Describe the problem in at least 10 characters.')
      return
    }
    createTicket({
      userId: user?.id ?? 1,
      userName: user?.name || 'Amina K.',
      category: 'bug',
      subject: 'Report a problem',
      description: description.trim(),
      attachments: [],
      now: '2026-09-24T12:00:00Z',
    })
    setSent(true)
    setError('')
    setDescription('')
  }

  return (
    <AppLayout>
      <main className="mx-auto w-full max-w-2xl px-6 py-12">
        <Link to="/help" className="text-sm text-neutral-500 hover:text-primary">
          ← Help Center
        </Link>

        <h1 className="mt-6 text-2xl font-bold text-neutral-900">Safety & Policies</h1>
        <p className="mt-1 text-sm text-neutral-500">
          For contract disagreements use Open Dispute; use Report a problem for bugs and abuse.
        </p>

        {/* Policy links */}
        <div className="mt-6 space-y-3">
          {policies.map((p) => (
            <div key={p.title} className="rounded-xl border border-neutral-300 bg-white p-5">
              <p className="font-semibold text-neutral-900">{p.title}</p>
              <p className="mt-1 text-sm text-neutral-600">{p.desc}</p>
              <button className="mt-2 text-sm text-primary hover:underline" type="button">
                Read (demo) →
              </button>
            </div>
          ))}
        </div>

        {/* Report a problem */}
        <div className="mt-8 rounded-2xl border border-warning/30 bg-warning/5 p-6">
          <h2 className="text-lg font-semibold text-neutral-900">Report a problem</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Platform bugs, abuse, or safety concerns (not contract disputes).
          </p>
          {sent ? (
            <div className="mt-4 rounded-xl bg-success/10 p-4 text-sm text-success">
              Report submitted as a support ticket.{' '}
              <button type="button" onClick={() => navigate('/help/tickets')} className="font-semibold underline">
                View tickets
              </button>
            </div>
          ) : (
            <form onSubmit={handleReport} className="mt-4 space-y-3">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="What happened? Steps to reproduce if it's a bug…"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
              {error && <p className="text-sm text-danger">{error}</p>}
              <button
                type="submit"
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                Submit report
              </button>
            </form>
          )}
        </div>

        {/* Quick links */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            to="/help"
            className="rounded-xl border border-neutral-300 bg-white p-4 text-center text-sm font-medium text-neutral-700 hover:border-primary"
          >
            Browse FAQs
          </Link>
          <Link
            to="/help/contact"
            className="rounded-xl border border-neutral-300 bg-white p-4 text-center text-sm font-medium text-neutral-700 hover:border-primary"
          >
            Contact Support
          </Link>
        </div>
      </main>
    </AppLayout>
  )
}
