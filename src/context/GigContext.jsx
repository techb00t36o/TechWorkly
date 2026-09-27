// Gigs marketplace state (PRD 5.6): Worker-initiated service packages with
// instant company ordering. Orders normalize into unified Contracts (GIG_ORDER).
import { createContext, useContext, useReducer } from 'react'

const GigContext = createContext(null)

// Browse_Gigs filter taxonomy
export const gigCategories = [
  { value: 'developer', label: 'Developer' },
  { value: 'qa', label: 'QA Engineer' },
  { value: 'hacker', label: 'Hacker' },
]

export const gigSubCategories = {
  developer: [
    { value: 'web', label: 'Web' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'desktop', label: 'Desktop' },
    { value: 'browser', label: 'Browser' },
  ],
}

export const deliveryFilters = [
  { value: 3, label: 'Up to 3 days' },
  { value: 7, label: 'Up to 7 days' },
  { value: 14, label: 'Up to 14 days' },
]

export const gigSorts = [
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'top-rated', label: 'Top Rated' },
]

// Seed gigs mirror worker-profile names so Browse → Worker Profile links work.
// Demo worker id 1 owns the Amina gigs (same id as demo auth user).
const sampleGigs = [
  {
    id: 'gig-1',
    workerId: 1,
    workerName: 'Amina K.',
    workerSlug: 'amina-k',
    workerAvatar: 'https://i.pravatar.cc/300?img=47',
    verified: true,
    title: 'React Performance Audit',
    description:
      'Identify and fix performance bottlenecks in your React application with actionable recommendations. Includes bundle analysis, render profiling, and a prioritized fix roadmap your team can ship immediately.',
    category: 'developer',
    subCategory: 'web',
    tags: ['React', 'Performance', 'Audit'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&h=400&fit=crop',
    ],
    rating: 4.9,
    ordersCompleted: 42,
    bestSeller: true,
    createdAt: '2026-06-12T10:00:00Z',
    tools: ['React', 'Lighthouse', 'Why Did You Render', 'Vite'],
    packages: [
      {
        tier: 'basic',
        name: 'Basic',
        price: 400,
        deliveryDays: 3,
        revisions: 1,
        features: ['Performance audit report', 'Bundle analysis', 'Top 5 issues ranked'],
      },
      {
        tier: 'standard',
        name: 'Standard',
        price: 800,
        deliveryDays: 5,
        revisions: 2,
        features: [
          'Everything in Basic',
          'Render optimization guide',
          'Lighthouse score targets',
          '15-min follow-up call',
        ],
      },
      {
        tier: 'premium',
        name: 'Premium',
        price: 1500,
        deliveryDays: 7,
        revisions: 3,
        features: [
          'Everything in Standard',
          'Hands-on refactor PR',
          'CI perf budget setup',
          '30-day async support',
        ],
      },
    ],
    requirements: [
      { id: 'r1', label: 'Repo access or a staging URL', type: 'text' },
      { id: 'r2', label: 'Target browser/device list', type: 'text' },
      { id: 'r3', label: 'Screenshots of slow flows (optional)', type: 'file' },
    ],
    faq: [
      { q: 'Do you need full source access?', a: 'A staging URL is enough for most audits. Source access speeds up the refactor PR tier.' },
      { q: 'Which React versions do you support?', a: 'React 17+ including concurrent features and server components previews.' },
    ],
  },
  {
    id: 'gig-2',
    workerId: 1,
    workerName: 'Amina K.',
    workerSlug: 'amina-k',
    workerAvatar: 'https://i.pravatar.cc/300?img=47',
    verified: true,
    title: 'API Design & Build',
    description:
      'Design and build a RESTful or GraphQL API for your application with authentication, validation, and interactive documentation ready for your frontend team.',
    category: 'developer',
    subCategory: 'web',
    tags: ['Node.js', 'API', 'GraphQL'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&h=400&fit=crop',
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=640&h=400&fit=crop',
    ],
    rating: 4.8,
    ordersCompleted: 31,
    bestSeller: false,
    createdAt: '2026-07-02T10:00:00Z',
    tools: ['Node.js', 'PostgreSQL', 'Swagger', 'JWT'],
    packages: [
      {
        tier: 'basic',
        name: 'Basic',
        price: 600,
        deliveryDays: 5,
        revisions: 1,
        features: ['OpenAPI spec', 'CRUD endpoints', 'JWT auth scaffold'],
      },
      {
        tier: 'standard',
        name: 'Standard',
        price: 1200,
        deliveryDays: 7,
        revisions: 2,
        features: ['Everything in Basic', 'PostgreSQL schema', 'Swagger UI', 'Seed scripts'],
      },
      {
        tier: 'premium',
        name: 'Premium',
        price: 2400,
        deliveryDays: 14,
        revisions: 3,
        features: ['Everything in Standard', 'Role-based access', 'Rate limiting', 'Deployed staging'],
      },
    ],
    requirements: [
      { id: 'r1', label: 'Existing data model or product brief', type: 'text' },
      { id: 'r2', label: 'Preferred stack (Node/Go) notes', type: 'text' },
    ],
    faq: [
      { q: 'Do you write frontend code?', a: 'API-first — I deliver OpenAPI/GraphQL schema your frontend can consume immediately.' },
    ],
  },
  {
    id: 'gig-3',
    workerId: 'w-chen',
    workerName: 'Chen W.',
    workerSlug: 'chen-w',
    workerAvatar: 'https://i.pravatar.cc/300?img=59',
    verified: true,
    title: 'Smart Contract Audit',
    description:
      'Full security audit of your Solidity smart contracts with severity classification, remediation steps, and a free re-audit after fixes.',
    category: 'hacker',
    subCategory: null,
    tags: ['Solidity', 'Security', 'Audit'],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=640&h=400&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=640&h=400&fit=crop'],
    rating: 5.0,
    ordersCompleted: 18,
    bestSeller: true,
    createdAt: '2026-05-20T10:00:00Z',
    tools: ['Slither', 'Foundry', 'Echidna', 'Solidity'],
    packages: [
      {
        tier: 'basic',
        name: 'Basic',
        price: 1000,
        deliveryDays: 5,
        revisions: 1,
        features: ['Manual review ≤ 500 LOC', 'Severity report', 'Slither static scan'],
      },
      {
        tier: 'standard',
        name: 'Standard',
        price: 2500,
        deliveryDays: 7,
        revisions: 2,
        features: ['Everything in Basic', 'Up to 2k LOC', 'Echidna fuzz suite', 'Re-audit'],
      },
      {
        tier: 'premium',
        name: 'Premium',
        price: 5000,
        deliveryDays: 14,
        revisions: 2,
        features: ['Everything in Standard', 'Formal invariants', 'War-room call', 'Publish-ready report'],
      },
    ],
    requirements: [
      { id: 'r1', label: 'Repo commit hash or verified source', type: 'text' },
      { id: 'r2', label: 'Deployed addresses (if any)', type: 'text' },
    ],
    faq: [
      { q: 'Do you sign NDAs?', a: 'Yes — standard mutual NDA available before kickoff.' },
    ],
  },
  {
    id: 'gig-4',
    workerId: 'w-marcus',
    workerName: 'Marcus T.',
    workerSlug: 'marcus-t',
    workerAvatar: 'https://i.pravatar.cc/300?img=12',
    verified: true,
    title: 'Web App Penetration Test',
    description:
      'Comprehensive OWASP-aligned security assessment of your web application with CVSS-scored findings and a practical remediation guide.',
    category: 'hacker',
    subCategory: null,
    tags: ['Pentest', 'OWASP', 'Security'],
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=640&h=400&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=640&h=400&fit=crop'],
    rating: 4.6,
    ordersCompleted: 27,
    bestSeller: false,
    createdAt: '2026-08-01T10:00:00Z',
    tools: ['Burp Suite', 'OWASP ZAP', 'Nmap'],
    packages: [
      {
        tier: 'basic',
        name: 'Basic',
        price: 800,
        deliveryDays: 5,
        revisions: 1,
        features: ['Auth & session tests', 'Top 10 checklist', 'Executive summary'],
      },
      {
        tier: 'standard',
        name: 'Standard',
        price: 1800,
        deliveryDays: 7,
        revisions: 2,
        features: ['Everything in Basic', 'API testing', 'CVSS scoring', 'Retest'],
      },
      {
        tier: 'premium',
        name: 'Premium',
        price: 3500,
        deliveryDays: 14,
        revisions: 2,
        features: ['Everything in Standard', 'Logic-bug deep dive', 'Remediation workshop'],
      },
    ],
    requirements: [
      { id: 'r1', label: 'Staging URL + test accounts', type: 'text' },
      { id: 'r2', label: 'Scope boundaries (out-of-scope paths)', type: 'text' },
    ],
    faq: [],
  },
  {
    id: 'gig-5',
    workerId: 'w-priya',
    workerName: 'Priya N.',
    workerSlug: 'priya-n',
    workerAvatar: 'https://i.pravatar.cc/300?img=45',
    verified: true,
    title: 'PostgreSQL Performance Tuning',
    description:
      'Analyze and optimize your PostgreSQL queries, indexes, and schema for maximum throughput with a clear before/after performance report.',
    category: 'developer',
    subCategory: 'desktop',
    tags: ['PostgreSQL', 'Performance', 'SQL'],
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=640&h=400&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=640&h=400&fit=crop'],
    rating: 4.8,
    ordersCompleted: 22,
    bestSeller: false,
    createdAt: '2026-07-18T10:00:00Z',
    tools: ['PostgreSQL', 'pgBadger', 'EXPLAIN'],
    packages: [
      {
        tier: 'basic',
        name: 'Basic',
        price: 350,
        deliveryDays: 3,
        revisions: 1,
        features: ['Slow-query review', 'Index recommendations'],
      },
      {
        tier: 'standard',
        name: 'Standard',
        price: 900,
        deliveryDays: 5,
        revisions: 2,
        features: ['Everything in Basic', 'Schema optimization', 'Before/after report'],
      },
      {
        tier: 'premium',
        name: 'Premium',
        price: 1800,
        deliveryDays: 7,
        revisions: 2,
        features: ['Everything in Standard', 'Partitioning plan', 'Query rewrite PR'],
      },
    ],
    requirements: [
      { id: 'r1', label: 'EXPLAIN ANALYZE output for top queries', type: 'file' },
      { id: 'r2', label: 'Approximate table sizes', type: 'text' },
    ],
    faq: [],
  },
  {
    id: 'gig-6',
    workerId: 'w-mahfuz',
    workerName: 'Mahfuz',
    workerSlug: 'mahfuz',
    workerAvatar: '/Mahfuz.jpg',
    verified: true,
    title: 'Landing Page Build',
    description:
      'A modern, responsive landing page built with React and TailwindCSS, optimized for performance and SEO — ready to deploy.',
    category: 'developer',
    subCategory: 'web',
    tags: ['React', 'TailwindCSS', 'SEO'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=400&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=400&fit=crop'],
    rating: 4.9,
    ordersCompleted: 15,
    bestSeller: false,
    createdAt: '2026-08-15T10:00:00Z',
    tools: ['React', 'Vite', 'TailwindCSS', 'Lighthouse'],
    packages: [
      {
        tier: 'basic',
        name: 'Basic',
        price: 400,
        deliveryDays: 3,
        revisions: 2,
        features: ['1-page responsive build', 'Basic SEO tags', 'Deploy help'],
      },
      {
        tier: 'standard',
        name: 'Standard',
        price: 800,
        deliveryDays: 5,
        revisions: 2,
        features: ['Everything in Basic', 'CMS-ready sections', 'Analytics setup'],
      },
      {
        tier: 'premium',
        name: 'Premium',
        price: 1500,
        deliveryDays: 7,
        revisions: 3,
        features: ['Everything in Standard', 'A/B-ready variants', '30-day support'],
      },
    ],
    requirements: [
      { id: 'r1', label: 'Brand colors / Figma link', type: 'text' },
      { id: 'r2', label: 'Copy draft or outline', type: 'file' },
    ],
    faq: [
      { q: 'Can you match our design system?', a: 'Yes — share Figma/tokens and I will follow them exactly.' },
    ],
  },
  {
    id: 'gig-7',
    workerId: 'w-david',
    workerName: 'David R.',
    workerSlug: 'david-r',
    workerAvatar: 'https://i.pravatar.cc/300?img=53',
    verified: false,
    title: 'Playwright E2E Test Suite',
    description:
      'Set up a maintainable end-to-end test suite with Playwright covering your critical user flows and CI integration.',
    category: 'qa',
    subCategory: null,
    tags: ['Playwright', 'E2E', 'CI'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=640&h=400&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=640&h=400&fit=crop'],
    rating: 4.7,
    ordersCompleted: 19,
    bestSeller: false,
    createdAt: '2026-08-22T10:00:00Z',
    tools: ['Playwright', 'TypeScript', 'GitHub Actions'],
    packages: [
      {
        tier: 'basic',
        name: 'Basic',
        price: 500,
        deliveryDays: 5,
        revisions: 1,
        features: ['5 critical-path tests', 'CI workflow file'],
      },
      {
        tier: 'standard',
        name: 'Standard',
        price: 1200,
        deliveryDays: 7,
        revisions: 2,
        features: ['Everything in Basic', 'Page-object structure', '15 tests', 'Flake report'],
      },
      {
        tier: 'premium',
        name: 'Premium',
        price: 2200,
        deliveryDays: 14,
        revisions: 2,
        features: ['Everything in Standard', 'Visual regression', 'Parallel grid', 'Training call'],
      },
    ],
    requirements: [
      { id: 'r1', label: 'Staging URL + credentials', type: 'text' },
      { id: 'r2', label: 'Priority user flows list', type: 'text' },
    ],
    faq: [],
  },
  {
    id: 'gig-8',
    workerId: 'w-sofia',
    workerName: 'Sofia M.',
    workerSlug: 'sofia-m',
    workerAvatar: 'https://i.pravatar.cc/300?img=44',
    verified: true,
    title: 'Flutter App UI Polish',
    description:
      'Pixel-perfect Flutter UI refinements: animations, responsive layouts, and theme consistency across iOS and Android.',
    category: 'developer',
    subCategory: 'mobile',
    tags: ['Flutter', 'UI', 'Mobile'],
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=640&h=400&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=640&h=400&fit=crop'],
    rating: 4.7,
    ordersCompleted: 12,
    bestSeller: false,
    createdAt: '2026-09-01T10:00:00Z',
    tools: ['Flutter', 'Dart', 'Figma'],
    packages: [
      {
        tier: 'basic',
        name: 'Basic',
        price: 300,
        deliveryDays: 3,
        revisions: 1,
        features: ['Theme cleanup', 'Spacing pass'],
      },
      {
        tier: 'standard',
        name: 'Standard',
        price: 700,
        deliveryDays: 5,
        revisions: 2,
        features: ['Everything in Basic', 'Micro-interactions', 'Responsive breakpoints'],
      },
      {
        tier: 'premium',
        name: 'Premium',
        price: 1400,
        deliveryDays: 10,
        revisions: 3,
        features: ['Everything in Standard', 'Custom transitions', 'Design-token sync'],
      },
    ],
    requirements: [
      { id: 'r1', label: 'Figma link or screenshots', type: 'text' },
    ],
    faq: [],
  },
]

// Gig orders are thin metadata; money/delivery live on the linked Contract.
const sampleOrders = [
  {
    id: 'go-1',
    contractId: 'c-5',
    gigId: 'gig-1',
    packageTier: 'standard',
    companyId: 1,
    companyName: 'Nimbus Labs',
    workerId: 1,
    workerName: 'Amina K.',
    requirementsAnswers: [
      { label: 'Repo access or a staging URL', value: 'staging.nimbus.dev' },
      { label: 'Target browser/device list', value: 'Chrome, Safari mobile' },
    ],
    status: 'completed',
    orderedAt: '2026-07-25T10:00:00Z',
  },
]

function gigReducer(state, action) {
  switch (action.type) {
    case 'CREATE_GIG': {
      const gig = {
        ...action.payload,
        id: `gig-${state.seq + 1}`,
        rating: 0,
        ordersCompleted: 0,
        bestSeller: false,
        createdAt: new Date().toISOString(),
      }
      return { ...state, seq: state.seq + 1, gigs: [gig, ...state.gigs] }
    }
    case 'UPDATE_GIG': {
      return {
        ...state,
        gigs: state.gigs.map((g) => (g.id === action.payload.id ? { ...g, ...action.payload } : g)),
      }
    }
    case 'DELETE_GIG': {
      return { ...state, gigs: state.gigs.filter((g) => g.id !== action.payload) }
    }
    case 'PLACE_ORDER': {
      return {
        ...state,
        seq: state.seq + 1,
        orders: [{ ...action.payload, id: `go-${state.seq + 1}` }, ...state.orders],
      }
    }
    case 'UPDATE_ORDER_STATUS': {
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.contractId === action.payload.contractId
            ? { ...o, status: action.payload.status }
            : o,
        ),
      }
    }
    case 'INCREMENT_ORDERS': {
      return {
        ...state,
        gigs: state.gigs.map((g) =>
          g.id === action.payload
            ? { ...g, ordersCompleted: g.ordersCompleted + 1 }
            : g,
        ),
      }
    }
    default:
      return state
  }
}

export function GigProvider({ children }) {
  const [state, dispatch] = useReducer(gigReducer, {
    gigs: sampleGigs,
    orders: sampleOrders,
    seq: 100,
  })

  const createGig = (data) => {
    dispatch({ type: 'CREATE_GIG', payload: data })
  }

  const updateGig = (data) => {
    dispatch({ type: 'UPDATE_GIG', payload: data })
  }

  const deleteGig = (gigId) => {
    dispatch({ type: 'DELETE_GIG', payload: gigId })
  }

  // Order metadata + counter; Contract creation is orchestrated by the page
  // so escrow/chat/notifications can wire in one place (unified contract model).
  const placeOrder = (data) => {
    dispatch({ type: 'PLACE_ORDER', payload: data })
  }

  const updateOrderStatus = (contractId, status) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { contractId, status } })
  }

  const incrementOrderCount = (gigId) => {
    dispatch({ type: 'INCREMENT_ORDERS', payload: gigId })
  }

  const getGigById = (id) => state.gigs.find((g) => g.id === id)

  const getGigsByWorker = (workerId) =>
    state.gigs.filter((g) => String(g.workerId) === String(workerId))

  // Profile page looks up by slug (mock workers don't share numeric ids with gigs)
  const getGigsBySlug = (slug) => state.gigs.filter((g) => g.workerSlug === slug)

  const getOrderById = (id) => state.orders.find((o) => o.id === id)

  const getOrderByContract = (contractId) =>
    state.orders.find((o) => o.contractId === contractId)

  const getOrdersByRole = (role) =>
    state.orders.filter((o) =>
      role === 'worker'
        ? true
        : role === 'company'
          ? String(o.companyId) === '1'
          : false,
    )

  // Multi-filter catalog used by BrowseGigsPage
  const searchGigs = ({ query, category, subCategory, maxPrice, maxDelivery, minRating, verifiedOnly, sort } = {}) => {
    let list = [...state.gigs]
    const q = (query || '').trim().toLowerCase()
    if (q) {
      list = list.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.workerName.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q)) ||
          g.description.toLowerCase().includes(q),
      )
    }
    if (category && category !== 'all') {
      list = list.filter((g) => g.category === category)
      if (subCategory && subCategory !== 'all') {
        list = list.filter((g) => g.subCategory === subCategory)
      }
    }
    if (maxPrice != null) {
      list = list.filter((g) => Math.min(...g.packages.map((p) => p.price)) <= maxPrice)
    }
    if (maxDelivery != null) {
      list = list.filter(
        (g) => Math.min(...g.packages.map((p) => p.deliveryDays)) <= maxDelivery,
      )
    }
    if (minRating) {
      list = list.filter((g) => g.rating >= minRating)
    }
    if (verifiedOnly) {
      list = list.filter((g) => g.verified)
    }
    const startingPrice = (g) => Math.min(...g.packages.map((p) => p.price))
    if (sort === 'price-low') list.sort((a, b) => startingPrice(a) - startingPrice(b))
    else if (sort === 'price-high') list.sort((a, b) => startingPrice(b) - startingPrice(a))
    else if (sort === 'top-rated') list.sort((a, b) => b.rating - a.rating)
    else if (sort === 'best-selling') list.sort((a, b) => b.ordersCompleted - a.ordersCompleted)
    else list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return list
  }

  const getSimilarGigs = (gig, limit = 4) =>
    state.gigs
      .filter((g) => g.id !== gig.id && g.category === gig.category)
      .slice(0, limit)

  const value = {
    ...state,
    createGig,
    updateGig,
    deleteGig,
    placeOrder,
    updateOrderStatus,
    incrementOrderCount,
    getGigById,
    getGigsByWorker,
    getGigsBySlug,
    getOrderById,
    getOrderByContract,
    getOrdersByRole,
    searchGigs,
    getSimilarGigs,
  }

  return <GigContext.Provider value={value}>{children}</GigContext.Provider>
}

// eslint-disable-next-line react-only-export-components -- intentional: hook belongs with its provider
export function useGigs() {
  const context = useContext(GigContext)
  if (!context) {
    throw new Error('useGigs must be used within a GigProvider')
  }
  return context
}
