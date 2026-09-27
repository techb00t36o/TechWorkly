// Modal form for companies to send a milestone-based offer to an applicant.
import { useState } from 'react'
import { useContracts } from '../../../context/ContractContext.jsx'
import { useNotifications } from '../../../context/NotificationContext.jsx'

export default function MakeOfferModal({ job, applicant, onClose, onCreated }) {
  const { createOffer } = useContracts()
  const { addNotification } = useNotifications()

  // Default: single milestone covering the full job budget (Phase 1 simplest case)
  const [milestones, setMilestones] = useState([
    { title: 'Full delivery', amount: String(job.budget || ''), dueDate: '' },
  ])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const total = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0)

  const updateMilestone = (index, field, value) => {
    setMilestones((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    )
    setError('')
  }

  const addMilestone = () => {
    setMilestones((prev) => [...prev, { title: '', amount: '', dueDate: '' }])
  }

  const removeMilestone = (index) => {
    // Keep at least one milestone — an offer must define a deliverable
    setMilestones((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))
  }

  // Sequential validation: first failing field wins (matches JobForm pattern)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (milestones.some((m) => !m.title.trim())) {
      setError('Every milestone needs a title.')
      return
    }
    if (milestones.some((m) => !m.amount || Number(m.amount) <= 0)) {
      setError('Every milestone needs an amount greater than 0.')
      return
    }
    if (total <= 0) {
      setError('Offer total must be greater than 0.')
      return
    }

    const contractId = createOffer({
      jobId: job.id,
      jobTitle: job.title,
      companyId: job.companyId,
      companyName: job.companyName,
      workerId: applicant.workerId,
      workerName: applicant.workerName,
      totalAmount: total,
      message: message.trim(),
      milestones: milestones.map((m, i) => ({
        id: `${Date.now()}-${i}`,
        title: m.title.trim(),
        amount: Number(m.amount),
        dueDate: m.dueDate || 'TBD',
        status: 'pending',
        submittedAt: null,
        releasedAt: null,
      })),
    })
    // Notify the worker that an offer is waiting for them
    addNotification({
      type: 'application',
      title: 'New offer',
      body: `${job.companyName} sent you an offer for ${job.title}.`,
      link: `/contracts/${contractId}`,
      recipientId: applicant.workerId,
    })
    onCreated(contractId)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-neutral-300 bg-white p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Make an Offer</h3>
            <p className="mt-0.5 text-sm text-neutral-500">
              {job.title} · {applicant.workerName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Milestone rows: dynamic add/remove, amounts sum to offer total */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Milestones</label>
            <div className="space-y-3">
              {milestones.map((m, i) => (
                <div key={i} className="rounded-xl border border-neutral-200 p-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) => updateMilestone(i, 'title', e.target.value)}
                        placeholder={`Milestone ${i + 1} title`}
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={m.amount}
                          onChange={(e) => updateMilestone(i, 'amount', e.target.value)}
                          placeholder="Amount (USD)"
                          min="0"
                          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                        />
                        <input
                          type="date"
                          value={m.dueDate}
                          onChange={(e) => updateMilestone(i, 'dueDate', e.target.value)}
                          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                        />
                      </div>
                    </div>
                    {milestones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMilestone(i)}
                        className="mt-1 rounded-lg p-1.5 text-neutral-400 hover:bg-danger/10 hover:text-danger"
                        aria-label="Remove milestone"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addMilestone}
              className="mt-2 text-sm font-medium text-primary hover:text-primary-dark"
            >
              + Add milestone
            </button>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-neutral-100 px-3 py-2.5 text-sm">
            <span className="text-neutral-500">Offer total</span>
            <span className="font-bold text-neutral-900">${total.toLocaleString()}</span>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Message <span className="font-normal text-neutral-400">(optional)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Introduce the offer, timeline, or expectations..."
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Send Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
