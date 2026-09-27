// Searchable worker directory with role filters, sorting, and profile cards.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout.jsx'

const roles = ['All', 'Developer', 'QA Engineer', 'Hacker']

const workers = [
  {
    slug: 'amina-k',
    name: 'Amina K.',
    avatar: 'https://i.pravatar.cc/300?img=47',
    role: 'Full-Stack Developer',
    type: 'Developer',
    skills: ['React', 'Node.js', 'API'],
    rating: 4.9,
    projects: 42,
    earned: 48000,
    verified: true,
  },
  {
    slug: 'david-r',
    name: 'David R.',
    avatar: 'https://i.pravatar.cc/300?img=53',
    role: 'QA Engineer',
    type: 'QA Engineer',
    skills: ['Playwright', 'CI'],
    rating: 4.8,
    projects: 31,
    earned: 26000,
    verified: true,
  },
  {
    slug: 'chen-w',
    name: 'Chen W.',
    avatar: 'https://i.pravatar.cc/300?img=59',
    role: 'Security Hacker',
    type: 'Hacker',
    skills: ['Audit', 'Pentest'],
    rating: 4.9,
    projects: 19,
    earned: 33000,
    verified: true,
  },
  {
    slug: 'sofia-m',
    name: 'Sofia M.',
    avatar: 'https://i.pravatar.cc/300?img=44',
    role: 'Mobile Developer',
    type: 'Developer',
    skills: ['Flutter', 'Swift'],
    rating: 4.7,
    projects: 27,
    earned: 31000,
    verified: true,
  },
  {
    slug: 'liam-o',
    name: 'Liam O.',
    avatar: 'https://i.pravatar.cc/300?img=51',
    role: 'QA Automation Engineer',
    type: 'QA Engineer',
    skills: ['Cypress', 'Jenkins'],
    rating: 4.6,
    projects: 14,
    earned: 15000,
    verified: false,
  },
  {
    slug: 'priya-n',
    name: 'Priya N.',
    avatar: 'https://i.pravatar.cc/300?img=45',
    role: 'Backend Developer',
    type: 'Developer',
    skills: ['Postgres', 'Go'],
    rating: 4.8,
    projects: 35,
    earned: 44000,
    verified: true,
  },
  {
    slug: 'marcus-t',
    name: 'Marcus T.',
    avatar: 'https://i.pravatar.cc/300?img=12',
    role: 'Web Security Engineer',
    type: 'Hacker',
    skills: ['XSS', 'Recon'],
    rating: 4.5,
    projects: 11,
    earned: 19000,
    verified: true,
  },
  {
    slug: 'elena-r',
    name: 'Elena R.',
    avatar: 'https://i.pravatar.cc/300?img=32',
    role: 'React Developer',
    type: 'Developer',
    skills: ['TypeScript', 'Next.js'],
    rating: 4.7,
    projects: 23,
    earned: 28000,
    verified: true,
  },
  {
    slug: 'mahfuz',
    name: 'Mahfuz',
    avatar: '/Mahfuz.jpg',
    role: 'Full-Stack Developer',
    type: 'Developer',
    skills: ['React', 'Node.js', 'TailwindCSS'],
    rating: 4.8,
    projects: 15,
    earned: 18500,
    verified: true,
  },
]

export default function BrowseWorkersPage() {
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('All')
  const [sort, setSort] = useState('newest')

  // Role AND search: both conditions must pass; search crosses name, role, and skills arrays
  const filtered = workers.filter(
    (w) =>
      (role === 'All' || w.type === role) &&
      (w.name.toLowerCase().includes(query.toLowerCase()) ||
        w.role.toLowerCase().includes(query.toLowerCase()) ||
        w.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()))),
  )

  // In-place sort; default ('newest') maps to earned desc since there is no date field
  filtered.sort((a, b) => {
    if (sort === 'rating') return b.rating - a.rating
    if (sort === 'projects') return b.projects - a.projects
    return b.earned - a.earned
  })

  // Stats from the unfiltered master list so the hero always shows totals regardless of current filters
  const totalProjects = workers.reduce((sum, w) => sum + w.projects, 0)
  const verifiedCount = workers.filter((w) => w.verified).length
  const avgRating = (workers.reduce((sum, w) => sum + w.rating, 0) / workers.length).toFixed(1)

  return (
    <AppLayout>
      {/* ─── Hero / stats header ─── */}
      <section className="border-b border-neutral-300 bg-neutral-100">
        <div className="mx-auto max-w-screen-2xl px-6 py-14">
          <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">Browse Workers</h1>
          <p className="mt-3 max-w-2xl text-neutral-500">
            Explore verified developers, QA engineers, and security talent on TechWorkly — hire for
            a single role or a whole team.
          </p>
          <div className="mt-6 flex items-center gap-8 text-sm text-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-neutral-900">{verifiedCount}</span> verified
              workers
            </span>
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-neutral-900">{totalProjects}</span> completed
              projects
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
            placeholder="Search workers, skills…"
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light md:max-w-sm"
          />
          <div className="flex items-center gap-4">
            {/* ─── Role filter pills ─── */}
            <div className="flex flex-wrap items-center gap-2">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    role === r
                      ? 'bg-primary text-white'
                      : 'border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            {/* ─── Sort dropdown ─── */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-700 focus:border-primary focus:outline-none"
            >
              <option value="newest">Top earners</option>
              <option value="projects">Most projects</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>
        </div>
      </section>

      {/* ─── Worker cards grid ─── */}
      <section className="mx-auto max-w-screen-2xl px-6 pb-20">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-neutral-300 bg-white p-12 text-center">
            <p className="text-lg font-semibold text-neutral-900">No workers found</p>
            <p className="mt-2 text-sm text-neutral-500">
              Try a different search or clear your filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((w) => (
              <div
                key={w.name}
                className="flex flex-col rounded-2xl border border-neutral-300 bg-white p-6 transition hover:border-primary hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0">
                    {/* Letter avatar underneath; image covers it when loaded */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-semibold text-white">
                      {w.name[0]}
                    </div>
                    <img
                      src={w.avatar}
                      alt={w.name}
                      className="absolute inset-0 h-12 w-12 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                  <div>
                    <p className="flex items-center gap-2 font-semibold text-neutral-900">
                      {w.name}
                      {w.verified && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success text-[10px] text-white">
                          ✓
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-neutral-500">{w.role}</p>
                  </div>
                  <span className="ml-auto flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-700 tabular-nums">
                    ★ {w.rating}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {w.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-neutral-200 pt-4 text-sm">
                  <div>
                    <p className="font-semibold text-neutral-900">{w.projects} projects</p>
                    <p className="text-xs text-neutral-500">
                      ${w.earned.toLocaleString()} paid via escrow
                    </p>
                  </div>
                  <Link
                    to={`/workers/${w.slug}`}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                  >
                    View Profile
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