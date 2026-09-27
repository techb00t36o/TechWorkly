import { Clock, Users, Briefcase, DollarSign, Star } from "lucide-react";

export default function WorkerStatsBar({ stats }) {
  const items = [
    {
      icon: Briefcase,
      value: stats.jobsCompleted.value,
      label: "Jobs Completed",
      sub: stats.jobsCompleted.change,
      color: "text-primary",
    },
    {
      icon: Users,
      value: stats.podsAndSquads.value,
      label: "Pods & Squads",
      sub: stats.podsAndSquads.label,
      color: "text-purple-600",
    },
    {
      icon: Clock,
      value: stats.activeGigs.value,
      label: "Active Gigs",
      sub: stats.activeGigs.label,
      color: "text-amber-600",
    },
    {
      icon: DollarSign,
      value: stats.escrowClearance.value,
      label: "Escrow Clearance",
      sub: stats.escrowClearance.sub,
      color: "text-emerald-600",
    },
    {
      icon: Clock,
      value: stats.responseTime.value,
      label: "Response Time",
      sub: stats.responseTime.sub,
      color: "text-blue-600",
    },
    {
      icon: Star,
      value: stats.overallRating.value,
      label: "Overall Rating",
      sub: stats.overallRating.label,
      color: "text-amber-500",
    },
  ];

  return (
    <section className="rounded-2xl border border-neutral-300 bg-white">
      <div className="grid grid-cols-6 divide-x divide-neutral-200">
        {items.map((item) => (
          <div key={item.label} className="px-6 py-4 text-center">
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
            <p className="text-lg font-bold text-neutral-900">{item.value}</p>
            <p className="text-xs font-medium text-neutral-500">{item.label}</p>
            {item.sub && (
              <p className="mt-0.5 text-[11px] text-neutral-400">{item.sub}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
