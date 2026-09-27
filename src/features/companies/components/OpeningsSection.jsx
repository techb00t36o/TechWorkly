// Tabbed view of company openings split between team pods and solo roles.
import { useState } from 'react'
import { Link } from 'react-router-dom'

const teamPods = [
  {
    id: 'pod-1',
    ref: 'POD-ARC-09',
    title: 'Cross-Platform Real-Time Analytics Engine',
    rate: '$350 - $450 / hr',
    rateDetail: 'Aggregate Pod Escrow · 6 Months',
    seats: [
      { role: '2x Senior Backend Go Engineers', desc: 'High-throughput gRPC, Raft consensus', rate: '$90 - $120/hr', status: '1/2 Filled', escrow: true },
      { role: '1x QA Automation Lead', desc: 'Chaos testing, Playwright, distributed load suites', rate: '$75 - $95/hr', status: 'Filled', escrow: true },
      { role: '1x AppSec / Penetration Tester', desc: 'Kernel memory boundaries, fuzzing, OAuth security', rate: '$110 - $140/hr', status: 'Open', escrow: true, immediate: true },
    ],
    progress: 50,
    filledText: '2 of 4 Seats Confirmed (50%)',
  },
  {
    id: 'pod-2',
    ref: 'POD-ML-03',
    title: 'Autonomous Agent Orchestration Mesh',
    rate: '$480 - $600 / hr',
    rateDetail: 'Aggregate Pod Escrow · 4 Specialists',
    description: 'Seeking a cohesive team or individual specialists in LangGraph, Rust microVMs, and vector indexing engines. 3 of 4 seats remain open.',
    escrowAmount: '$120,000 Milestone 1 Pre-Funded',
  },
]

const soloRoles = [
  {
    id: 'solo-1',
    title: 'Staff Distributed Systems Architect (Raft/Go)',
    skills: ['Go 1.23', 'Kubernetes Operators', 'High Concurrency'],
    rate: '$125 - $160 / hr',
    escrow: true,
    location: 'Remote (Americas/EU)',
  },
  {
    id: 'solo-2',
    title: 'Senior Cryptographic Protocol Engineer',
    skills: ['Zero-Knowledge (STARKs)', 'Rust', 'WASM'],
    rate: '$140 - $180 / hr',
    escrow: true,
    location: 'Global Remote',
  },
  {
    id: 'solo-3',
    title: 'Principal Full-Stack Systems Lead (TypeScript & C++)',
    skills: ['React 19', 'WebGL / WebGPU', 'Native Addons'],
    rate: '$110 - $135 / hr',
    escrow: true,
    location: 'US Timezones',
  },
]

function SeatRow({ seat }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {/* Status icon: green checkmark if filled/partial, neutral circle if still open */}
        <div className={`flex h-7 w-7 items-center justify-center rounded text-sm ${
          seat.status !== 'Open' ? 'bg-success/10 text-success' : 'bg-neutral-200 text-neutral-500'
        }`}>
          {seat.status !== 'Open' ? '✓' : '○'}
        </div>
        <div>
          <span className="block text-sm font-semibold text-neutral-900">{seat.role}</span>
          <span className="text-xs text-neutral-500">{seat.desc}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:justify-end">
        {seat.escrow && (
          <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Escrow Funded ✓
          </span>
        )}
        <span className="text-xs font-medium text-neutral-700">{seat.rate}</span>
        {/* Immediate > Filled > generic status — urgency badge takes visual priority */}
        {seat.immediate ? (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Immediate Seat</span>
        ) : seat.status === 'Filled' ? (
          <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">Filled</span>
        ) : (
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">{seat.status}</span>
        )}
      </div>
    </div>
  )
}

export default function OpeningsSection({ companyName: _companyName }) {
  const [tab, setTab] = useState('team')

  return (
    <section className="rounded-2xl border border-neutral-300 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Active Openings</h2>
          <p className="mt-1 text-sm text-neutral-500">Apply individually or deploy together as a verified pre-formed pod.</p>
        </div>
        <div className="flex items-center self-start rounded-lg bg-neutral-100 p-1 sm:self-auto">
          <button
            onClick={() => setTab('team')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
              tab === 'team' ? 'bg-white text-primary shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            Team Pods ({teamPods.length})
          </button>
          <button
            onClick={() => setTab('solo')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
              tab === 'solo' ? 'bg-white text-primary shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Solo Roles ({soloRoles.length})
          </button>
        </div>
      </div>

      {/* Team Pods Tab */}
      {tab === 'team' && (
        <div className="space-y-4">
          {teamPods.map((pod) => (
            <div key={pod.id} className="rounded-xl bg-neutral-50 p-4 shadow-sm md:p-6">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">Autonomous Pod</span>
                    <span className="text-xs text-neutral-500">Ref: {pod.ref}</span>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900">{pod.title}</h3>
                </div>
                <div className="text-left md:text-right">
                  <span className="block text-lg font-bold text-neutral-900">{pod.rate}</span>
                  <span className="text-xs text-neutral-500">{pod.rateDetail}</span>
                </div>
              </div>

              {/* Progress bar only shown for pods that have a seats array with fill data */}
              {pod.progress !== undefined && (
                <div className="mb-4 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
                  <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1 text-neutral-900">
                      <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                      Pod Assembly Progress
                    </span>
                    <span className="text-primary">{pod.filledText}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                    <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pod.progress}%` }} />
                  </div>
                </div>
              )}

              {pod.seats && (
                <div className="mb-4 space-y-2">
                  {pod.seats.map((seat) => (
                    <SeatRow key={seat.role} seat={seat} />
                  ))}
                </div>
              )}

              {pod.description && (
                <p className="mb-4 text-sm text-neutral-600">{pod.description}</p>
              )}

              {pod.escrowAmount && (
                <p className="mb-4 text-xs font-medium text-success">
                  <svg className="mr-1 inline h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  {pod.escrowAmount}
                </p>
              )}

              {/* Pods with seats array offer squad + specialist apply; pods without it link to job board */}
              <div className="flex items-center justify-end gap-2 pt-2">
                {pod.seats && (
                  <>
                    <button className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
                      Apply with Pre-Formed Squad
                    </button>
                    <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
                      Apply as Specialist
                    </button>
                  </>
                )}
                {!pod.seats && (
                  <Link to="/browse-jobs" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
                    View Pod Details
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Solo Roles Tab */}
      {tab === 'solo' && (
        <div className="space-y-3">
          {soloRoles.map((role) => (
            <div key={role.id} className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  {role.escrow && (
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">Escrow Funded ✓</span>
                  )}
                  <span className="text-xs text-neutral-500">{role.location}</span>
                </div>
                <h3 className="text-base font-bold text-neutral-900">{role.title}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {role.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-neutral-600 border border-neutral-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 md:flex-shrink-0">
                <span className="text-base font-bold text-neutral-900">{role.rate}</span>
                <button className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark">
                  Apply Solo
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
