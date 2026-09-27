// Worker My Gigs: manage listings + incoming gig orders (Phase 4).
import { Link } from 'react-router-dom'
import { Plus, Star, Package, ExternalLink } from 'lucide-react'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import { useGigs } from '../../context/GigContext.jsx'
import { useContracts } from '../../context/ContractContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const statusBadge = {
  active: 'bg-primary-light text-primary',
  completed: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
}

export default function ManageGigsPage() {
  const { user } = useAuth()
  const { getGigsByWorker, orders, deleteGig } = useGigs()
  const { getContractById } = useContracts()

  // Demo: user id 1 owns Amina's seeded gigs; non-id-1 still sees worker 1 gigs for demo
  const workerId = user?.id || 1
  const myGigs = getGigsByWorker(workerId)
  const myOrders = orders.filter(
    (o) => String(o.workerId) === String(workerId) || String(o.workerId) === '1',
  )

  return (
    <DashboardLayout role="worker">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Gigs</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage service packages and track incoming orders.
          </p>
        </div>
        <Link
          to="/dashboard/worker/gigs/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" />
          Post a Gig
        </Link>
      </div>

      {/* Listings */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Active listings
        </h2>
        {myGigs.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-neutral-300 bg-white p-10 text-center">
            <Package className="mx-auto h-10 w-10 text-neutral-300" />
            <p className="mt-3 font-semibold text-neutral-900">No gigs yet</p>
            <p className="mt-1 text-sm text-neutral-500">
              Package a skill into fixed tiers and start selling.
            </p>
            <Link
              to="/dashboard/worker/gigs/new"
              className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Create your first gig
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myGigs.map((gig) => (
              <div
                key={gig.id}
                className="overflow-hidden rounded-2xl border border-neutral-300 bg-white"
              >
                <img src={gig.image} alt="" className="h-32 w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/gigs/${gig.id}`}
                      className="font-semibold text-neutral-900 hover:text-primary"
                    >
                      {gig.title}
                    </Link>
                    <span className="flex items-center gap-0.5 text-xs text-neutral-500">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      {gig.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    {gig.ordersCompleted} orders · from $
                    {Math.min(...gig.packages.map((p) => p.price))}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Link
                      to={`/gigs/${gig.id}`}
                      className="flex-1 rounded-lg border border-neutral-300 px-2 py-1.5 text-center text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                    >
                      <ExternalLink className="mr-1 inline h-3 w-3" />
                      View
                    </Link>
                    <Link
                      to={`/dashboard/worker/gigs/${gig.id}/edit`}
                      className="flex-1 rounded-lg border border-neutral-300 px-2 py-1.5 text-center text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this gig?')) deleteGig(gig.id)
                      }}
                      className="rounded-lg border border-danger/30 px-2 py-1.5 text-xs font-medium text-danger hover:bg-danger/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Incoming orders */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Incoming orders
        </h2>
        {myOrders.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
            No orders yet — they appear here when a company checks out.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-neutral-300 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 text-xs uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="px-4 py-3">Gig</th>
                  <th className="px-4 py-3">Buyer</th>
                  <th className="px-4 py-3">Package</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Workspace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {myOrders.map((o) => {
                  const contract = getContractById(o.contractId)
                  return (
                    <tr key={o.id}>
                      <td className="px-4 py-3 font-medium text-neutral-900">
                        {contract?.jobTitle || o.gigId}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">{o.companyName}</td>
                      <td className="px-4 py-3 capitalize text-neutral-600">{o.packageTier}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            statusBadge[contract?.status || o.status] || statusBadge.pending
                          }`}
                        >
                          {contract?.status || o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/contracts/${o.contractId}`}
                          className="text-primary hover:underline"
                        >
                          Open →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </DashboardLayout>
  )
}
