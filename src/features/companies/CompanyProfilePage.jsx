// Full company profile page composing hero, stats, openings, reviews, and sidebar.
import { useParams, Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout.jsx'
import StatsBar from './components/StatsBar.jsx'
import AboutSection from './components/AboutSection.jsx'
import OpeningsSection from './components/OpeningsSection.jsx'
import ReviewsSection from './components/ReviewsSection.jsx'
import PortfolioSection from './components/PortfolioSection.jsx'
import CompanySidebar from './components/CompanySidebar.jsx'
import { useReviews } from '../../context/ReviewContext.jsx'

const companies = {
  'nimbus-labs': {
    name: 'Nimbus Labs',
    logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=nimbus-labs&backgroundColor=6366f1,8b5cf6',
    tagline: 'Cloud-native SaaS for growing teams.',
    category: 'Web',
    industry: 'SaaS',
    rating: 4.9,
    hires: 38,
    openings: 4,
    verified: true,
    location: 'San Francisco, CA & Remote',
    founded: '2019',
    employees: '120 - 250 employees',
    tags: ['Autonomous AI Systems', 'Distributed Cloud', 'FinTech Infrastructure'],
    followers: '2.4k',
  },
  'bluepeak': {
    name: 'Bluepeak',
    logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=bluepeak&backgroundColor=0ea5e9,0284c7',
    tagline: 'Mobile-first fintech built on escrow rails.',
    category: 'Mobile',
    industry: 'Fintech',
    rating: 4.8,
    hires: 27,
    openings: 3,
    verified: true,
    location: 'New York, NY & Remote',
    founded: '2020',
    employees: '80 - 150 employees',
    tags: ['Mobile Payments', 'Escrow Systems', 'Banking Infrastructure'],
    followers: '1.8k',
  },
  'vector-systems': {
    name: 'Vector Systems',
    logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=vector-systems&backgroundColor=10b981,059669',
    tagline: 'Reliable desktop tooling for engineering teams.',
    category: 'Desktop',
    industry: 'Developer Tools',
    rating: 4.7,
    hires: 19,
    openings: 2,
    verified: true,
    location: 'Austin, TX & Remote',
    founded: '2018',
    employees: '50 - 100 employees',
    tags: ['Desktop Applications', 'Developer Tools', 'Systems Engineering'],
    followers: '1.2k',
  },
  'horizon-web': {
    name: 'Horizon Web',
    logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=horizon-web&backgroundColor=f59e0b,d97706',
    tagline: 'High-converting e-commerce experiences.',
    category: 'Web',
    industry: 'E-commerce',
    rating: 4.6,
    hires: 24,
    openings: 5,
    verified: false,
    location: 'Chicago, IL & Remote',
    founded: '2020',
    employees: '40 - 80 employees',
    tags: ['E-commerce', 'Conversion Optimization', 'Headless CMS'],
    followers: '980',
  },
  'pocketcast-apps': {
    name: 'Pocketcast Apps',
    logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=pocketcast-apps&backgroundColor=ec4899,db2777',
    tagline: 'Everyday utility apps for Android & iOS.',
    category: 'Mobile',
    industry: 'Consumer Apps',
    rating: 4.5,
    hires: 15,
    openings: 2,
    verified: true,
    location: 'Berlin, Germany & Remote',
    founded: '2021',
    employees: '30 - 60 employees',
    tags: ['Consumer Apps', 'Mobile Utilities', 'Cross-Platform'],
    followers: '720',
  },
  'fiberline': {
    name: 'Fiberline',
    logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=fiberline&backgroundColor=14b8a6,0d9488',
    tagline: 'Browser extensions for privacy-first productivity.',
    category: 'Browser',
    industry: 'Privacy',
    rating: 4.9,
    hires: 12,
    openings: 1,
    verified: true,
    location: 'London, UK & Remote',
    founded: '2021',
    employees: '20 - 40 employees',
    tags: ['Browser Extensions', 'Privacy', 'Security'],
    followers: '540',
  },
  'quantum-soft': {
    name: 'Quantum Soft',
    logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=quantum-soft&backgroundColor=8b5cf6,7c3aed',
    tagline: 'Enterprise desktop dashboards and data tools.',
    category: 'Desktop',
    industry: 'Enterprise',
    rating: 4.4,
    hires: 21,
    openings: 3,
    verified: false,
    location: 'Toronto, Canada & Remote',
    founded: '2018',
    employees: '60 - 120 employees',
    tags: ['Enterprise Software', 'Data Visualization', 'Desktop Apps'],
    followers: '1.1k',
  },
  'webforge-studio': {
    name: 'WebForge Studio',
    logo: 'https://api.dicebear.com/9.x/shapes/svg?seed=webforge-studio&backgroundColor=ef4444,dc2626',
    tagline: 'Design-driven marketing sites and web apps.',
    category: 'Web',
    industry: 'Agency',
    rating: 4.8,
    hires: 33,
    openings: 6,
    verified: true,
    location: 'Amsterdam, Netherlands & Remote',
    founded: '2017',
    employees: '80 - 160 employees',
    tags: ['Web Design', 'Marketing Sites', 'React Apps'],
    followers: '2.1k',
  },
}

export default function CompanyProfilePage() {
  const { slug } = useParams()
  // O(1) slug lookup in object keyed by slug — returns undefined for unknown slugs
  const company = companies[slug]
  // Live public reviews submitted this session against this company name
  const { getProfileSummary } = useReviews()
  const live = company
    ? getProfileSummary('company', company.name)
    : { list: [], count: 0, overall: 0 }

  // Guard clause: unknown slug renders a 404-style fallback instead of crashing
  if (!company) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-screen-2xl px-6 py-20 text-center">
          <p className="text-lg font-semibold text-neutral-900">Company not found</p>
          <Link to="/browse-companies" className="mt-4 inline-block text-sm text-primary hover:underline">
            Browse all companies
          </Link>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      {/* Hero Banner */}
      <div className="relative w-full overflow-hidden bg-neutral-900 pb-16">
        {/* Gradient banner */}
        <div className="relative h-64 md:h-72 bg-gradient-to-r from-neutral-900 via-primary to-neutral-900 overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -right-16 -top-24 w-96 h-96 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-80 h-40 bg-success/20 blur-2xl pointer-events-none" />
          {/* Escrow badge */}
          <div className="absolute top-4 right-6 hidden md:flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-white">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase">Escrow Vault: Verified High Capacity</span>
          </div>
        </div>

        {/* Company Identity Block */}
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8 -mt-20 relative z-10">
          <div className="rounded-2xl border border-neutral-300 bg-white p-4 shadow-md md:p-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              {/* Identity & Badges */}
              <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
                {/* Logo */}
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-neutral-100 p-2 shadow-sm flex items-center justify-center relative flex-shrink-0 overflow-hidden">
                  <div className="flex h-full w-full items-center justify-center rounded-lg bg-primary text-3xl font-bold text-white">
                    {company.name[0]}
                  </div>
                  {company.logo && (
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="absolute inset-0 h-full w-full rounded-xl object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}
                  {company.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success text-white flex items-center justify-center shadow-sm">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Title & Metadata */}
                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-neutral-900 md:text-3xl">{company.name}</h1>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-semibold">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Payment Verified ✓
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-xs font-semibold">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                      ID & Entity Verified ✓
                    </span>
                  </div>
                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    {company.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-500">
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {company.location}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      Founded {company.founded}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                      {company.employees}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors shadow-sm">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                    <span>Follow</span>
                    <span className="ml-1 text-neutral-500 text-xs">{company.followers}</span>
                  </button>
                  <button className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors shadow-sm">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                    <span>Contact Company</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8 py-8">
        {/* Stats Bar */}
        <StatsBar />

        {/* Escrow Trust Banner */}
        <div className="mb-6 rounded-2xl border border-neutral-300 bg-success/5 p-4 md:p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success text-white flex-shrink-0 shadow-sm">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-base font-bold text-neutral-900">Funds Fully Guaranteed & Pre-Escrowed</h2>
                  <span className="rounded-full bg-success px-2 py-0.5 text-xs font-semibold text-white">Safe Engagement</span>
                </div>
                <p className="text-sm text-neutral-600 max-w-2xl">
                  Verified Funding Method active. {company.name} maintains auto-funded milestone vaults with institutional liquidity backing across all individual and team postings.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-sm">
                <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <span className="text-sm font-semibold text-neutral-900">100% Escrow Protection</span>
              </div>
              <button className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                Escrow Terms
              </button>
            </div>
          </div>
        </div>

        {/* 8-col + 4-col layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Main Content (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <AboutSection company={company} />
            <OpeningsSection />
            <ReviewsSection liveReviews={live.list} />
            <PortfolioSection />
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4">
            <CompanySidebar />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
