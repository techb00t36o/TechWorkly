import { useState } from 'react'

const filterTabs = ['All Roles (248)', 'Backend (94)', 'Full Stack (62)', 'Security (48)', 'QA (44)']

const reviews = [
  {
    id: 1,
    name: 'Dr. Elena Rostova',
    role: 'Senior Rust & Kernel Systems Engineer',
    hireType: 'Team Pod Hire',
    rating: 5.0,
    text: 'One of the cleanest engineering engagements in my 12 years of contracting. Vanguard\'s team leads provided razor-sharp system specs with zero ambiguity. Escrow milestone releases were approved within 45 minutes of pull request review merges.',
    duration: '7 Months',
    amount: '$115,000 Total Escrow Disbursed',
    verified: true,
  },
  {
    id: 2,
    name: 'Tariq Al-Mansoor',
    role: 'AppSec & Penetration Specialist',
    hireType: 'Solo Hire',
    rating: 5.0,
    text: 'Complete autonomy and respectful engineering culture. We performed invasive fuzzing and penetration tests against their core identity service. Findings were triaged rapidly and our remuneration was wired exactly as pledged.',
    duration: '3 Months',
    amount: '$42,000 Total Escrow Disbursed',
    verified: true,
  },
]

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1 text-primary">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className="h-4 w-4"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ))}
      <span className="ml-1 text-xs font-semibold text-neutral-600">{rating}</span>
    </div>
  )
}

export default function ReviewsSection({ liveReviews = [] }) {
  const [activeFilter, setActiveFilter] = useState('All Roles (248)')

  // Session-submitted dual reviews (public only) prepended above mock history
  const liveCards = liveReviews.map((r) => ({
    id: r.id,
    name: r.reviewerName,
    role: r.reviewerRole === 'worker' ? 'Freelance Worker' : 'Company',
    hireType: r.sourceType === 'TEAM_ROLE' ? 'Team Hire' : 'Solo Hire',
    rating: r.ratings.overall,
    text: r.comment || '(No written feedback)',
    duration: 'Completed',
    amount: r.projectTitle,
    verified: false,
  }))
  const cards = [...liveCards, ...reviews]

  return (
    <section className="rounded-2xl border border-neutral-300 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Contractor & Squad Feedback</h2>
          <p className="mt-1 text-sm text-neutral-500">Dual performance metrics verified by platform cryptographic escrow release.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-neutral-100 px-3 py-2 text-center">
            <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">Squad / Pod Rating</span>
            <span className="text-lg font-bold text-primary">4.98 ★</span>
          </div>
          <div className="rounded-lg bg-neutral-100 px-3 py-2 text-center">
            <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">Individual Rating</span>
            <span className="text-lg font-bold text-primary">4.94 ★</span>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              activeFilter === tab
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {cards.map((review) => (
          <div key={review.id} className="rounded-xl bg-neutral-50 p-4 shadow-sm">
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                  {review.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-neutral-900">{review.name}</span>
                    {review.verified && (
                      <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">Verified Contractor ✓</span>
                    )}
                  </div>
                  <span className="text-xs text-neutral-500">{review.role} — {review.hireType}</span>
                </div>
              </div>
              <StarRating rating={review.rating} />
            </div>
            <p className="mb-3 text-sm leading-relaxed text-neutral-600">"{review.text}"</p>
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <span>Project Duration: {review.duration}</span>
              <span>•</span>
              <span>{review.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
