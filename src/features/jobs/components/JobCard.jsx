import { Link } from 'react-router-dom'
import { getCompanyLogo } from '../../../utils/companyLogo.js'

export default function JobCard({ job, actions }) {
  const timeAgo = getTimeAgo(job.postedAt)
  const logo = job.companyLogo || getCompanyLogo(job.companyName)

  return (
    <div className="flex flex-col rounded-2xl border border-neutral-300 bg-white p-6 transition hover:border-primary hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Letter avatar under the image; logo covers it when loaded */}
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-primary">
            <span className="absolute inset-0 flex items-center justify-center font-semibold text-white">
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
          <div>
            <p className="font-semibold text-neutral-900">{job.companyName}</p>
            <p className="text-sm text-neutral-500">{job.category}</p>
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            job.status === 'open'
              ? 'bg-success/10 text-success'
              : 'bg-neutral-200 text-neutral-600'
          }`}
        >
          {job.status === 'open' ? 'Open' : 'Closed'}
        </span>
      </div>

      <Link to={`/jobs/${job.id}`} className="mt-4 block">
        <h3 className="text-lg font-semibold text-neutral-900 hover:text-primary">
          {job.title}
        </h3>
      </Link>

      <div className="mt-3 flex flex-wrap gap-2">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-neutral-200 pt-4 text-sm">
        <div className="space-y-1">
          <p className="font-semibold text-neutral-900">${job.budget.toLocaleString()}</p>
          <p className="text-xs text-neutral-500">{job.duration} · {timeAgo}</p>
        </div>
        {/* When actions slot is provided (e.g. Apply button), use it; otherwise show default View Details link */}
        {actions ? (
          actions
        ) : (
          <Link
            to={`/jobs/${job.id}`}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  )
}

// Duplicated from JobDetailPage — extract to shared util if modifying behavior
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
