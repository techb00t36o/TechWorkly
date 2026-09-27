// Browse Gigs (Browse_Gigs.docx): search, filters sidebar, sort, results grid.
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, BadgeCheck, Search } from 'lucide-react'
import AppLayout from '../../components/AppLayout.jsx'
import {
  useGigs,
  gigCategories,
  gigSubCategories,
  deliveryFilters,
  gigSorts,
} from '../../context/GigContext.jsx'

const ratingFilters = [
  { value: 0, label: 'Any rating' },
  { value: 4, label: '4★ & up' },
  { value: 4.5, label: '4.5★ & up' },
]

function GigCard({ gig }) {
  const starting = Math.min(...gig.packages.map((p) => p.price))
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-300 bg-white transition hover:border-primary hover:shadow-sm">
      <Link to={`/gigs/${gig.id}`} className="relative block h-40 overflow-hidden">
        <img
          src={gig.image}
          alt={gig.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {gig.bestSeller && (
          <span className="absolute left-3 top-3 rounded-full bg-warning px-2.5 py-0.5 text-xs font-semibold text-white">
            Best Seller
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <img
            src={gig.workerAvatar}
            alt={gig.workerName}
            className="h-7 w-7 rounded-full object-cover"
          />
          <Link
            to={`/workers/${gig.workerSlug}`}
            className="text-sm font-medium text-neutral-700 hover:text-primary"
          >
            {gig.workerName}
          </Link>
          {gig.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
        </div>
        <Link to={`/gigs/${gig.id}`} className="mt-2 block">
          <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900 group-hover:text-primary">
            {gig.title}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
          <span className="flex items-center gap-0.5 font-medium text-neutral-800">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            {gig.rating.toFixed(1)}
          </span>
          <span>({gig.ordersCompleted} orders)</span>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-neutral-200 pt-3">
          <div>
            <p className="text-[11px] text-neutral-400">Starting at</p>
            <p className="text-lg font-bold text-neutral-900">${starting}</p>
          </div>
          <Link
            to={`/gigs/${gig.id}`}
            className="rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white hover:bg-primary-dark"
          >
            View Gig
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function BrowseGigsPage() {
  const { searchGigs } = useGigs()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [subCategory, setSubCategory] = useState('all')
  const [maxPrice, setMaxPrice] = useState(5000)
  const [maxDelivery, setMaxDelivery] = useState('all')
  const [minRating, setMinRating] = useState(0)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [showSuggest, setShowSuggest] = useState(false)
  const pageSize = 6

  const results = useMemo(
    () =>
      searchGigs({
        query,
        category,
        subCategory,
        maxPrice,
        maxDelivery: maxDelivery === 'all' ? null : Number(maxDelivery),
        minRating,
        verifiedOnly,
        sort,
      }),
    [searchGigs, query, category, subCategory, maxPrice, maxDelivery, minRating, verifiedOnly, sort],
  )

  // Search-as-you-type suggestions (Browse_Gigs §1): top title matches under the input
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || !showSuggest) return []
    return results
      .filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.workerName.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q)),
      )
      .slice(0, 5)
  }, [query, results, showSuggest])

  const totalPages = Math.max(1, Math.ceil(results.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const visible = results.slice((safePage - 1) * pageSize, safePage * pageSize)

  // Reset to page 1 when filters change
  const update = (fn) => (v) => {
    fn(v)
    setPage(1)
  }

  return (
    <AppLayout>
      {/* Hero + search */}
      <section className="border-b border-neutral-300 bg-neutral-100">
        <div className="mx-auto max-w-screen-2xl px-6 py-12">
          <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">Browse Gigs</h1>
          <p className="mt-2 max-w-2xl text-neutral-500">
            Order ready-made services from verified workers — fixed packages, clear delivery times,
            escrow-protected checkout.
          </p>
          <div className="relative mt-6 max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => update(setQuery)(e.target.value)}
              onFocus={() => setShowSuggest(true)}
              onBlur={() => {
                // Delay so suggestion Link click registers before unmount
                setTimeout(() => setShowSuggest(false), 150)
              }}
              placeholder="Search gig title, skill, or worker name…"
              className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-9 pr-4 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
            {suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-lg">
                {suggestions.map((s) => (
                  <li key={s.id}>
                    <Link
                      to={`/gigs/${s.id}`}
                      className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-neutral-50"
                      onClick={() => setShowSuggest(false)}
                    >
                      <img src={s.image} alt="" className="h-8 w-10 rounded object-cover" />
                      <span className="flex-1 truncate font-medium text-neutral-800">{s.title}</span>
                      <span className="text-xs text-neutral-500">{s.workerName}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-neutral-500">
            <span>
              <span className="font-semibold text-neutral-900">{results.length}</span> gigs found
            </span>
            <label className="flex items-center gap-2">
              Sort
              <select
                value={sort}
                onChange={(e) => update(setSort)(e.target.value)}
                className="rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-700 focus:border-primary focus:outline-none"
              >
                {gigSorts.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-screen-2xl gap-6 px-6 py-8 lg:grid-cols-[240px_1fr]">
        {/* Filters sidebar */}
        <aside className="h-fit rounded-2xl border border-neutral-300 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">
            Filters
          </h2>

          <div className="mb-5">
            <p className="mb-2 text-sm font-medium text-neutral-900">Category</p>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="radio"
                  name="category"
                  checked={category === 'all'}
                  onChange={() => {
                    setCategory('all')
                    setSubCategory('all')
                    setPage(1)
                  }}
                />
                All
              </label>
              {gigCategories.map((c) => (
                <label key={c.value} className="flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="radio"
                    name="category"
                    checked={category === c.value}
                    onChange={() => {
                      setCategory(c.value)
                      setSubCategory('all')
                      setPage(1)
                    }}
                  />
                  {c.label}
                </label>
              ))}
            </div>
            {category === 'developer' && (
              <div className="mt-3 space-y-1.5 border-l-2 border-neutral-200 pl-3">
                <p className="mb-1 text-xs font-medium text-neutral-500">Sub-category</p>
                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="radio"
                    name="sub"
                    checked={subCategory === 'all'}
                    onChange={() => update(setSubCategory)('all')}
                  />
                  All
                </label>
                {gigSubCategories.developer.map((s) => (
                  <label key={s.value} className="flex items-center gap-2 text-sm text-neutral-700">
                    <input
                      type="radio"
                      name="sub"
                      checked={subCategory === s.value}
                      onChange={() => update(setSubCategory)(s.value)}
                    />
                    {s.label}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="mb-5">
            <p className="mb-2 text-sm font-medium text-neutral-900">
              Max starting price{' '}
              <span className="font-semibold text-primary">${maxPrice}</span>
            </p>
            <input
              type="range"
              min={100}
              max={5000}
              step={100}
              value={maxPrice}
              onChange={(e) => update(setMaxPrice)(Number(e.target.value))}
              className="w-full accent-[var(--color-primary,#0f6e56)]"
            />
          </div>

          <div className="mb-5">
            <p className="mb-2 text-sm font-medium text-neutral-900">Delivery time</p>
            <select
              value={maxDelivery}
              onChange={(e) => update(setMaxDelivery)(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-2 text-sm text-neutral-700 focus:border-primary focus:outline-none"
            >
              <option value="all">Any</option>
              {deliveryFilters.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <p className="mb-2 text-sm font-medium text-neutral-900">Rating</p>
            <select
              value={minRating}
              onChange={(e) => update(setMinRating)(Number(e.target.value))}
              className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-2 text-sm text-neutral-700 focus:border-primary focus:outline-none"
            >
              {ratingFilters.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => update(setVerifiedOnly)(e.target.checked)}
              className="accent-[var(--color-primary,#0f6e56)]"
            />
            Verified workers only
          </label>
        </aside>

        {/* Results */}
        <div>
          {visible.length === 0 ? (
            <div className="rounded-2xl border border-neutral-300 bg-white p-12 text-center">
              <p className="text-lg font-semibold text-neutral-900">No gigs match your filters</p>
              <p className="mt-1 text-sm text-neutral-500">
                Try broadening price range, delivery time, or clearing search.
              </p>
              <button
                onClick={() => {
                  setQuery('')
                  setCategory('all')
                  setSubCategory('all')
                  setMaxPrice(5000)
                  setMaxDelivery('all')
                  setMinRating(0)
                  setVerifiedOnly(false)
                  setPage(1)
                }}
                className="mt-4 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`h-8 w-8 rounded-lg text-sm font-medium ${
                    n === safePage
                      ? 'bg-primary text-white'
                      : 'border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </AppLayout>
  )
}
