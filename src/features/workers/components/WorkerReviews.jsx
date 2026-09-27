import { Star } from "lucide-react";

export default function WorkerReviews({ reviews }) {
  return (
    <section className="rounded-2xl border border-neutral-300 bg-white p-6">
      <h3 className="mb-4 text-lg font-bold text-neutral-900">
        Performance Reviews
      </h3>

      <div className="mb-6 grid grid-cols-3 gap-4">
        {/* Object.entries iterates breakdown keys dynamically (pod, solo, gig) so the grid adapts to data shape */}
        {Object.entries(reviews.breakdown).map(([type, data]) => (
          <div
            key={type}
            className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center"
          >
            {/* Map raw key to display label; falls back to capitalized key name */}
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              {type === "pod" ? "Pod" : type === "solo" ? "Solo" : "Gig"}
            </p>
            <div className="my-1 flex items-center justify-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-xl font-bold text-neutral-900">
                {/* N/A fallback avoids showing a misleading 0 rating when no reviews exist */}
                {data.rating > 0 ? data.rating : "N/A"}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              {data.count} review{data.count !== 1 ? "s" : ""}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-6 flex items-center gap-6">
        <div>
          <p className="text-3xl font-bold text-neutral-900">
            {reviews.overall}
          </p>
          <p className="text-xs text-neutral-400">Overall Rating</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {/* Star distribution: reduce sums counts, division-by-zero guard prevents NaN bar widths */}
          {[5, 4, 3, 2, 1].map((star) => {
            // Fallback to 0 handles missing keys in sparse distribution objects
            const count = reviews.distribution[star] || 0;
            const total = Object.values(reviews.distribution).reduce(
              (a, b) => a + b,
              0
            );
            const pct = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="w-3 text-right text-xs text-neutral-500">
                  {star}
                </span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 text-right text-[11px] text-neutral-400">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {reviews.recent.map((review, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-neutral-200 bg-neutral-50 p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-neutral-900">
                  {review.author}
                </span>
                <span className="ml-2 text-xs text-neutral-400">
                  {review.role}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-neutral-900">
                    {review.rating}
                  </span>
                </div>
                <span className="text-xs text-neutral-400">{review.date}</span>
              </div>
            </div>
            <p className="mb-1 text-xs text-neutral-500">{review.project}</p>
            <p className="text-sm leading-relaxed text-neutral-600">
              {review.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
