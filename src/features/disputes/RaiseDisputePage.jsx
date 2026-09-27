// Raise a dispute on an active contract (Dispute_Resolution.docx §1–3).
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useContracts } from '../../context/ContractContext.jsx'
import { useDisputes, disputeCategories } from '../../context/DisputeContext.jsx'
import { useNotifications } from '../../context/NotificationContext.jsx'

export default function RaiseDisputePage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { user, role } = useAuth()
  const { getContractById } = useContracts()
  const { openDispute, getDisputeForContract } = useDisputes()
  const { addNotification } = useNotifications()

  const contractId = params.get('contractId') || ''
  const contract = contractId ? getContractById(contractId) : null
  const existing = contractId ? getDisputeForContract(contractId) : null

  const [category, setCategory] = useState('payment')
  const [description, setDescription] = useState('')
  const [milestones, setMilestones] = useState([])
  const [evidenceLabel, setEvidenceLabel] = useState('')
  const [evidenceContent, setEvidenceContent] = useState('')
  const [evidenceList, setEvidenceList] = useState([])
  const [error, setError] = useState('')

  const isWorker = role === 'worker' && contract && String(user?.id) === String(contract.workerId)
  const isCompany = role === 'company' && contract && String(user?.id) === String(contract.companyId)
  const isParticipant = isWorker || isCompany

  const toggleMilestone = (id) => {
    setMilestones((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]))
  }

  const addEvidence = () => {
    if (!evidenceLabel.trim() || !evidenceContent.trim()) return
    setEvidenceList((list) => [
      ...list,
      {
        id: `ev-input-${list.length + 1}`,
        byRole: role,
        byName: role === 'worker' ? contract.workerName : contract.companyName,
        kind: 'text',
        label: evidenceLabel.trim(),
        content: evidenceContent.trim(),
        at: '2026-09-24T12:00:00Z',
      },
    ])
    setEvidenceLabel('')
    setEvidenceContent('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!contract) {
      setError('Select a valid contract.')
      return
    }
    if (!isParticipant) {
      setError('Only contract participants can open a dispute.')
      return
    }
    if (description.trim().length < 20) {
      setError('Describe the issue in at least 20 characters.')
      return
    }

    const openerRole = isWorker ? 'worker' : 'company'
    const responderRole = isWorker ? 'company' : 'worker'
    const openerName = isWorker ? contract.workerName : contract.companyName
    const responderName = isWorker ? contract.companyName : contract.workerName
    const responderId = isWorker ? contract.companyId : contract.workerId

    openDispute({
      contractId: contract.id,
      contractTitle: contract.jobTitle,
      openerId: user?.id ?? 1,
      openerRole,
      openerName,
      responderId,
      responderRole,
      responderName,
      category,
      description: description.trim(),
      milestonesReferenced: milestones,
      evidence: evidenceList,
      responseDeadline: '2026-10-01T12:00:00Z',
      now: '2026-09-24T12:00:00Z',
    })

    addNotification({
      type: 'system',
      title: 'Dispute opened',
      body: `${openerName} opened a dispute on ${contract.jobTitle}. You have 3 days to respond.`,
      link: `/contracts/${contract.id}`,
      recipientId: responderId,
      recipientRole: responderRole,
    })

    navigate(`/contracts/${contract.id}`)
  }

  return (
    <DashboardLayout role={role || 'worker'}>
      <div className="mx-auto max-w-2xl">
        <Link
          to={contract ? `/contracts/${contract.id}` : '/dashboard/worker/contracts'}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary"
        >
          ← Back
        </Link>

        <div className="rounded-2xl border border-neutral-300 bg-white p-6">
          <h1 className="text-2xl font-bold text-neutral-900">Open a Dispute</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Evidence submission → other party response → mutual resolution or admin escalation.
          </p>

          {existing && (
            <div className="mt-4 rounded-xl border border-warning/30 bg-warning/5 p-4 text-sm text-neutral-700">
              This contract already has an open dispute.{' '}
              <Link to={`/disputes/${existing.id}`} className="font-semibold text-primary hover:underline">
                View dispute →
              </Link>
            </div>
          )}

          {!contractId && (
            <div className="mt-4 rounded-xl bg-neutral-100 p-4 text-sm text-neutral-600">
              Open this flow from a contract page (Open Dispute) so the project and other party are
              auto-linked. You can also paste a contract id below.
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Contract</label>
              <input
                type="text"
                value={contractId}
                readOnly={Boolean(contract)}
                onChange={() => {}}
                placeholder="c-1"
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-700 focus:border-primary focus:outline-none"
              />
              {contract && (
                <p className="mt-1 text-xs text-neutral-500">
                  {contract.jobTitle} · {contract.companyName} ↔ {contract.workerName}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                {disputeCategories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Description of the issue
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="What happened, what outcome you expect…"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            {contract?.milestones?.length > 0 && (
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">
                  Reference milestone(s)
                </label>
                <div className="space-y-2">
                  {contract.milestones.map((m) => (
                    <label key={m.id} className="flex items-center gap-2 text-sm text-neutral-700">
                      <input
                        type="checkbox"
                        checked={milestones.includes(m.id)}
                        onChange={() => toggleMilestone(m.id)}
                      />
                      {m.title} (${m.amount.toLocaleString()})
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Evidence */}
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-sm font-semibold text-neutral-900">Evidence</p>
              <p className="text-xs text-neutral-500">
                Attach files, screenshots, or message excerpts (text notes in this demo).
              </p>
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  placeholder="Label (e.g. Delivery note)"
                  value={evidenceLabel}
                  onChange={(e) => setEvidenceLabel(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <textarea
                  placeholder="Details or excerpt…"
                  value={evidenceContent}
                  onChange={(e) => setEvidenceContent(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addEvidence}
                  className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  + Add evidence
                </button>
              </div>
              {evidenceList.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {evidenceList.map((ev) => (
                    <li key={ev.id} className="text-xs text-neutral-600">
                      • <strong>{ev.label}</strong>: {ev.content}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-lg bg-danger py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Open Dispute
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
