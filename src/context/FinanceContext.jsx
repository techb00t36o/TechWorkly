// Private finance state (PRD 5.9): role-scoped wallets, transaction log,
// and derived escrow totals from the unified Contract model.
// Must render inside ContractProvider (uses useContracts).
import { createContext, useContext, useReducer, useMemo } from 'react'
import { useContracts } from './ContractContext.jsx'

const FinanceContext = createContext(null)

// Wallets are role-private: demo user id 1 acts as both roles, so balances
// are keyed by role, never shared. Public UI only ever shows trust badges.
const initialWallets = {
  worker: { available: 4250, totalEarnedLifetime: 18400, payoutMethod: 'Bank •••• 4821' },
  company: { available: 12500, totalFundedLifetime: 46200, paymentMethod: 'Visa •••• 9910' },
}

// Seed log covers every type from the page specs so filters have data on day one.
// role = whose perspective; amount sign is applied at render from direction.
const sampleTransactions = [
  { id: 'tx-1', role: 'company', type: 'deposit', amount: 10000, status: 'completed', projectTitle: 'Account top-up', counterparty: 'Visa •••• 9910', method: 'Visa •••• 9910', createdAt: '2026-08-01T10:00:00Z', contractId: null },
  { id: 'tx-2', role: 'company', type: 'funded', amount: 6000, status: 'completed', projectTitle: 'Security Auditor', counterparty: 'Amina K.', method: 'Wallet balance', createdAt: '2026-09-12T10:00:00Z', contractId: 'c-3' },
  { id: 'tx-3', role: 'worker', type: 'released', amount: 3250, status: 'completed', projectTitle: 'Backend API Developer', counterparty: 'Nimbus Labs', method: 'Escrow release', createdAt: '2026-09-19T09:00:00Z', contractId: 'c-4', milestoneTitle: 'API scaffold + auth' },
  { id: 'tx-4', role: 'company', type: 'released', amount: 3250, status: 'completed', projectTitle: 'Backend API Developer', counterparty: 'Amina K.', method: 'Escrow release', createdAt: '2026-09-19T09:00:00Z', contractId: 'c-4', milestoneTitle: 'API scaffold + auth' },
  { id: 'tx-5', role: 'company', type: 'funded', amount: 6500, status: 'completed', projectTitle: 'Backend API Developer', counterparty: 'Amina K.', method: 'Wallet balance', createdAt: '2026-09-08T10:00:00Z', contractId: 'c-4' },
  { id: 'tx-6', role: 'worker', type: 'released', amount: 5000, status: 'completed', projectTitle: 'Full-Stack Dashboard Developer', counterparty: 'Nimbus Labs', method: 'Escrow release', createdAt: '2026-08-19T09:00:00Z', contractId: 'c-5', milestoneTitle: 'MVP dashboard' },
  { id: 'tx-7', role: 'worker', type: 'released', amount: 5000, status: 'completed', projectTitle: 'Full-Stack Dashboard Developer', counterparty: 'Nimbus Labs', method: 'Escrow release', createdAt: '2026-08-31T09:00:00Z', contractId: 'c-5', milestoneTitle: 'Charts + reporting + handoff' },
  { id: 'tx-8', role: 'company', type: 'released', amount: 10000, status: 'completed', projectTitle: 'Full-Stack Dashboard Developer', counterparty: 'Amina K.', method: 'Escrow release', createdAt: '2026-08-31T09:00:00Z', contractId: 'c-5' },
  { id: 'tx-9', role: 'worker', type: 'withdrawal', amount: 2500, status: 'completed', projectTitle: 'Payout', counterparty: 'Bank •••• 4821', method: 'Bank •••• 4821', createdAt: '2026-08-25T14:00:00Z', contractId: null },
  { id: 'tx-10', role: 'company', type: 'funded', amount: 10000, status: 'completed', projectTitle: 'E-commerce Platform Rebuild', counterparty: 'Team escrow', method: 'Wallet balance', createdAt: '2026-09-15T10:00:00Z', contractId: null },
  { id: 'tx-11', role: 'worker', type: 'released', amount: 1800, status: 'pending', projectTitle: 'Security Auditor', counterparty: 'Nimbus Labs', method: 'Escrow release', createdAt: '2026-09-22T14:00:00Z', contractId: 'c-3', milestoneTitle: 'Vulnerability scan + report' },
  { id: 'tx-12', role: 'worker', type: 'withdrawal', amount: 800, status: 'pending', projectTitle: 'Payout', counterparty: 'PayPal •••• user@mail.com', method: 'PayPal', createdAt: '2026-09-21T11:00:00Z', contractId: null },
  { id: 'tx-13', role: 'company', type: 'refund', amount: 450, status: 'completed', projectTitle: 'QA Automation Engineer', counterparty: 'Dispute resolution', method: 'Wallet balance', createdAt: '2026-08-14T16:00:00Z', contractId: null },
]

// Counter increments in the reducer (outside render) so components stay pure.
function financeReducer(state, action) {
  switch (action.type) {
    case 'ADD_FUNDS': {
      const seq = state.seq + 1
      const wallet = state.wallets.company
      return {
        ...state,
        seq,
        wallets: {
          ...state.wallets,
          company: { ...wallet, available: wallet.available + action.payload.amount },
        },
        transactions: [
          {
            id: `tx-${seq}`,
            role: 'company',
            type: 'deposit',
            amount: action.payload.amount,
            status: 'completed',
            projectTitle: 'Account top-up',
            counterparty: action.payload.method,
            method: action.payload.method,
            createdAt: new Date().toISOString(),
            contractId: null,
          },
          ...state.transactions,
        ],
      }
    }
    // Gig order checkout: debit company wallet when paying from balance (escrow-first)
    case 'CHARGE_ESCROW': {
      const seq = state.seq + 1
      const wallet = state.wallets.company
      const amount = action.payload.amount
      if (amount > wallet.available) return state
      return {
        ...state,
        seq,
        wallets: {
          ...state.wallets,
          company: { ...wallet, available: wallet.available - amount },
        },
        transactions: [
          {
            id: `tx-${seq}`,
            role: 'company',
            type: 'funded',
            amount,
            status: 'completed',
            projectTitle: action.payload.projectTitle,
            counterparty: action.payload.counterparty,
            method: 'Wallet balance',
            createdAt: new Date().toISOString(),
            contractId: action.payload.contractId,
          },
          ...state.transactions,
        ],
      }
    }
    case 'WITHDRAW': {
      const seq = state.seq + 1
      const wallet = state.wallets.worker
      const nextAvailable = Math.max(0, wallet.available - action.payload.amount)
      return {
        ...state,
        seq,
        wallets: {
          ...state.wallets,
          worker: { ...wallet, available: nextAvailable },
        },
        transactions: [
          {
            id: `tx-${seq}`,
            role: 'worker',
            type: 'withdrawal',
            amount: action.payload.amount,
            status: 'pending',
            projectTitle: 'Payout',
            counterparty: action.payload.method,
            method: action.payload.method,
            createdAt: new Date().toISOString(),
            contractId: null,
          },
          ...state.transactions,
        ],
      }
    }
    case 'COMPLETE_WITHDRAWAL': {
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload ? { ...t, status: 'completed' } : t,
        ),
      }
    }
    default:
      return state
  }
}

// Merges seed log with live contract fund/release events so dashboards stay
// accurate after EscrowPanel / MilestoneTracker actions.
function deriveContractEvents(contracts, existing) {
  const known = new Set(existing.map((t) => t.contractId + t.type + (t.milestoneTitle || '')))
  const extra = []

  contracts.forEach((c) => {
    const fundKey = `${c.id}funded`
    if (c.escrow?.funded && !existing.some((t) => t.contractId === c.id && t.type === 'funded')) {
      if (!known.has(fundKey)) {
        extra.push({
          id: `auto-f-${c.id}`,
          role: 'company',
          type: 'funded',
          amount: c.totalAmount,
          status: 'completed',
          projectTitle: c.jobTitle,
          counterparty: c.workerName,
          method: 'Wallet balance',
          createdAt: c.escrow.fundedAt || c.createdAt,
          contractId: c.id,
        })
      }
    }
    ;(c.milestones || []).forEach((m) => {
      if (m.status !== 'released' || !m.releasedAt) return
      const key = `${c.id}released${m.title}`
      if (existing.some((t) => t.contractId === c.id && t.milestoneTitle === m.title && t.type === 'released')) {
        return
      }
      if (known.has(key)) return
      extra.push(
        {
          id: `auto-rw-${c.id}-${m.id}`,
          role: 'worker',
          type: 'released',
          amount: m.amount,
          status: 'completed',
          projectTitle: c.jobTitle,
          counterparty: c.companyName,
          method: 'Escrow release',
          createdAt: m.releasedAt,
          contractId: c.id,
          milestoneTitle: m.title,
        },
        {
          id: `auto-rc-${c.id}-${m.id}`,
          role: 'company',
          type: 'released',
          amount: m.amount,
          status: 'completed',
          projectTitle: c.jobTitle,
          counterparty: c.workerName,
          method: 'Escrow release',
          createdAt: m.releasedAt,
          contractId: c.id,
          milestoneTitle: m.title,
        },
      )
    })
  })

  return extra.length ? [...extra, ...existing] : existing
}

export function FinanceProvider({ children }) {
  const { contracts } = useContracts()
  const [state, dispatch] = useReducer(financeReducer, {
    wallets: initialWallets,
    transactions: sampleTransactions,
    seq: 100,
  })

  const allTransactions = useMemo(
    () => deriveContractEvents(contracts, state.transactions),
    [contracts, state.transactions],
  )

  const addFunds = (amount, method) => {
    dispatch({ type: 'ADD_FUNDS', payload: { amount, method } })
  }

  // Debit company wallet for a gig order / escrow funding event
  const chargeEscrow = (amount, { projectTitle, counterparty, contractId } = {}) => {
    dispatch({
      type: 'CHARGE_ESCROW',
      payload: { amount, projectTitle, counterparty, contractId },
    })
  }

  const withdraw = (amount, method) => {
    dispatch({ type: 'WITHDRAW', payload: { amount, method } })
    // Mock settlement: mark the withdrawal completed shortly after "request"
    // (no timer in render — left pending until user refreshes is also fine;
    // we complete it optimistically for demo feel via a second action call site)
    return amount
  }

  const completeWithdrawal = (txId) => {
    dispatch({ type: 'COMPLETE_WITHDRAWAL', payload: txId })
  }

  const getTransactionsByRole = (role) =>
    allTransactions
      .filter((t) => t.role === role)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  // Escrow still locked: funded contracts with unreleased milestone amounts
  const getEscrowPositions = (role) => {
    const list = role === 'worker' ? getWorkerContracts() : getCompanyContracts()
    return list
      .filter((c) => c.escrow?.funded && c.status !== 'declined')
      .map((c) => {
        const unreleased = (c.milestones || [])
          .filter((m) => m.status !== 'released')
          .reduce((s, m) => s + m.amount, 0)
        const nextMilestone = (c.milestones || []).find((m) => m.status !== 'released')
        return {
          contractId: c.id,
          title: c.jobTitle,
          sourceType: c.sourceType || 'JOB',
          counterparty: role === 'worker' ? c.companyName : c.workerName,
          amount: unreleased,
          releaseTrigger: nextMilestone
            ? nextMilestone.status === 'submitted'
              ? 'Releases on milestone approval'
              : `Releases on "${nextMilestone.title}"`
            : 'All milestones released',
        }
      })
      .filter((p) => p.amount > 0)
  }

  const getWorkerContracts = () =>
    contracts.filter((c) => c.status === 'active' || c.status === 'completed' || c.status === 'pending')

  const getCompanyContracts = () => getWorkerContracts()

  // Role-aware summary strip (private — never rendered on public profiles)
  const getSummary = (role) => {
    const wallet = state.wallets[role]
    const positions = getEscrowPositions(role)
    const inEscrow = positions.reduce((s, p) => s + p.amount, 0)
    const txs = getTransactionsByRole(role)
    const released = txs
      .filter((t) => t.type === 'released' && t.status === 'completed')
      .reduce((s, t) => s + t.amount, 0)
    const deposited = txs
      .filter((t) => t.type === 'deposit' && t.status === 'completed')
      .reduce((s, t) => s + t.amount, 0)
    const funded = txs
      .filter((t) => t.type === 'funded' && t.status === 'completed')
      .reduce((s, t) => s + t.amount, 0)
    const withdrawn = txs
      .filter((t) => t.type === 'withdrawal' && t.status !== 'failed')
      .reduce((s, t) => s + t.amount, 0)

    if (role === 'worker') {
      return {
        available: wallet.available,
        inEscrow,
        // Lifetime earned = seeded baseline + live releases observed in session
        totalEarned: wallet.totalEarnedLifetime + released,
        totalWithdrawn: withdrawn,
        totalReleased: released,
        payoutMethod: wallet.payoutMethod,
        positions,
      }
    }
    return {
      available: wallet.available,
      inEscrow,
      totalFunded: wallet.totalFundedLifetime + funded,
      totalAdded: deposited,
      totalSpent: funded + 0,
      paymentMethod: wallet.paymentMethod,
      positions,
    }
  }

  // Breakdown by source type for the chart strip (Jobs vs Team Roles)
  const getBreakdown = (role) => {
    const txs = getTransactionsByRole(role).filter((t) => t.status === 'completed')
    let jobs = 0
    let teams = 0
    txs.forEach((t) => {
      const isTeam =
        contracts.find((c) => c.id === t.contractId)?.sourceType === 'TEAM_ROLE'
      const amt = t.amount
      if (t.type === 'released' || t.type === 'funded') {
        if (isTeam) teams += amt
        else jobs += amt
      }
    })
    return { jobs, teams }
  }

  const value = {
    transactions: allTransactions,
    addFunds,
    chargeEscrow,
    withdraw,
    completeWithdrawal,
    getTransactionsByRole,
    getEscrowPositions,
    getSummary,
    getBreakdown,
  }

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

// eslint-disable-next-line react-only-export-components -- intentional: hook belongs with its provider
export function useFinance() {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}
