// Admin dashboard: stats, alerts, and quick links (Admin_Panel.docx §1).
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import { useAdmin } from '../../context/AdminContext.jsx'
import { useDisputes } from '../../context/DisputeContext.jsx'
import { useSupport } from '../../context/SupportContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminDashboard() {
  const { profile, user } = useAuth()
  const { getStats, getOpenFlags, getPendingVerifications } = useAdmin()
  const { getAdminQueue, getOpenDisputes } = useDisputes()
  const { getOpenTickets } = useSupport()

  const stats = getStats()
  const adminQueue = getAdminQueue()
  const openDisputes = getOpenDisputes()
  const openFlags = getOpenFlags()
  const pendingVerifications = getPendingVerifications()
  const openTickets = getOpenTickets()

  const cards = [
    { label: 'Pending verifications', value: stats.pendingVerifications, path: '/dashboard/admin/verifications', color: 'warning' },
    { label: 'Open / review disputes', value: openDisputes.length + adminQueue.length, path: '/dashboard/admin/disputes', color: 'danger' },
    { label: 'Flagged items', value: openFlags.length, path: '/dashboard/admin/moderation', color: 'primary' },
    { label: 'Open tickets', value: openTickets.length, path: '/help/tickets', color: 'info' },
  ]

  const alerts = [
    adminQueue.length > 0 && `${adminQueue.length} dispute(s) awaiting admin review`,
    pendingVerifications.length > 0 && `${pendingVerifications.length} verification(s) in queue`,
    openFlags.length > 0 && `${openFlags.length} content flag(s) open`,
    openTickets.length > 0 && `${openTickets.length} support ticket(s) open`,
  ].filter(Boolean)

  const quickActions = [
    { label: 'Verification Queue', path: '/dashboard/admin/verifications' },
    { label: 'Dispute Management', path: '/dashboard/admin/disputes' },
    { label: 'User Management', path: '/dashboard/admin/users' },
    { label: 'Fraud & Spam Review', path: '/dashboard/admin/moderation' },
    { label: 'Activity Log', path: '/dashboard/admin/activity' },
    { label: 'Help Center', path: '/help' },
  ]

  return (
    <DashboardLayout role="admin">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {profile.name || user?.name || 'Admin'} Dashboard
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Platform operations: verifications, disputes, moderation, and support.
          </p>
        </div>
        <Link
          to="/dashboard/admin/disputes"
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Review Disputes
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((stat) => (
          <Link
            key={stat.label}
            to={stat.path}
            className="rounded-2xl border border-neutral-300 bg-white p-6 hover:border-primary"
          >
            <p className="text-sm text-neutral-500">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold text-${stat.color}`}>{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Alerts */}
      <div className="mb-8 rounded-2xl border border-warning/30 bg-warning/5 p-6">
        <h2 className="text-lg font-semibold text-neutral-900">Quick alerts</h2>
        {alerts.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-500">Nothing urgent right now.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {alerts.map((a) => (
              <li key={a} className="flex items-center gap-2 text-sm text-neutral-700">
                <span className="h-2 w-2 rounded-full bg-warning" />
                {a}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl border border-neutral-300 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="rounded-xl border border-neutral-300 p-4 text-sm font-medium text-neutral-700 hover:border-primary hover:bg-primary-light"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
