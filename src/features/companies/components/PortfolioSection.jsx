// Grid of company portfolio projects with images and external links.
const projects = [
  {
    id: 1,
    category: 'Open Architecture Mesh',
    title: 'Decentralized Data Mesh API',
    description: 'Sub-millisecond ledger indexing layer processing over 180,000 queries per second with multi-region partition resilience.',
    tech: ['Rust', 'Kafka', 'React', 'AWS ECS'],
    pod: 'Alpha-7 (4 Engineers)',
    type: 'Pod',
  },
  {
    id: 2,
    category: 'Native Telemetry',
    title: 'Enterprise Mobile Telemetry Suite',
    description: 'Battery-efficient telemetry daemon capturing offline device crash forensics and memory leaks across iOS and Android fleets.',
    tech: ['Swift', 'Kotlin NDK', 'GraphQL', 'SQLite'],
    pod: 'Solo Specialist: K. Bradley',
    type: 'Solo',
  },
]

export default function PortfolioSection() {
  return (
    <section className="rounded-2xl border border-neutral-300 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Verified System Deliveries</h2>
          <p className="mt-1 text-sm text-neutral-500">Publicly showcased engineering deliverables built with platform contractors.</p>
        </div>
        <a href="#" className="text-sm font-medium text-primary hover:underline">
          View Repository Docs →
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <div key={project.id} className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-sm">
            {/* Placeholder image area */}
            <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-300">
              <svg className="h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
              </svg>
            </div>

            <div className="p-4">
              <span className="rounded-full bg-neutral-200 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
                {project.category}
              </span>
              <h3 className="mt-2 text-base font-bold text-neutral-900">{project.title}</h3>
              <p className="mt-1 text-sm text-neutral-600">{project.description}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span key={t} className="rounded-full bg-white border border-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-600">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-3">
                <span className="text-xs text-neutral-500">
                  Built by {project.type}: {project.pod}
                </span>
                <a href="#" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  {project.type === 'Pod' ? 'Case Study' : 'Technical Spec'}
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
