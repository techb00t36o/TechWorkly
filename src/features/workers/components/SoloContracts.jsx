import { Star, ArrowRight } from "lucide-react";

export default function SoloContracts({ contracts }) {
  if (!contracts || contracts.length === 0) return null;

  return (
    <section className="rounded-2xl border border-neutral-300 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-neutral-900">
          Solo Contract History
        </h3>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {contracts.length} Contracts
        </span>
      </div>
      <div className="space-y-3">
        {contracts.map((contract, idx) => (
          <div
            key={idx}
            className="group flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-neutral-900">
                  {contract.project}
                </h4>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  {contract.value}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                {contract.client} &middot; {contract.period}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-neutral-900">
                  {contract.rating}
                </span>
              </div>
              <button className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80">
                View
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
