// Worker profile gigs: live GigContext listings when present, mock fallback otherwise.
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useGigs } from "../../../context/GigContext.jsx";

export default function GigsSection({ gigs, workerSlug }) {
  const { getGigsBySlug } = useGigs();
  // Prefer live marketplace gigs for this worker; fall back to mock profile gigs
  const live = workerSlug ? getGigsBySlug(workerSlug) : [];
  const list =
    live.length > 0
      ? live.map((g) => ({
          id: g.id,
          title: g.title,
          description: g.description,
          price: `From $${Math.min(...g.packages.map((p) => p.price))}`,
          deliveryTime: `${Math.min(...g.packages.map((p) => p.deliveryDays))} days`,
          includes: g.packages[0]?.features || [],
          to: `/gigs/${g.id}`,
        }))
      : (gigs || []).map((g) => ({
          ...g,
          to: "/browse-gigs",
        }));

  if (!list || list.length === 0) return null;

  return (
    <section className="rounded-2xl border border-neutral-300 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-neutral-900">
          Gigs &amp; Fixed-Price Services
        </h3>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {list.length} Available
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {list.map((gig) => (
          <div
            key={gig.id || gig.title}
            className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-md"
          >
            <div className="relative h-36 overflow-hidden">
              <img
                src={gig.image}
                alt={gig.title}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <span className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-neutral-900 backdrop-blur-sm">
                {gig.price}
              </span>
            </div>
            <div className="p-4">
              <h4 className="mb-1.5 text-sm font-bold text-neutral-900">
                {gig.title}
              </h4>
              <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-neutral-500">
                {gig.description}
              </p>
              <div className="mb-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  Includes
                </p>
                <ul className="space-y-1">
                  {(gig.includes || []).slice(0, 4).map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-1.5 text-xs text-neutral-600"
                    >
                      <span className="h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-neutral-400">
                  Delivery: {gig.deliveryTime}
                </span>
                <Link
                  to={gig.to}
                  className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90"
                >
                  Book Gig
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
