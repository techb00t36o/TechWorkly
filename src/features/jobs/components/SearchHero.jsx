import { ShieldCheck, Search, Clock, Filter } from 'lucide-react'
import { quickFilters } from '../browseV2MockData.js'

export default function SearchHero({ filters, onFilterChange }) {
  return (
    <div className="border border-neutral-300 bg-white p-6 shadow-sm rounded-xl">
      {/* Headline Area */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Institutional Trust &amp; Escrow Protocol
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-neutral-900">
            Browse High-Impact Engineering Jobs &amp; Squad Contracts
          </h1>
          <p className="mt-2 text-neutral-600">
            Vetted contracts backed by milestone escrow. Apply with your squad or solo.
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-neutral-700">
          <div>
            <p className="text-xs text-neutral-500">Escrow Locked</p>
            <p className="font-bold text-neutral-900">$14,820,400</p>
          </div>
          <div className="h-8 w-px bg-neutral-300" />
          <div>
            <p className="text-xs text-neutral-500">Avg Squad Fill</p>
            <p className="font-bold text-neutral-900">48 Hours</p>
          </div>
        </div>
      </div>

      {/* Advanced Search Bar */}
      <div className="mt-6 bg-neutral-100 p-2 rounded-lg">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
          <div className="relative md:col-span-5">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Keyword, Role, or Tech Stack"
              value={filters.keyword}
              onChange={(e) => onFilterChange({ ...filters, keyword: e.target.value })}
              className="w-full rounded-lg bg-white px-10 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
          </div>

          <div className="relative md:col-span-3">
            <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Location / Timezone Overlap"
              value={filters.location}
              onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
              className="w-full rounded-lg bg-white px-10 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
          </div>

          <div className="md:col-span-2">
            <select
              value={filters.type}
              onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
              className="w-full rounded-lg bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none"
            >
              <option value="">All Types</option>
              <option value="Squad Opening">Squad Opening</option>
              <option value="Solo Specialist">Solo Specialist</option>
              <option value="Squad Takeover">Squad Takeover</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 bg-primary text-white rounded-lg px-6 py-2.5 font-semibold hover:bg-primary/90"
            >
              <Filter className="h-4 w-4" />
              Find Contracts
            </button>
          </div>
        </div>
      </div>

      {/* Quick Filter Pills */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-neutral-500">Quick Filters:</span>
        {quickFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange({ ...filters, quickFilter: filter })}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filters.quickFilter === filter
                ? 'bg-primary-light text-primary'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  )
}
