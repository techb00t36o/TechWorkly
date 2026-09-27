// Admin activity log for accountability (Admin_Panel.docx §8).
import DashboardLayout from '../../components/DashboardLayout.jsx'
import { useAdmin } from '../../context/AdminContext.jsx'

export default function ActivityLogPage() {
  const { activity } = useAdmin()

  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Admin Activity Log</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Audit trail of verification, user, and moderation actions.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-300 bg-white">
          {activity.length === 0 ? (
            <p className="p-8 text-center text-sm text-neutral-500">No activity yet.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {activity.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-4 px-6 py-4">
                  <div>
                    <p className="text-sm text-neutral-900">{a.action}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {a.adminName} · {a.targetType} #{a.targetId}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-neutral-400">
                    {new Date(a.at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
