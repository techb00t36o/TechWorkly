// Company dashboard showing stats, recent activity, and quick action links.
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import DashboardLayout from '../../components/DashboardLayout.jsx'

const stats = [
  { label: 'Active Jobs', value: '3', change: '2 hiring, 1 in progress', color: 'primary' },
  { label: 'Workers Hired', value: '8', change: '3 this month', color: 'success' },
  { label: 'Pending Payments', value: '$3,500', change: '4 milestones', color: 'warning' },
  { label: 'Completed Projects', value: '6', change: '95% on-time', color: 'info' },
]

const recentActivity = [
  { type: 'application', text: 'New application from Amina K. for Frontend Dev role', time: '1 hour ago' },
  { type: 'milestone', text: 'Backend API milestone approved for E-commerce project', time: '5 hours ago' },
  { type: 'hire', text: 'David R. accepted your offer for QA Engineer role', time: '1 day ago' },
  { type: 'payment', text: '$800 escrow released for Security audit milestone', time: '2 days ago' },
]

const quickActions = [
  { label: 'Post a Job', path: '/dashboard/company/jobs/new', icon: 'plus' },
  { label: 'Browse Gigs', path: '/browse-gigs', icon: 'package' },
  { label: 'Create a Team', path: '/dashboard/company/teams/new', icon: 'users' },
  { label: 'My Teams', path: '/dashboard/company/teams', icon: 'building' },
  { label: 'My Contracts', path: '/dashboard/company/contracts', icon: 'contract' },
  { label: 'Messages', path: '/messages', icon: 'chat' },
  { label: 'Browse Workers', path: '/browse-workers', icon: 'users' },
  { label: 'Balance & Billing', path: '/dashboard/company/balance', icon: 'dollar' },
  { label: 'Transactions', path: '/dashboard/transactions', icon: 'receipt' },
  { label: 'Company Profile', path: '/account', icon: 'building' },
]

export default function CompanyDashboard() {
  const { user, profile } = useAuth()

  return (
    <DashboardLayout role="company">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {profile.name || user?.name || 'Company'} Dashboard
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage your jobs, teams, and hiring.
          </p>
        </div>
        <Link
          to="/dashboard/company/jobs/new"
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          + Post a Job
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-neutral-300 bg-white p-6">
            <p className="text-sm text-neutral-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900">{stat.value}</p>
            <p className={`mt-1 text-xs font-medium text-${stat.color}`}>{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-300 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                {/* Activity dot color: green for payments/milestones (success), blue for hires, teal for applications */}
                <div className={`mt-0.5 flex h-2 w-2 shrink-0 rounded-full ${
                  item.type === 'payment' || item.type === 'milestone' ? 'bg-success' :
                  item.type === 'hire' ? 'bg-primary' :
                  item.type === 'application' ? 'bg-info' : 'bg-neutral-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-neutral-700">{item.text}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-neutral-300 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className="flex items-center gap-3 rounded-xl border border-neutral-300 p-4 transition hover:border-primary hover:bg-primary-light"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                  {action.icon === 'plus' && (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  )}
                  {action.icon === 'dollar' && (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {action.icon === 'receipt' && (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                    </svg>
                  )}
                  {action.icon === 'users' && (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  )}
                  {action.icon === 'building' && (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                    </svg>
                  )}
                  {action.icon === 'contract' && (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  )}
                  {action.icon === 'chat' && (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-semibold text-neutral-900">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
