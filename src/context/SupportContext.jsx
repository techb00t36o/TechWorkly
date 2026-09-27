// Help/Support state (PRD 5.11): ticketing for the Help Center + thread replies.
import { createContext, useContext, useReducer, useMemo } from 'react'

const SupportContext = createContext(null)

// Ticket categories match Help_Support_Center §5 contact form.
export const ticketCategories = [
  { value: 'account', label: 'Account' },
  { value: 'payments', label: 'Payments' },
  { value: 'jobs', label: 'Jobs / Teams' },
  { value: 'verification', label: 'Verification' },
  { value: 'disputes', label: 'Disputes' },
  { value: 'safety', label: 'Safety' },
  { value: 'bug', label: 'Report a problem' },
  { value: 'other', label: 'Other' },
]

export const ticketStatuses = {
  open: { label: 'Open', badge: 'bg-primary-light text-primary' },
  in_progress: { label: 'In Progress', badge: 'bg-warning/10 text-warning' },
  resolved: { label: 'Resolved', badge: 'bg-success/10 text-success' },
}

// Seeds: one open, one in progress, one resolved so My Tickets has history.
const sampleTickets = [
  {
    id: 't-1',
    userId: 1,
    userName: 'Amina K.',
    category: 'payments',
    subject: 'Withdrawal still pending after 48 hours',
    description: 'Bank transfer requested on Sep 20 still shows pending. Reference TX-12.',
    status: 'in_progress',
    messages: [
      {
        id: 'tm-1',
        from: 'user',
        fromName: 'Amina K.',
        body: 'Bank transfer requested on Sep 20 still shows pending. Reference TX-12.',
        at: '2026-09-21T10:00:00Z',
      },
      {
        id: 'tm-2',
        from: 'support',
        fromName: 'Support',
        body: 'Thanks — we are checking with the payout partner. Expect an update within 24 hours.',
        at: '2026-09-21T14:00:00Z',
      },
    ],
    createdAt: '2026-09-21T10:00:00Z',
    updatedAt: '2026-09-21T14:00:00Z',
  },
  {
    id: 't-2',
    userId: 1,
    userName: 'Nimbus Labs',
    category: 'verification',
    subject: 'Company funds verification docs rejected',
    description: 'Bank statement was rejected — need guidance on acceptable formats.',
    status: 'open',
    messages: [
      {
        id: 'tm-3',
        from: 'user',
        fromName: 'Nimbus Labs',
        body: 'Bank statement was rejected — need guidance on acceptable formats.',
        at: '2026-09-23T09:00:00Z',
      },
    ],
    createdAt: '2026-09-23T09:00:00Z',
    updatedAt: '2026-09-23T09:00:00Z',
  },
  {
    id: 't-3',
    userId: 1,
    userName: 'Amina K.',
    category: 'bug',
    subject: 'Messages page slow to load threads',
    description: 'Thread list takes ~5s on first open after login.',
    status: 'resolved',
    messages: [
      {
        id: 'tm-4',
        from: 'user',
        fromName: 'Amina K.',
        body: 'Thread list takes ~5s on first open after login.',
        at: '2026-09-10T11:00:00Z',
      },
      {
        id: 'tm-5',
        from: 'support',
        fromName: 'Support',
        body: 'Fixed in the latest deploy — closing this ticket. Thanks for the report!',
        at: '2026-09-12T16:00:00Z',
      },
    ],
    createdAt: '2026-09-10T11:00:00Z',
    updatedAt: '2026-09-12T16:00:00Z',
  },
]

// Thread ids and timestamps stay in the reducer so components stay pure.
function supportReducer(state, action) {
  switch (action.type) {
    case 'CREATE_TICKET': {
      const seq = state.seq + 1
      const now = action.payload.now
      const ticket = {
        ...action.payload,
        id: `t-${seq}`,
        status: 'open',
        messages: [
          {
            id: `tm-${seq}-0`,
            from: 'user',
            fromName: action.payload.userName,
            body: action.payload.description,
            at: now,
          },
        ],
        createdAt: now,
        updatedAt: now,
      }
      return { ...state, seq, tickets: [ticket, ...state.tickets] }
    }
    case 'ADD_TICKET_MESSAGE': {
      return {
        ...state,
        tickets: state.tickets.map((t) => {
          if (t.id !== action.payload.ticketId) return t
          const message = {
            id: `${t.id}-m-${t.messages.length + 1}`,
            from: action.payload.from,
            fromName: action.payload.fromName,
            body: action.payload.body,
            at: action.payload.now,
          }
          return {
            ...t,
            messages: [...t.messages, message],
            status: action.payload.from === 'support' && t.status === 'open' ? 'in_progress' : t.status,
            updatedAt: action.payload.now,
          }
        }),
      }
    }
    case 'TICKET_STATUS': {
      return {
        ...state,
        tickets: state.tickets.map((t) =>
          t.id !== action.payload.ticketId
            ? t
            : { ...t, status: action.payload.status, updatedAt: action.payload.now },
        ),
      }
    }
    default:
      return state
  }
}

export function SupportProvider({ children }) {
  const [state, dispatch] = useReducer(supportReducer, {
    tickets: sampleTickets,
    seq: 50,
  })

  const createTicket = (data) => dispatch({ type: 'CREATE_TICKET', payload: data })
  const addTicketMessage = (data) => dispatch({ type: 'ADD_TICKET_MESSAGE', payload: data })
  const setTicketStatus = (data) => dispatch({ type: 'TICKET_STATUS', payload: data })

  const getTicketById = (id) => state.tickets.find((t) => t.id === id)
  const getTicketsByUser = (userId) =>
    state.tickets.filter((t) => String(t.userId) === String(userId))
  const getOpenTickets = () =>
    state.tickets.filter((t) => t.status === 'open' || t.status === 'in_progress')

  const value = useMemo(
    () => ({
      tickets: state.tickets,
      createTicket,
      addTicketMessage,
      setTicketStatus,
      getTicketById,
      getTicketsByUser,
      getOpenTickets,
      ticketCategories,
      ticketStatuses,
    }),
    // Mutators close over dispatch; selectors recompute from state.tickets
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.tickets],
  )

  return <SupportContext.Provider value={value}>{children}</SupportContext.Provider>
}

// eslint-disable-next-line react-only-export-components -- intentional: hook belongs with its provider
export function useSupport() {
  const context = useContext(SupportContext)
  if (!context) {
    throw new Error('useSupport must be used within a SupportProvider')
  }
  return context
}
