// Contract state for offers, escrow funding, and milestone tracking (PRD 5.7).
import { createContext, useContext, useReducer } from 'react'

const ContractContext = createContext(null)

// Milestone status flow: pending (awaiting work) → submitted (awaiting approval)
// → released (escrow payout done). Contract completes when ALL milestones release.
const sampleContracts = [
  {
    id: 'c-1',
    jobId: '1',
    jobTitle: 'Senior React Developer',
    companyId: 1,
    companyName: 'Nimbus Labs',
    workerId: 1,
    workerName: 'Amina K.',
    totalAmount: 8000,
    status: 'pending',
    escrow: { funded: false, fundedAt: null },
    milestones: [
      { id: 'c-1-m1', title: 'Initial delivery', amount: 8000, dueDate: '2026-10-15', status: 'pending', submittedAt: null, releasedAt: null },
    ],
    message: 'We were impressed by your application. Here is an offer with a single milestone covering the full scope.',
    createdAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'c-2',
    jobId: '2',
    jobTitle: 'Flutter Mobile Developer',
    companyId: 1,
    companyName: 'Nimbus Labs',
    workerId: 1,
    workerName: 'Amina K.',
    totalAmount: 7000,
    status: 'active',
    escrow: { funded: false, fundedAt: null },
    milestones: [
      { id: 'c-2-m1', title: 'Auth + payments module', amount: 3500, dueDate: '2026-10-01', status: 'pending', submittedAt: null, releasedAt: null },
      { id: 'c-2-m2', title: 'Realtime dashboard + release', amount: 3500, dueDate: '2026-10-20', status: 'pending', submittedAt: null, releasedAt: null },
    ],
    message: 'Two-milestone plan. Escrow must be funded before work submission begins.',
    createdAt: '2026-09-15T09:00:00Z',
  },
  {
    id: 'c-3',
    jobId: '4',
    jobTitle: 'Security Auditor',
    companyId: 1,
    companyName: 'Nimbus Labs',
    workerId: 1,
    workerName: 'Amina K.',
    totalAmount: 6000,
    status: 'active',
    escrow: { funded: true, fundedAt: '2026-09-12T10:00:00Z' },
    milestones: [
      { id: 'c-3-m1', title: 'Vulnerability scan + report', amount: 3000, dueDate: '2026-09-25', status: 'submitted', submittedAt: '2026-09-22T14:00:00Z', releasedAt: null },
      { id: 'c-3-m2', title: 'Remediation review', amount: 3000, dueDate: '2026-10-10', status: 'pending', submittedAt: null, releasedAt: null },
    ],
    message: 'Escrow funded. First milestone submitted and awaiting your approval.',
    createdAt: '2026-09-10T08:00:00Z',
  },
  {
    id: 'c-4',
    jobId: '6',
    jobTitle: 'Backend API Developer',
    companyId: 1,
    companyName: 'Nimbus Labs',
    workerId: 1,
    workerName: 'Amina K.',
    totalAmount: 6500,
    status: 'active',
    escrow: { funded: true, fundedAt: '2026-09-08T10:00:00Z' },
    milestones: [
      { id: 'c-4-m1', title: 'API scaffold + auth', amount: 3250, dueDate: '2026-09-20', status: 'released', submittedAt: '2026-09-18T12:00:00Z', releasedAt: '2026-09-19T09:00:00Z' },
      { id: 'c-4-m2', title: 'WebSockets + production hardening', amount: 3250, dueDate: '2026-10-05', status: 'pending', submittedAt: null, releasedAt: null },
    ],
    message: 'First milestone approved and released. Keep going on the second.',
    createdAt: '2026-09-05T10:00:00Z',
  },
  {
    id: 'c-5',
    jobId: '8',
    jobTitle: 'Full-Stack Dashboard Developer',
    companyId: 1,
    companyName: 'Nimbus Labs',
    workerId: 1,
    workerName: 'Amina K.',
    totalAmount: 10000,
    status: 'completed',
    escrow: { funded: true, fundedAt: '2026-08-01T10:00:00Z' },
    milestones: [
      { id: 'c-5-m1', title: 'MVP dashboard', amount: 5000, dueDate: '2026-08-20', status: 'released', submittedAt: '2026-08-18T12:00:00Z', releasedAt: '2026-08-19T09:00:00Z' },
      { id: 'c-5-m2', title: 'Charts + reporting + handoff', amount: 5000, dueDate: '2026-09-01', status: 'released', submittedAt: '2026-08-30T12:00:00Z', releasedAt: '2026-08-31T09:00:00Z' },
    ],
    message: 'Project completed. All milestones released.',
    createdAt: '2026-07-25T10:00:00Z',
  },
]

// Nested immutability pattern: map contracts → map milestones → replace one.
// Completing a contract is derived, not stored: when the last milestone releases,
// the reducer flips status to 'completed' in the same action.
function contractReducer(state, action) {
  switch (action.type) {
    case 'CREATE_OFFER': {
      const newContract = {
        ...action.payload,
        id: action.payload.id || Date.now().toString(),
        // Unified contract model (PRD 6): JOB by default; TEAM_ROLE when hired
        // from a team seat. Payload may pass status/escrow so team hires can
        // land active + funded in one step (escrow-first rule).
        sourceType: action.payload.sourceType || 'JOB',
        status: action.payload.status || 'pending',
        escrow: action.payload.escrow || { funded: false, fundedAt: null },
        createdAt: new Date().toISOString(),
      }
      return { ...state, contracts: [newContract, ...state.contracts] }
    }
    case 'ACCEPT_OFFER': {
      return {
        ...state,
        contracts: state.contracts.map((c) =>
          c.id === action.payload ? { ...c, status: 'active' } : c,
        ),
      }
    }
    case 'DECLINE_OFFER': {
      return {
        ...state,
        contracts: state.contracts.map((c) =>
          c.id === action.payload ? { ...c, status: 'declined' } : c,
        ),
      }
    }
    case 'FUND_ESCROW': {
      return {
        ...state,
        contracts: state.contracts.map((c) =>
          c.id === action.payload
            ? { ...c, escrow: { funded: true, fundedAt: new Date().toISOString() } }
            : c,
        ),
      }
    }
    case 'SUBMIT_MILESTONE': {
      return {
        ...state,
        contracts: state.contracts.map((c) =>
          c.id === action.payload.contractId
            ? {
                ...c,
                milestones: c.milestones.map((m) =>
                  m.id === action.payload.milestoneId
                    ? { ...m, status: 'submitted', submittedAt: new Date().toISOString() }
                    : m,
                ),
              }
            : c,
        ),
      }
    }
    case 'APPROVE_MILESTONE': {
      return {
        ...state,
        contracts: state.contracts.map((c) => {
          if (c.id !== action.payload.contractId) return c
          const milestones = c.milestones.map((m) =>
            m.id === action.payload.milestoneId
              ? { ...m, status: 'released', releasedAt: new Date().toISOString() }
              : m,
          )
          // Contract completes only when every milestone has been released
          const allReleased = milestones.every((m) => m.status === 'released')
          return { ...c, milestones, status: allReleased ? 'completed' : c.status }
        }),
      }
    }
    // Gig order flow: company sends delivery back for rework (Order_a_Gig §7)
    case 'REQUEST_REVISION': {
      return {
        ...state,
        contracts: state.contracts.map((c) =>
          c.id === action.payload.contractId
            ? {
                ...c,
                milestones: c.milestones.map((m) =>
                  m.id === action.payload.milestoneId
                    ? { ...m, status: 'pending', submittedAt: null, releasedAt: null }
                    : m,
                ),
              }
            : c,
        ),
      }
    }
    default:
      return state
  }
}

export function ContractProvider({ children }) {
  const [state, dispatch] = useReducer(contractReducer, { contracts: sampleContracts })

  // Returns the new contract's id so callers can navigate to it immediately
  const createOffer = (data) => {
    const id = Date.now().toString()
    dispatch({ type: 'CREATE_OFFER', payload: { ...data, id } })
    return id
  }

  const acceptOffer = (contractId) => {
    dispatch({ type: 'ACCEPT_OFFER', payload: contractId })
  }

  const declineOffer = (contractId) => {
    dispatch({ type: 'DECLINE_OFFER', payload: contractId })
  }

  const fundEscrow = (contractId) => {
    dispatch({ type: 'FUND_ESCROW', payload: contractId })
  }

  const submitMilestone = (contractId, milestoneId) => {
    dispatch({ type: 'SUBMIT_MILESTONE', payload: { contractId, milestoneId } })
  }

  const approveMilestone = (contractId, milestoneId) => {
    dispatch({ type: 'APPROVE_MILESTONE', payload: { contractId, milestoneId } })
  }

  const requestRevision = (contractId, milestoneId) => {
    dispatch({ type: 'REQUEST_REVISION', payload: { contractId, milestoneId } })
  }

  const getContractById = (contractId) => {
    return state.contracts.find((c) => c.id === contractId)
  }

  const getContractsByCompany = (companyId) => {
    return state.contracts.filter((c) => String(c.companyId) === String(companyId))
  }

  const getContractsByWorker = (workerId) => {
    return state.contracts.filter((c) => String(c.workerId) === String(workerId))
  }

  // Used by JobDetailPage to detect whether an offer already exists for an applicant
  const getContractForJobWorker = (jobId, workerId) => {
    return state.contracts.find(
      (c) => c.jobId === jobId && String(c.workerId) === String(workerId),
    )
  }

  // Used by team hire + listing pages to find the TEAM_ROLE contract for a seat
  const getContractForTeamRole = (teamId, workerId) => {
    return state.contracts.find(
      (c) =>
        c.sourceType === 'TEAM_ROLE' &&
        c.teamId === teamId &&
        String(c.workerId) === String(workerId),
    )
  }

  // Used by OrderGigPage to guard against re-ordering the same gig (one open order)
  const getGigOrderByGigWorker = (gigId, companyId) => {
    return state.contracts.find(
      (c) =>
        c.sourceType === 'GIG_ORDER' &&
        c.gigId === gigId &&
        String(c.companyId) === String(companyId),
    )
  }

  const value = {
    ...state,
    createOffer,
    acceptOffer,
    declineOffer,
    fundEscrow,
    submitMilestone,
    approveMilestone,
    requestRevision,
    getContractById,
    getContractsByCompany,
    getContractsByWorker,
    getContractForJobWorker,
    getContractForTeamRole,
    getGigOrderByGigWorker,
  }

  return <ContractContext.Provider value={value}>{children}</ContractContext.Provider>
}

// eslint-disable-next-line react-only-export-components -- intentional: hook belongs with its provider
export function useContracts() {
  const context = useContext(ContractContext)
  if (!context) {
    throw new Error('useContracts must be used within a ContractProvider')
  }
  return context
}
