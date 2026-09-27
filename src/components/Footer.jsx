// Site-wide footer with navigation links, newsletter, and brand info.
import { Link } from 'react-router-dom'

export default function Footer() {
  const cols = [
    {
      title: 'Platform',
      links: [
        { label: 'Browse Jobs', to: '/browse-jobs' },
        { label: 'Browse Workers', to: '/browse-workers' },
        { label: 'Browse Gigs', to: '/browse-gigs' },
        { label: 'How It Works', to: '/#how-it-works' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', to: '/' },
        { label: 'Help / Support', to: '/help' },
        { label: 'Terms', to: '/help/safety' },
        { label: 'Privacy', to: '/help/safety' },
      ],
    },
  ]
  return (
    <footer className="bg-neutral-900 py-14 text-neutral-300">
      <div className="mx-auto w-full px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* ─── Brand column ─── */}
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-white">
                TW
              </span>
              <span className="text-lg font-semibold text-white">TechWorkly</span>
            </div>
            <p className="mt-4 text-sm text-neutral-500">
              Trust-first hiring for individuals, teams, and gigs.
            </p>
          </div>
          {/* ─── Link columns ─── */}
          {cols.map((c) => (
            <div key={c.title}>
              <p className="mb-3 text-sm font-semibold text-white">{c.title}</p>
              <ul className="space-y-2 text-sm">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="hover:text-white">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {/* ─── Newsletter form ─── */}
          <div>
            <p className="mb-3 text-sm font-semibold text-white">Newsletter</p>
            <p className="text-sm text-neutral-500">Get new projects and tips.</p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-3 flex gap-2"
            >
              <input
                type="email"
                placeholder="you@email.com"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-primary focus:outline-none"
              />
              <button className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
                Join
              </button>
            </form>
          </div>
        </div>
        {/* ─── Copyright bar ─── */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-neutral-800 pt-6 text-sm text-neutral-500 md:flex-row">
          <span>© {new Date().getFullYear()} TechWorkly. All rights reserved.</span>
          <span className="flex gap-4">
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">LinkedIn</a>
            <a href="#" className="hover:text-white">GitHub</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
