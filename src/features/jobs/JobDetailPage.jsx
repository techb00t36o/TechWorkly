// Full job detail page with description, applicant list, and apply sidebar.
import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useJobs } from '../../context/JobContext.jsx'
import { useContracts } from '../../context/ContractContext.jsx'
import { useNotifications } from '../../context/NotificationContext.jsx'
import AppLayout from '../../components/AppLayout.jsx'
import MakeOfferModal from '../contracts/components/MakeOfferModal.jsx'
import { getCompanyLogo } from '../../utils/companyLogo.js'

export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { getJobById, applyToJob, hasApplied, updateApplicationStatus } = useJobs()
  const { getContractForJobWorker } = useContracts()
  const { addNotification } = useNotifications()
  const job = getJobById(id)
  // Modal state for the company "Make Offer" flow
  const [offerApplicant, setOfferApplicant] = useState(null)

  if (!job) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-screen-2xl px-6 py-20 text-center">
          <p className="text-lg font-semibold text-neutral-900">Job not found</p>
          <Link to="/browse-jobs" className="mt-4 inline-block text-sm text-primary hover:underline">
            Browse all jobs
          </Link>
        </div>
      </AppLayout>
    )
  }

  // Derived permission flags: simplify repeated role checks throughout the component
  const isCompany = user?.role === 'company'
  const isWorker = user?.role === 'worker'
  const isOwner = isCompany && user?.id === job.companyId
  // Only check application status for workers; avoids unnecessary lookups for companies
  const applied = isWorker ? hasApplied(job.id, user.id) : false
  // Worker's offer for THIS job (pending or active) — drives the "View Offer" sidebar button
  const workerContract = isWorker ? getContractForJobWorker(job.id, user.id) : null
  const timeAgo = getTimeAgo(job.postedAt)

  const handleApply = () => {
    applyToJob(job.id, user.id, profile?.name || user?.name || 'Worker')
    // Notify the hiring company about the new application
    addNotification({
      type: 'application',
      title: 'New application',
      body: `${profile?.name || user?.name || 'A worker'} applied to ${job.title}.`,
      link: `/jobs/${job.id}`,
      recipientId: job.companyId,
    })
  }

  // Called after MakeOfferModal successfully creates a contract
  const handleOfferCreated = (contractId) => {
    // Mark the application accepted so the badge reflects the offer state
    if (offerApplicant) {
      updateApplicationStatus(job.id, offerApplicant.workerId, 'accepted')
    }
    setOfferApplicant(null)
    navigate(`/contracts/${contractId}`)
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-2xl px-6 py-10">
        <Link to="/browse-jobs" className="mb-6 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Jobs
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-neutral-300 bg-white p-8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-primary">
                      <span className="absolute inset-0 flex items-center justify-center font-semibold text-white">
                        {job.companyName[0]}
                      </span>
                      <img
                        src={job.companyLogo || getCompanyLogo(job.companyName)}
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
                  <h1 className="mt-4 text-2xl font-bold text-neutral-900">{job.title}</h1>
                </div>
                {/* Status badge: green for open, neutral gray for closed */}
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    job.status === 'open'
                      ? 'bg-success/10 text-success'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {job.status === 'open' ? 'Open' : 'Closed'}
                </span>
              </div>

              <div className="mt-6">
                <h2 className="mb-3 text-sm font-semibold text-neutral-900">Description</h2>
                <p className="text-sm leading-relaxed text-neutral-700 whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              <div className="mt-6">
                <h2 className="mb-3 text-sm font-semibold text-neutral-900">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-8 border-t border-neutral-200 pt-6">
                <div>
                  <p className="text-xs text-neutral-500">Budget</p>
                  <p className="mt-1 text-lg font-bold text-neutral-900">${job.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Duration</p>
                  <p className="mt-1 text-lg font-bold text-neutral-900">{job.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Posted</p>
                  <p className="mt-1 text-lg font-bold text-neutral-900">{timeAgo}</p>
                </div>
              </div>
            </div>

            {/* Applicants section — hidden from non-owner companies and workers */}
            {isOwner && (
              <div className="rounded-2xl border border-neutral-300 bg-white p-8">
                <h2 className="mb-4 text-lg font-semibold text-neutral-900">
                  Applicants ({job.applications.length})
                </h2>
                {job.applications.length === 0 ? (
                  <p className="text-sm text-neutral-500">No applications yet.</p>
                ) : (
                  <div className="space-y-4">
                    {job.applications.map((app) => {
                      // Detect an existing offer so we link to the contract instead of re-offering
                      const existingContract = getContractForJobWorker(job.id, app.workerId)
                      return (
                        <div
                          key={app.workerId}
                          className="flex items-center justify-between rounded-xl border border-neutral-200 p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                              {app.workerName[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-neutral-900">{app.workerName}</p>
                              <p className="text-xs text-neutral-500">Applied {getTimeAgo(app.appliedAt)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {/* Three-way status color: accepted=green, rejected=red, pending=yellow */}
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                app.status === 'accepted'
                                  ? 'bg-success/10 text-success'
                                  : app.status === 'rejected'
                                    ? 'bg-danger/10 text-danger'
                                    : 'bg-warning/10 text-warning'
                              }`}
                            >
                              {app.status}
                            </span>
                            {/* Offer actions: link to existing contract or open the offer modal */}
                            {existingContract ? (
                              <Link
                                to={`/contracts/${existingContract.id}`}
                                className="rounded-lg border border-primary/30 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary-light"
                              >
                                View Contract
                              </Link>
                            ) : (
                              app.status === 'pending' && (
                                <button
                                  onClick={() => setOfferApplicant(app)}
                                  className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary-dark"
                                >
                                  Make Offer
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-neutral-300 bg-white p-6">
              <h3 className="mb-4 text-sm font-semibold text-neutral-900">About the Company</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-semibold text-white">
                  {job.companyName[0]}
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{job.companyName}</p>
                  <p className="text-sm text-neutral-500">{job.category}</p>
                </div>
              </div>
              <Link
                to="#"
                className="mt-4 block w-full rounded-lg border border-neutral-300 py-2 text-center text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                View Company Profile
              </Link>
            </div>

            {/* Apply / Action card — content varies by role + job status */}
            <div className="rounded-2xl border border-neutral-300 bg-white p-6">
              {/* Worker with a pending/active offer: direct link to accept or track it */}
              {isWorker && workerContract && workerContract.status !== 'declined' && (
                <div className="mb-4 rounded-xl border border-warning/30 bg-warning/5 p-4 text-center">
                  <p className="text-sm font-semibold text-neutral-900">
                    {workerContract.status === 'pending' ? 'You have a pending offer' : 'Active contract'}
                  </p>
                  <Link
                    to={`/contracts/${workerContract.id}`}
                    className="mt-2 block w-full rounded-lg bg-primary py-2 text-center text-sm font-semibold text-white hover:bg-primary-dark"
                  >
                    {workerContract.status === 'pending' ? 'View Offer' : 'Open Contract'}
                  </Link>
                </div>
              )}
              {isWorker && job.status === 'open' && (
                <>
                  {applied ? (
                    <div className="text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                        <svg className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                      <p className="mt-3 font-semibold text-neutral-900">Application Submitted</p>
                      <p className="mt-1 text-sm text-neutral-500">You&apos;ve already applied to this job.</p>
                    </div>
                  ) : (
                    <button
                      onClick={handleApply}
                      className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
                    >
                      Apply Now
                    </button>
                  )}
                </>
              )}
              {isWorker && job.status === 'closed' && (
                <p className="text-center text-sm text-neutral-500">This job is no longer accepting applications.</p>
              )}
              {isOwner && (
                <div className="space-y-3">
                  <Link
                    to={`/dashboard/company/jobs/${job.id}/edit`}
                    className="block w-full rounded-lg border border-neutral-300 py-2.5 text-center text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    Edit Job
                  </Link>
                  <p className="text-center text-xs text-neutral-500">
                    {job.applications.length} application{job.applications.length !== 1 ? 's' : ''} received
                  </p>
                </div>
              )}
              {!user && (
                <Link
                  to="/login"
                  className="block w-full rounded-lg bg-primary py-2.5 text-center text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  Log in to Apply
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Make Offer modal — rendered only while an applicant is selected */}
      {offerApplicant && (
        <MakeOfferModal
          job={job}
          applicant={offerApplicant}
          onClose={() => setOfferApplicant(null)}
          onCreated={handleOfferCreated}
        />
      )}
    </AppLayout>
  )
}

// Converts ISO date string to human-readable relative time (e.g. "3 days ago").
// NOTE: Duplicated in JobCard and ApplicantCard — consider extracting to a shared util.
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
