// Help Center home: search, shortcuts, popular topics, FAQ categories.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout.jsx'
import {
  faqCategories,
  popularTopics,
  articles,
  searchArticles,
} from './data/helpFaqs.js'

const shortcuts = [
  { label: 'Account', slug: 'account' },
  { label: 'Payments', slug: 'payments' },
  { label: 'Jobs / Teams', slug: 'teams' },
  { label: 'Verification', slug: 'trust' },
  { label: 'Disputes', slug: 'trust' },
  { label: 'Safety', slug: 'trust' },
]

export default function HelpCenterPage() {
  const [query, setQuery] = useState('')
  const results = searchArticles(query)

  return (
    <AppLayout>
      <main className="mx-auto w-full max-w-4xl px-6 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neutral-900">How can we help?</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Search FAQs, browse categories, or contact support.
          </p>
          <div className="mx-auto mt-6 max-w-xl">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search help articles…"
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Search results */}
        {query.trim() && (
          <div className="mt-8 rounded-2xl border border-neutral-300 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Results for “{query}”
            </h2>
            {results.length === 0 ? (
              <p className="mt-3 text-sm text-neutral-500">No articles matched. Try contact support.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {results.map((a) => (
                  <li key={a.slug}>
                    <Link to={`/help/article/${a.slug}`} className="text-sm text-primary hover:underline">
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Category shortcuts */}
        <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {shortcuts.map((s) => (
            <Link
              key={s.label}
              to={`/help#${s.slug}`}
              className="rounded-xl border border-neutral-300 bg-white p-4 text-center text-xs font-medium text-neutral-700 hover:border-primary hover:bg-primary-light"
            >
              {s.label}
            </Link>
          ))}
        </div>

        {/* Popular topics */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-neutral-900">Popular topics</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {popularTopics.map((t) => (
              <Link
                key={t.slug}
                to={`/help/article/${t.slug}`}
                className="rounded-xl border border-neutral-300 bg-white p-4 text-sm font-medium text-neutral-800 hover:border-primary"
              >
                {t.title}
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ categories */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-neutral-900">Browse by category</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {faqCategories.map((c) => (
              <div
                key={c.slug}
                id={c.slug}
                className="rounded-xl border border-neutral-300 bg-white p-5"
              >
                <p className="font-semibold text-neutral-900">{c.label}</p>
                <ul className="mt-2 space-y-1.5">
                  {articles
                    .filter((a) => a.category === c.slug)
                    .slice(0, 4)
                    .map((a) => (
                      <li key={a.slug}>
                        <Link
                          to={`/help/article/${a.slug}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {a.title}
                        </Link>
                      </li>
                    ))}
                  {articles.filter((a) => a.category === c.slug).length === 0 && (
                    <li className="text-xs text-neutral-400">No articles yet</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="mt-10 rounded-2xl border border-primary/30 bg-primary-light p-6 text-center">
          <h2 className="text-lg font-semibold text-neutral-900">Still need help?</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Submit a ticket — typical response within 1 business day.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              to="/help/contact"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Contact Support
            </Link>
            <Link
              to="/help/tickets"
              className="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              My Tickets
            </Link>
            <Link
              to="/help/safety"
              className="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Safety & Policies
            </Link>
          </div>
        </section>
      </main>
    </AppLayout>
  )
}
