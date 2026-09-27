// Registration form with name, email, password, role selection, and social signup.
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AppLayout from '../../components/AppLayout.jsx'

export default function SignUpPage() {
  const [searchParams] = useSearchParams()
  {/* Role comes from the URL (e.g. /signup?role=company) so the previous
      role-selection page can pre-fill it — defaulting to 'worker' handles
      direct navigation to /signup with no params. */}
  const role = searchParams.get('role') || 'worker'
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    // Sequential validation: first failing field wins, so the user
    // fixes one thing at a time instead of being overwhelmed by all errors.
    if (!name.trim()) {
      setError('Please enter your full name.')
      return
    }
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (!agreed) {
      setError('You must agree to the Terms & Privacy Policy.')
      return
    }

    setError('')
    // TODO: connect to /api/v1/auth/signup
    // Route to the correct onboarding flow based on role — company onboarding
    // collects hiring preferences, worker onboarding collects skills/portfolio.
    const onboardPath = role === 'company' ? '/onboarding/company' : '/onboarding/worker'
    navigate(onboardPath)
  }

  return (
    <AppLayout>
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-neutral-300 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-neutral-900">
              Create your account
            </h1>
            {/* Subtext adapts to the role set on the previous screen so the
                user immediately sees what they signed up for. */}
            <p className="mt-1 text-sm text-neutral-500">
              {role === 'company'
                ? 'Sign up to start hiring talent and building teams.'
                : 'Sign up to find work, join teams, and get paid.'}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* ─── Name field ─── */}
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
              </div>

              {/* ─── Email field ─── */}
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
              </div>

              {/* ─── Password field ─── */}
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 pr-24 text-sm text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-500 hover:text-neutral-900"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* ─── Terms agreement ─── */}
              <label className="flex items-start gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary-light"
                />
                <span>
                  I agree to the{' '}
                  <a href="#" className="font-medium text-primary hover:text-primary-dark underline">
                    Terms of Service
                  </a>{' '}
                  &amp;{' '}
                  <a href="#" className="font-medium text-primary hover:text-primary-dark underline">
                    Privacy Policy
                  </a>
                </span>
              </label>

              {error && (
                <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-primary py-2.5 font-semibold text-white hover:bg-primary-dark"
              >
                Create Account
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-neutral-500">
              <span className="h-px flex-1 bg-neutral-300" />
              or continue with
              <span className="h-px flex-1 bg-neutral-300" />
            </div>

            {/* ─── Social signup buttons ─── */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Google', char: 'G' },
                { label: 'Apple', char: '' },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg border border-neutral-300 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                    {p.char || ''}
                  </span>
                  {p.label}
                </button>
              ))}
            </div>

            {/* ─── Login link ─── */}
            <p className="mt-6 text-center text-sm text-neutral-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </main>
    </AppLayout>
  )
}
