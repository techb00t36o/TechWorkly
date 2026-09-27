// In-app notifications across the 5 PRD categories (5.8):
// messages, applications, payments, verification, system.
import { createContext, useContext, useReducer, useMemo } from 'react'

const NotificationContext = createContext(null)

// Demo user id is always 1 (from onboarding's setUser), so seeds target 1
// and are visible under either role.
const sampleNotifications = [
  { id: 'n-1', type: 'application', title: 'New application', body: 'Amina K. applied to Senior React Developer.', link: '/jobs/1', read: false, recipientId: 1, createdAt: '2026-09-11T14:05:00Z' },
  { id: 'n-2', type: 'message', title: 'New message', body: 'Amina K.: Thanks! Reviewing the milestones now…', link: '/messages/cv-1', read: false, recipientId: 1, createdAt: '2026-09-20T10:18:00Z' },
  { id: 'n-3', type: 'payment', title: 'Milestone released', body: '$3,250 released for "API scaffold + auth".', link: '/contracts/c-4', read: false, recipientId: 1, createdAt: '2026-09-19T09:00:00Z' },
  { id: 'n-4', type: 'verification', title: 'Verification approved', body: 'Your identity verification was approved.', link: '/account', read: true, recipientId: 1, createdAt: '2026-09-01T12:00:00Z' },
  { id: 'n-5', type: 'system', title: 'Scheduled maintenance', body: 'The platform will be read-only Sunday 02:00–04:00 UTC.', link: '/', read: true, recipientId: 1, createdAt: '2026-08-28T08:00:00Z' },
  { id: 'n-6', type: 'payment', title: 'Escrow funded', body: '$6,500 secured for Backend API Developer.', link: '/contracts/c-4', read: true, recipientId: 1, createdAt: '2026-09-08T10:05:00Z' },
  { id: 'n-7', type: 'application', title: 'Offer accepted', body: 'Amina K. accepted your offer for Security Auditor.', link: '/contracts/c-3', read: true, recipientId: 1, createdAt: '2026-09-11T09:00:00Z' },
  { id: 'n-8', type: 'message', title: 'New message', body: 'Amina K.: Submitted the vulnerability scan report…', link: '/messages/cv-2', read: true, recipientId: 1, createdAt: '2026-09-22T14:30:00Z' },
]

function notificationReducer(state, action) {
  switch (action.type) {
    case 'ADD_NOTIFICATION': {
      const notification = {
        id: action.payload.id || Date.now().toString(),
        read: false,
        createdAt: new Date().toISOString(),
        ...action.payload,
      }
      return { ...state, notifications: [notification, ...state.notifications] }
    }
    case 'MARK_READ': {
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n,
        ),
      }
    }
    case 'MARK_ALL_READ': {
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      }
    }
    default:
      return state
  }
}

export function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: sampleNotifications,
  })

  const addNotification = (data) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: data })
  }

  const markRead = (id) => {
    dispatch({ type: 'MARK_READ', payload: id })
  }

  const markAllRead = () => {
    dispatch({ type: 'MARK_ALL_READ' })
  }

  // Newest first for the dropdown panel
  const sorted = useMemo(
    () =>
      [...state.notifications].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      ),
    [state.notifications],
  )

  const unreadCount = state.notifications.filter((n) => !n.read).length

  const value = {
    notifications: sorted,
    unreadCount,
    addNotification,
    markRead,
    markAllRead,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

// eslint-disable-next-line react-only-export-components -- intentional: hook belongs with its provider
export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
