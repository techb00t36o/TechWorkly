// Admin panel state (PRD 5.11): verification queue, user management,
// fraud/spam + content moderation flags, and admin activity log.
import { createContext, useContext, useReducer, useMemo } from 'react'

const AdminContext = createContext(null)

// Seed verification items covering skill, identity, and funds checks.
const sampleVerifications = [
  {
    id: 'v-1',
    type: 'skill',
    subjectName: 'Amina K.',
    subjectRole: 'worker',
    subjectId: 1,
    detail: 'React/TypeScript skill test · Score 92%',
    submittedAt: '2026-09-20T09:00:00Z',
    status: 'pending',
    notes: '',
  },
  {
    id: 'v-2',
    type: 'identity',
    subjectName: 'David R.',
    subjectRole: 'worker',
    subjectId: 2,
    detail: 'Passport upload · UK',
    submittedAt: '2026-09-21T14:30:00Z',
    status: 'pending',
    notes: '',
  },
  {
    id: 'v-3',
    type: 'funds',
    subjectName: 'Nimbus Labs',
    subjectRole: 'company',
    subjectId: 1,
    detail: 'Bank statement · Min balance check',
    submittedAt: '2026-09-22T11:00:00Z',
    status: 'pending',
    notes: '',
  },
  {
    id: 'v-4',
    type: 'skill',
    subjectName: 'Sofia M.',
    subjectRole: 'worker',
    subjectId: 3,
    detail: 'UI/UX portfolio review',
    submittedAt: '2026-09-18T16:00:00Z',
    status: 'approved',
    notes: 'Strong case studies.',
  },
  {
    id: 'v-5',
    type: 'identity',
    subjectName: 'Jordan Lee',
    subjectRole: 'worker',
    subjectId: 4,
    detail: 'Driver license · Blurry upload',
    submittedAt: '2026-09-19T10:00:00Z',
    status: 'rejected',
    notes: 'Please re-upload a clearer photo.',
  },
]

// Mock directory of platform users for management actions.
const sampleUsers = [
  { id: 1, name: 'Amina K.', role: 'worker', email: 'amina@mail.com', status: 'active', flags: 0, joined: '2026-06-01', verified: true },
  { id: 2, name: 'David R.', role: 'worker', email: 'david@mail.com', status: 'active', flags: 1, joined: '2026-06-15', verified: false },
  { id: 3, name: 'Sofia M.', role: 'worker', email: 'sofia@mail.com', status: 'active', flags: 0, joined: '2026-07-02', verified: true },
  { id: 4, name: 'Jordan Lee', role: 'worker', email: 'jordan@mail.com', status: 'suspended', flags: 3, joined: '2026-07-20', verified: false },
  { id: 5, name: 'Nimbus Labs', role: 'company', email: 'hire@nimbus.io', status: 'active', flags: 0, joined: '2026-05-10', verified: true },
  { id: 6, name: 'Vanguard Syndicate', role: 'company', email: 'ops@vanguard.co', status: 'active', flags: 0, joined: '2026-05-28', verified: true },
  { id: 7, name: 'Pixel Forge', role: 'company', email: 'hi@pixelforge.io', status: 'banned', flags: 5, joined: '2026-08-01', verified: false },
  { id: 8, name: 'Riley Chen', role: 'worker', email: 'riley@mail.com', status: 'pending_review', flags: 2, joined: '2026-09-10', verified: false },
]

// Fraud/spam + content moderation queue (listings, apps, messages, reviews, profiles).
const sampleFlags = [
  {
    id: 'f-1',
    kind: 'listing',
    title: 'Job: $5/hr full-stack "urgent"',
    reason: 'Spammy pricing · repeated template text',
    reporterId: 2,
    targetLabel: 'Job #482',
    status: 'open',
    at: '2026-09-22T08:00:00Z',
  },
  {
    id: 'f-2',
    kind: 'message',
    title: 'Off-platform contact attempt',
    reason: 'User shared WhatsApp number in first message',
    reporterId: 1,
    targetLabel: 'Conversation cv-3',
    status: 'open',
    at: '2026-09-23T12:00:00Z',
  },
  {
    id: 'f-3',
    kind: 'review',
    title: 'Reported review on Amina K.',
    reason: 'Suspected fake 5-star from same IP cluster',
    reporterId: 3,
    targetLabel: 'Review rv-9',
    status: 'open',
    at: '2026-09-21T18:00:00Z',
  },
  {
    id: 'f-4',
    kind: 'application',
    title: 'Low-effort bulk applications',
    reason: 'Same cover letter on 12 jobs in 10 minutes',
    reporterId: 5,
    targetLabel: 'User Riley Chen',
    status: 'open',
    at: '2026-09-23T09:30:00Z',
  },
  {
    id: 'f-5',
    kind: 'profile',
    title: 'Portfolio uses unlicensed stock',
    reason: 'Company reports copied case study images',
    reporterId: 6,
    targetLabel: 'Profile pixel-forge',
    status: 'resolved',
    at: '2026-09-15T10:00:00Z',
  },
  {
    id: 'f-6',
    kind: 'listing',
    title: 'Team listing: phishing-looking brief',
    reason: 'Asks candidates to "verify wallet"',
    reporterId: 3,
    targetLabel: 'Team t-12',
    status: 'open',
    at: '2026-09-24T07:00:00Z',
  },
]

const sampleActivity = [
  {
    id: 'a-1',
    adminName: 'Trust & Safety',
    action: 'Approved identity verification',
    targetType: 'verification',
    targetId: 'v-4',
    at: '2026-09-19T12:00:00Z',
  },
  {
    id: 'a-2',
    adminName: 'Support Agent',
    action: 'Suspended user Pixel Forge',
    targetType: 'user',
    targetId: '7',
    at: '2026-09-16T15:00:00Z',
  },
  {
    id: 'a-3',
    adminName: 'Trust & Safety',
    action: 'Removed flagged profile content',
    targetType: 'flag',
    targetId: 'f-5',
    at: '2026-09-15T11:00:00Z',
  },
]

// Status transitions and ids stay in the reducer (components stay pure).
function adminReducer(state, action) {
  switch (action.type) {
    case 'VERIFY_DECISION': {
      const seq = state.seq + 1
      const item = state.verifications.find((v) => v.id === action.payload.itemId)
      if (!item) return state
      const statusMap = { approve: 'approved', reject: 'rejected', more_info: 'more_info' }
      const actionMap = {
        approve: 'Approved verification',
        reject: 'Rejected verification',
        more_info: 'Requested more info',
      }
      return {
        ...state,
        seq,
        verifications: state.verifications.map((v) =>
          v.id !== action.payload.itemId
            ? v
            : {
                ...v,
                status: statusMap[action.payload.decision],
                notes: action.payload.notes || v.notes,
              },
        ),
        activity: [
          {
            id: `a-${seq}`,
            adminName: action.payload.adminName || 'Admin',
            action: `${actionMap[action.payload.decision]} (${item.type}: ${item.subjectName})`,
            targetType: 'verification',
            targetId: item.id,
            at: action.payload.now,
          },
          ...state.activity,
        ],
      }
    }
    case 'UPDATE_USER_STATUS': {
      const seq = state.seq + 1
      const user = state.users.find((u) => String(u.id) === String(action.payload.userId))
      if (!user) return state
      const label = {
        active: 'Restored',
        suspended: 'Suspended',
        banned: 'Banned',
        pending_review: 'Flagged for review',
        verified: 'Manually verified',
      }[action.payload.status] || action.payload.status
      return {
        ...state,
        seq,
        users: state.users.map((u) =>
          String(u.id) !== String(action.payload.userId)
            ? u
            : {
                ...u,
                status: action.payload.status === 'verified' ? u.status : action.payload.status,
                verified: action.payload.status === 'verified' ? true : u.verified,
              },
        ),
        activity: [
          {
            id: `a-${seq}`,
            adminName: action.payload.adminName || 'Admin',
            action: `${label} user ${user.name}`,
            targetType: 'user',
            targetId: String(user.id),
            at: action.payload.now,
          },
          ...state.activity,
        ],
      }
    }
    case 'RESOLVE_FLAG': {
      const seq = state.seq + 1
      const flag = state.flags.find((f) => f.id === action.payload.flagId)
      if (!flag) return state
      return {
        ...state,
        seq,
        flags: state.flags.map((f) =>
          f.id !== action.payload.flagId
            ? f
            : { ...f, status: action.payload.status, resolution: action.payload.resolution },
        ),
        activity: [
          {
            id: `a-${seq}`,
            adminName: action.payload.adminName || 'Admin',
            action: `${action.payload.resolution} — ${flag.title}`,
            targetType: 'flag',
            targetId: flag.id,
            at: action.payload.now,
          },
          ...state.activity,
        ],
      }
    }
    case 'LOG_ACTION': {
      const seq = state.seq + 1
      return {
        ...state,
        seq,
        activity: [
          {
            id: `a-${seq}`,
            ...action.payload,
          },
          ...state.activity,
        ],
      }
    }
    default:
      return state
  }
}

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(adminReducer, {
    verifications: sampleVerifications,
    users: sampleUsers,
    flags: sampleFlags,
    activity: sampleActivity,
    seq: 200,
  })

  const verifyDecision = (data) => dispatch({ type: 'VERIFY_DECISION', payload: data })
  const updateUserStatus = (data) => dispatch({ type: 'UPDATE_USER_STATUS', payload: data })
  const resolveFlag = (data) => dispatch({ type: 'RESOLVE_FLAG', payload: data })
  const logAction = (data) => dispatch({ type: 'LOG_ACTION', payload: data })

  const getVerificationById = (id) => state.verifications.find((v) => v.id === id)
  const getPendingVerifications = () => state.verifications.filter((v) => v.status === 'pending')
  const getUserById = (id) => state.users.find((u) => String(u.id) === String(id))
  const searchUsers = (query) => {
    const q = (query || '').toLowerCase().trim()
    if (!q) return state.users
    return state.users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.includes(q),
    )
  }
  const getOpenFlags = () => state.flags.filter((f) => f.status === 'open')
  const getFlagsByKind = (kind) => state.flags.filter((f) => f.kind === kind)

  const getStats = () => ({
    pendingVerifications: state.verifications.filter((v) => v.status === 'pending').length,
    openFlags: state.flags.filter((f) => f.status === 'open').length,
    suspendedUsers: state.users.filter((u) => u.status === 'suspended' || u.status === 'banned').length,
    totalUsers: state.users.length,
  })

  const value = useMemo(
    () => ({
      verifications: state.verifications,
      users: state.users,
      flags: state.flags,
      activity: state.activity,
      verifyDecision,
      updateUserStatus,
      resolveFlag,
      logAction,
      getVerificationById,
      getPendingVerifications,
      getUserById,
      searchUsers,
      getOpenFlags,
      getFlagsByKind,
      getStats,
    }),
    // Mutators close over dispatch; selectors recompute from state slices
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.verifications, state.users, state.flags, state.activity],
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

// eslint-disable-next-line react-only-export-components -- intentional: hook belongs with its provider
export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
