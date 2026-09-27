import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function WorkerFinancialBar({ financials }) {
  // Toggle state controls visibility of sensitive financial data (balance, payouts, etc.)
  const [showPrivate, setShowPrivate] = useState(false);

  return (
    <section className="rounded-2xl border border-neutral-300 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-3">
        <div className="flex items-center gap-4">
          <button className="text-sm font-bold text-neutral-900">Public</button>
          <button className="text-sm font-medium text-neutral-400">Worker</button>
        </div>
        <button
          onClick={() => setShowPrivate(!showPrivate)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
        >
          {showPrivate ? (
            <EyeOff className="h-3.5 w-3.5" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
          {showPrivate ? "Hide" : "Show"} Private Financials
        </button>
      </div>

      {/* Public view: tier badge and rates visible to anyone; private view: worker-only balance/payouts */}
      {!showPrivate ? (
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
              {financials.public.tier}
            </span>
            {financials.public.escrowReady && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Escrow Ready
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-neutral-400">Gig Rates</p>
              <p className="text-sm font-bold text-neutral-900">
                {financials.worker.gigRates}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-400">Retainer</p>
              <p className="text-sm font-bold text-neutral-900">
                {financials.worker.retainer}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 py-4">
          <div className="mb-3 grid grid-cols-4 gap-3">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
              <p className="text-[11px] text-neutral-400">Available Balance</p>
              <p className="text-lg font-bold text-neutral-900">
                {financials.worker.availableBalance}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
              <p className="text-[11px] text-neutral-400">Earnings Total</p>
              <p className="text-lg font-bold text-neutral-900">
                {financials.worker.earningsTotal}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
              <p className="text-[11px] text-neutral-400">Escrow Clearance</p>
              <p className="text-lg font-bold text-neutral-900">
                {financials.worker.escrowClearance}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
              <p className="text-[11px] text-neutral-400">Pending Payouts</p>
              <p className="text-lg font-bold text-neutral-900">
                {financials.worker.pendingPayouts}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50">
              Withdraw
            </button>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-500">
              Withdrawal: {financials.worker.withdrawFee} fee &middot;{" "}
              {financials.worker.withdrawalOptions.join(", ")}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
