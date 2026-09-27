import { Link } from 'react-router-dom'
import StepIndicator from './StepIndicator.jsx'

export default function OnboardingLayout({ children, currentStep, totalSteps, title, subtitle }) {
  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="sticky top-0 z-20 border-b border-neutral-300 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex h-16 w-full items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
              TW
            </span>
            <span className="text-lg font-semibold text-neutral-900">TechWorkly</span>
          </Link>
          <span className="text-sm text-neutral-500">
            Step {currentStep} of {totalSteps}
          </span>
        </nav>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        <div className="rounded-2xl border border-neutral-300 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
          )}
          <div className="mt-6">{children}</div>
        </div>
      </main>
    </div>
  )
}
