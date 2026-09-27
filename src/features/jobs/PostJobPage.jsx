// Job creation and editing form with title, description, skills, and budget fields.
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useJobs } from '../../context/JobContext.jsx'
import DashboardLayout from '../../components/DashboardLayout.jsx'

const steps = ['Job Details', 'Skills & Budget', 'Review & Publish']

export default function PostJobPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { createJob, updateJob, getJobById } = useJobs()
  // URL param presence determines edit vs create mode
  const isEditing = Boolean(id)
  const existingJob = isEditing ? getJobById(id) : null

  const [step, setStep] = useState(1)
  // Pre-populate form when editing; null means no data yet (step 1 starts with null)
  const [formData, setFormData] = useState(
    isEditing && existingJob
      ? {
          title: existingJob.title,
          description: existingJob.description,
          category: existingJob.category,
          skills: existingJob.skills,
          budget: existingJob.budget,
          duration: existingJob.duration,
        }
      : null,
  )

  // Multi-step wizard: step 1 captures details, step 2 adds skills/budget, step 3 submits
  const handleFormSubmit = (data) => {
    if (step === 1) {
      setFormData(data)
      setStep(2)
      return
    }
    if (step === 2) {
      setFormData((prev) => ({ ...prev, ...data }))
      setStep(3)
      return
    }
    if (step === 3) {
      const jobData = {
        ...(formData || {}),
        companyId: user?.id || 'company-1',
        companyName: profile.name || user?.name || 'Company',
      }
      if (isEditing) {
        updateJob({ ...existingJob, ...jobData })
      } else {
        createJob(jobData)
      }
      navigate('/dashboard/company/jobs')
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <DashboardLayout role="company">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">
            {isEditing ? 'Edit Job' : 'Post a New Job'}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {isEditing ? 'Update your job listing details.' : 'Fill in the details to find the right talent.'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    i + 1 <= step
                      ? 'bg-primary text-white'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`ml-2 text-sm font-medium hidden sm:inline ${
                    i + 1 <= step ? 'text-neutral-900' : 'text-neutral-500'
                  }`}
                >
                  {s}
                </span>
                {i < steps.length - 1 && (
                  <div
                    className={`mx-4 hidden h-0.5 w-12 sm:block ${
                      i + 1 < step ? 'bg-primary' : 'bg-neutral-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="rounded-2xl border border-neutral-300 bg-white p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Job Title</label>
                <input
                  type="text"
                  value={formData?.title || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Senior React Developer"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Description</label>
                <textarea
                  value={formData?.description || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  placeholder="Describe the role, responsibilities, and requirements..."
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Category</label>
                <div className="flex flex-wrap gap-2">
                  {['Web', 'Mobile', 'Desktop', 'Browser'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, category: cat }))}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                        formData?.category === cat
                          ? 'bg-primary text-white'
                          : 'border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Required Skills</label>
                <input
                  type="text"
                  // Enter key adds skill inline; prevents form submission and duplicate entries
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const skill = e.target.value.trim()
                      if (skill && !formData?.skills?.includes(skill)) {
                        setFormData((prev) => ({ ...prev, skills: [...(prev?.skills || []), skill] }))
                        e.target.value = ''
                      }
                    }
                  }}
                  placeholder="Type a skill and press Enter"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
                {formData?.skills?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-1.5 rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              skills: prev.skills.filter((s) => s !== skill),
                            }))
                          }
                          className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Budget (USD)</label>
                  <input
                    type="number"
                    value={formData?.budget || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
                    placeholder="5000"
                    min="0"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Duration</label>
                  <input
                    type="text"
                    value={formData?.duration || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g. 3 months"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && formData && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-900">Review your job listing</h3>
              <div className="rounded-xl border border-neutral-200 p-4 space-y-3">
                <div>
                  <p className="text-xs text-neutral-500">Title</p>
                  <p className="font-medium text-neutral-900">{formData.title}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Description</p>
                  <p className="text-sm text-neutral-700">{formData.description}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Category</p>
                  <p className="font-medium text-neutral-900">{formData.category}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Skills</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {formData.skills?.map((s) => (
                      <span key={s} className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-neutral-500">Budget</p>
                    <p className="font-medium text-neutral-900">${Number(formData.budget).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Duration</p>
                    <p className="font-medium text-neutral-900">{formData.duration}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              type="button"
              onClick={() => handleFormSubmit(formData)}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              {/* Label changes based on final step and edit vs create mode */}
              {step === 3 ? (isEditing ? 'Update Job' : 'Publish Job') : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
