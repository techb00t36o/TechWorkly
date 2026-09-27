import { useState, useMemo, useCallback } from 'react'
import AppLayout from '../../components/AppLayout.jsx'
import SearchHero from './components/SearchHero.jsx'
import FilterSidebar from './components/FilterSidebar.jsx'
import FeaturedSquadCard from './components/FeaturedSquadCard.jsx'
import JobCardV2 from './components/JobCardV2.jsx'
import Pagination from './components/Pagination.jsx'
import JobBannerCTA from './components/JobBannerCTA.jsx'
import { browseV2Jobs, featuredSquad } from './browseV2MockData.js'

const ITEMS_PER_PAGE = 6

const contractTypeMap = {
  'Turnkey Squad': 'turnkeySquad',
  'Solo Specialist': 'soloSpecialist',
  'Squad Lead': 'squadLead',
  'Contract to Hire': 'soloSpecialist',
}

const seniorityMap = {
  'Staff / Principal': 'staffPrincipal',
  'Senior Specialist': 'seniorSpecialist',
  'Squad Lead': 'squadLead',
}

const modalityMap = {
  'Async-First': 'asyncFirst',
  'US Hours Overlap': 'usOverlap',
  'EU Timezone': 'euTimezone',
}

const initialFilters = {
  keyword: '',
  location: '',
  type: '',
  quickFilter: 'All Roles',
  preFunded: true,
  verifiedKYB: true,
  disputeInsurance: false,
  turnkeySquad: true,
  soloSpecialist: true,
  squadLead: false,
  fullSquadTakeover: false,
  staffPrincipal: true,
  seniorSpecialist: true,
  asyncFirst: true,
  usOverlap: true,
  euTimezone: false,
  rateRange: [40, 300],
  milestone: null,
}

export default function BrowseJobsV2() {
  const [filters, setFilters] = useState(initialFilters)
  const [currentPage, setCurrentPage] = useState(1)

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }, [])

  const filteredJobs = useMemo(() => {
    return browseV2Jobs.filter((job) => {
      // Keyword search
      if (filters.keyword) {
        const kw = filters.keyword.toLowerCase()
        const matchesKeyword =
          job.title.toLowerCase().includes(kw) ||
          job.companyName.toLowerCase().includes(kw) ||
          job.skills.some((s) => s.toLowerCase().includes(kw))
        if (!matchesKeyword) return false
      }

      // Location/timezone search
      if (filters.location) {
        const loc = filters.location.toLowerCase()
        if (!job.timeZone.toLowerCase().includes(loc)) return false
      }

      // Contract type filter
      if (filters.type && job.contractType !== filters.type) return false

      // Quick filter (simplified matching)
      if (filters.quickFilter !== 'All Roles') {
        const qf = filters.quickFilter.toLowerCase()
        if (qf === '$100+/hr' && job.hourlyRange[0] < 100) return false
        if (qf === 'turnkey squad openings' && job.contractType !== 'Turnkey Squad') return false
        if (qf.includes('/') && !job.skills.some((s) => qf.includes(s.toLowerCase()))) return false
        if (qf.includes('&') && !job.skills.some((s) => qf.toLowerCase().includes(s.toLowerCase()))) return false
      }

      // Contract structure filter
      const structKey = contractTypeMap[job.contractType]
      if (structKey && !filters[structKey]) return false

      // Seniority filter
      const senKey = seniorityMap[job.seniority]
      if (senKey && !filters[senKey]) return false

      // Modality filter
      const modKey = modalityMap[job.workModality]
      if (modKey && !filters[modKey]) return false

      // Rate range filter
      if (job.hourlyRange[1] < filters.rateRange[0] || job.hourlyRange[0] > filters.rateRange[1]) {
        return false
      }

      // Milestone size filter
      if (filters.milestone && job.milestoneSize !== filters.milestone) return false

      return true
    })
  }, [filters])

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE)
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <AppLayout>
      <div className="min-h-screen bg-neutral-50">
        {/* Search Hero */}
        <SearchHero
          filters={filters}
          onFilterChange={handleFilterChange}
          totalResults={filteredJobs.length}
        />

        {/* Two-Column Body */}
        <div className="mx-auto max-w-[1600px] px-6 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Sidebar */}
            <div className="lg:col-span-3">
              <div className="sticky top-6">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Right Column — Results */}
            <div className="space-y-6 lg:col-span-9">
              {/* Feed Control Strip */}
              <div className="flex items-center justify-between rounded-xl border border-neutral-300 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-neutral-900">
                    {filteredJobs.length}
                  </span>
                  <span className="text-sm text-neutral-500">
                    verified escrow opportunities
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-neutral-500">Sort by:</span>
                  <select className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-700 outline-none">
                    <option>Highest Escrow Secured</option>
                    <option>Newest Openings</option>
                    <option>Hourly Rate: High to Low</option>
                    <option>Ending Soon</option>
                  </select>
                </div>
              </div>

              {/* Featured Squad */}
              <FeaturedSquadCard squad={featuredSquad} />

              {/* Job Cards */}
              {paginatedJobs.map((job) => (
                <JobCardV2 key={job.id} job={job} />
              ))}

              {/* Empty state */}
              {paginatedJobs.length === 0 && (
                <div className="rounded-xl border border-neutral-300 bg-white p-12 text-center shadow-sm">
                  <p className="text-lg font-semibold text-neutral-700">
                    No jobs match your filters
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    Try adjusting your search criteria or resetting filters.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleFilterChange(initialFilters)}
                    className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {filteredJobs.length > ITEMS_PER_PAGE && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalResults={filteredJobs.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mx-auto max-w-[1600px] px-6 pb-12">
          <JobBannerCTA />
        </div>
      </div>
    </AppLayout>
  )
}
