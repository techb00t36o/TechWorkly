// Multi-step worker onboarding wizard collecting profile, skills, portfolio, and OTP.
// Steps: 1) Personal profile (photo, name, bio) → 2) Skills & expertise → 3) Portfolio links → 4) OTP confirmation
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import OnboardingLayout from './OnboardingLayout.jsx'
import UploadField from './UploadField.jsx'
import TagInput from './TagInput.jsx'
import OTPInput from './OTPInput.jsx'

const TOTAL_STEPS = 4

// Step 1: Collect personal identity and professional summary
function ProfileStep({ form, setForm, errors }) {
  return (
    <div className="space-y-4">
      <UploadField
        label="Profile photo"
        accept="image/*"
        onChange={(file) => setForm({ ...form, photo: file })}
        preview={form.photo ? URL.createObjectURL(form.photo) : null}
      />
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Full name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="John Smith"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
        {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Bio</label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Tell us about yourself and your expertise..."
          rows={3}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Location</label>
        <input
          type="text"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="City, Country"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      </div>
    </div>
  )
}

function ProfessionalStep({ form, setForm, errors }) {
  const roles = [
    'Frontend Developer',
    'Backend Developer',
    'Full-Stack Developer',
    'Mobile Developer',
    'QA Engineer',
    'DevOps Engineer',
    'Security Engineer',
    'UI/UX Designer',
    'Project Manager',
    'Data Engineer',
  ]

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Primary role</label>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        >
          <option value="">Select a role</option>
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        {errors.role && <p className="mt-1 text-xs text-danger">{errors.role}</p>}
      </div>
      <TagInput
        label="Skills"
        tags={form.skills}
        onChange={(skills) => setForm({ ...form, skills })}
        placeholder="Add a skill (e.g. React, Node.js)"
      />
      {errors.skills && <p className="text-xs text-danger">{errors.skills}</p>}
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Years of experience</label>
        <select
          value={form.experience}
          onChange={(e) => setForm({ ...form, experience: e.target.value })}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        >
          <option value="">Select</option>
          <option value="0-1">Less than 1 year</option>
          <option value="1-3">1–3 years</option>
          <option value="3-5">3–5 years</option>
          <option value="5-10">5–10 years</option>
          <option value="10+">10+ years</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Portfolio links</label>
        {/* Map over array by index — each field is independent and can be removed by index */}
        {form.portfolios.map((url, i) => (
          <div key={i} className="mb-2 flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => {
                // Immutably update a single portfolio entry without losing other values
                const next = [...form.portfolios]
                next[i] = e.target.value
                setForm({ ...form, portfolios: next })
              }}
              placeholder="https://..."
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
            <button
              type="button"
              onClick={() => {
                // Remove entry by index — filter out the one being deleted
                const next = form.portfolios.filter((_, j) => j !== i)
                setForm({ ...form, portfolios: next })
              }}
              className="rounded-lg border border-neutral-300 px-3 py-2.5 text-sm font-medium text-neutral-500 hover:bg-neutral-100"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setForm({ ...form, portfolios: [...form.portfolios, ''] })}
          className="text-sm font-semibold text-primary hover:text-primary-dark"
        >
          + Add link
        </button>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Hourly rate (USD)</label>
        <input
          type="number"
          value={form.hourlyRate}
          onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
          placeholder="e.g. 50"
          min="0"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      </div>
    </div>
  )
}

function PaymentStep({ form, setForm }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-500">
        Connect your payment method to receive escrow-backed payments. You can set this up later,
        but it&apos;s required before you can get hired.
      </p>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Country for payouts</label>
        <select
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        >
          <option value="">Select country</option>
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="CA">Canada</option>
          <option value="AU">Australia</option>
          <option value="BD">Bangladesh</option>
          <option value="IN">India</option>
          <option value="DE">Germany</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      <div className="rounded-xl border border-neutral-300 bg-neutral-50 p-6 text-center">
        <svg
          className="mx-auto h-12 w-12 text-neutral-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
          />
        </svg>
        <p className="mt-3 text-sm font-medium text-neutral-700">Stripe Connect</p>
        <p className="mt-1 text-xs text-neutral-500">
          Secure payment processing powered by Stripe
        </p>
        <button
          type="button"
          className="mt-4 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
        >
          Connect with Stripe
        </button>
      </div>
    </div>
  )
}

function VerificationStep({ form, setForm }) {
  const [otpSent, setOtpSent] = useState(false)

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Phone number</label>
        <div className="flex gap-2">
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+1 555 000 0000"
            className="flex-1 rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
          <button
            type="button"
            onClick={() => setOtpSent(true)}
            className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
          >
            Send Code
          </button>
        </div>
      </div>
      {otpSent && (
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Enter verification code
          </label>
          <OTPInput
            value={form.otp}
            onChange={(otp) => setForm({ ...form, otp })}
          />
          <p className="mt-2 text-xs text-neutral-500">
            We sent a 6-digit code to {form.phone || 'your phone'}.
          </p>
        </div>
      )}
      <UploadField
        label="Government ID (optional)"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(file) => setForm({ ...form, idDocument: file })}
        preview={form.idDocument ? form.idDocument.name : null}
      />
      <div className="rounded-xl border border-neutral-300 bg-primary-light p-4">
        <p className="text-sm font-medium text-primary">
          Verification is optional but increases your trust score with employers.
        </p>
      </div>
    </div>
  )
}

function ConfirmationStep() {
  const navigate = useNavigate()

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success text-2xl text-white">
        ✓
      </div>
      <h2 className="text-xl font-bold text-neutral-900">You&apos;re all set!</h2>
      <p className="mt-2 text-sm text-neutral-500">
        Your worker profile is ready. Start browsing jobs and get hired.
      </p>
      <button
        onClick={() => navigate('/dashboard/worker')}
        className="mt-6 w-full rounded-lg bg-primary py-2.5 font-semibold text-white hover:bg-primary-dark"
      >
        Go to Dashboard
      </button>
    </div>
  )
}

export default function WorkerOnboarding() {
  const { setUser, updateProfile, completeOnboarding } = useAuth()
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState({})
  // portfolios starts with one empty string so the user always sees at least one input field
  const [form, setForm] = useState({
    name: '',
    photo: null,
    bio: '',
    location: '',
    role: '',
    skills: [],
    experience: '',
    portfolios: [''],
    hourlyRate: '',
    country: '',
    phone: '',
    otp: '',
    idDocument: null,
  })

  // Step-specific validation — only checks fields relevant to the active step
  const validate = () => {
    const errs = {}
    if (step === 1) {
      if (!form.name.trim()) errs.name = 'Please enter your name.'
    }
    if (step === 2) {
      if (!form.role) errs.role = 'Please select a role.'
      if (form.skills.length === 0) errs.skills = 'Add at least one skill.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const next = () => {
    if (!validate()) return
    if (step < TOTAL_STEPS) {
      setStep(step + 1)
    } else {
      // Final step: persist profile, mark onboarding done, then show confirmation
      setUser({ id: 1, name: form.name, email: 'worker@example.com' }, 'worker')
      updateProfile(form)
      completeOnboarding()
      setStep(5) // exits the wizard flow into ConfirmationStep
    }
  }

  const back = () => {
    if (step > 1) setStep(step - 1)
  }

  // After completion, bypass the wizard and render the success screen
  if (step === 5) {
    return (
      <OnboardingLayout currentStep={4} totalSteps={4} title="" subtitle="">
        <ConfirmationStep role="worker" />
      </OnboardingLayout>
    )
  }

  const stepConfig = {
    1: {
      title: 'Your profile',
      subtitle: 'Tell us about yourself so employers can find you.',
    },
    2: {
      title: 'Professional details',
      subtitle: 'Showcase your skills and experience.',
    },
    3: {
      title: 'Payment setup',
      subtitle: 'Connect a payment method to receive escrow-backed payouts.',
    },
    4: {
      title: 'Verification',
      subtitle: 'Verify your identity to build trust with employers.',
    },
  }

  // Dynamic lookup: maps step number → component, avoiding switch/case boilerplate
  const StepComponent = {
    1: ProfileStep,
    2: ProfessionalStep,
    3: PaymentStep,
    4: VerificationStep,
  }[step]

  return (
    <OnboardingLayout
      currentStep={step}
      totalSteps={TOTAL_STEPS}
      title={stepConfig[step].title}
      subtitle={stepConfig[step].subtitle}
    >
      <StepComponent form={form} setForm={setForm} errors={errors} />

      <div className="mt-8 flex gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={back}
            className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={next}
          className="flex-1 rounded-lg bg-primary py-2.5 font-semibold text-white hover:bg-primary-dark"
        >
          {step === TOTAL_STEPS ? 'Complete Setup' : 'Continue'}
        </button>
      </div>
    </OnboardingLayout>
  )
}
