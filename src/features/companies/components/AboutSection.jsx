export default function AboutSection({ company }) {
  const domains = [
    { label: 'Distributed Web Architecture', color: 'bg-primary' },
    { label: 'Mobile (iOS & Android)', color: 'bg-success' },
    { label: 'Desktop Core Engines (Rust & C++)', color: 'bg-neutral-700' },
    { label: 'Browser Extensions & Zero-Trust Sec', color: 'bg-danger' },
  ]

  const socialLinks = [
    { icon: 'terminal', label: 'GitHub', href: '#' },
    { icon: 'linkedin', label: 'LinkedIn', href: '#' },
    { icon: 'discord', label: 'Discord', href: '#' },
    { icon: 'globe', label: 'Website', href: '#' },
  ]

  return (
    <section className="rounded-2xl border border-neutral-300 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900">About {company.name}</h2>
        <div className="flex items-center gap-2">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-900"
              title={link.label}
            >
              {link.icon === 'terminal' && (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                </svg>
              )}
              {link.icon === 'linkedin' && (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              )}
              {link.icon === 'discord' && (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              )}
              {link.icon === 'globe' && (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              )}
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-4 text-sm leading-relaxed text-neutral-600">
        <p>
          {company.name} designs and implements {company.tagline.toLowerCase()} We operate on
          rigorous, async-first sprints where autonomous engineering teams own architecture end-to-end.
        </p>
        <p>
          We eschew bureaucratic overhead in favor of verified technical execution. Our teams interface
          directly with core systems engineers, supported by pre-funded milestone escrow contracts
          that guarantee full payouts upon delivery confirmation.
        </p>
      </div>

      <div className="mt-6 rounded-xl bg-neutral-50 p-4">
        <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Core Engineering Pillars & Work Domains
        </span>
        <div className="flex flex-wrap gap-2">
          {domains.map((domain) => (
            <span
              key={domain.label}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-800 shadow-sm"
            >
              <span className={`h-2 w-2 rounded-full ${domain.color}`} />
              {domain.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
