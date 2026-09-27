// Right sidebar with engagement terms, pod CTA, trust seal, and similar specialists.
import {
  Shield,
  Star,
  Users,
  ArrowRight,
  DollarSign,
  Calendar,
  AlertTriangle,
  Clock,
  TrendingUp,
} from "lucide-react";

export default function WorkerSidebar({ worker }) {
  return (
    <div className="space-y-6">
      {/* Engagement Terms */}
      <div className="rounded-2xl border border-neutral-300 bg-white p-5">
        <h3 className="mb-3 text-sm font-bold text-neutral-900">
          Engagement Terms
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
            <span className="flex items-center gap-1.5 text-xs text-neutral-500">
              <DollarSign className="h-3 w-3" /> Hourly Rate
            </span>
            <span className="text-sm font-bold text-neutral-900">
              {worker.engagementTerms.hourlyRate}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
            <span className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Calendar className="h-3 w-3" /> Pod Retainer
            </span>
            <span className="text-sm font-bold text-neutral-900">
              {worker.engagementTerms.podRetainer}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
            <span className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Clock className="h-3 w-3" /> Min Allocation
            </span>
            <span className="text-sm font-bold text-neutral-900">
              {worker.engagementTerms.minAllocation}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
            <span className="flex items-center gap-1.5 text-xs text-neutral-500">
              <TrendingUp className="h-3 w-3" /> Max Allocation
            </span>
            <span className="text-sm font-bold text-neutral-900">
              {worker.engagementTerms.maxAllocation}
            </span>
          </div>
        </div>
      </div>

      {/* Pod CTA */}
      <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5 text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
          <Users className="h-5 w-5 text-purple-600" />
        </div>
        <h4 className="mb-1 text-sm font-bold text-neutral-900">
          Form a Pod with {worker.name.split(" ")[0]}
        </h4>
        <p className="mb-3 text-xs text-neutral-500">
          Assemble a team of verified specialists for complex projects
        </p>
        <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700">
          <Users className="h-4 w-4" />
          Form Pod
        </button>
      </div>

      {/* Trust Seal */}
      <div className="rounded-2xl border border-neutral-300 bg-white p-5">
        <div className="mb-3 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-bold text-neutral-900">
            Vanguard Trust Seal
          </h3>
        </div>
        <div className="space-y-2">
          {worker.verified.map((v, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2"
            >
              <svg
                className="h-4 w-4 text-emerald-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-medium text-neutral-700">
                {v.label}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium text-amber-700">
              PGP Key — Encrypted Comms Only
            </span>
          </div>
        </div>
      </div>

      {/* Similar Specialists */}
      <div className="rounded-2xl border border-neutral-300 bg-white p-5">
        <h3 className="mb-3 text-sm font-bold text-neutral-900">
          Similar Specialists
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <img
              src="https://i.pravatar.cc/80?img=33"
              alt="Worker"
              className="h-10 w-10 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-neutral-900">
                Sarah Chen
              </p>
              <p className="text-[11px] text-neutral-400">
                Systems Architect
              </p>
            </div>
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-neutral-900">4.94</span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <img
              src="https://i.pravatar.cc/80?img=15"
              alt="Worker"
              className="h-10 w-10 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-neutral-900">
                James Park
              </p>
              <p className="text-[11px] text-neutral-400">
                Backend Engineer
              </p>
            </div>
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-neutral-900">4.89</span>
            </div>
          </div>
        </div>
        <button className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50">
          View All
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
