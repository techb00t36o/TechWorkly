// Role-aware contract list with status tabs (company and worker share this page).
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useContracts } from '../../context/ContractContext.jsx'
import DashboardLayout from '../../components/DashboardLayout.jsx'

const statusStyles = {
  pending: 'bg-warning/10 text-warning',
  active: 'bg-primary-light text-primary',
  completed: 'bg-success/10 text-success',
  declined: 'bg-danger/10 text-danger',
}

const sourceLabels = {
  GIG_ORDER: 'Gig Order',
  TEAM_ROLE: 'Team Role',
  JOB: 'Job',
}

export default function ContractsPage() {
  const { user, role } = useAuth()
  const { getContractsByCompany, getContractsByWorker } = useContracts()
  const [tab, setTab] = useState('all')

  // Role determines which side of each contract we list
  const myContracts =
    role === 'worker'
      ? getContractsByWorker(user?.id)
      : getContractsByCompany(user?.id)

  // Tab filter: 'all' returns everything, others match status exactly
  const filtered = myContracts.filter((c) => {
    if (tab === 'gigs') return c.sourceType === 'GIG_ORDER'
    if (tab === 'pending') return c.status === 'pending'
    if (tab === 'active') return c.status === 'active'
    if (tab === 'completed') return c.status === 'completed'
    return true
  })

  const isWorker = role === 'worker'

  return (
    <DashboardLayout role={role || 'company'}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {tab === 'gigs' ? 'My Gig Orders' : 'My Contracts'}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {tab === 'gigs'
              ? 'Instant gig purchases with escrow-backed delivery.'
              : isWorker
                ? 'Track your offers, escrow, and milestone payouts.'
                : 'Manage offers, escrow funding, and milestone approvals.'}
          </p>
        </div>
        {isWorker ? (
          <Link
            to="/browse-jobs"
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Browse Jobs
          </Link>
        ) : (
          <Link
            to="/browse-gigs"
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Browse Gigs
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        {[
          { key: 'all', label: 'All', count: myContracts.length },
          {
            key: 'gigs',
            label: 'Gig Orders',
            count: myContracts.filter((c) => c.sourceType === 'GIG_ORDER').length,
          },
          { key: 'pending', label: 'Offers', count: myContracts.filter((c) => c.status === 'pending').length },
          { key: 'active', label: 'Active', count: myContracts.filter((c) => c.status === 'active').length },
          { key: 'completed', label: 'Completed', count: myContracts.filter((c) => c.status === 'completed').length },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              tab === t.key
                ? 'bg-primary text-white'
                : 'border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Contract list */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-neutral-300 bg-white p-12 text-center">
          <p className="text-lg font-semibold text-neutral-900">
            {tab === 'gigs' ? 'No gig orders yet' : 'No contracts found'}
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            {tab === 'gigs'
              ? 'Order a ready-made service and it will appear here.'
              : tab === 'all'
                ? isWorker
                  ? 'Apply to jobs to receive offers.'
                  : 'Make offers from your job applicants to get started.'
                : `No ${tab} contracts at the moment.`}
          </p>
          <Link
            to={tab === 'gigs' ? '/browse-gigs' : isWorker ? '/browse-jobs' : '/dashboard/company/jobs'}
            className="mt-4 inline-block rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            {tab === 'gigs'
              ? 'Browse Gigs'
              : isWorker
                ? 'Browse Jobs'
                : 'Manage Jobs'}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((contract) => {
            const releasedCount = contract.milestones.filter((m) => m.status === 'released').length
            const counterparty = isWorker ? contract.companyName : contract.workerName
            const source = sourceLabels[contract.sourceType] || 'Job'
            return (
              <Link
                key={contract.id}
                to={`/contracts/${contract.id}`}
                className="block rounded-2xl border border-neutral-300 bg-white p-6 transition hover:border-primary hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                      {counterparty[0]}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-neutral-900">{contract.jobTitle}</h3>
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                          {source}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500">{counterparty}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[contract.status]}`}
                  >
                    {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-4">
                  <div className="flex items-center gap-6 text-sm text-neutral-500">
                    <span>
                      <span className="font-semibold text-neutral-900">
                        ${contract.totalAmount.toLocaleString()}
                      </span>{' '}
                      value
                    </span>
                    <span>
                      <span className="font-semibold text-neutral-900">
                        {releasedCount}/{contract.milestones.length}
                      </span>{' '}
                      milestones
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        contract.escrow.funded ? 'bg-success/10 text-success' : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {contract.escrow.funded ? 'Escrow funded' : 'Escrow unfunded'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-primary">View →</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
