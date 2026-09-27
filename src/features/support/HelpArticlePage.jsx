// Help article view with helpful feedback and related articles.
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AppLayout from '../../components/AppLayout.jsx'
import { findArticle, faqCategories } from './data/helpFaqs.js'

export default function HelpArticlePage() {
  const { slug } = useParams()
  const article = findArticle(slug)
  const [feedback, setFeedback] = useState(null)

  if (!article) {
    return (
      <AppLayout>
        <main className="mx-auto max-w-2xl px-6 py-16 text-center">
          <p className="text-lg font-semibold text-neutral-900">Article not found</p>
          <Link to="/help" className="mt-4 inline-block text-sm text-primary hover:underline">
            Back to Help Center
          </Link>
        </main>
      </AppLayout>
    )
  }

  const category = faqCategories.find((c) => c.slug === article.category)

  return (
    <AppLayout>
      <main className="mx-auto w-full max-w-2xl px-6 py-12">
        <Link to="/help" className="text-sm text-neutral-500 hover:text-primary">
          ← Help Center
        </Link>

        <article className="mt-6 rounded-2xl border border-neutral-300 bg-white p-8">
          {category && (
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              {category.label}
            </p>
          )}
          <h1 className="mt-1 text-2xl font-bold text-neutral-900">{article.title}</h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-700">{article.body}</p>

          {/* Helpful feedback */}
          <div className="mt-8 border-t border-neutral-200 pt-6">
            <p className="text-sm font-medium text-neutral-700">Was this helpful?</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setFeedback('yes')}
                className={`rounded-lg border px-4 py-1.5 text-sm ${
                  feedback === 'yes'
                    ? 'border-success bg-success/10 text-success'
                    : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setFeedback('no')}
                className={`rounded-lg border px-4 py-1.5 text-sm ${
                  feedback === 'no'
                    ? 'border-danger bg-danger/10 text-danger'
                    : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                No
              </button>
            </div>
            {feedback && (
              <p className="mt-2 text-xs text-neutral-500">Thanks for your feedback.</p>
            )}
          </div>

          {/* Related */}
          {article.related?.length > 0 && (
            <div className="mt-6 border-t border-neutral-200 pt-6">
              <p className="text-sm font-medium text-neutral-700">Related articles</p>
              <ul className="mt-2 space-y-1.5">
                {article.related.map((r) => {
                  const rel = findArticle(r)
                  if (!rel) return null
                  return (
                    <li key={r}>
                      <Link to={`/help/article/${r}`} className="text-sm text-primary hover:underline">
                        {rel.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </article>

        <div className="mt-6 text-center">
          <Link to="/help/contact" className="text-sm text-primary hover:underline">
            Still need help? Contact support →
          </Link>
        </div>
      </main>
    </AppLayout>
  )
}
