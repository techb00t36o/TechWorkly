// Dispute state (PRD 5.11): evidence, mutual resolution, admin escalation.
// Hangs off the unified Contract model regardless of hiring path.
import { createContext, useContext, useReducer, useMemo } from 'react'

const DisputeContext = createContext(null)

// Categories from Dispute_Resolution.docx §2
export const disputeCategories = [
  { value: 'payment', label: 'Payment issue' },
  { value: 'quality', label: 'Quality of work' },
  { value: 'deadline', label: 'Missed deadline' },
  { value: 'communication', label: 'Communication breakdown' },
  { value: 'other', label: 'Other' },
]

export const disputeStatuses = {
  open: { label: 'Open', badge: 'bg-danger/10 text-danger' },
  awaiting_response: { label: 'Awaiting Response', badge: 'bg-warning/10 text-warning' },
  under_admin_review: { label: 'Under Admin Review', badge: 'bg-primary-light text-primary' },
  resolved: { label: 'Resolved', badge: 'bg-success/10 text-success' },
  closed: { label: 'Closed', badge: 'bg-neutral-200 text-neutral-600' },
}

// Seeds cover each status so list/detail views have data on day one.
const sampleDisputes = [
  {
    id: 'd-1',
    contractId: 'c-2',
    contractTitle: 'Flutter Mobile Developer',
    openerId: 1,
    openerRole: 'worker',
    openerName: 'Amina K.',
    responderId: 1,
    responderRole: 'company',
    responderName: 'Nimbus Labs',
    category: 'payment',
    description:
      'Escrow shows funded but milestone 1 was rejected without a clear reason. Requesting release or a fair split after partial delivery.',
    status: 'awaiting_response',
    milestonesReferenced: ['c-2-m1'],
    evidence: [
      {
        id: 'ev-1',
        byRole: 'worker',
        byName: 'Amina K.',
        kind: 'text',
        label: 'Delivery note',
        content: 'Submitted auth + payments module on Sep 28 with demo credentials.',
        at: '2026-09-29T10:00:00Z',
      },
    ],
    timeline: [
      { at: '2026-09-29T10:00:00Z', actorRole: 'worker', actorName: 'Amina K.', action: 'opened', note: 'Dispute opened with evidence.' },
      { at: '2026-09-29T10:05:00Z', actorRole: 'system', actorName: 'System', action: 'notified', note: 'Response requested from Nimbus Labs (3-day deadline).' },
    ],
    resolution: null,
    responseDeadline: '2026-10-02T10:00:00Z',
    escalatedToAdmin: false,
    adminDecision: null,
    createdAt: '2026-09-29T10:00:00Z',
  },
  {
    id: 'd-2',
    contractId: 'c-4',
    contractTitle: 'Backend API Developer',
    openerId: 1,
    openerRole: 'company',
    openerName: 'Nimbus Labs',
    responderId: 1,
    responderRole: 'worker',
    responderName: 'Amina K.',
    category: 'quality',
    description:
      'API scaffold landed but auth endpoints fail the acceptance checklist. Requesting partial refund until rework is complete.',
    status: 'under_admin_review',
    milestonesReferenced: ['c-4-m1'],
    evidence: [
      {
        id: 'ev-2',
        byRole: 'company',
        byName: 'Nimbus Labs',
        kind: 'text',
        label: 'Acceptance checklist',
        content: '6 of 11 auth cases fail. Screenshots attached in thread.',
        at: '2026-09-25T14:00:00Z',
      },
      {
        id: 'ev-3',
        byRole: 'worker',
        byName: 'Amina K.',
        kind: 'text',
        label: 'Response',
        content: 'Two failures are fixture issues on staging; happy to re-run with correct env vars.',
        at: '2026-09-26T09:30:00Z',
      },
    ],
    timeline: [
      { at: '2026-09-25T14:00:00Z', actorRole: 'company', actorName: 'Nimbus Labs', action: 'opened', note: 'Dispute opened on quality of work.' },
      { at: '2026-09-26T09:30:00Z', actorRole: 'worker', actorName: 'Amina K.', action: 'responded', note: 'Worker submitted response + evidence.' },
      { at: '2026-09-27T11:00:00Z', actorRole: 'company', actorName: 'Nimbus Labs', action: 'escalated', note: 'No mutual agreement — escalated to admin.' },
      { at: '2026-09-27T12:00:00Z', actorRole: 'admin', actorName: 'Trust & Safety', action: 'review_started', note: 'Admin review in progress.' },
    ],
    resolution: null,
    responseDeadline: '2026-09-29T14:00:00Z',
    escalatedToAdmin: true,
    adminDecision: null,
    createdAt: '2026-09-25T14:00:00Z',
  },
  {
    id: 'd-3',
    contractId: 'c-5',
    contractTitle: 'Full-Stack Dashboard Developer',
    openerId: 1,
    openerRole: 'worker',
    openerName: 'Amina K.',
    responderId: 1,
    responderRole: 'company',
    responderName: 'Nimbus Labs',
    category: 'deadline',
    description: 'Final handoff delayed by one week; agreed partial release for charts milestone.',
    status: 'resolved',
    milestonesReferenced: ['c-5-m2'],
    evidence: [
      {
        id: 'ev-4',
        byRole: 'worker',
        byName: 'Amina K.',
        kind: 'text',
        label: 'Timeline note',
        content: 'Blocked by API rate limits on staging; recovered and delivered.',
        at: '2026-08-20T16:00:00Z',
      },
    ],
    timeline: [
      { at: '2026-08-20T16:00:00Z', actorRole: 'worker', actorName: 'Amina K.', action: 'opened', note: 'Dispute opened on missed deadline.' },
      { at: '2026-08-21T10:00:00Z', actorRole: 'company', actorName: 'Nimbus Labs', action: 'responded', note: 'Company acknowledged delay.' },
      { at: '2026-08-22T15:00:00Z', actorRole: 'company', actorName: 'Nimbus Labs', action: 'mutual_proposed', note: 'Proposed 50% release on charts milestone.' },
      { at: '2026-08-23T09:00:00Z', actorRole: 'worker', actorName: 'Amina K.', action: 'mutual_agreed', note: 'Both parties agreed to partial release.' },
    ],
    resolution: { type: 'split', amount: 2500, note: 'Mutual: $2,500 released; remainder refunded to company wallet.' },
    responseDeadline: '2026-08-23T16:00:00Z',
    escalatedToAdmin: false,
    adminDecision: null,
    createdAt: '2026-08-20T16:00:00Z',
  },
]

// Ids and timestamps live in the reducer so components stay pure.
function disputeReducer(state, action) {
  switch (action.type) {
    case 'OPEN_DISPUTE': {
      const seq = state.seq + 1
      const now = action.payload.now
      const dispute = {
        ...action.payload,
        id: `d-${seq}`,
        status: 'open',
        evidence: action.payload.evidence || [],
        timeline: [
          {
            at: now,
            actorRole: action.payload.openerRole,
            actorName: action.payload.openerName,
            action: 'opened',
            note: 'Dispute opened.',
          },
          {
            at: now,
            actorRole: 'system',
            actorName: 'System',
            action: 'notified',
            note: `Response requested from ${action.payload.responderName} (3-day deadline).`,
          },
        ],
        resolution: null,
        responseDeadline: action.payload.responseDeadline,
        escalatedToAdmin: false,
        adminDecision: null,
        createdAt: now,
      }
      // Auto-advance: open → awaiting_response once the other party is notified
      dispute.status = 'awaiting_response'
      return { ...state, seq, disputes: [dispute, ...state.disputes] }
    }
    case 'ADD_EVIDENCE': {
      return {
        ...state,
        disputes: state.disputes.map((d) =>
          d.id !== action.payload.disputeId
            ? d
            : {
                ...d,
                evidence: [...d.evidence, action.payload.evidence],
                timeline: [
                  ...d.timeline,
                  {
                    at: action.payload.now,
                    actorRole: action.payload.actorRole,
                    actorName: action.payload.actorName,
                    action: 'evidence_added',
                    note: `Added evidence: ${action.payload.evidence.label}`,
                  },
                ],
              },
        ),
      }
    }
    case 'RESPOND_TO_DISPUTE': {
      return {
        ...state,
        disputes: state.disputes.map((d) =>
          d.id !== action.payload.disputeId
            ? d
            : {
                ...d,
                status: d.escalatedToAdmin ? 'under_admin_review' : 'open',
                timeline: [
                  ...d.timeline,
                  {
                    at: action.payload.now,
                    actorRole: action.payload.actorRole,
                    actorName: action.payload.actorName,
                    action: 'responded',
                    note: action.payload.note || 'Submitted response.',
                  },
                ],
              },
        ),
      }
    }
    case 'PROPOSE_MUTUAL': {
      return {
        ...state,
        disputes: state.disputes.map((d) =>
          d.id !== action.payload.disputeId
            ? d
            : {
                ...d,
                timeline: [
                  ...d.timeline,
                  {
                    at: action.payload.now,
                    actorRole: action.payload.actorRole,
                    actorName: action.payload.actorName,
                    action: 'mutual_proposed',
                    note: action.payload.note,
                  },
                ],
              },
        ),
      }
    }
    case 'AGREE_MUTUAL': {
      return {
        ...state,
        disputes: state.disputes.map((d) =>
          d.id !== action.payload.disputeId
            ? d
            : {
                ...d,
                status: 'resolved',
                resolution: action.payload.resolution,
                timeline: [
                  ...d.timeline,
                  {
                    at: action.payload.now,
                    actorRole: action.payload.actorRole,
                    actorName: action.payload.actorName,
                    action: 'mutual_agreed',
                    note: `Mutual resolution agreed: ${action.payload.resolution.type}.`,
                  },
                ],
              },
        ),
      }
    }
    case 'ESCALATE_TO_ADMIN': {
      return {
        ...state,
        disputes: state.disputes.map((d) =>
          d.id !== action.payload.disputeId
            ? d
            : {
                ...d,
                status: 'under_admin_review',
                escalatedToAdmin: true,
                timeline: [
                  ...d.timeline,
                  {
                    at: action.payload.now,
                    actorRole: action.payload.actorRole,
                    actorName: action.payload.actorName,
                    action: 'escalated',
                    note: 'Escalated to admin for manual review.',
                  },
                ],
              },
        ),
      }
    }
    case 'ADMIN_DECIDE': {
      return {
        ...state,
        disputes: state.disputes.map((d) =>
          d.id !== action.payload.disputeId
            ? d
            : {
                ...d,
                status: 'resolved',
                escalatedToAdmin: true,
                adminDecision: action.payload.decision,
                resolution: action.payload.resolution,
                timeline: [
                  ...d.timeline,
                  {
                    at: action.payload.now,
                    actorRole: 'admin',
                    actorName: action.payload.adminName || 'Admin',
                    action: 'admin_decision',
                    note: action.payload.note,
                  },
                ],
              },
        ),
      }
    }
    case 'CLOSE_DISPUTE': {
      return {
        ...state,
        disputes: state.disputes.map((d) =>
          d.id !== action.payload.disputeId
            ? d
            : {
                ...d,
                status: 'closed',
                timeline: [
                  ...d.timeline,
                  {
                    at: action.payload.now,
                    actorRole: action.payload.actorRole,
                    actorName: action.payload.actorName,
                    action: 'closed',
                    note: 'Dispute closed.',
                  },
                ],
              },
        ),
      }
    }
    default:
      return state
  }
}

export function DisputeProvider({ children }) {
  const [state, dispatch] = useReducer(disputeReducer, {
    disputes: sampleDisputes,
    seq: 100,
  })

  const openDispute = (data) => dispatch({ type: 'OPEN_DISPUTE', payload: data })
  const addEvidence = (data) => dispatch({ type: 'ADD_EVIDENCE', payload: data })
  const respondToDispute = (data) => dispatch({ type: 'RESPOND_TO_DISPUTE', payload: data })
  const proposeMutual = (data) => dispatch({ type: 'PROPOSE_MUTUAL', payload: data })
  const agreeMutual = (data) => dispatch({ type: 'AGREE_MUTUAL', payload: data })
  const escalateToAdmin = (data) => dispatch({ type: 'ESCALATE_TO_ADMIN', payload: data })
  const adminDecide = (data) => dispatch({ type: 'ADMIN_DECIDE', payload: data })
  const closeDispute = (data) => dispatch({ type: 'CLOSE_DISPUTE', payload: data })

  const getDisputeById = (id) => state.disputes.find((d) => d.id === id)

  const getDisputeForContract = (contractId) =>
    state.disputes.find(
      (d) =>
        d.contractId === contractId &&
        d.status !== 'resolved' &&
        d.status !== 'closed',
    )

  const getDisputesByRole = (role) =>
    state.disputes.filter((d) => d.openerRole === role || d.responderRole === role)

  const getOpenDisputes = () =>
    state.disputes.filter((d) => d.status === 'open' || d.status === 'awaiting_response')

  const getAdminQueue = () =>
    state.disputes.filter((d) => d.status === 'under_admin_review' || d.escalatedToAdmin)

  const value = useMemo(
    () => ({
      disputes: state.disputes,
      openDispute,
      addEvidence,
      respondToDispute,
      proposeMutual,
      agreeMutual,
      escalateToAdmin,
      adminDecide,
      closeDispute,
      getDisputeById,
      getDisputeForContract,
      getDisputesByRole,
      getOpenDisputes,
      getAdminQueue,
      disputeCategories,
      disputeStatuses,
    }),
    // Mutators close over dispatch only; selectors recompute from state.disputes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.disputes],
  )

  return <DisputeContext.Provider value={value}>{children}</DisputeContext.Provider>
}

// eslint-disable-next-line react-only-export-components -- intentional: hook belongs with its provider
export function useDisputes() {
  const context = useContext(DisputeContext)
  if (!context) {
    throw new Error('useDisputes must be used within a DisputeProvider')
  }
  return context
}
