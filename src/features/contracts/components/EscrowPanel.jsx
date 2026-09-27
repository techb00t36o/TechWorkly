// Escrow status panel with mock card funding modal (no real Stripe integration).
import { useState } from 'react'
import { Lock, ShieldCheck, DollarSign } from 'lucide-react'
import { useContracts } from '../../../context/ContractContext.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useNotifications } from '../../../context/NotificationContext.jsx'

export default function EscrowPanel({ contract }) {
  const { fundEscrow } = useContracts()
  const { user, role } = useAuth()
  const { addNotification } = useNotifications()
  const [showModal, setShowModal] = useState(false)
  const [card, setCard] = useState('')
  const [exp, setExp] = useState('')
  const [cvc, setCvc] = useState('')

  const isCompany = role === 'company' && String(user?.id) === String(contract.companyId)
  const funded = contract.escrow.funded

  const total = contract.totalAmount
  const released = contract.milestones
    .filter((m) => m.status === 'released')
    .reduce((sum, m) => sum + m.amount, 0)
  const held = funded ? total - released : 0

  // Basic client-side gating before dispatching the mock fund action
  const canFund = card.replace(/\s/g, '').length >= 12 && exp.length >= 4 && cvc.length >= 3

  const handleFund = (e) => {
    e.preventDefault()
    if (!canFund) return
    fundEscrow(contract.id)
    // Notify the worker that escrow is secured and work can begin
    addNotification({
      type: 'payment',
      title: 'Escrow funded',
      body: `$${contract.totalAmount.toLocaleString()} secured for ${contract.jobTitle}.`,
      link: `/contracts/${contract.id}`,
      recipientId: contract.workerId,
    })
    setShowModal(false)
    setCard('')
    setExp('')
    setCvc('')
  }

  // Format card number in groups of 4 as the user types
  const handleCardChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16)
    setCard(digits.replace(/(.{4})/g, '$1 ').trim())
  }

  return (
    <div className="rounded-2xl border border-neutral-300 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
          <ShieldCheck className="h-5 w-5 text-success" />
          Escrow
        </h2>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            funded ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
          }`}
        >
          {funded ? 'Funded' : 'Not funded'}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">Contract value</span>
          <span className="font-semibold text-neutral-900">${total.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">Held in escrow</span>
          <span className="font-semibold text-warning">${held.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">Released</span>
          <span className="font-semibold text-success">${released.toLocaleString()}</span>
        </div>
      </div>

      {contract.status === 'active' && !funded && isCompany && (
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          <Lock className="h-4 w-4" />
          Fund Escrow (${total.toLocaleString()})
        </button>
      )}

      {contract.status === 'active' && !funded && !isCompany && (
        <p className="mt-4 rounded-lg bg-neutral-100 px-3 py-2 text-center text-xs text-neutral-500">
          Waiting for the company to fund escrow before work begins.
        </p>
      )}

      {funded && (
        <p className="mt-4 flex items-center gap-1.5 rounded-lg bg-success/10 px-3 py-2 text-xs text-success">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
          Funds secured. Releases happen on milestone approval.
        </p>
      )}

      {/* Mock payment modal — card data is never sent anywhere (frontend-only demo) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-300 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">Fund Escrow</h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4 flex items-center gap-2 rounded-lg bg-primary-light px-3 py-2.5 text-sm text-primary">
              <DollarSign className="h-4 w-4" />
              <span className="font-semibold">${total.toLocaleString()}</span>
              <span className="text-neutral-500">to be held until milestones release</span>
            </div>

            <form onSubmit={handleFund} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Card number</label>
                <input
                  type="text"
                  value={card}
                  onChange={handleCardChange}
                  placeholder="4242 4242 4242 4242"
                  inputMode="numeric"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Expiry</label>
                  <input
                    type="text"
                    value={exp}
                    onChange={(e) => setExp(e.target.value.replace(/\D/g, '').slice(0, 4).replace(/(.{2})/g, '$1 / ').trim())}
                    placeholder="MM / YY"
                    inputMode="numeric"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">CVC</label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="123"
                    inputMode="numeric"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                  />
                </div>
              </div>

              <p className="text-xs text-neutral-400">
                Demo only — no real payment is processed.
              </p>

              <button
                type="submit"
                disabled={!canFund}
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm & Fund ${total.toLocaleString()}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
