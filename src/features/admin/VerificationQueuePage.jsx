// Admin verification queue: approve / reject / request more info (Admin_Panel.docx §2).
import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import { useAdmin } from '../../context/AdminContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const typeLabels = {
  skill: 'Skill Verification',
  identity: 'Identity Verification',
  funds: 'Company Funds Verification',
}

const statusBadge = {
  pending: 'bg-warning/10 text-warning',
  approved: 'bg-success/10 text-success',
  rejected: 'bg-danger/10 text-danger',
  more_info: 'bg-primary-light text-primary',
}

export default function VerificationQueuePage() {
  const { user } = useAuth()
  const { verifications, verifyDecision } = useAdmin()
  const [filter, setFilter] = useState('pending')
  const [notes, setNotes] = useState({})

  const list = verifications.filter((v) => filter === 'all' || v.status === filter)

  const handle = (item, decision) => {
    verifyDecision({
      itemId: item.id,
      decision,
      notes: notes[item.id] || '',
      adminName: user?.name || 'Admin',
      now: '2026-09-24T12:00:00Z',
    })
  }

  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Verification Queue</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Review skill, identity, and company funds submissions.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {['pending', 'approved', 'rejected', 'more_info', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-sm ${
                filter === f
                  ? 'bg-primary text-white'
                  : 'border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {f === 'all' ? 'All' : f === 'more_info' ? 'More info' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {list.length === 0 && (
            <div className="rounded-2xl border border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
              No items in this filter.
            </div>
          )}
          {list.map((item) => (
            <div key={item.id} className="rounded-2xl border border-neutral-300 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-neutral-900">{item.subjectName}</span>
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs capitalize text-neutral-600">
                      {item.subjectRole}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[item.status]}`}>
                      {item.status === 'more_info' ? 'More info' : item.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-700">{typeLabels[item.type]}</p>
                  <p className="mt-0.5 text-sm text-neutral-500">{item.detail}</p>
                  <p className="mt-1 text-xs text-neutral-400">
                    Submitted {new Date(item.submittedAt).toLocaleDateString()}
                  </p>
                  {item.notes && (
                    <p className="mt-2 rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
                      Notes: {item.notes}
                    </p>
                  )}
                </div>
                {item.status === 'pending' && (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Optional notes"
                      value={notes[item.id] || ''}
                      onChange={(e) => setNotes({ ...notes, [item.id]: e.target.value })}
                      className="w-48 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handle(item, 'approve')}
                        className="rounded-lg bg-success px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handle(item, 'reject')}
                        className="rounded-lg bg-danger px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handle(item, 'more_info')}
                        className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                      >
                        More info
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
