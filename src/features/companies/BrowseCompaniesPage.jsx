// Searchable company directory with industry filters, sorting, and company cards.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout.jsx'

const categories = ['All', 'Web', 'Mobile', 'Desktop', 'Browser']

const companies = [
  {
    name: 'Nimbus Labs',
    slug: 'nimbus-labs',
    logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=nimbus-labs&backgroundColor=6366f1,8b5cf6',
    tagline: 'Cloud-native SaaS for growing teams.',
    category: 'Web',
    industry: 'SaaS',
    rating: 4.9,
    hires: 38,
    openings: 4,
    verified: true,
  },
  {
    name: 'Bluepeak',
    slug: 'bluepeak',
    logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=bluepeak&backgroundColor=0ea5e9,0284c7',
    tagline: 'Mobile-first fintech built on escrow rails.',
    category: 'Mobile',
    industry: 'Fintech',
    rating: 4.8,
    hires: 27,
    openings: 3,
    verified: true,
  },
  {
    name: 'Vector Systems',
    slug: 'vector-systems',
    logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=vector-systems&backgroundColor=10b981,059669',
    tagline: 'Reliable desktop tooling for engineering teams.',
    category: 'Desktop',
    industry: 'Developer Tools',
    rating: 4.7,
    hires: 19,
    openings: 2,
    verified: true,
  },
  {
    name: 'Horizon Web',
    slug: 'horizon-web',
    logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=horizon-web&backgroundColor=f59e0b,d97706',
    tagline: 'High-converting e-commerce experiences.',
    category: 'Web',
    industry: 'E-commerce',
    rating: 4.6,
    hires: 24,
    openings: 5,
    verified: false,
  },
  {
    name: 'Pocketcast Apps',
    slug: 'pocketcast-apps',
    logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=pocketcast-apps&backgroundColor=ec4899,db2777',
    tagline: 'Everyday utility apps for Android & iOS.',
    category: 'Mobile',
    industry: 'Consumer Apps',
    rating: 4.5,
    hires: 15,
    openings: 2,
    verified: true,
  },
  {
    name: 'Fiberline',
    slug: 'fiberline',
    logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=fiberline&backgroundColor=14b8a6,0d9488',
    tagline: 'Browser extensions for privacy-first productivity.',
    category: 'Browser',
    industry: 'Privacy',
    rating: 4.9,
    hires: 12,
    openings: 1,
    verified: true,
  },
  {
    name: 'Quantum Soft',
    slug: 'quantum-soft',
    logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=quantum-soft&backgroundColor=8b5cf6,7c3aed',
    tagline: 'Enterprise desktop dashboards and data tools.',
    category: 'Desktop',
    industry: 'Enterprise',
    rating: 4.4,
    hires: 21,
    openings: 3,
    verified: false,
  },
  {
    name: 'WebForge Studio',
    slug: 'webforge-studio',
    logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=webforge-studio&backgroundColor=ef4444,dc2626',
    tagline: 'Design-driven marketing sites and web apps.',
    category: 'Web',
    industry: 'Agency',
    rating: 4.8,
    hires: 33,
    openings: 6,
    verified: true,
  },
]

export default function BrowseCompaniesPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('newest')

  // Two independent filters: category is exact match (or "All" bypass), search is fuzzy OR across name/tagline/industry
  const filtered = companies.filter(
    (c) =>
      (category === 'All' || c.category === category) &&
      (c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.tagline.toLowerCase().includes(query.toLowerCase()) ||
        c.industry.toLowerCase().includes(query.toLowerCase())),
  )

  // Descending comparator — "newest" defaults to most open roles since data has no timestamp
  filtered.sort((a, b) => {
    if (sort === 'hires') return b.hires - a.hires
    if (sort === 'rating') return b.rating - a.rating
    return b.openings - a.openings
  })

  // Aggregate stats from full (unfiltered) list so hero counters stay stable while user filters
  const totalOpenings = companies.reduce((sum, c) => sum + c.openings, 0)
  const verifiedCount = companies.filter((c) => c.verified).length
  const avgRating = (companies.reduce((sum, c) => sum + c.rating, 0) / companies.length).toFixed(1)

  return (
    <AppLayout>
      {/* ─── Hero / stats header ─── */}
      <section className="border-b border-neutral-300 bg-neutral-100">
        <div className="mx-auto max-w-screen-2xl px-6 py-14">
          <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">Browse Companies</h1>
          <p className="mt-3 max-w-2xl text-neutral-500">
            Explore verified companies and teams hiring on TechWorkly — see their track record and
            current openings.
          </p>
          <div className="mt-6 flex items-center gap-8 text-sm text-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-neutral-900">{verifiedCount}</span> verified
              companies
            </span>
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-neutral-900">{totalOpenings}</span> open team
              roles
            </span>
            <span className="hidden items-center gap-1.5 md:flex">
              <span className="font-semibold text-neutral-900">★ {avgRating}</span> avg. rating
            </span>
          </div>
        </div>
      </section>

      {/* ─── Search, filters, and sort ─── */}
      <section className="mx-auto max-w-screen-2xl px-6 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies, industries…"
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light md:max-w-sm"
          />
          <div className="flex items-center gap-4">
            {/* ─── Category filter pills ─── */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    category === cat
                      ? 'bg-primary text-white'
                      : 'border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* ─── Sort dropdown ─── */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-700 focus:border-primary focus:outline-none"
            >
              <option value="newest">Open roles</option>
              <option value="hires">Most hires</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>
        </div>
      </section>

      {/* ─── Company cards grid ─── */}
      <section className="mx-auto max-w-screen-2xl px-6 pb-20">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-neutral-300 bg-white p-12 text-center">
            <p className="text-lg font-semibold text-neutral-900">No companies found</p>
            <p className="mt-2 text-sm text-neutral-500">
              Try a different search or clear your filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <div
                key={c.name}
                className="flex flex-col rounded-2xl border border-neutral-300 bg-white p-6 transition hover:border-primary hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0">
                    {/* Letter mark underneath; logo image covers it when loaded */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-semibold text-white">
                      {c.name[0]}
                    </div>
                    <img
                      src={c.logo}
                      alt={`${c.name} logo`}
                      className="absolute inset-0 h-12 w-12 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                  <div>
                    <p className="flex items-center gap-2 font-semibold text-neutral-900">
                      {c.name}
                      {c.verified && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success text-[10px] text-white">
                          ✓
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-neutral-500">{c.industry}</p>
                  </div>
                  <span className="ml-auto flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-700 tabular-nums">
                    ★ {c.rating}
                  </span>
                </div>

                <p className="mt-4 text-sm text-neutral-700">{c.tagline}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary">
                    {c.category} Developer
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-neutral-200 pt-4 text-sm">
                  <div>
                    <p className="font-semibold text-neutral-900">{c.openings} open roles</p>
                    <p className="text-xs text-neutral-500">{c.hires} hires made</p>
                  </div>
                  <Link
                    to={`/companies/${c.slug}`}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                  >
                    View Company
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  )
}