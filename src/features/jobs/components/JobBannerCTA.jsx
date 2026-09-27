import { Link2 } from 'lucide-react'

export default function JobBannerCTA() {
  return (
    <div className="flex flex-col gap-6 border border-neutral-300 bg-white p-8 rounded-xl shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex shrink-0 items-center justify-center rounded-xl bg-primary-light p-3 text-primary">
          <Link2 className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-neutral-900">
            Don&apos;t see the exact fit for your domain?
          </h3>
          <p className="mt-1 max-w-xl text-sm text-neutral-600">
            Publish your availability, verified code repositories, and escrow payout terms.
            Institutional clients and turnkey squad leaders search and extend direct contracts
            to pre-vetted engineers daily.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 gap-3">
        <button
          type="button"
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Complete Specialist Profile
        </button>
        <button
          type="button"
          className="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
        >
          Assemble a Squad
        </button>
      </div>
    </div>
  )
}
