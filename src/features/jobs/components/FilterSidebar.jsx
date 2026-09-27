import { useState, useCallback } from 'react'
import { Filter, RotateCcw } from 'lucide-react'

const CHECKBOX_SECTIONS = [
  {
    key: 'escrow',
    label: 'Escrow & Compliance Guarantees',
    options: [
      { key: 'preFunded', label: 'Pre-funded Escrow' },
      { key: 'verifiedKYB', label: 'Verified KYB' },
      { key: 'disputeInsurance', label: 'Dispute Insurance' },
    ],
  },
  {
    key: 'structure',
    label: 'Contract Structure',
    options: [
      { key: 'turnkeySquad', label: 'Turnkey Squad', count: 142 },
      { key: 'soloSpecialist', label: 'Solo Specialist', count: 218 },
      { key: 'squadLead', label: 'Squad Lead', count: 52 },
      { key: 'fullSquadTakeover', label: 'Full Squad Takeover', count: 16 },
    ],
  },
  {
    key: 'seniority',
    label: 'Seniority & Track Record',
    options: [
      { key: 'staffPrincipal', label: 'Staff / Principal' },
      { key: 'seniorSpecialist', label: 'Senior Specialist' },
      { key: 'squadLead', label: 'Squad Lead' },
    ],
  },
  {
    key: 'modality',
    label: 'Working Terms / Modality',
    options: [
      { key: 'asyncFirst', label: 'Async-first' },
      { key: 'usOverlap', label: 'US Overlap' },
      { key: 'euTimezone', label: 'EU Timezone' },
    ],
  },
]

const MILESTONE_OPTIONS = [
  '$5k - $20k',
  '$20k - $50k',
  '$50k - $100k',
  '$100k+',
]

function CheckboxItem({ label, count, checked, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary cursor-pointer"
        />
        <span className="text-sm text-neutral-700 group-hover:text-neutral-900 transition-colors">
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className="text-xs text-neutral-400 font-mono">{count}</span>
      )}
    </label>
  )
}

function FilterSidebar({ filters, onFilterChange, counts }) {
  const [rateRange, setRateRange] = useState(filters?.rateRange || [40, 300])
  const [milestone, setMilestone] = useState(filters?.milestone || null)

  const toggleCheckbox = useCallback(
    (key) => {
      onFilterChange({ ...filters, [key]: !filters?.[key] })
    },
    [filters, onFilterChange]
  )

  const handleRateChange = useCallback(
    (e) => {
      const value = Number(e.target.value)
      const newRange = [rateRange[0], value]
      setRateRange(newRange)
      onFilterChange({ ...filters, rateRange: newRange })
    },
    [filters, onFilterChange, rateRange]
  )

  const handleMilestoneToggle = useCallback(
    (option) => {
      const newValue = milestone === option ? null : option
      setMilestone(newValue)
      onFilterChange({ ...filters, milestone: newValue })
    },
    [filters, onFilterChange, milestone]
  )

  const handleReset = useCallback(() => {
    const resetFilters = {}
    CHECKBOX_SECTIONS.forEach((section) => {
      section.options.forEach((opt) => {
        resetFilters[opt.key] = false
      })
    })
    resetFilters.rateRange = [40, 300]
    resetFilters.milestone = null
    setRateRange([40, 300])
    setMilestone(null)
    onFilterChange(resetFilters)
  }, [onFilterChange])

  const activeCount = Object.values(filters || {}).filter(
    (v) => v === true || (Array.isArray(v) && (v[0] !== 40 || v[1] !== 300))
  ).length + (milestone ? 1 : 0)

  return (
    <aside className="rounded-xl border border-neutral-300 bg-white p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-neutral-500" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
            Filters
          </h2>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary-light text-primary text-xs font-semibold">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reset All
          </button>
        )}
      </div>

      {/* Checkbox sections */}
      {CHECKBOX_SECTIONS.map((section) => (
        <div key={section.key} className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {section.label}
          </p>
          <div className="space-y-2">
            {section.options.map((option) => (
              <CheckboxItem
                key={option.key}
                label={option.label}
                count={option.count ?? counts?.[option.key]}
                checked={!!filters?.[option.key]}
                onChange={() => toggleCheckbox(option.key)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Hourly Rate Range */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Hourly Rate (USD)
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-700 font-medium">
            ${rateRange[0]} - ${rateRange[1]}
          </span>
        </div>
        <input
          type="range"
          min={40}
          max={300}
          value={rateRange[1]}
          onChange={handleRateChange}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-neutral-200 accent-primary"
        />
        <div className="flex justify-between text-xs text-neutral-400">
          <span>$40</span>
          <span>$300</span>
        </div>
      </div>

      {/* Fixed Milestone Size */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Fixed Milestone Size
        </p>
        <div className="grid grid-cols-2 gap-2">
          {MILESTONE_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => handleMilestoneToggle(option)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                milestone === option
                  ? 'bg-primary-light text-primary font-semibold'
                  : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default FilterSidebar
