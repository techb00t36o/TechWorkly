export default function ApplicantCard({ applicant, onAccept, onReject }) {
  // Maps application status to Tailwind color classes for the badge
  const statusColors = {
    accepted: 'bg-success/10 text-success',
    rejected: 'bg-danger/10 text-danger',
    pending: 'bg-warning/10 text-warning',
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-neutral-200 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
          {applicant.workerName[0]}
        </div>
        <div>
          <p className="font-semibold text-neutral-900">{applicant.workerName}</p>
          <p className="text-xs text-neutral-500">Applied {getTimeAgo(applicant.appliedAt)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[applicant.status]}`}>
          {applicant.status}
        </span>
        {/* Action buttons only shown while pending — accepted/rejected are final states */}
        {applicant.status === 'pending' && (
          <>
            <button
              onClick={() => onAccept(applicant.workerId)}
              className="rounded-lg border border-success/30 px-3 py-1.5 text-sm font-medium text-success hover:bg-success/10"
            >
              Accept
            </button>
            <button
              onClick={() => onReject(applicant.workerId)}
              className="rounded-lg border border-danger/30 px-3 py-1.5 text-sm font-medium text-danger hover:bg-danger/10"
            >
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// Duplicated from JobCard/JobDetailPage — extract to shared util if modifying behavior
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
