const stats = [
  { label: 'Member Since', value: 'Mar 2021', detail: '4+ Years Continuous', icon: 'calendar', highlight: false },
  { label: 'Total Jobs Posted', value: '142', detail: '94% Fill rate', icon: 'briefcase', highlight: false },
  { label: 'Total Hires Made', value: '380+', detail: '84 Solo · 42 Squads', icon: 'users', highlight: false },
  { label: 'Total Capital Spent', value: '$4.2M+', detail: '100% via Escrow', icon: 'dollar', highlight: true },
  { label: 'Avg. Response Time', value: '< 2 hrs', detail: 'Top 1% Fastest', icon: 'clock', highlight: false },
  { label: 'Platform Rating', value: '4.96', detail: '248 reviews', suffix: '/ 5.0', icon: 'star', highlight: false },
]

export default function StatsBar() {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col justify-between rounded-2xl border border-neutral-300 bg-white p-4 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{stat.label}</span>
          {/* Highlight draws attention to the financial "trust signal" stat */}
          <span className={`mt-1 text-xl font-bold ${stat.highlight ? 'text-primary' : 'text-neutral-900'}`}>
            {stat.value}
          </span>
          {stat.suffix && (
            <span className="text-xs text-neutral-500">{stat.suffix}</span>
          )}
          {/* Dollar icon gets green to reinforce escrow/money safety association */}
          <span className={`mt-1 flex items-center gap-1 text-xs ${
            stat.icon === 'dollar' ? 'text-success' : 'text-neutral-500'
          }`}>
            {stat.icon === 'dollar' && (
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            )}
            {stat.detail}
          </span>
        </div>
      ))}
    </div>
  )
}
