import { ShieldCheck, Star, Lock, Bookmark, Users, Clock, Globe } from 'lucide-react'
import { getCompanyLogo } from '../../../utils/companyLogo.js'

function getTimeAgo(dateString) {
  const now = new Date()
  const posted = new Date(dateString)
  const diffMs = now - posted
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

export default function FeaturedSquadCard({ squad }) {
  const {
    title,
    companyName,
    companyVerified,
    companyRating,
    companyReviews,
    companySpend,
    description,
    monthlyEscrow,
    hourlyRange,
    duration,
    hoursPerWeek,
    timeZone,
    skills,
    contractType,
    postedAt,
    roster,
  } = squad

  return (
    <div className="rounded-xl border border-neutral-300 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      {/* Top bar */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {contractType || 'Turnkey Squad Contract'}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            <Lock className="h-3 w-3" />
            Escrow Locked: ${monthlyEscrow?.toLocaleString()}/mo
          </span>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-neutral-900">
            ${monthlyEscrow?.toLocaleString()} / month
          </p>
          <p className="text-xs text-neutral-500">
            ${hourlyRange?.[0]} — ${hourlyRange?.[1]}/hr blended
          </p>
        </div>
      </div>

      {/* Title section */}
      <div className="mt-4 flex items-start gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary">
          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
            {companyName?.[0]}
          </span>
          <img
            src={getCompanyLogo(companyName)}
            alt={`${companyName} logo`}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold text-neutral-900">{title}</h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
            <span className="font-medium">{companyName}</span>
            {companyVerified && (
              <ShieldCheck className="h-4 w-4 text-primary" />
            )}
            <span className="flex items-center gap-0.5 text-amber-500">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="font-medium">{companyRating}</span>
            </span>
            <span className="text-neutral-400">({companyReviews?.toLocaleString()} reviews)</span>
            <span className="text-neutral-300">·</span>
            <span>{companySpend}</span>
            <span className="text-neutral-300">·</span>
            <span className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" />
              {timeZone}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm leading-relaxed text-neutral-600">{description}</p>

      {/* Squad Roster */}
      <div className="mt-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-500">
          Squad Composition &amp; Open Seats
        </p>
        <div className="grid grid-cols-3 gap-2">
          {roster?.map((member, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  member.status === 'open' ? 'bg-success' : 'bg-neutral-400'
                }`}
              />
              <span className="text-sm font-medium text-neutral-700">{member.role}</span>
              <span
                className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  member.status === 'open'
                    ? 'bg-success/10 text-success'
                    : 'bg-neutral-200 text-neutral-600'
                }`}
              >
                {member.status === 'open' ? `${member.slots || 1} Slot` : 'Filled'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Tags + Posted */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {skills?.map((skill) => (
            <span
              key={skill}
              className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-xs text-neutral-700"
            >
              {skill}
            </span>
          ))}
        </div>
        <span className="whitespace-nowrap text-xs text-neutral-400">
          Posted {getTimeAgo(postedAt)}
        </span>
      </div>

      {/* Actions bar */}
      <div className="mt-5 flex items-center justify-between border-t border-neutral-200 pt-4">
        <div className="flex items-center gap-4 text-sm text-neutral-600">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {hoursPerWeek} hrs/week
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg border border-neutral-300 p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-700"
          >
            <Bookmark className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Apply for Squad Slot
          </button>
        </div>
      </div>
    </div>
  )
}
