// Fraud/spam + content moderation queue (Admin_Panel.docx §5–6).
import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import { useAdmin } from '../../context/AdminContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const kindTabs = [
  { key: 'all', label: 'All' },
  { key: 'listing', label: 'Listings' },
  { key: 'application', label: 'Applications' },
  { key: 'message', label: 'Messages' },
  { key: 'review', label: 'Reviews' },
  { key: 'profile', label: 'Profiles' },
]

const kindBadge = {
  listing: 'bg-primary-light text-primary',
  application: 'bg-info/10 text-info',
  message: 'bg-warning/10 text-warning',
  review: 'bg-success/10 text-success',
  profile: 'bg-neutral-100 text-neutral-600',
}

export default function ModerationPage() {
  const { user } = useAuth()
  const { flags, resolveFlag } = useAdmin()
  const [kind, setKind] = useState('all')
  const [statusFilter, setStatusFilter] = useState('open')

  const list = flags.filter(
    (f) =>
      (kind === 'all' || f.kind === kind) &&
      (statusFilter === 'all' || f.status === statusFilter),
  )

  const act = (flag, status, resolution) => {
    resolveFlag({
      flagId: flag.id,
      status,
      resolution,
      adminName: user?.name || 'Admin',
      now: '2026-09-24T12:00:00Z',
    })
  }

  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Fraud, Spam & Content Moderation</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Flagged listings, applications, messages, reviews, and profiles.
          </p>
        </div>

        {/* Kind tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {kindTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setKind(t.key)}
              className={`rounded-full px-3 py-1.5 text-sm ${
                kind === t.key
                  ? 'bg-primary text-white'
                  : 'border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="mb-6 flex gap-2">
          {['open', 'resolved', 'all'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1 text-xs ${
                statusFilter === s
                  ? 'bg-neutral-900 text-white'
                  : 'border border-neutral-300 bg-white text-neutral-600'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {list.length === 0 && (
            <div className="rounded-2xl border border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
              No flags in this view.
            </div>
          )}
          {list.map((f) => (
            <div key={f.id} className="rounded-2xl border border-neutral-300 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${kindBadge[f.kind]}`}>
                      {f.kind}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        f.status === 'open' ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'
                      }`}
                    >
                      {f.status}
                    </span>
                  </div>
                  <p className="mt-2 font-semibold text-neutral-900">{f.title}</p>
                  <p className="mt-0.5 text-sm text-neutral-600">{f.reason}</p>
                  <p className="mt-1 text-xs text-neutral-400">
                    Target: {f.targetLabel} · Reported {new Date(f.at).toLocaleDateString()}
                  </p>
                  {f.resolution && (
                    <p className="mt-2 text-xs text-success">Resolved: {f.resolution}</p>
                  )}
                </div>
                {f.status === 'open' && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => act(f, 'resolved', 'Removed content')}
                      className="rounded-lg bg-danger px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                    >
                      Remove listing
                    </button>
                    <button
                      onClick={() => act(f, 'resolved', 'Warned user')}
                      className="rounded-lg border border-warning/30 px-3 py-1.5 text-xs font-medium text-warning hover:bg-warning/10"
                    >
                      Warn user
                    </button>
                    <button
                      onClick={() => act(f, 'resolved', 'Escalated to Trust & Safety')}
                      className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                    >
                      Escalate
                    </button>
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
