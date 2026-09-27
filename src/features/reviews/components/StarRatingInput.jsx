// Interactive star input (click or keyboard) shared by Leave Review forms.
import { Star } from 'lucide-react'

export default function StarRatingInput({ value = 0, onChange, label }) {
  // 1–5 whole stars; hovering previews without committing
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <div className="flex items-center gap-1">
        {stars.map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${label}: ${n} star${n > 1 ? 's' : ''}`}
            onClick={() => onChange(n)}
            className="transition hover:scale-110"
          >
            <Star
              className={`h-6 w-6 ${
                n <= value
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-neutral-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 w-8 text-right text-sm font-semibold text-neutral-700 tabular-nums">
          {value > 0 ? value : '—'}
        </span>
      </div>
    </div>
  )
}
