// On-platform messaging: conversations tied to contracts/workers, with
// external contact info blocked from being sent (PRD 5.8 key system rule).
// The contact-info detector lives in features/messages/contactFilter.js.
import { createContext, useContext, useReducer } from 'react'

const MessageContext = createContext(null)

// Seeded conversations mirror the contract pairs (companyId/workerId 1 = demo user)
// so the conversation is visible under either role.
const sampleConversations = [
  {
    id: 'cv-1',
    contractId: 'c-1',
    jobId: '1',
    workerId: 1,
    workerName: 'Amina K.',
    companyId: 1,
    companyName: 'Nimbus Labs',
    unreadCount: 1,
    lastActivity: '2026-09-20T10:30:00Z',
    messages: [
      { id: 'm-1-1', senderId: 1, senderRole: 'company', text: 'Hi Amina — we just sent over an offer for the Senior React Developer role. Take a look when you can.', createdAt: '2026-09-20T10:05:00Z' },
      { id: 'm-1-2', senderId: 1, senderRole: 'worker', text: 'Thanks! Reviewing the milestones now — happy to start as soon as escrow is funded.', createdAt: '2026-09-20T10:18:00Z' },
      { id: 'm-1-3', senderId: 1, senderRole: 'company', text: 'Perfect. Funding escrow today so you can begin this week.', createdAt: '2026-09-20T10:30:00Z' },
    ],
  },
  {
    id: 'cv-2',
    contractId: 'c-3',
    jobId: '4',
    workerId: 1,
    workerName: 'Amina K.',
    companyId: 1,
    companyName: 'Nimbus Labs',
    unreadCount: 0,
    lastActivity: '2026-09-22T15:00:00Z',
    messages: [
      { id: 'm-2-1', senderId: 1, senderRole: 'worker', text: 'Submitted the vulnerability scan report for milestone 1 — ready for your review.', createdAt: '2026-09-22T14:30:00Z' },
      { id: 'm-2-2', senderId: 1, senderRole: 'company', text: 'Got it, reviewing the findings now. Should approve by tomorrow.', createdAt: '2026-09-22T15:00:00Z' },
    ],
  },
  {
    id: 'cv-3',
    contractId: 'c-4',
    jobId: '6',
    workerId: 1,
    workerName: 'Amina K.',
    companyId: 1,
    companyName: 'Nimbus Labs',
    unreadCount: 0,
    lastActivity: '2026-09-19T09:30:00Z',
    messages: [
      { id: 'm-3-1', senderId: 1, senderRole: 'company', text: 'Milestone 1 approved and funds released. Nice work on the API scaffold!', createdAt: '2026-09-19T09:30:00Z' },
    ],
  },
]

function messageReducer(state, action) {
  switch (action.type) {
    case 'SEND_MESSAGE': {
      return {
        ...state,
        conversations: state.conversations.map((cv) =>
          cv.id === action.payload.conversationId
            ? {
                ...cv,
                messages: [...cv.messages, action.payload.message],
                lastActivity: action.payload.message.createdAt,
                // Sending never clears the user's own unread badge (that's the other side)
              }
            : cv,
        ),
      }
    }
    case 'MARK_CONVERSATION_READ': {
      return {
        ...state,
        conversations: state.conversations.map((cv) =>
          cv.id === action.payload ? { ...cv, unreadCount: 0 } : cv,
        ),
      }
    }
    case 'CREATE_CONVERSATION': {
      // Guard against duplicates for the same worker/company pair
      const exists = state.conversations.find(
        (cv) =>
          String(cv.workerId) === String(action.payload.workerId) &&
          String(cv.companyId) === String(action.payload.companyId),
      )
      if (exists) return state
      return { ...state, conversations: [action.payload, ...state.conversations] }
    }
    default:
      return state
  }
}

export function MessageProvider({ children }) {
  const [state, dispatch] = useReducer(messageReducer, { conversations: sampleConversations })

  // Blocked sends are filtered in the UI before reaching this function;
  // the reducer assumes the message is already policy-compliant.
  const sendMessage = (conversationId, senderId, senderRole, text) => {
    dispatch({
      type: 'SEND_MESSAGE',
      payload: {
        conversationId,
        message: {
          id: Date.now().toString(),
          senderId,
          senderRole,
          text,
          createdAt: new Date().toISOString(),
        },
      },
    })
  }

  const markConversationRead = (conversationId) => {
    dispatch({ type: 'MARK_CONVERSATION_READ', payload: conversationId })
  }

  const createConversation = (data) => {
    const conversation = {
      id: Date.now().toString(),
      contractId: data.contractId || null,
      jobId: data.jobId || null,
      workerId: data.workerId,
      workerName: data.workerName,
      companyId: data.companyId,
      companyName: data.companyName,
      unreadCount: 0,
      lastActivity: new Date().toISOString(),
      messages: [],
    }
    dispatch({ type: 'CREATE_CONVERSATION', payload: conversation })
    return conversation.id
  }

  const getConversationById = (id) => {
    return state.conversations.find((cv) => cv.id === id)
  }

  // Returns the existing conversation for a contract, or null
  const getConversationByContract = (contractId) => {
    return state.conversations.find((cv) => cv.contractId === contractId)
  }

  // Returns an existing pair conversation, creating one when absent
  const findOrCreateConversation = (params) => {
    const existing = state.conversations.find(
      (cv) =>
        String(cv.workerId) === String(params.workerId) &&
        String(cv.companyId) === String(params.companyId),
    )
    if (existing) return existing.id
    return createConversation(params)
  }

  // Sort newest-activity first for the conversation list
  const sortedConversations = [...state.conversations].sort(
    (a, b) => new Date(b.lastActivity) - new Date(a.lastActivity),
  )

  const value = {
    conversations: sortedConversations,
    sendMessage,
    markConversationRead,
    createConversation,
    getConversationById,
    getConversationByContract,
    findOrCreateConversation,
  }

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
}

// eslint-disable-next-line react-only-export-components -- intentional: hook belongs with its provider
export function useMessages() {
  const context = useContext(MessageContext)
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider')
  }
  return context
}
