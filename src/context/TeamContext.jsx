// Team-Based Hiring state: multi-role teams, per-role applications, and the
// shared Team Workspace (chat, files, milestones, work-count) — PRD 5.5.
import { createContext, useContext, useReducer } from 'react'

const TeamContext = createContext(null)

// Demo company/worker ids are 1 (onboarding setUser), so the seeded team is
// owned by company 1 and already has worker 1 hired as Team Lead.
const sampleTeams = [
  {
    id: 't-1',
    companyId: 1,
    companyName: 'Nimbus Labs',
    title: 'E-commerce Platform Rebuild',
    description:
      'Rebuild our headless e-commerce platform end to end: storefront, checkout, admin API, and a full automated QA suite. We need a tight cross-functional pod that can ship weekly.',
    projectType: 'One-time',
    status: 'in_progress',
    startDate: '2026-09-15',
    deadline: '2026-12-15',
    teamLeadId: 1,
    createdAt: '2026-09-01T10:00:00Z',
    roles: [
      {
        id: 'tr-1',
        title: 'Backend Developer',
        subCategory: 'Web',
        quantity: 2,
        filled: 1,
        skills: ['Node.js', 'PostgreSQL', 'REST API'],
        experience: 'Senior',
        budgetType: 'fixed',
        budget: 5000,
        escrowFunded: true,
      },
      {
        id: 'tr-2',
        title: 'QA Engineer',
        subCategory: null,
        quantity: 1,
        filled: 0,
        skills: ['Playwright', 'Cypress', 'CI/CD'],
        experience: 'Mid-level',
        budgetType: 'fixed',
        budget: 3500,
        escrowFunded: true,
      },
      {
        id: 'tr-3',
        title: 'Security Reviewer',
        subCategory: null,
        quantity: 1,
        filled: 0,
        skills: ['Pentest', 'OWASP', 'Node.js'],
        experience: 'Senior',
        budgetType: 'fixed',
        budget: 4000,
        escrowFunded: false,
      },
    ],
    members: [
      {
        workerId: 1,
        workerName: 'Amina K.',
        roleId: 'tr-1',
        roleTitle: 'Backend Developer',
        isLead: true,
        workCount: 3,
        joinedAt: '2026-09-10T10:00:00Z',
      },
    ],
    milestones: [
      { id: 'tm-1', title: 'API architecture + auth', dueDate: '2026-09-28', status: 'approved' },
      { id: 'tm-2', title: 'Checkout + payments integration', dueDate: '2026-10-20', status: 'in_progress' },
      { id: 'tm-3', title: 'QA suite + security review', dueDate: '2026-11-15', status: 'not_started' },
      { id: 'tm-4', title: 'Launch hardening + handoff', dueDate: '2026-12-10', status: 'not_started' },
    ],
    files: [
      { id: 'tf-1', name: 'product-brief.pdf', size: '2.4 MB', uploadedBy: 'Nimbus Labs', uploadedAt: '2026-09-12T09:00:00Z' },
      { id: 'tf-2', name: 'api-schema-v2.yaml', size: '180 KB', uploadedBy: 'Amina K.', uploadedAt: '2026-09-18T14:30:00Z' },
      { id: 'tf-3', name: 'design-system.fig', size: '12 MB', uploadedBy: 'Nimbus Labs', uploadedAt: '2026-09-20T11:00:00Z' },
    ],
    chat: [
      { id: 'tc-1', senderId: 1, senderName: 'Nimbus Labs', senderRole: 'company', text: 'Welcome to the team workspace! Kickoff notes are in Files.', createdAt: '2026-09-15T09:00:00Z' },
      { id: 'tc-2', senderId: 1, senderName: 'Amina K.', senderRole: 'worker', text: 'Auth module is done — starting checkout integration today.', createdAt: '2026-09-22T10:15:00Z' },
      { id: 'tc-3', senderId: 1, senderName: 'Nimbus Labs', senderRole: 'company', text: 'Great. QA and Security seats are still open — applicants are in review.', createdAt: '2026-09-22T11:00:00Z' },
    ],
    tasks: [
      { id: 'tt-1', title: 'Ship orders API endpoints', assigneeId: 1, assigneeName: 'Amina K.', status: 'done', dueDate: '2026-09-25' },
      { id: 'tt-2', title: 'Integrate Stripe checkout session', assigneeId: 1, assigneeName: 'Amina K.', status: 'in_progress', dueDate: '2026-10-10' },
      { id: 'tt-3', title: 'Draft E2E test plan', assigneeId: null, assigneeName: 'Unassigned', status: 'not_started', dueDate: '2026-10-15' },
    ],
    activity: [
      { id: 'ta-1', text: 'Milestone "API architecture + auth" approved — escrow released', createdAt: '2026-09-21T16:00:00Z' },
      { id: 'ta-2', text: 'Amina K. joined as Backend Developer (Team Lead)', createdAt: '2026-09-10T10:00:00Z' },
      { id: 'ta-3', text: 'Team published with 3 open roles', createdAt: '2026-09-01T10:00:00Z' },
    ],
  },
  {
    id: 't-2',
    companyId: 'company-2',
    companyName: 'Bluepeak',
    title: 'Fintech Mobile App Pod',
    description:
      'Assemble a pod to ship a cross-platform fintech app: mobile engineers, QA, and a security reviewer working together from day one.',
    projectType: 'Ongoing',
    status: 'open',
    startDate: '2026-10-01',
    deadline: '2027-03-01',
    teamLeadId: null,
    createdAt: '2026-09-18T10:00:00Z',
    roles: [
      {
        id: 'tr-4',
        title: 'Mobile Developer',
        subCategory: 'Mobile',
        quantity: 2,
        filled: 0,
        skills: ['Flutter', 'Dart', 'Firebase'],
        experience: 'Mid-level',
        budgetType: 'hourly',
        budget: 60,
        escrowFunded: true,
      },
      {
        id: 'tr-5',
        title: 'QA Engineer',
        subCategory: null,
        quantity: 1,
        filled: 0,
        skills: ['Playwright', 'Mobile testing'],
        experience: 'Senior',
        budgetType: 'fixed',
        budget: 4000,
        escrowFunded: true,
      },
      {
        id: 'tr-6',
        title: 'Security Reviewer',
        subCategory: null,
        quantity: 1,
        filled: 0,
        skills: ['OWASP', 'Mobile security'],
        experience: 'Senior',
        budgetType: 'fixed',
        budget: 4500,
        escrowFunded: true,
      },
    ],
    members: [],
    milestones: [
      { id: 'tm-5', title: 'Architecture & threat model', dueDate: '2026-10-20', status: 'not_started' },
      { id: 'tm-6', title: 'MVP feature complete', dueDate: '2027-01-15', status: 'not_started' },
    ],
    files: [],
    chat: [],
    tasks: [],
    activity: [
      { id: 'ta-4', text: 'Team published with 3 open roles', createdAt: '2026-09-18T10:00:00Z' },
    ],
  },
]

// Applications live outside teams so role tabs can filter flat and hire
// actions can update both the application and the team role seat atomically.
const sampleApplications = [
  {
    id: 'ta-101',
    teamId: 't-1',
    roleId: 'tr-1',
    workerId: 1,
    workerName: 'Amina K.',
    rating: 4.9,
    jobsCompleted: 42,
    verified: true,
    skills: ['Node.js', 'PostgreSQL', 'React'],
    rate: '$55/hr',
    coverMessage: 'I have led backend rebuilds for two marketplaces and can own the API surface end to end.',
    status: 'hired',
    appliedAt: '2026-09-08T10:00:00Z',
  },
  {
    id: 'ta-102',
    teamId: 't-1',
    roleId: 'tr-1',
    workerId: 'w-5',
    workerName: 'Marcus T.',
    rating: 4.7,
    jobsCompleted: 28,
    verified: true,
    skills: ['Node.js', 'Go', 'Redis'],
    rate: '$50/hr',
    coverMessage: 'Built high-throughput payment APIs. Available full-time from next week.',
    status: 'pending',
    appliedAt: '2026-09-20T09:00:00Z',
  },
  {
    id: 'ta-103',
    teamId: 't-1',
    roleId: 'tr-2',
    workerId: 'w-6',
    workerName: 'Priya S.',
    rating: 4.8,
    jobsCompleted: 35,
    verified: true,
    skills: ['Playwright', 'Cypress', 'Python'],
    rate: '$45/hr',
    coverMessage: 'I will own the E2E suite and CI gates so regressions never reach staging.',
    status: 'pending',
    appliedAt: '2026-09-21T14:00:00Z',
  },
  {
    id: 'ta-104',
    teamId: 't-1',
    roleId: 'tr-2',
    workerId: 'w-7',
    workerName: 'Tomás L.',
    rating: 4.5,
    jobsCompleted: 19,
    verified: false,
    skills: ['Cypress', 'Jest', 'Manual QA'],
    rate: '$40/hr',
    coverMessage: 'Detail-oriented QA with fintech experience. Can start immediately.',
    status: 'shortlisted',
    appliedAt: '2026-09-21T16:30:00Z',
  },
  {
    id: 'ta-105',
    teamId: 't-1',
    roleId: 'tr-3',
    workerId: 'w-8',
    workerName: 'Jonas W.',
    rating: 5.0,
    jobsCompleted: 51,
    verified: true,
    skills: ['Pentest', 'OWASP', 'Burp Suite'],
    rate: '$65/hr',
    coverMessage: 'Former appsec lead. I will run a full threat model before checkout goes live.',
    status: 'pending',
    appliedAt: '2026-09-22T08:00:00Z',
  },
  {
    id: 'ta-106',
    teamId: 't-2',
    roleId: 'tr-4',
    workerId: 'w-9',
    workerName: 'Sofia M.',
    rating: 4.6,
    jobsCompleted: 22,
    verified: true,
    skills: ['Flutter', 'Dart', 'Firebase'],
    rate: '$55/hr',
    coverMessage: 'Shipped three production Flutter apps for fintech clients.',
    status: 'pending',
    appliedAt: '2026-09-19T12:00:00Z',
  },
]

// Nested immutability: map teams → map roles/members/workspace slices → replace one.
// Hire is the critical action: it marks the application hired, fills one seat,
// appends the member, logs activity, and derives open/filling/filled status.
function teamReducer(state, action) {
  switch (action.type) {
    case 'CREATE_TEAM': {
      const newTeam = {
        ...action.payload,
        id: action.payload.id || `t-${Date.now()}`,
        status: 'open',
        teamLeadId: null,
        members: [],
        milestones: [],
        files: [],
        chat: [],
        tasks: [],
        activity: [
          {
            id: `ta-${Date.now()}`,
            text: `Team published with ${action.payload.roles.length} open role${action.payload.roles.length !== 1 ? 's' : ''}`,
            createdAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
      }
      return { ...state, teams: [newTeam, ...state.teams] }
    }
    case 'APPLY_TO_ROLE': {
      return { ...state, applications: [action.payload, ...state.applications] }
    }
    case 'UPDATE_APPLICATION_STATUS': {
      return {
        ...state,
        applications: state.applications.map((a) =>
          a.id === action.payload.applicationId
            ? { ...a, status: action.payload.status }
            : a,
        ),
      }
    }
    case 'HIRE_APPLICATION': {
      const { applicationId, contractId } = action.payload
      const application = state.applications.find((a) => a.id === applicationId)
      if (!application) return state

      const teams = state.teams.map((t) => {
        if (t.id !== application.teamId) return t
        const roles = t.roles.map((r) =>
          r.id === application.roleId ? { ...r, filled: r.filled + 1 } : r,
        )
        const allFilled = roles.every((r) => r.filled >= r.quantity)
        const anyFilled = roles.some((r) => r.filled > 0)
        const status = allFilled ? 'filled' : anyFilled && t.status !== 'in_progress' ? 'filling' : t.status
        const member = {
          workerId: application.workerId,
          workerName: application.workerName,
          roleId: application.roleId,
          roleTitle: roles.find((r) => r.id === application.roleId)?.title || 'Member',
          isLead: false,
          workCount: 1,
          joinedAt: new Date().toISOString(),
          contractId,
        }
        return {
          ...t,
          roles,
          status: t.status === 'in_progress' ? t.status : status,
          members: [...t.members, member],
          activity: [
            {
              id: `ta-${Date.now()}`,
              text: `${application.workerName} hired for ${member.roleTitle}`,
              createdAt: new Date().toISOString(),
            },
            ...t.activity,
          ],
        }
      })

      return {
        ...state,
        teams,
        applications: state.applications.map((a) =>
          a.id === applicationId ? { ...a, status: 'hired', contractId } : a,
        ),
      }
    }
    case 'SET_TEAM_LEAD': {
      return {
        ...state,
        teams: state.teams.map((t) =>
          t.id === action.payload.teamId
            ? {
                ...t,
                teamLeadId: action.payload.workerId,
                members: t.members.map((m) =>
                  String(m.workerId) === String(action.payload.workerId)
                    ? { ...m, isLead: true }
                    : { ...m, isLead: false },
                ),
                activity: [
                  {
                    id: `ta-${Date.now()}`,
                    text: `${action.payload.workerName} assigned as Team Lead`,
                    createdAt: new Date().toISOString(),
                  },
                  ...t.activity,
                ],
              }
            : t,
        ),
      }
    }
    case 'FUND_ROLE_ESCROW': {
      return {
        ...state,
        teams: state.teams.map((t) =>
          t.id === action.payload.teamId
            ? {
                ...t,
                roles: t.roles.map((r) =>
                  r.id === action.payload.roleId ? { ...r, escrowFunded: true } : r,
                ),
              }
            : t,
        ),
      }
    }
    case 'ADD_CHAT_MESSAGE': {
      return {
        ...state,
        teams: state.teams.map((t) =>
          t.id === action.payload.teamId
            ? {
                ...t,
                chat: [
                  ...t.chat,
                  // Id assigned here (reducer, outside render) to keep components pure
                  { id: `tc-${state.chatSeq ?? 0}-${t.chat.length}`, ...action.payload.message },
                ],
              }
            : t,
        ),
        chatSeq: (state.chatSeq ?? 0) + 1,
      }
    }
    case 'ADD_FILE': {
      return {
        ...state,
        teams: state.teams.map((t) =>
          t.id === action.payload.teamId
            ? {
                ...t,
                files: [
                  { id: `tf-${state.fileSeq ?? 0}-${t.files.length}`, ...action.payload.file },
                  ...t.files,
                ],
                activity: [
                  {
                    id: `ta-f-${state.fileSeq ?? 0}`,
                    text: `${action.payload.file.uploadedBy} uploaded ${action.payload.file.name}`,
                    createdAt: action.payload.file.uploadedAt,
                  },
                  ...t.activity,
                ],
              }
            : t,
        ),
        fileSeq: (state.fileSeq ?? 0) + 1,
      }
    }
    case 'UPDATE_MILESTONE_STATUS': {
      return {
        ...state,
        teams: state.teams.map((t) => {
          if (t.id !== action.payload.teamId) return t
          const milestone = t.milestones.find((m) => m.id === action.payload.milestoneId)
          return {
            ...t,
            milestones: t.milestones.map((m) =>
              m.id === action.payload.milestoneId ? { ...m, status: action.payload.status } : m,
            ),
            activity:
              action.payload.status === 'approved' && milestone
                ? [
                    {
                      id: `ta-${Date.now()}`,
                      text: `Milestone "${milestone.title}" approved`,
                      createdAt: new Date().toISOString(),
                    },
                    ...t.activity,
                  ]
                : t.activity,
          }
        }),
      }
    }
    case 'ADD_TASK': {
      return {
        ...state,
        teams: state.teams.map((t) =>
          t.id === action.payload.teamId
            ? { ...t, tasks: [...t.tasks, action.payload.task] }
            : t,
        ),
      }
    }
    case 'UPDATE_TASK': {
      return {
        ...state,
        teams: state.teams.map((t) =>
          t.id === action.payload.teamId
            ? {
                ...t,
                tasks: t.tasks.map((task) =>
                  task.id === action.payload.taskId
                    ? { ...task, ...action.payload.updates }
                    : task,
                ),
              }
            : t,
        ),
      }
    }
    default:
      return state
  }
}

export function TeamProvider({ children }) {
  const [state, dispatch] = useReducer(teamReducer, {
    teams: sampleTeams,
    applications: sampleApplications,
  })

  const createTeam = (data) => {
    const id = `t-${Date.now()}`
    dispatch({ type: 'CREATE_TEAM', payload: { ...data, id } })
    return id
  }

  const applyToRole = ({ teamId, roleId, workerId, workerName, rating, jobsCompleted, verified, skills, rate, coverMessage }) => {
    const id = `ta-${Date.now()}`
    dispatch({
      type: 'APPLY_TO_ROLE',
      payload: {
        id,
        teamId,
        roleId,
        workerId,
        workerName,
        rating: rating ?? 4.5,
        jobsCompleted: jobsCompleted ?? 10,
        verified: verified ?? false,
        skills: skills ?? [],
        rate: rate ?? '$45/hr',
        coverMessage,
        status: 'pending',
        appliedAt: new Date().toISOString(),
      },
    })
    return id
  }

  const updateApplicationStatus = (applicationId, status) => {
    dispatch({ type: 'UPDATE_APPLICATION_STATUS', payload: { applicationId, status } })
  }

  const hireApplication = (applicationId, contractId) => {
    dispatch({ type: 'HIRE_APPLICATION', payload: { applicationId, contractId } })
  }

  const setTeamLead = (teamId, workerId, workerName) => {
    dispatch({ type: 'SET_TEAM_LEAD', payload: { teamId, workerId, workerName } })
  }

  const fundRoleEscrow = (teamId, roleId) => {
    dispatch({ type: 'FUND_ROLE_ESCROW', payload: { teamId, roleId } })
  }

  const addChatMessage = (teamId, message) => {
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { teamId, message } })
  }

  const addFile = (teamId, file) => {
    dispatch({ type: 'ADD_FILE', payload: { teamId, file } })
  }

  const updateMilestoneStatus = (teamId, milestoneId, status) => {
    dispatch({ type: 'UPDATE_MILESTONE_STATUS', payload: { teamId, milestoneId, status } })
  }

  const addTask = (teamId, task) => {
    dispatch({ type: 'ADD_TASK', payload: { teamId, task: { ...task, id: `tt-${Date.now()}` } } })
  }

  const updateTask = (teamId, taskId, updates) => {
    dispatch({ type: 'UPDATE_TASK', payload: { teamId, taskId, updates } })
  }

  const getTeamById = (id) => state.teams.find((t) => t.id === id)

  const getTeamsByCompany = (companyId) =>
    state.teams.filter((t) => String(t.companyId) === String(companyId))

  const getOpenTeams = () => state.teams.filter((t) => t.status === 'open' || t.status === 'filling')

  const getApplicationsByTeam = (teamId) =>
    state.applications.filter((a) => a.teamId === teamId)

  const getApplicationsByRole = (teamId, roleId) =>
    state.applications.filter((a) => a.teamId === teamId && a.roleId === roleId)

  const hasApplied = (teamId, roleId, workerId) =>
    state.applications.some(
      (a) =>
        a.teamId === teamId &&
        a.roleId === roleId &&
        String(a.workerId) === String(workerId),
    )

  const isTeamMember = (teamId, userId) => {
    const team = getTeamById(teamId)
    if (!team) return false
    return (
      String(team.companyId) === String(userId) ||
      team.members.some((m) => String(m.workerId) === String(userId))
    )
  }

  const value = {
    ...state,
    createTeam,
    applyToRole,
    updateApplicationStatus,
    hireApplication,
    setTeamLead,
    fundRoleEscrow,
    addChatMessage,
    addFile,
    updateMilestoneStatus,
    addTask,
    updateTask,
    getTeamById,
    getTeamsByCompany,
    getOpenTeams,
    getApplicationsByTeam,
    getApplicationsByRole,
    hasApplied,
    isTeamMember,
  }

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>
}

// eslint-disable-next-line react-only-export-components -- intentional: hook belongs with its provider
export function useTeams() {
  const context = useContext(TeamContext)
  if (!context) {
    throw new Error('useTeams must be used within a TeamProvider')
  }
  return context
}
