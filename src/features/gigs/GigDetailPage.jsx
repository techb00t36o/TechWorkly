// Gig Listing Page (Gig_Listing_Page.docx): gallery, packages, worker, reviews, FAQ, similar.
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Star, BadgeCheck, Check, ChevronDown, Clock, RefreshCw, ArrowRight } from 'lucide-react'
import AppLayout from '../../components/AppLayout.jsx'
import { useGigs } from '../../context/GigContext.jsx'
import { useReviews } from '../../context/ReviewContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const tierLabels = { basic: 'Basic', standard: 'Standard', premium: 'Premium' }

export default function GigDetailPage() {
  const { id } = useParams()
  const { user, role } = useAuth()
  const { getGigById, getSimilarGigs } = useGigs()
  const { getPublicReviews } = useReviews()
  const [activeImage, setActiveImage] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)

  const gig = getGigById(id)

  if (!gig) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <p className="text-lg font-semibold text-neutral-900">Gig not found</p>
          <Link to="/browse-gigs" className="mt-3 inline-block text-sm text-primary hover:underline">
            Back to Browse Gigs
          </Link>
        </div>
      </AppLayout>
    )
  }

  const similar = getSimilarGigs(gig, 4)
  // Gig-specific reviews only — separate from job/team reviews (Gig_Listing_Page §6)
  const gigReviews = getPublicReviews({
    revieweeRole: 'worker',
    revieweeName: gig.workerName,
    sourceType: 'GIG_ORDER',
  }).slice(0, 4)

  const canOrder = role === 'company' || !user
  const orderPath = `/gigs/${gig.id}/order`

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
          <Link to="/browse-gigs" className="hover:text-primary">
            Browse Gigs
          </Link>
          <span>/</span>
          <span className="text-neutral-800">{gig.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            {/* Header */}
            <div className="rounded-2xl border border-neutral-300 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-medium text-primary">
                      {gig.category === 'developer' ? 'Developer' : gig.category === 'qa' ? 'QA Engineer' : 'Hacker'}
                    </span>
                    {gig.subCategory && (
                      <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 capitalize">
                        {gig.subCategory}
                      </span>
                    )}
                    {gig.bestSeller && (
                      <span className="rounded-full bg-warning/15 px-2.5 py-0.5 text-xs font-medium text-warning">
                        Best Seller
                      </span>
                    )}
                  </div>
                  <h1 className="mt-3 text-2xl font-bold text-neutral-900">{gig.title}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <Link
                      to={`/workers/${gig.workerSlug}`}
                      className="flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-primary"
                    >
                      <img
                        src={gig.workerAvatar}
                        alt={gig.workerName}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      {gig.workerName}
                      {gig.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                    </Link>
                    <span className="flex items-center gap-1 text-sm text-neutral-600">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <strong>{gig.rating.toFixed(1)}</strong>
                      ({gig.ordersCompleted} orders completed)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-300 bg-white">
              <img
                src={gig.gallery[activeImage] || gig.image}
                alt={gig.title}
                className="h-72 w-full object-cover md:h-96"
              />
              {gig.gallery.length > 1 && (
                <div className="flex gap-2 p-3">
                  {gig.gallery.map((src, i) => (
                    <button
                      key={src + i}
                      onClick={() => setActiveImage(i)}
                      className={`h-14 w-20 overflow-hidden rounded-lg border-2 ${
                        i === activeImage ? 'border-primary' : 'border-transparent opacity-70'
                      }`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <section className="mt-6 rounded-2xl border border-neutral-300 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">About this gig</h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{gig.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {gig.tools.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>

            {/* About the worker */}
            <section className="mt-6 rounded-2xl border border-neutral-300 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">About the worker</h2>
              <div className="mt-4 flex items-center gap-4">
                <img
                  src={gig.workerAvatar}
                  alt={gig.workerName}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div className="flex-1">
                  <Link
                    to={`/workers/${gig.workerSlug}`}
                    className="font-semibold text-neutral-900 hover:text-primary"
                  >
                    {gig.workerName}
                  </Link>
                  <p className="text-sm text-neutral-500">
                    ★ {gig.rating.toFixed(1)} · {gig.ordersCompleted} orders completed
                  </p>
                </div>
                <Link
                  to={`/workers/${gig.workerSlug}`}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  View full profile
                </Link>
              </div>
            </section>

            {/* Reviews */}
            <section className="mt-6 rounded-2xl border border-neutral-300 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">Gig reviews</h2>
              {gigReviews.length === 0 ? (
                <p className="mt-3 text-sm text-neutral-500">
                  No reviews yet for this gig. Reviews appear after completed orders.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {gigReviews.map((r) => (
                    <div key={r.id} className="border-b border-neutral-200 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-900">{r.reviewerName}</span>
                        <span className="flex items-center gap-1 text-sm text-neutral-600">
                          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                          {r.ratings.overall}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-neutral-600">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* FAQ */}
            {gig.faq?.length > 0 && (
              <section className="mt-6 rounded-2xl border border-neutral-300 bg-white p-6">
                <h2 className="text-lg font-semibold text-neutral-900">FAQ</h2>
                <div className="mt-3 divide-y divide-neutral-200">
                  {gig.faq.map((item, i) => (
                    <div key={item.q}>
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="flex w-full items-center justify-between py-3 text-left text-sm font-medium text-neutral-900"
                      >
                        {item.q}
                        <ChevronDown
                          className={`h-4 w-4 text-neutral-500 transition ${
                            openFaq === i ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {openFaq === i && (
                        <p className="pb-3 text-sm text-neutral-600">{item.a}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Similar gigs */}
            {similar.length > 0 && (
              <section className="mt-6">
                <h2 className="text-lg font-semibold text-neutral-900">Similar gigs</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {similar.map((s) => (
                    <Link
                      key={s.id}
                      to={`/gigs/${s.id}`}
                      className="group overflow-hidden rounded-2xl border border-neutral-300 bg-white hover:border-primary"
                    >
                      <img
                        src={s.image}
                        alt={s.title}
                        className="h-28 w-full object-cover"
                      />
                      <div className="p-3">
                        <p className="line-clamp-2 text-sm font-medium text-neutral-900 group-hover:text-primary">
                          {s.title}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          From ${Math.min(...s.packages.map((p) => p.price))}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Packages sidebar */}
          <aside className="h-fit lg:sticky lg:top-24">
            <div className="rounded-2xl border border-neutral-300 bg-white p-5">
              <div className="mb-4 flex gap-1 rounded-lg bg-neutral-100 p-1">
                {gig.packages.map((p) => (
                  <span
                    key={p.tier}
                    className="flex-1 rounded-md py-1.5 text-center text-xs font-semibold uppercase tracking-wide text-neutral-700"
                  >
                    {tierLabels[p.tier]}
                  </span>
                ))}
              </div>
              <div className="space-y-3">
                {gig.packages.map((p) => (
                  <div
                    key={p.tier}
                    className="rounded-xl border border-neutral-200 p-4"
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-semibold text-neutral-900">{p.name}</span>
                      <span className="text-xl font-bold text-neutral-900">${p.price}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {p.deliveryDays} day{p.deliveryDays > 1 ? 's' : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <RefreshCw className="h-3.5 w-3.5" />
                        {p.revisions} revision{p.revisions > 1 ? 's' : ''}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-1.5 text-xs text-neutral-600">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {canOrder ? (
                      <Link
                        to={`${orderPath}?tier=${p.tier}`}
                        className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
                      >
                        Order Now
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <Link
                        to={orderPath}
                        className="mt-4 flex w-full items-center justify-center rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                      >
                        Switch to company account to order
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  )
}
