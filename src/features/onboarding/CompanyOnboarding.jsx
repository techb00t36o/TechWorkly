// Multi-step company onboarding wizard collecting profile, team, verification, and OTP.
// Steps: 1) Company profile (logo, name, tagline) → 2) Team setup → 3) Identity verification → 4) OTP confirmation
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import OnboardingLayout from './OnboardingLayout.jsx'
import UploadField from './UploadField.jsx'
import OTPInput from './OTPInput.jsx'

const TOTAL_STEPS = 4

// Step 1: Collect company identity and branding information
function ProfileStep({ form, setForm, errors }) {
  return (
    <div className="space-y-4">
      <UploadField
        label="Company logo"
        accept="image/*"
        onChange={(file) => setForm({ ...form, logo: file })}
        preview={form.logo ? URL.createObjectURL(form.logo) : null}
      />
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Company name</label>
        <input
          type="text"
          value={form.companyName}
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          placeholder="Acme Inc."
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
        {errors.companyName && <p className="mt-1 text-xs text-danger">{errors.companyName}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Tagline</label>
        <input
          type="text"
          value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          placeholder="Building the future of..."
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Website URL</label>
        <input
          type="url"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          placeholder="https://..."
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      </div>
    </div>
  )
}

function CompanyDetailsStep({ form, setForm, errors }) {
  const industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'E-commerce',
    'Education',
    'Media & Entertainment',
    'Manufacturing',
    'Real Estate',
    'Other',
  ]

  const sizes = [
    '1–10 employees',
    '11–50 employees',
    '51–200 employees',
    '201–500 employees',
    '500+ employees',
  ]

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Industry</label>
        <select
          value={form.industry}
          onChange={(e) => setForm({ ...form, industry: e.target.value })}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        >
          <option value="">Select industry</option>
          {industries.map((ind) => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
        {errors.industry && <p className="mt-1 text-xs text-danger">{errors.industry}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Company size</label>
        <select
          value={form.companySize}
          onChange={(e) => setForm({ ...form, companySize: e.target.value })}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        >
          <option value="">Select size</option>
          {sizes.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Headquarters</label>
        <input
          type="text"
          value={form.headquarters}
          onChange={(e) => setForm({ ...form, headquarters: e.target.value })}
          placeholder="City, Country"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Company description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Tell workers what your company does and what kind of talent you're looking for..."
          rows={4}
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
        Set up a payment method to fund escrow for jobs and teams. You can complete this later,
        but it&apos;s required before posting jobs.
      </p>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Billing email</label>
        <input
          type="email"
          value={form.billingEmail}
          onChange={(e) => setForm({ ...form, billingEmail: e.target.value })}
          placeholder="billing@company.com"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
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
          Secure payment processing for escrow-funded projects
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
        <label className="mb-1 block text-sm font-medium text-neutral-700">Company email</label>
        <div className="flex gap-2">
          <input
            type="email"
            value={form.companyEmail}
            onChange={(e) => setForm({ ...form, companyEmail: e.target.value })}
            placeholder="verify@company.com"
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
            value={form.emailOtp}
            onChange={(otp) => setForm({ ...form, emailOtp: otp })}
          />
          <p className="mt-2 text-xs text-neutral-500">
            We sent a 6-digit code to {form.companyEmail || 'your email'}.
          </p>
        </div>
      )}
      <UploadField
        label="Business registration document (optional)"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(file) => setForm({ ...form, registrationDoc: file })}
        preview={form.registrationDoc ? form.registrationDoc.name : null}
      />
      <div className="rounded-xl border border-neutral-300 bg-primary-light p-4">
        <p className="text-sm font-medium text-primary">
          Verified companies get a trust badge and higher visibility in search results.
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
      <h2 className="text-xl font-bold text-neutral-900">Company profile ready!</h2>
      <p className="mt-2 text-sm text-neutral-500">
        Start posting jobs, building teams, and hiring talent.
      </p>
      <button
        onClick={() => navigate('/dashboard/company')}
        className="mt-6 w-full rounded-lg bg-primary py-2.5 font-semibold text-white hover:bg-primary-dark"
      >
        Go to Dashboard
      </button>
    </div>
  )
}

export default function CompanyOnboarding() {
  const { setUser, updateProfile, completeOnboarding } = useAuth()
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    companyName: '',
    logo: null,
    tagline: '',
    website: '',
    industry: '',
    companySize: '',
    headquarters: '',
    description: '',
    billingEmail: '',
    companyEmail: '',
    emailOtp: '',
    registrationDoc: null,
  })

  // Only validates fields for the current step — each step gates its own required fields
  const validate = () => {
    const errs = {}
    if (step === 1 && !form.companyName.trim()) {
      errs.companyName = 'Please enter your company name.'
    }
    if (step === 2 && !form.industry) {
      errs.industry = 'Please select an industry.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const next = () => {
    if (!validate()) return
    if (step < TOTAL_STEPS) {
      setStep(step + 1)
    } else {
      // Final step: persist all form data, mark onboarding complete, then jump to confirmation view
      setUser({ id: 1, name: form.companyName, email: 'company@example.com' }, 'company')
      updateProfile(form)
      completeOnboarding()
      setStep(5) // step 5 exits the wizard and shows ConfirmationStep
    }
  }

  const back = () => {
    if (step > 1) setStep(step - 1)
  }

  if (step === 5) {
    return (
      <OnboardingLayout currentStep={4} totalSteps={4} title="" subtitle="">
        <ConfirmationStep />
      </OnboardingLayout>
    )
  }

  const stepConfig = {
    1: {
      title: 'Company profile',
      subtitle: 'Set up your company presence on TechWorkly.',
    },
    2: {
      title: 'Company details',
      subtitle: 'Tell workers about your company.',
    },
    3: {
      title: 'Payment setup',
      subtitle: 'Connect a payment method to fund escrow projects.',
    },
    4: {
      title: 'Verification',
      subtitle: 'Verify your company email and identity.',
    },
  }

  // Dynamic lookup: maps current step number to its component, avoiding a long switch/if chain
  const StepComponent = {
    1: ProfileStep,
    2: CompanyDetailsStep,
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
