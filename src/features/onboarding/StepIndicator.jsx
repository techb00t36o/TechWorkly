export default function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {/* Derive step state (active/completed/pending) from 1-based index relative to currentStep */}
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1
        const isActive = step === currentStep
        const isCompleted = step < currentStep

        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                isCompleted
                  ? 'bg-success text-white'
                  : isActive
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-500'
              }`}
            >
              {isCompleted ? '✓' : step}
            </div>
            {step < totalSteps && (
              <div
                className={`h-0.5 w-8 ${
                  step < currentStep ? 'bg-success' : 'bg-neutral-200'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
