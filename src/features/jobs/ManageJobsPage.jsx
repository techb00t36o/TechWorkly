// Company job management page with tabs for active, draft, and closed listings.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useJobs } from '../../context/JobContext.jsx'
import DashboardLayout from '../../components/DashboardLayout.jsx'

export default function ManageJobsPage() {
  const { user } = useAuth()
  const { getJobsByCompany, toggleJobStatus, deleteJob } = useJobs()
  const companyJobs = getJobsByCompany(user?.id || 'company-1')
  const [tab, setTab] = useState('all')

  // Tab-based filter: 'all' returns everything, other tabs match status exactly
  const filtered = companyJobs.filter((j) => {
    if (tab === 'open') return j.status === 'open'
    if (tab === 'closed') return j.status === 'closed'
    return true
  })

  // Browser confirm for destructive action — prevents accidental permanent deletion
  const handleDelete = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteJob(jobId)
    }
  }

  return (
    <DashboardLayout role="company">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Jobs</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage your posted job listings and review applicants.
          </p>
        </div>
        <Link
          to="/dashboard/company/jobs/new"
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          + Post New Job
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        {/* Counts computed inline — filters run on every render but dataset is small */}
        {[
          { key: 'all', label: 'All', count: companyJobs.length },
          { key: 'open', label: 'Open', count: companyJobs.filter((j) => j.status === 'open').length },
          { key: 'closed', label: 'Closed', count: companyJobs.filter((j) => j.status === 'closed').length },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              tab === t.key
                ? 'bg-primary text-white'
                : 'border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Job list */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-neutral-300 bg-white p-12 text-center">
          <p className="text-lg font-semibold text-neutral-900">No jobs found</p>
          <p className="mt-2 text-sm text-neutral-500">
            {tab === 'all'
              ? 'Post your first job to start hiring.'
              : `No ${tab} jobs at the moment.`}
          </p>
          <Link
            to="/dashboard/company/jobs/new"
            className="mt-4 inline-block rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            + Post a Job
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-neutral-300 bg-white p-6 transition hover:border-primary hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-neutral-900">{job.title}</h3>
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
                  <div className="mt-2 flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
                <div className="flex items-center gap-6 text-sm text-neutral-500">
                  <span>
                    <span className="font-semibold text-neutral-900">${job.budget.toLocaleString()}</span> budget
                  </span>
                  <span>
                    <span className="font-semibold text-neutral-900">{job.applications.length}</span> applicant{job.applications.length !== 1 ? 's' : ''}
                  </span>
                  <span>{job.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    View
                  </Link>
                  <Link
                    to={`/dashboard/company/jobs/${job.id}/edit`}
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => toggleJobStatus(job.id)}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
                      job.status === 'open'
                        ? 'border-warning/30 text-warning hover:bg-warning/10'
                        : 'border-success/30 text-success hover:bg-success/10'
                    }`}
                  >
                    {job.status === 'open' ? 'Close' : 'Reopen'}
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="rounded-lg border border-danger/30 px-3 py-1.5 text-sm font-medium text-danger hover:bg-danger/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
