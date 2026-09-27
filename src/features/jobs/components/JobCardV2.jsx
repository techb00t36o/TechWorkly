import { Star, Lock, Bookmark, Clock, Globe, Zap } from 'lucide-react'
import { getCompanyLogo } from '../../../utils/companyLogo.js'

export default function JobCardV2({ job }) {
  const actionLabel =
    job.contractType === 'Lead' ? 'Apply as Lead' : 'Submit Proposal'
  const logo = job.companyLogo || getCompanyLogo(job.companyName)

  return (
    <div className="rounded-xl border border-neutral-300 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
            {job.contractType}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Lock size={12} />
            Escrowed
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-neutral-600">
          <span className="font-semibold text-neutral-800">
            ${job.hourlyRange[0]} — ${job.hourlyRange[1]} / hr
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            Part-Time ({job.hoursPerWeek}h/wk)
          </span>
        </div>
      </div>

      {/* Title section */}
      <div className="mt-5 flex items-start gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary">
          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
            {job.companyName[0]}
          </span>
          <img
            src={logo}
            alt={`${job.companyName} logo`}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold text-neutral-900">{job.title}</h3>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
            <span className="font-medium text-neutral-700">{job.companyName}</span>

            <span className="flex items-center gap-1 text-amber-500">
              <Star size={14} fill="currentColor" />
              <span className="font-medium text-neutral-700">
                {job.companyRating}
              </span>
            </span>

            <span>{job.companyReviews} reviews</span>

            <span className="flex items-center gap-1">
              <Zap size={14} />
              {job.companySpend} spent
            </span>

            <span className="flex items-center gap-1">
              <Globe size={14} />
              {job.timeZone}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-neutral-600">
        {job.description}
      </p>

      {/* Bottom bar */}
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-neutral-200 pt-4">
        {/* Skill tags */}
        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-xs text-neutral-700"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg bg-neutral-100 p-2 text-neutral-700 transition-colors hover:bg-neutral-200"
            aria-label="Bookmark job"
          >
            <Bookmark size={18} />
          </button>
          <button
            type="button"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
