import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Shield, CheckCircle, ArrowRight, Lock, Users, Star, Rocket,
  Code, Smartphone, Cloud, ShieldCheck, Brain, Cpu,
  Zap, BadgeCheck, Gavel
} from 'lucide-react'
import AppLayout from '../../components/AppLayout.jsx'

function Hero() {
  const [payoutApproved, setPayoutApproved] = useState(false)

  return (
    <section className="relative overflow-hidden">
      <div className="absolute -top-32 left-1/2 w-[850px] -translate-x-1/2 bg-gradient-to-b from-primary/10 via-primary-light/40 to-transparent blur-3xl pointer-events-none" />
      <div className="mx-auto max-w-[1600px] px-6 pt-8 pb-16">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left: Headline & Actions */}
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-high px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" />
              Zero-Risk Milestone Escrow &bull; 48-Hour Talent Onboarding
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl">
              Where High-Velocity Teams &amp; Vetted Tech Specialists Build Together
            </h1>
            <p className="max-w-xl text-lg text-neutral-500">
              Deploy pre-vetted engineers or turnkey squads in under 48 hours. Every contract
              secured by milestone-based bank-grade escrow with zero friction.
            </p>
            {/* Dual CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                to="/teams"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary/90"
              >
                Hire a Team
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/browse-jobs"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-neutral-700 shadow-sm transition-all hover:bg-neutral-100"
              >
                Find Work as a Specialist
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  Avg $125/hr
                </span>
              </Link>
            </div>
            {/* Trust Sub-badges */}
            <div className="flex flex-wrap items-center gap-5 pt-1 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                100% Segregated Escrow
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Sandboxed Code Audited
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                No Recruiter Retainers
              </span>
            </div>
          </div>

          {/* Right: Interactive Escrow Mockup */}
          <div className="relative lg:col-span-5">
            <div className="absolute -top-3 -right-3 h-28 w-28 rounded-full bg-primary/10 blur-xl pointer-events-none" />
            <div className="relative rounded-xl bg-white p-6 shadow-xl">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Active Contract Sprint
                  </p>
                  <p className="text-lg font-bold text-neutral-900">
                    Fintech Core Banking Migration
                  </p>
                  <p className="text-xs text-neutral-500">
                    Sprint 03 &bull; Block Vault Refactor
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <Shield className="h-3.5 w-3.5" />
                  $32,400 USD
                </span>
              </div>

              {/* Squad Members Row */}
              <div className="mb-4 space-y-2 rounded-lg bg-neutral-100 px-4 py-3">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span className="font-semibold text-neutral-900">
                    Deployed Core Squad (4 Specialists)
                  </span>
                  <span className="font-medium text-emerald-600">All On-Duty</span>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[
                    { role: 'Lead Arch', rate: '$140/hr', jss: '100%' },
                    { role: 'Sr Go Dev', rate: '$120/hr', jss: '99%' },
                    { role: 'QA Auto', rate: '$95/hr', jss: '100%' },
                    { role: 'SecOps', rate: '$155/hr', jss: '100%' },
                  ].map((m) => (
                    <div key={m.role} className="rounded bg-white p-2 text-center shadow-xs">
                      <p className="truncate text-xs font-semibold text-neutral-900">{m.role}</p>
                      <p className="text-xs font-bold text-primary">{m.rate}</p>
                      <p className="text-[11px] text-emerald-600">{m.jss} JSS</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone Progress */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 font-semibold text-neutral-900">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Automated CI &amp; Code Review Milestone
                  </span>
                  <span className="font-bold text-primary">74% Done</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500"
                    style={{ width: '74%' }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>37 / 50 PRs Merged &amp; Passing</span>
                  <span className="text-neutral-700">Sprint Closes in 4d</span>
                </div>
              </div>

              {/* Interactive Escrow Action */}
              <div className="space-y-2">
                <button
                  onClick={() => setPayoutApproved(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
                >
                  <Lock className="h-4 w-4" />
                  {payoutApproved
                    ? 'Milestone 3 Approved & Queued'
                    : '1-Click Milestone Payout Approval ($10,800)'}
                </button>
                {payoutApproved && (
                  <div className="rounded bg-emerald-100 py-1.5 text-center text-xs font-semibold text-emerald-700">
                    Funds unlocked securely via Smart Escrow Vault
                  </div>
                )}
                <div className="flex items-center justify-between px-1 text-xs text-neutral-500">
                  <span>Vault ID: #ESC-9082-US</span>
                  <span className="flex items-center gap-1 font-medium text-neutral-700">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    Secured &amp; Insured
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Metric Ribbon */}
        <div className="mt-12 grid grid-cols-2 gap-4 rounded-xl bg-white p-6 shadow-sm md:grid-cols-4">
          {[
            { value: '24m', label: 'Average Matching Velocity', sub: 'First vetted candidate introduction', color: 'text-primary' },
            { value: '99.4%', label: 'Verified Job Success Rate', sub: 'Milestones completed without disputes', color: 'text-emerald-600' },
            { value: '$185M+', label: 'Total Capital Protected', sub: 'Safely transferred through escrow', color: 'text-neutral-900' },
            { value: '100%', label: 'Milestone Guarantee', sub: 'Zero payout without approved work', color: 'text-orange-600' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className={`text-2xl font-bold tracking-tight ${stat.color}`}>{stat.value}</span>
              <span className="text-sm font-semibold text-neutral-900">{stat.label}</span>
              <span className="text-xs text-neutral-500">{stat.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DualTrack() {
  const companySteps = [
    { title: 'Post Role or Assemble Squad', desc: 'Specify tech stack, sprint scope, and delivery schedule. Choose solo contractors or complete turnkey pods.' },
    { title: 'Review Pre-Sandboxed Talent', desc: 'Inspect verified git commits, architecture sandbox scores, and verified identity records before issuing an offer.' },
    { title: 'Fund Escrow Securely', desc: 'Lock contract capital into segregated milestone vaults. Specialists commence engineering only once backing is secured.' },
    { title: 'Approve Milestones & Release', desc: 'Automated test runs, code review, and PR acceptance prompt instantaneous capital disbursement. You retain total control.' },
  ]
  const specialistSteps = [
    { title: 'Verify Identity & GitHub Stack', desc: 'Complete one-time algorithmic sandbox vetting and technical peer review. Skip resume rewriting.' },
    { title: 'Get Matched to High-Value Contracts', desc: 'Receive direct client invitations or join pre-formed squads at your requested hourly rates. No race-to-the-bottom bidding.' },
    { title: 'Deliver with 100% Fund Assurance', desc: 'You never write a single line of code until client escrow is confirmed and locked in your sprint ledger.' },
    { title: 'Instant Guaranteed Payouts', desc: 'Auto-transferred directly to your local bank account, ACH, or multi-currency account as soon as milestones conclude.' },
  ]

  return (
    <section id="how-it-works" className="bg-neutral-100 py-20">
      <div className="mx-auto max-w-[1600px] px-6 space-y-12">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Precision Delivery Process
          </p>
          <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">
            Institutional Escrow. Built for Both Sides of the Table.
          </h2>
          <p className="text-sm text-neutral-500">
            Whether you&apos;re accelerating roadmap deliverables or contributing deep technical
            leadership, TechWorkly safeguards every second and every dollar.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Track 1: Companies */}
          <div className="flex flex-col justify-between rounded-xl bg-white p-8 shadow-sm">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">
                      For Tech Companies &amp; Founders
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Assemble squads with zero headcount bloat
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
                  Client Path
                </span>
              </div>
              <div className="space-y-5">
                {companySteps.map((s, i) => (
                  <div key={s.title} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{s.title}</p>
                      <p className="text-sm text-neutral-500">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-6">
              <Link
                to="/signup"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
              >
                Assemble a Project Squad
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Track 2: Specialists */}
          <div className="flex flex-col justify-between rounded-xl bg-white p-8 shadow-sm">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Code className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">
                      For Elite Specialists &amp; Tech Leads
                    </h3>
                    <p className="text-xs text-neutral-500">
                      High-rate engagements with guaranteed pay
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Specialist Path
                </span>
              </div>
              <div className="space-y-5">
                {specialistSteps.map((s, i) => (
                  <div key={s.title} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{s.title}</p>
                      <p className="text-sm text-neutral-500">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-6">
              <Link
                to="/browse-workers"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-100 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-200"
              >
                Apply for Vetted Specialist Status
                <BadgeCheck className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SquadHiring() {
  const specialists = [
    { name: 'Marcus Vance', role: 'Principal Cloud Architect', skills: ['Kubernetes', 'AWS', 'Terraform'], rate: '$145/hr', jss: '100%', img: 'https://i.pravatar.cc/150?img=68' },
    { name: 'Sarah Lin', role: 'Senior Full-Stack Engineer', skills: ['TypeScript', 'Next.js', 'Go'], rate: '$115/hr', jss: '99%', img: 'https://i.pravatar.cc/150?img=47' },
    { name: 'Devon Briggs', role: 'QA Automation Lead', skills: ['Playwright', 'CI/CD', 'Python'], rate: '$90/hr', jss: '100%', img: 'https://i.pravatar.cc/150?img=53' },
    { name: 'Tariq Mansoor', role: 'Offensive Security & Audit', skills: ['SOC2', 'Pen-Testing', 'Rust'], rate: '$150/hr', jss: '100%', img: 'https://i.pravatar.cc/150?img=59' },
  ]

  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1600px] px-6 space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Turnkey Units
            </p>
            <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">
              Build a Full Project Team in One Place
            </h2>
            <p className="text-sm text-neutral-500">
              Skip 3 months of recruiting fragmentation. Spin up cohesive squads that have
              completed multi-sprint deliveries together with proven chemistry.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              to="#"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-100"
            >
              Configure Custom Squad
            </Link>
            <Link
              to="/dashboard/company/teams/new"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
            >
              Start a Team
              <Users className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Featured Squad Card */}
        <div className="space-y-4 rounded-xl bg-white p-6 shadow-md">
          <div className="flex flex-col gap-4 rounded-lg bg-neutral-100 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
                Ω
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-neutral-900">
                    Squad Alpha: Cloud Infrastructure &amp; Security Unit
                  </h3>
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-xs text-neutral-500">
                  Pre-vetted collective &bull; Immediate 48h Sprint Readiness
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                <Zap className="h-3 w-3" />
                12 Sprints Shipped Together &bull; Zero Onboarding Delay
              </span>
              <span className="text-lg font-bold text-neutral-900">
                $500/hr{' '}
                <span className="text-xs font-normal text-neutral-500">blended</span>
              </span>
            </div>
          </div>

          {/* 4 Specialist Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {specialists.map((s) => (
              <div
                key={s.name}
                className="space-y-3 rounded-lg bg-neutral-100 p-4 shadow-xs transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={s.img}
                    alt={s.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="flex items-center gap-1 text-sm font-semibold text-neutral-900">
                      {s.name}
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                    </p>
                    <p className="text-xs text-neutral-500">{s.role}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {s.skills.map((sk) => (
                    <span
                      key={sk}
                      className="rounded bg-neutral-200 px-2 py-0.5 text-[11px] font-medium text-neutral-700"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-sm font-bold text-primary">{s.rate}</span>
                  <span className="flex items-center gap-0.5 font-semibold text-emerald-600">
                    <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                    {s.jss} JSS
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Categories() {
  const cats = [
    { icon: Code, name: 'Web Development', openings: '480+', tech: 'React, Next.js, TypeScript, Node.js, GraphQL', rate: '$75 – $130 / hr' },
    { icon: Smartphone, name: 'Mobile Engineering', openings: '210+', tech: 'iOS/Swift, Android Kotlin, React Native, Flutter', rate: '$80 – $145 / hr' },
    { icon: Cloud, name: 'Cloud & DevOps', openings: '190+', tech: 'AWS, GCP, Kubernetes, Terraform, ArgoCD, Helm', rate: '$100 – $165 / hr' },
    { icon: ShieldCheck, name: 'Security & DevSecOps', openings: '85+', tech: 'Zero-Trust, Pen-testing, SOC2 Audits, Cryptography', rate: '$130 – $210 / hr' },
    { icon: Brain, name: 'AI & Machine Learning', openings: '160+', tech: 'LLM orchestration, LangChain, PyTorch, Vector DBs', rate: '$120 – $190 / hr' },
    { icon: Cpu, name: 'Desktop & Systems', openings: '95+', tech: 'Rust, C++, WebAssembly, Kernel Drivers, Go CLI', rate: '$110 – $175 / hr' },
  ]

  return (
    <section className="bg-neutral-100 py-20">
      <div className="mx-auto max-w-[1600px] px-6 space-y-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Technical Catalog
            </p>
            <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">
              Explore Core Engineering Disciplines
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Transparent market rates across verified architectural proficiencies.
            </p>
          </div>
          <Link
            to="/browse-workers"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80"
          >
            Explore all 1,400+ tech roles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => (
            <Link
              key={c.name}
              to="/browse-workers"
              className="group flex flex-col justify-between rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-700">
                    {c.openings} Openings
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 group-hover:text-primary transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-sm text-neutral-500">{c.tech}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4 text-xs text-neutral-500">
                <span>Market Bracket:</span>
                <span className="font-semibold text-neutral-900">{c.rate}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function Trust() {
  const pillars = [
    { icon: Lock, color: 'bg-emerald-50 text-emerald-600', title: '100% Escrow-Protected', desc: 'Funds are held in segregated client trust accounts before execution begins and released strictly upon explicit sprint sign-off.' },
    { icon: BadgeCheck, color: 'bg-primary/10 text-primary', title: 'Top 3% Vetted Talent', desc: 'Multi-tiered algorithmic assessments, real sandbox code compilation, and verified references ensure instant high performance.' },
    { icon: ShieldCheck, color: 'bg-amber-50 text-amber-600', title: 'Verified Identity & KYB', desc: 'Rigorous KYC/KYB screening for enterprise entities and contractors ensures zero legal liabilities or anonymous contractors.' },
    { icon: Gavel, color: 'bg-primary/5 text-primary', title: 'Zero-Dispute Guarantee', desc: 'Independent staff architects review git commit hashes and sprint criteria within 24h if specifications are contested.' },
  ]

  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1400px] px-6 space-y-12">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Bank-Grade Infrastructure
          </p>
          <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">
            Engineered for Complete Capital and Career Security
          </h2>
          <p className="text-sm text-neutral-500">
            Platform mechanics designed from the ledger up to eliminate payment disputes, scope
            fraud, and speculative recruitment.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.title} className="space-y-3 rounded-xl bg-white p-6 shadow-sm">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${p.color}`}>
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">{p.title}</h3>
              <p className="text-sm text-neutral-500">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-neutral-100 p-8 md:flex-row md:p-12">
          <img
            src="https://i.pravatar.cc/150?img=11"
            alt="Liam Thomsen"
            className="h-20 w-20 shrink-0 rounded-full object-cover shadow-sm md:h-24 md:w-24"
          />
          <div className="space-y-3">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-lg font-medium italic text-neutral-900 md:text-xl">
              &ldquo;TechWorkly reduced our sprint lead time from 6 weeks to 3 days. The escrow
              milestone structure gives our finance department complete peace of mind while securing
              absolute senior firepower.&rdquo;
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
              <span className="font-bold text-neutral-900">Liam Thomsen</span>
              <span>&bull;</span>
              <span>Chief Technology Officer, PayCore Global (Series B FinTech)</span>
              <span>&bull;</span>
              <span className="font-semibold text-emerald-600">$380k+ Milestones Disbursed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Featured() {
  const workers = [
    {
      name: 'Elena Rostova',
      role: 'Cloud Native Architect',
      skills: ['AWS', 'Kubernetes', 'Kafka'],
      rating: 5.0,
      reviews: 48,
      rate: '$135',
      badge: 'Verified Top 1%',
      img: 'https://i.pravatar.cc/150?img=32',
    },
    {
      name: 'Kenji Sato',
      role: 'Rust & Distributed Systems',
      skills: ['Rust', 'Raft', 'gRPC'],
      rating: 4.98,
      reviews: 39,
      rate: '$150',
      badge: 'Verified Top 1%',
      img: 'https://i.pravatar.cc/150?img=51',
    },
    {
      name: 'Mateo Alvarez',
      role: 'Senior Frontend & Design Systems',
      skills: ['React', 'Tailwind', 'WebGL'],
      rating: 5.0,
      reviews: 62,
      rate: '$95',
      badge: 'Available Immediately',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      img: 'https://i.pravatar.cc/150?img=57',
    },
  ]

  return (
    <section className="bg-neutral-100 py-20">
      <div className="mx-auto max-w-[1600px] px-6 space-y-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Pre-Screened Roster
            </p>
            <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">
              Available Senior Talent
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Every engineer has cleared sandboxed live testing and background checks.
            </p>
          </div>
          <Link
            to="/browse-workers"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80"
          >
            View all 8,500+ specialists
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {workers.map((w) => (
            <div
              key={w.name}
              className="flex flex-col justify-between space-y-4 rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <img
                      src={w.img}
                      alt={w.name}
                      className="h-16 w-16 rounded-full object-cover shadow-xs"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${w.badgeColor || 'bg-primary-light text-primary'}`}>
                    {w.badge}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="text-lg font-bold text-neutral-900">{w.name}</h3>
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  </div>
                  <p className="text-sm text-neutral-500">{w.role}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {w.skills.map((sk) => (
                    <span
                      key={sk}
                      className="rounded bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center gap-1 font-semibold text-neutral-900">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {w.rating}
                    <span className="font-normal">({w.reviews} reviews)</span>
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {w.rate}
                    <span className="text-xs font-normal text-neutral-500">/hr</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Link
                  to={`/workers/${w.name.toLowerCase().replace(/ /g, '-')}`}
                  className="flex-1 rounded-lg bg-neutral-100 py-2 text-center text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-200"
                >
                  View Profile
                </Link>
                <Link
                  to="/signup"
                  className="flex-1 rounded-lg bg-primary py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                >
                  Direct Hire
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PreFooterCTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1600px] px-6">
        <div className="relative overflow-hidden rounded-2xl bg-[#131B2E] p-12 text-center shadow-xl md:p-16">
          <div className="absolute -bottom-24 left-1/2 h-[200px] w-[600px] -translate-x-1/2 bg-primary/20 blur-3xl pointer-events-none" />
          <span className="rounded-full bg-[#1C2841] px-3 py-1 text-xs font-semibold text-blue-300">
            Zero Retainers &bull; Cancel Anytime
          </span>
          <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-bold tracking-tight text-white md:text-3xl">
            Ready to scale your technical capability with zero recruitment risk?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-neutral-400">
            Join over 1,200 tech companies and high-growth scale-ups protecting their runway and
            sprint cadence with TechWorkly.
          </p>
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-6">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary/90"
            >
              Deploy a Squad Now
              <Rocket className="h-4 w-4" />
            </Link>
            <Link
              to="/browse-jobs"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1C2841] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#243352]"
            >
              Join as a Verified Engineer
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white shadow-[0_-1px_8px_rgba(0,0,0,0.03)]">
      <div className="mx-auto max-w-[1800px] px-6 pt-16 pb-8">
        <div className="grid gap-12 pb-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand + Newsletter */}
          <div className="space-y-4 lg:col-span-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-neutral-900">
                Tech<span className="text-primary">Workly</span>
              </span>
            </div>
            <p className="max-w-sm text-sm text-neutral-500">
              The institutional-grade freelance workspace. Programmatic milestones, bank-level escrow
              security, and verified elite talent.
            </p>
            <div>
              <p className="mb-2 text-sm font-semibold text-neutral-900">
                Subscribe to Platform Bulletins
              </p>
              <form className="flex max-w-sm gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your professional email"
                  className="h-10 flex-1 rounded-lg bg-neutral-100 px-4 text-sm text-neutral-700 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="h-10 shrink-0 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Link Columns */}
          <div className="lg:col-span-2">
            <h4 className="mb-3 text-sm font-semibold text-neutral-900">Solutions</h4>
            <ul className="space-y-2">
              {[
                { label: 'Hire Talent', to: '/browse-workers' },
                { label: 'Assemble Teams', to: '/teams' },
                { label: 'Order Gigs', to: '/browse-gigs' },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-neutral-500 hover:text-neutral-900">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h4 className="mb-3 text-sm font-semibold text-neutral-900">Discover</h4>
            <ul className="space-y-2">
              {[
                { label: 'Browse Open Roles', to: '/browse-jobs' },
                { label: 'Browse Gigs', to: '/browse-gigs' },
                { label: 'Worker Specialties', to: '/browse-workers' },
                { label: 'Squad Configurations', to: '/teams' },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-neutral-500 hover:text-neutral-900">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h4 className="mb-3 text-sm font-semibold text-neutral-900">Support & Trust</h4>
            <ul className="space-y-2">
              {[
                { label: 'Help Center', to: '/help' },
                { label: 'Dispute Resolution', to: '/help/article/raise-dispute' },
                { label: 'Trust & Safety', to: '/help/safety' },
                { label: 'API Docs', to: '/' },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-neutral-500 hover:text-neutral-900">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h4 className="mb-3 text-sm font-semibold text-neutral-900">Legal</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Compliance'].map((l) => (
                <li key={l}>
                  <Link to="#" className="text-sm text-neutral-500 hover:text-neutral-900">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Trust Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 border-t border-neutral-200 pt-6 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <Lock className="h-3.5 w-3.5" />
            256-BIT SSL Encrypted
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Bank-Grade Revenue Certified
          </span>
          <span className="flex items-center gap-1">
            <BadgeCheck className="h-3.5 w-3.5" />
            SOC2 Type II Certified
          </span>
        </div>
        <p className="mt-4 text-center text-xs text-neutral-400">
          &copy; 2026 TechWorkly Financial Technologies, Inc.
        </p>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  // React Router does not auto-scroll to hash targets on SPA navigation;
  // this effect handles landing here from other pages (e.g. /#how-it-works)
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [hash])

  return (
    <AppLayout>
      <Hero />
      <DualTrack />
      <SquadHiring />
      <Categories />
      <Trust />
      <Featured />
      <PreFooterCTA />
      <Footer />
    </AppLayout>
  )
}
