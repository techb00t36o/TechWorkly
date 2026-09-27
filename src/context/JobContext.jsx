import { createContext, useContext, useReducer } from 'react'

const JobContext = createContext(null)

const sampleJobs = [
  {
    id: '1',
    // companyId 1 matches the demo user id from onboarding (setUser({ id: 1, ... }))
    // so the demo company owns this job and sees its applicants / Manage Jobs entry
    companyId: 1,
    companyName: 'Nimbus Labs',
    title: 'Senior React Developer',
    description: 'We are looking for an experienced React developer to build and maintain our core SaaS dashboard. You will work closely with the design team to implement pixel-perfect UI components and integrate with our GraphQL API. Strong understanding of performance optimization and testing is required.',
    category: 'Web',
    skills: ['React', 'TypeScript', 'GraphQL', 'TailwindCSS'],
    budget: 8000,
    duration: '3 months',
    status: 'open',
    postedAt: '2026-09-10T10:00:00Z',
    applications: [
      // workerId 1 matches the demo worker id so both demo roles can run the full
      // Make Offer → Accept → Fund → Submit → Approve loop across sessions
      { workerId: 1, workerName: 'Amina K.', appliedAt: '2026-09-11T14:00:00Z', status: 'pending' },
    ],
  },
  {
    id: '2',
    companyId: 'company-2',
    companyName: 'Bluepeak',
    title: 'Flutter Mobile Developer',
    description: 'Join our mobile team to build cross-platform fintech applications. You will develop features for our payment processing app, implement secure authentication flows, and work with real-time transaction data. Experience with state management and CI/CD pipelines is a plus.',
    category: 'Mobile',
    skills: ['Flutter', 'Dart', 'Firebase', 'REST API'],
    budget: 7000,
    duration: '2 months',
    status: 'open',
    postedAt: '2026-09-09T08:00:00Z',
    applications: [
      { workerId: 'w-1', workerName: 'Sofia M.', appliedAt: '2026-09-10T14:00:00Z', status: 'pending' },
    ],
  },
  {
    id: '3',
    companyId: 'company-3',
    companyName: 'Vector Systems',
    title: 'QA Automation Engineer',
    description: 'We need a detail-oriented QA engineer to design and implement our automated testing suite. You will write end-to-end tests using Playwright, maintain CI pipelines, and help improve our overall code quality. Familiarity with desktop applications is preferred.',
    category: 'Desktop',
    skills: ['Playwright', 'Cypress', 'Jenkins', 'Python'],
    budget: 5500,
    duration: '6 weeks',
    status: 'open',
    postedAt: '2026-09-08T12:00:00Z',
    applications: [
      { workerId: 'w-2', workerName: 'David R.', appliedAt: '2026-09-09T09:00:00Z', status: 'accepted' },
      { workerId: 'w-3', workerName: 'Liam O.', appliedAt: '2026-09-10T11:00:00Z', status: 'pending' },
    ],
  },
  {
    id: '4',
    companyId: 'company-1',
    companyName: 'Nimbus Labs',
    title: 'Security Auditor',
    description: 'Perform comprehensive security audits on our web applications and APIs. You will identify vulnerabilities, write detailed reports, and provide remediation guidance. Experience with OWASP top 10, penetration testing, and security tooling is essential.',
    category: 'Web',
    skills: ['Pentest', 'OWASP', 'Burp Suite', 'Node.js'],
    budget: 6000,
    duration: '4 weeks',
    status: 'open',
    postedAt: '2026-09-07T15:00:00Z',
    applications: [],
  },
  {
    id: '5',
    companyId: 'company-4',
    companyName: 'Horizon Web',
    title: 'E-commerce Frontend Developer',
    description: 'Build high-converting e-commerce experiences using Next.js and headless CMS. You will implement product pages, checkout flows, and performance optimizations. Strong eye for design and conversion optimization is required.',
    category: 'Web',
    skills: ['Next.js', 'TypeScript', 'Stripe', 'Sanity'],
    budget: 9000,
    duration: '2 months',
    status: 'closed',
    postedAt: '2026-08-20T10:00:00Z',
    applications: [
      { workerId: 'w-4', workerName: 'Elena R.', appliedAt: '2026-08-21T08:00:00Z', status: 'accepted' },
    ],
  },
  {
    id: '6',
    companyId: 'company-5',
    companyName: 'Pocketcast Apps',
    title: 'Backend API Developer',
    description: 'Develop and maintain RESTful APIs for our consumer utility apps. You will design database schemas, implement authentication, and build real-time features using WebSockets. Go or Node.js experience preferred.',
    category: 'Mobile',
    skills: ['Node.js', 'Go', 'PostgreSQL', 'WebSockets'],
    budget: 6500,
    duration: '6 weeks',
    status: 'open',
    postedAt: '2026-09-05T09:00:00Z',
    applications: [],
  },
  {
    id: '7',
    companyId: 'company-6',
    companyName: 'Fiberline',
    title: 'Browser Extension Developer',
    description: 'Create privacy-focused browser extensions for Chrome and Firefox. You will build content scripts, background workers, and popup UIs. Experience with WebExtensions API and Manifest V3 is essential.',
    category: 'Browser',
    skills: ['JavaScript', 'WebExtensions', 'Manifest V3', 'HTML/CSS'],
    budget: 4500,
    duration: '4 weeks',
    status: 'open',
    postedAt: '2026-09-04T14:00:00Z',
    applications: [
      { workerId: 'w-5', workerName: 'Marcus T.', appliedAt: '2026-09-05T10:00:00Z', status: 'pending' },
    ],
  },
  {
    id: '8',
    companyId: 'company-7',
    companyName: 'Quantum Soft',
    title: 'Full-Stack Dashboard Developer',
    description: 'Build enterprise-grade data dashboards and reporting tools. You will work with React on the frontend and Node.js on the backend, integrating with complex data pipelines. Experience with charting libraries and data visualization is required.',
    category: 'Desktop',
    skills: ['React', 'Node.js', 'D3.js', 'PostgreSQL'],
    budget: 10000,
    duration: '3 months',
    status: 'open',
    postedAt: '2026-09-03T11:00:00Z',
    applications: [],
  },
]

// Manages the full jobs array in-memory; each action replaces the matching job
// via immutable map/filter patterns to avoid direct state mutation
function jobReducer(state, action) {
  switch (action.type) {
    case 'CREATE_JOB': {
      // Generate a temporary client-side ID using Date.now(); this will be replaced
      // by a server-generated UUID in production
      const newJob = {
        ...action.payload,
        id: Date.now().toString(),
        status: 'open',
        postedAt: new Date().toISOString(),
        applications: [],
      }
      return { ...state, jobs: [newJob, ...state.jobs] }
    }
    case 'UPDATE_JOB': {
      return {
        ...state,
        jobs: state.jobs.map((job) =>
          job.id === action.payload.id ? { ...job, ...action.payload } : job,
        ),
      }
    }
    case 'DELETE_JOB': {
      return { ...state, jobs: state.jobs.filter((job) => job.id !== action.payload) }
    }
    // Toggle between 'open' and 'closed' status, leaving all other jobs untouched
    case 'TOGGLE_JOB_STATUS': {
      return {
        ...state,
        jobs: state.jobs.map((job) =>
          job.id === action.payload
            ? { ...job, status: job.status === 'open' ? 'closed' : 'open' }
            : job,
        ),
      }
    }
    // Immutably append a new application to the target job's applications array;
    // all other jobs remain unchanged
    case 'APPLY_TO_JOB': {
      return {
        ...state,
        jobs: state.jobs.map((job) =>
          job.id === action.payload.jobId
            ? {
                ...job,
                applications: [
                  ...job.applications,
                  {
                    workerId: action.payload.workerId,
                    workerName: action.payload.workerName,
                    appliedAt: new Date().toISOString(),
                    status: 'pending',
                  },
                ],
              }
            : job,
        ),
      }
    }
    // Navigate nested structure: find job -> find application -> update only the matching one
    case 'UPDATE_APPLICATION_STATUS': {
      return {
        ...state,
        jobs: state.jobs.map((job) =>
          job.id === action.payload.jobId
            ? {
                ...job,
                applications: job.applications.map((app) =>
                  app.workerId === action.payload.workerId
                    ? { ...app, status: action.payload.status }
                    : app,
                ),
              }
            : job,
        ),
      }
    }
    default:
      return state
  }
}

export function JobProvider({ children }) {
  const [state, dispatch] = useReducer(jobReducer, { jobs: sampleJobs })

  const createJob = (job) => {
    dispatch({ type: 'CREATE_JOB', payload: job })
  }

  const updateJob = (job) => {
    dispatch({ type: 'UPDATE_JOB', payload: job })
  }

  const deleteJob = (jobId) => {
    dispatch({ type: 'DELETE_JOB', payload: jobId })
  }

  const toggleJobStatus = (jobId) => {
    dispatch({ type: 'TOGGLE_JOB_STATUS', payload: jobId })
  }

  const applyToJob = (jobId, workerId, workerName) => {
    dispatch({ type: 'APPLY_TO_JOB', payload: { jobId, workerId, workerName } })
  }

  const updateApplicationStatus = (jobId, workerId, status) => {
    dispatch({ type: 'UPDATE_APPLICATION_STATUS', payload: { jobId, workerId, status } })
  }

  const getJobsByCompany = (companyId) => {
    return state.jobs.filter((job) => job.companyId === companyId)
  }

  const getJobById = (jobId) => {
    return state.jobs.find((job) => job.id === jobId)
  }

  // Safely check if a specific worker has already applied; returns false if job not found
  const hasApplied = (jobId, workerId) => {
    const job = state.jobs.find((j) => j.id === jobId)
    return job?.applications.some((app) => app.workerId === workerId) || false
  }

  const value = {
    ...state,
    createJob,
    updateJob,
    deleteJob,
    toggleJobStatus,
    applyToJob,
    updateApplicationStatus,
    getJobsByCompany,
    getJobById,
    hasApplied,
  }

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>
}

// eslint-disable-next-line react-only-export-components -- intentional: hook belongs with its provider
export function useJobs() {
  const context = useContext(JobContext)
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider')
  }
  return context
}
