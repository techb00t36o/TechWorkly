// Contact Support: submit a ticket (Help_Support_Center.docx §5).
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../../components/AppLayout.jsx'
import { useSupport, ticketCategories } from '../../context/SupportContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function ContactSupportPage() {
  const navigate = useNavigate()
  const { user, role } = useAuth()
  const { createTicket } = useSupport()

  const [category, setCategory] = useState('other')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [attachments, setAttachments] = useState([])
  const [error, setError] = useState('')

  const toggleAttachment = (name) => {
    setAttachments((a) => (a.includes(name) ? a.filter((x) => x !== name) : [...a, name]))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!subject.trim() || description.trim().length < 10) {
      setError('Add a subject and at least 10 characters of description.')
      return
    }
    const userName =
      user?.name ||
      (role === 'company' ? 'Nimbus Labs' : role === 'admin' ? 'Admin' : 'Amina K.')
    createTicket({
      userId: user?.id ?? 1,
      userName,
      category,
      subject: subject.trim(),
      description: description.trim(),
      attachments,
      now: '2026-09-24T12:00:00Z',
    })
    navigate('/help/tickets')
  }

  return (
    <AppLayout>
      <main className="mx-auto w-full max-w-2xl px-6 py-12">
        <Link to="/help" className="text-sm text-neutral-500 hover:text-primary">
          ← Help Center
        </Link>

        <div className="mt-6 rounded-2xl border border-neutral-300 bg-white p-8">
          <h1 className="text-2xl font-bold text-neutral-900">Contact Support</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Expected response: within 1 business day. For contract issues, prefer Open Dispute on the contract.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                {ticketCategories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            {/* Demo attachments (chips, not real uploads) */}
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Attachments (demo)
              </label>
              <div className="flex flex-wrap gap-2">
                {['screenshot.png', 'statement.pdf', 'email.eml'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleAttachment(f)}
                    className={`rounded-full border px-3 py-1 text-xs ${
                      attachments.includes(f)
                        ? 'border-primary bg-primary-light text-primary'
                        : 'border-neutral-300 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Submit ticket
            </button>
          </form>
        </div>
      </main>
    </AppLayout>
  )
}
