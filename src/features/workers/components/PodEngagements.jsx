import { Users, Star, ArrowRight } from "lucide-react";

export default function PodEngagements({ pods }) {
  if (!pods || pods.length === 0) return null;

  return (
    <section className="rounded-2xl border border-neutral-300 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-neutral-900">Pod Engagements</h3>
        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
          {pods.length} Engagements
        </span>
      </div>
      <div className="space-y-3">
        {pods.map((pod, idx) => (
          <div
            key={idx}
            className="group rounded-2xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-neutral-900">
                    {pod.name}
                  </h4>
                  <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-semibold text-purple-700">
                    {pod.role}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-500">{pod.period}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-neutral-900">
                  {pod.rating}
                </span>
              </div>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-neutral-600">
              {pod.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-neutral-500">
                  <Users className="h-3 w-3" />
                  {pod.members} members
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  {pod.escrowStatus}
                </span>
              </div>
              <button className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80">
                View Details
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
