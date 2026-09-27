// Right sidebar with trust info, directors, location, and similar clients.
const directors = [
  { name: 'Alexandre Kim', title: 'VP of Engineering & Scrum Admin', avatar: 'AK' },
  { name: 'Siddharth Rao', title: 'Lead Systems Architect', avatar: 'SR' },
]

const similarClients = [
  { name: 'Aether Dynamics', specialty: 'Autonomous Robotics & ROS2 Edge Intelligence', rating: 4.9, verified: true, spent: '$2.1M', openings: 4 },
  { name: 'Solara Labs', specialty: 'High-frequency algorithmic liquidity protocols', rating: 4.8, verified: true, spent: '$1.8M', openings: 2 },
  { name: 'Kryptex Protocol', specialty: 'Decentralized identity vaults & zero-knowledge security', rating: 4.7, verified: false, spent: '$950K', openings: 3 },
]

export default function CompanySidebar() {
  return (
    <div className="space-y-6">
      {/* Institutional Trust */}
      <div className="rounded-2xl border border-neutral-300 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-bold text-neutral-900">Institutional Trust</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">KYC AML Level 3 Verified</p>
              <p className="text-xs text-neutral-500">JPMorgan Chase Escrow Sub-account with live banking proofing.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10 text-success">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">Delaware C-Corp & Tax ID</p>
              <p className="text-xs text-neutral-500">$2M+ Vanilla Insurance backed operational guarantees.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">0 Disputes in 24 Months</p>
              <p className="text-xs text-neutral-500">100% mutual consensus milestone release across 380+ contracts.</p>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-neutral-50 px-3 py-2 text-center">
          <span className="text-xs font-medium text-neutral-500">Vanguard Trust Seal ID: VD-88901-US</span>
        </div>
      </div>

      {/* Talent & Pod Directors */}
      <div className="rounded-2xl border border-neutral-300 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-bold text-neutral-900">Talent & Pod Directors</h3>
        <div className="space-y-3">
          {directors.map((d) => (
            <div key={d.name} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                {d.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">{d.name}</p>
                <p className="text-xs text-neutral-500">{d.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Principal Node Location */}
      <div className="rounded-2xl border border-neutral-300 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-bold text-neutral-900">Principal Node Location</h3>
        <div className="flex h-32 w-full items-center justify-center rounded-xl bg-neutral-100">
          <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        </div>
        <p className="mt-3 text-sm text-neutral-600">500 Howard Street, Suite 400, Financial District, San Francisco, CA 94105</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Operating in UTC-8 & Asia</span>
          <span className="text-xs text-neutral-500">24/7 Deployment Coverage</span>
        </div>
      </div>

      {/* Similar Clients */}
      <div className="rounded-2xl border border-neutral-300 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900">Similar Syndicate Clients</h3>
          <a href="#" className="text-xs font-medium text-primary hover:underline">Explore All</a>
        </div>
        <div className="space-y-3">
          {similarClients.map((client) => (
            <div key={client.name} className="flex items-center justify-between rounded-xl border border-neutral-200 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {client.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-neutral-900">{client.name}</p>
                    {client.verified && (
                      <span className="rounded-full bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success">Verified</span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500">{client.specialty}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-xs font-bold text-primary">{client.spent}</span>
                <span className="text-[10px] text-neutral-500">{client.openings} Open Roles</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
