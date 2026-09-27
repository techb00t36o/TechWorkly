// Admin user management: search, status actions (Admin_Panel.docx §4).
import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import { useAdmin } from '../../context/AdminContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const statusBadge = {
  active: 'bg-success/10 text-success',
  suspended: 'bg-warning/10 text-warning',
  banned: 'bg-danger/10 text-danger',
  pending_review: 'bg-primary-light text-primary',
}

export default function UsersPage() {
  const { user } = useAuth()
  const { searchUsers, updateUserStatus } = useAdmin()
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const base = searchUsers(query)
  const list = roleFilter === 'all' ? base : base.filter((u) => u.role === roleFilter)

  const act = (u, status) => {
    updateUserStatus({
      userId: u.id,
      status,
      adminName: user?.name || 'Admin',
      now: '2026-09-24T12:00:00Z',
    })
  }

  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">User Management</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Search workers and companies; suspend, verify, ban, or restore.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <input
            type="search"
            placeholder="Search name, email, or role…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full max-w-sm rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All roles</option>
            <option value="worker">Workers</option>
            <option value="company">Companies</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-neutral-300 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Flags</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {list.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-neutral-900">{u.name}</p>
                    <p className="text-xs text-neutral-500">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-neutral-600">{u.role}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[u.status] || 'bg-neutral-100 text-neutral-600'}`}>
                      {u.status.replace('_', ' ')}
                    </span>
                    {u.verified && (
                      <span className="ml-1 rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
                        verified
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{u.flags}</td>
                  <td className="px-4 py-3 text-neutral-500">{u.joined}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {u.status !== 'active' && (
                        <button
                          onClick={() => act(u, 'active')}
                          className="rounded border border-success/30 px-2 py-1 text-xs text-success hover:bg-success/10"
                        >
                          Restore
                        </button>
                      )}
                      {u.status === 'active' && (
                        <button
                          onClick={() => act(u, 'suspended')}
                          className="rounded border border-warning/30 px-2 py-1 text-xs text-warning hover:bg-warning/10"
                        >
                          Suspend
                        </button>
                      )}
                      {!u.verified && (
                        <button
                          onClick={() => act(u, 'verified')}
                          className="rounded border border-primary/30 px-2 py-1 text-xs text-primary hover:bg-primary-light"
                        >
                          Verify
                        </button>
                      )}
                      {u.status !== 'banned' && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Ban ${u.name}?`)) act(u, 'banned')
                          }}
                          className="rounded border border-danger/30 px-2 py-1 text-xs text-danger hover:bg-danger/10"
                        >
                          Ban
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                    No users match.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
