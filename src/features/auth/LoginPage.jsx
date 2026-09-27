// Multi-step login form with email/password, social login, and password reset flow.
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AppLayout from '../../components/AppLayout.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

function ForgotPasswordFlow({ onBack }) {
  /* Multi-step reset: email/phone → OTP → new password → confirm */
  const [step, setStep] = useState(1)
  const [form, setForm] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  // Step-gated validation: each step checks only what matters for that stage,
  // so errors surface immediately without waiting for the full form.
  const next = () => {
    if (step === 1 && !form.trim()) {
      setError('Enter your email or phone number to continue.')
      return
    }
    if (step === 2 && otp.length !== 6) {
      setError('Enter the 6-digit code we sent you.')
      return
    }
    if (step === 3) {
      if (password.length < 8) {
        setError('Password must be at least 8 characters.')
        return
      }
      if (password !== confirm) {
        setError('Passwords do not match.')
        return
      }
    }
    setError('')
    setStep((s) => s + 1)
  }

  {/* Step 5 is a terminal state — no further progression possible,
      so we short-circuit the entire flow with a success view instead of
      rendering step-gated inputs that will never appear. */}
  if (step === 5) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success text-white">
          ✓
        </div>
        <h2 className="text-xl font-bold text-neutral-900">Password reset</h2>
        <p className="mt-2 text-sm text-neutral-500">
          Your password has been updated. You can now log in with your new password.
        </p>
        <button
          onClick={onBack}
          className="mt-6 w-full rounded-lg bg-primary py-2.5 font-semibold text-white hover:bg-primary-dark"
        >
          Back to Login
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-neutral-900">Reset your password</h2>
      <p className="mt-1 text-sm text-neutral-500">
        Step {step} of 4 —{' '}
        {
          ['Enter your email or phone', 'Verify the code', 'Set a new password'][step - 1]
        }
      </p>

      <div className="mt-5 space-y-4">
        {step === 1 && (
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Email or phone number
            </label>
            <input
              type="text"
              value={form}
              onChange={(e) => setForm(e.target.value)}
              placeholder="you@email.com or +1 555 000 0000"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Enter the 6-digit code
            </label>
            {/* Strip non-digits at input time so the field only ever holds
                a clean 6-character string — avoids per-character validation later. */}
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-center text-lg tracking-[0.5em] text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
            <p className="mt-2 text-xs text-neutral-500">
              We sent a code to <span className="font-medium text-neutral-700">{form || 'your contact'}</span>.
            </p>
          </div>
        )}

        {step === 3 && (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                New password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
              />
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        {step > 1 && (
          <button
            onClick={() => {
              setStep((s) => s - 1)
              setError('')
            }}
            className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
          >
            Back
          </button>
        )}
        <button
          onClick={next}
          className="flex-1 rounded-lg bg-primary py-2.5 font-semibold text-white hover:bg-primary-dark"
        >
          {/* Label maps to the action completing the current step, not the step itself */}
          {step === 1 ? 'Send reset code' : step === 2 ? 'Verify code' : 'Update password'}
        </button>
      </div>
    </div>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [error, setError] = useState('')

  // Post-login redirect (e.g. OrderGigPage ?next=/gigs/…/order)
  const nextPath = searchParams.get('next')

  const handleLogin = (e) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }
    // TODO: connect to /api/v1/auth/login
    setError('')
    // Demo: route to a default dashboard after "login" unless a next path was set
    navigate(nextPath || '/dashboard/worker')
  }

  // Demo staff entry — bypasses onboarding (PRD 5.11 admin role)
  const handleAdminDemo = () => {
    setUser({ id: 1, name: 'Alex Admin', email: 'admin@techworkly.io' }, 'admin')
    navigate('/dashboard/admin')
  }

  return (
    <AppLayout>
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-neutral-300 bg-white p-8 shadow-sm">
            {/* showForgot flips between two completely different component trees
                rather than conditionally hiding sections — keeps each flow self-contained
                and avoids shared-state bugs between login and reset. */}
            {!showForgot ? (
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Welcome back</h1>
                <p className="mt-1 text-sm text-neutral-500">
                  Log in to your account. We&apos;ll take you to your dashboard automatically.
                </p>

                <form onSubmit={handleLogin} className="mt-6 space-y-4">
                  {/* ─── Email / phone field ─── */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      Email or phone number
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                    />
                  </div>

                  {/* ─── Password field ─── */}
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label className="block text-sm font-medium text-neutral-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgot(true)}
                        className="text-xs font-semibold text-primary hover:text-primary-dark"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
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

                  {error && (
                    <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-primary py-2.5 font-semibold text-white hover:bg-primary-dark"
                  >
                    Log In
                  </button>
                </form>

                <div className="my-6 flex items-center gap-3 text-xs text-neutral-500">
                  <span className="h-px flex-1 bg-neutral-300" />
                  or continue with
                  <span className="h-px flex-1 bg-neutral-300" />
                </div>

                {/* ─── Social login buttons ─── */}
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

                {/* ─── Sign up link ─── */}
                <p className="mt-6 text-center text-sm text-neutral-500">
                  Don&apos;t have an account?{' '}
                  <Link to="/role-selection" className="font-semibold text-primary hover:text-primary-dark">
                    Sign Up
                  </Link>
                </p>
                <p className="mt-3 text-center">
                  <button
                    type="button"
                    onClick={handleAdminDemo}
                    className="text-xs font-semibold text-neutral-500 hover:text-primary"
                  >
                    Continue as admin (demo staff login)
                  </button>
                </p>
                <p className="mt-4 text-center text-xs text-neutral-500">
                  By continuing you agree to our{' '}
                  <a href="#" className="underline">Terms</a> &amp;{' '}
                  <a href="#" className="underline">Privacy Policy</a>
                </p>
              </div>
            ) : (
              <ForgotPasswordFlow onBack={() => setShowForgot(false)} />
            )}
          </div>

          <p className="mt-4 text-center text-xs text-neutral-500">
            No role selection needed — we route Workers and Companies to the right dashboard.
          </p>
        </div>
      </main>
    </AppLayout>
  )
}
