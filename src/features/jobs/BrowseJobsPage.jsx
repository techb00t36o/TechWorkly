// Searchable job board with category filters, sorting, and job cards.
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useJobs } from '../../context/JobContext.jsx'
import AppLayout from '../../components/AppLayout.jsx'
import JobCard from './components/JobCard.jsx'

const categories = ['All', 'Web', 'Mobile', 'Desktop', 'Browser']

export default function BrowseJobsPage() {
  const { user, profile } = useAuth()
  const { jobs, applyToJob, hasApplied } = useJobs()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('newest')

  // Two-stage filter: first exclude closed jobs, then apply category + search in one pass
  const filtered = jobs
    .filter((j) => j.status === 'open')
    .filter(
      (j) =>
        (category === 'All' || j.category === category) &&
        (j.title.toLowerCase().includes(query.toLowerCase()) ||
          j.companyName.toLowerCase().includes(query.toLowerCase()) ||
          j.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()))),
    )

  // Parse ISO strings for date comparison; budget sorts avoid Date overhead
  filtered.sort((a, b) => {
    if (sort === 'budget-high') return b.budget - a.budget
    if (sort === 'budget-low') return a.budget - b.budget
    return new Date(b.postedAt) - new Date(a.postedAt)
  })

  // Aggregate stats computed from raw jobs (not filtered) so totals reflect full catalog
  const totalJobs = jobs.filter((j) => j.status === 'open').length
  const categoryCount = jobs.filter(
    (j) => j.status === 'open' && (category === 'All' || j.category === category),
  ).length
  const totalBudget = jobs
    .filter((j) => j.status === 'open')
    .reduce((sum, j) => sum + j.budget, 0)

  return (
    <AppLayout>
      {/* Hero */}
      <section className="border-b border-neutral-300 bg-neutral-100">
        <div className="mx-auto max-w-screen-2xl px-6 py-14">
          <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">Browse Jobs</h1>
          <p className="mt-3 max-w-2xl text-neutral-500">
            Find open positions from verified companies on TechWorkly — apply with one click and get hired fast.
          </p>
          <div className="mt-6 flex items-center gap-8 text-sm text-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-neutral-900">{totalJobs}</span> open jobs
            </span>
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-neutral-900">{categoryCount}</span> in {category === 'All' ? 'all categories' : category}
            </span>
            <span className="hidden items-center gap-1.5 md:flex">
              <span className="font-semibold text-neutral-900">${totalBudget.toLocaleString()}</span> total budget
            </span>
          </div>
        </div>
      </section>

      {/* Search + filters */}
      <section className="mx-auto max-w-screen-2xl px-6 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs, skills, companies…"
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light md:max-w-sm"
          />
          <div className="flex items-center gap-4">
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
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-700 focus:border-primary focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="budget-high">Budget: High to Low</option>
              <option value="budget-low">Budget: Low to High</option>
            </select>
          </div>
        </div>
      </section>

      {/* Job cards */}
      <section className="mx-auto max-w-screen-2xl px-6 pb-20">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-neutral-300 bg-white p-12 text-center">
            <p className="text-lg font-semibold text-neutral-900">No jobs found</p>
            <p className="mt-2 text-sm text-neutral-500">
              Try a different search or clear your filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                actions={
                  // Workers see Apply/Applied; companies and guests see nothing
                  user?.role === 'worker' ? (
                    hasApplied(job.id, user.id) ? (
                      <span className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600">
                        Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => applyToJob(job.id, user.id, profile?.name || user?.name || 'Worker')}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                      >
                        Apply
                      </button>
                    )
                  ) : null
                }
              />
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  )
}
