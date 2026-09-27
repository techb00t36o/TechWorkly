// Order a Gig (Order_a_Gig.docx): package select → requirements → summary → escrow.
import { useState } from 'react'
import { Link, useParams, useSearchParams, useNavigate, Navigate } from 'react-router-dom'
import {
  Shield,
  CheckCircle2,
  CreditCard,
  FileText,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import AppLayout from '../../components/AppLayout.jsx'
import { useGigs } from '../../context/GigContext.jsx'
import { useContracts } from '../../context/ContractContext.jsx'
import { useMessages } from '../../context/MessageContext.jsx'
import { useNotifications } from '../../context/NotificationContext.jsx'
import { useFinance } from '../../context/FinanceContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const steps = ['Package', 'Requirements', 'Payment', 'Confirm']

export default function OrderGigPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, role } = useAuth()
  const { getGigById, placeOrder, incrementOrderCount } = useGigs()
  const { createOffer, getGigOrderByGigWorker } = useContracts()
  const { findOrCreateConversation } = useMessages()
  const { addNotification } = useNotifications()
  const { getSummary, chargeEscrow } = useFinance()

  const gig = getGigById(id)
  const preselect = searchParams.get('tier')

  const [step, setStep] = useState(0)
  const [tier, setTier] = useState(
    preselect && gig?.packages.some((p) => p.tier === preselect)
      ? preselect
      : gig?.packages[0]?.tier || 'basic',
  )
  const [answers, setAnswers] = useState({})
  const [paymentMethod, setPaymentMethod] = useState('wallet')
  const [placedContractId, setPlacedContractId] = useState(null)

  if (!gig) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <p className="font-semibold text-neutral-900">Gig not found</p>
          <Link to="/browse-gigs" className="mt-3 inline-block text-sm text-primary hover:underline">
            Back to Browse Gigs
          </Link>
        </div>
      </AppLayout>
    )
  }

  // Pre-order check (Order_a_Gig §1): prompt login if not signed in
  if (!user) {
    return <Navigate to={`/login?next=${encodeURIComponent(`/gigs/${gig.id}/order`)}`} replace />
  }

  // Pre-order checks (Order_a_Gig §1): company role + demo payment method present
  if (role && role !== 'company') {
    return (
      <AppLayout>
        <div className="mx-auto max-w-xl px-6 py-16 text-center">
          <div className="rounded-2xl border border-warning/30 bg-warning/5 p-8">
            <h1 className="text-lg font-semibold text-neutral-900">Company account required</h1>
            <p className="mt-2 text-sm text-neutral-600">
              Only company accounts can order gigs. Switch role or log in with a company profile.
            </p>
            <Link
              to={`/gigs/${gig.id}`}
              className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Back to gig
            </Link>
          </div>
        </div>
      </AppLayout>
    )
  }

  const pkg = gig.packages.find((p) => p.tier === tier) || gig.packages[0]
  const platformFee = Math.round(pkg.price * 0.05)
  const total = pkg.price + platformFee
  const deliveryDate = (() => {
    const d = new Date()
    d.setDate(d.getDate() + pkg.deliveryDays)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  })()

  // Duplicate order guard for this demo company
  const existing = getGigOrderByGigWorker(gig.id, user?.id || 1)
  const wallet = getSummary('company')

  // Payment-method setup pre-check (Order_a_Gig §1): no method on file → balance page
  const needsPaymentSetup = !wallet.paymentMethod

  const handlePay = () => {
    if (needsPaymentSetup) {
      navigate('/dashboard/company/balance')
      return
    }
    // Unified contract: instant purchase = active + funded in one step (escrow-first)
    const contractId = createOffer({
      jobId: gig.id,
      gigId: gig.id,
      jobTitle: gig.title,
      companyId: user?.id || 1,
      companyName: user?.name || 'Nimbus Labs',
      workerId: gig.workerId,
      workerName: gig.workerName,
      totalAmount: pkg.price,
      sourceType: 'GIG_ORDER',
      packageTier: pkg.tier,
      status: 'active',
      escrow: { funded: true, fundedAt: new Date().toISOString() },
      milestones: [
        {
          // Stable id: one open order per gig is already guarded above
          id: `m-${gig.id}-${pkg.tier}`,
          title: `Gig delivery (${pkg.name})`,
          amount: pkg.price,
          dueDate: deliveryDate,
          status: 'pending',
          submittedAt: null,
          releasedAt: null,
        },
      ],
      message: `Ordered ${pkg.name} package — ${pkg.deliveryDays}-day delivery.`,
    })

    // Wallet path debits balance; card path leaves wallet untouched (EscrowPanel pattern)
    if (paymentMethod === 'wallet') {
      chargeEscrow(total, {
        projectTitle: gig.title,
        counterparty: gig.workerName,
        contractId,
      })
    }

    placeOrder({
      contractId,
      gigId: gig.id,
      packageTier: pkg.tier,
      companyId: user?.id || 1,
      companyName: user?.name || 'Nimbus Labs',
      workerId: gig.workerId,
      workerName: gig.workerName,
      requirementsAnswers: gig.requirements.map((r) => ({
        label: r.label,
        value: answers[r.id] || '—',
      })),
      status: 'active',
      orderedAt: new Date().toISOString(),
    })
    incrementOrderCount(gig.id)
    // Lightweight workspace chat thread
    findOrCreateConversation({
      contractId,
      jobId: gig.id,
      workerId: gig.workerId,
      workerName: gig.workerName,
      companyId: user?.id || 1,
      companyName: user?.name || 'Nimbus Labs',
    })
    addNotification({
      type: 'application',
      title: 'New gig order',
      body: `${user?.name || 'A company'} ordered ${gig.title} (${pkg.name}).`,
      link: `/contracts/${contractId}`,
      recipientId: gig.workerId,
    })
    addNotification({
      type: 'payment',
      title: 'Escrow funded',
      body: `$${pkg.price} secured for ${gig.title}.`,
      link: `/contracts/${contractId}`,
      recipientId: user?.id || 1,
    })
    setPlacedContractId(contractId)
    setStep(3)
  }

  if (placedContractId && step === 3) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-xl px-6 py-16">
          <div className="rounded-2xl border border-success/30 bg-success/5 p-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
            <h1 className="mt-4 text-xl font-bold text-neutral-900">Order placed</h1>
            <p className="mt-2 text-sm text-neutral-600">
              Escrow is funded. The order appears in both My Orders lists and the gig workspace
              chat is ready.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to={`/contracts/${placedContractId}`}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                Open order workspace
              </Link>
              <Link
                to="/browse-gigs"
                className="rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                Browse more gigs
              </Link>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (existing && step < 3) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-xl px-6 py-16 text-center">
          <div className="rounded-2xl border border-neutral-300 bg-white p-8">
            <p className="font-semibold text-neutral-900">You already ordered this gig</p>
            <p className="mt-1 text-sm text-neutral-500">
              Track delivery and chat with {gig.workerName} from the order workspace.
            </p>
            <Link
              to={`/contracts/${existing.id}`}
              className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              View existing order
            </Link>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link
          to={`/gigs/${gig.id}`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to gig
        </Link>

        {/* Stepper */}
        <ol className="mb-8 flex items-center gap-2">
          {steps.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  i <= step ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-500'
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`text-xs font-medium ${i <= step ? 'text-neutral-900' : 'text-neutral-400'}`}
              >
                {label}
              </span>
              {i < steps.length - 1 && <div className="h-px flex-1 bg-neutral-200" />}
            </li>
          ))}
        </ol>

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="rounded-2xl border border-neutral-300 bg-white p-6">
            {/* Step 0 — package */}
            {step === 0 && (
              <>
                <h1 className="text-lg font-semibold text-neutral-900">Select package</h1>
                <div className="mt-4 space-y-3">
                  {gig.packages.map((p) => (
                    <label
                      key={p.tier}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
                        tier === p.tier
                          ? 'border-primary bg-primary-light/40'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="tier"
                        checked={tier === p.tier}
                        onChange={() => setTier(p.tier)}
                        className="mt-1 accent-[var(--color-primary,#0f6e56)]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-neutral-900">{p.name}</span>
                          <span className="text-lg font-bold text-neutral-900">${p.price}</span>
                        </div>
                        <p className="mt-1 text-xs text-neutral-500">
                          {p.deliveryDays}-day delivery · {p.revisions} revision
                          {p.revisions > 1 ? 's' : ''}
                        </p>
                        <p className="mt-2 text-sm text-neutral-600">{p.features.join(' · ')}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </>
            )}

            {/* Step 1 — requirements */}
            {step === 1 && (
              <>
                <h1 className="text-lg font-semibold text-neutral-900">Requirements</h1>
                <p className="mt-1 text-sm text-neutral-500">
                  Answer what {gig.workerName} needs to start. You can add files after ordering in
                  chat.
                </p>
                <div className="mt-5 space-y-4">
                  {gig.requirements.map((r) => (
                    <div key={r.id}>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-800">
                        {r.label}
                      </label>
                      {r.type === 'file' ? (
                        <div className="flex items-center gap-2 rounded-lg border border-dashed border-neutral-300 px-3 py-3 text-sm text-neutral-500">
                          <FileText className="h-4 w-4" />
                          <input
                            type="text"
                            placeholder="File link or describe attachment…"
                            value={answers[r.id] || ''}
                            onChange={(e) => setAnswers({ ...answers, [r.id]: e.target.value })}
                            className="flex-1 bg-transparent text-sm focus:outline-none"
                          />
                        </div>
                      ) : (
                        <textarea
                          rows={2}
                          value={answers[r.id] || ''}
                          onChange={(e) => setAnswers({ ...answers, [r.id]: e.target.value })}
                          placeholder="Your answer…"
                          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Step 2 — payment */}
            {step === 2 && (
              <>
                <h1 className="text-lg font-semibold text-neutral-900">Payment & escrow</h1>
                <p className="mt-1 text-sm text-neutral-500">
                  Funds are held in escrow until you accept delivery.
                </p>
                <div className="mt-5 space-y-3">
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${
                      paymentMethod === 'wallet'
                        ? 'border-primary bg-primary-light/40'
                        : 'border-neutral-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pay"
                      checked={paymentMethod === 'wallet'}
                      onChange={() => setPaymentMethod('wallet')}
                    />
                    <CreditCard className="h-5 w-5 text-neutral-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900">Wallet balance</p>
                      <p className="text-xs text-neutral-500">
                        Available ${wallet.available.toLocaleString()} · {wallet.paymentMethod}
                      </p>
                    </div>
                  </label>
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${
                      paymentMethod === 'card'
                        ? 'border-primary bg-primary-light/40'
                        : 'border-neutral-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pay"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <CreditCard className="h-5 w-5 text-neutral-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900">Visa •••• 9910</p>
                      <p className="text-xs text-neutral-500">Default card on file</p>
                    </div>
                  </label>
                </div>
                <div className="mt-5 flex items-start gap-2 rounded-xl bg-success/5 p-4 text-xs text-neutral-600">
                  <Shield className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <p>
                    Escrow-first: this order only goes live when payment clears. Disputes can be
                    opened from the order workspace if delivery goes wrong.
                  </p>
                </div>
              </>
            )}

            {/* Nav */}
            <div className="mt-6 flex justify-between border-t border-neutral-200 pt-5">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
              >
                Back
              </button>
              {step < 2 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={step === 1 && gig.requirements.some((r) => !answers[r.id]?.trim())}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : needsPaymentSetup ? (
                <button
                  onClick={() => navigate('/dashboard/company/balance')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  Set up payment method
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handlePay}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  Pay & Fund Escrow · ${total}
                </button>
              )}
            </div>
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-2xl border border-neutral-300 bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
              Order summary
            </h2>
            <div className="mt-4 flex gap-3">
              <img
                src={gig.image}
                alt=""
                className="h-16 w-20 rounded-lg object-cover"
              />
              <div>
                <p className="text-sm font-medium text-neutral-900">{gig.title}</p>
                <p className="text-xs text-neutral-500">{gig.workerName}</p>
              </div>
            </div>
            <dl className="mt-4 space-y-2 border-t border-neutral-200 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-500">{pkg.name} package</dt>
                <dd className="font-medium text-neutral-900">${pkg.price}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Platform fee (5%)</dt>
                <dd className="font-medium text-neutral-900">${platformFee}</dd>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-2">
                <dt className="font-semibold text-neutral-900">Total</dt>
                <dd className="font-bold text-neutral-900">${total}</dd>
              </div>
              <div className="flex justify-between text-xs text-neutral-500">
                <dt>Est. delivery</dt>
                <dd>{deliveryDate}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </AppLayout>
  )
}
