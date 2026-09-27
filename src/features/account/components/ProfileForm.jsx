// Editable profile form with role-based fields for workers and companies.
// Shows company-specific fields (tagline, website) when role is 'company'.
import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext.jsx'
import UploadField from '../../onboarding/UploadField.jsx'

export default function ProfileForm() {
  const { profile, updateProfile, role } = useAuth()
  // Conditionally include company-only fields via spread: false && {...} spreads nothing, true && {...} spreads the object
  const [form, setForm] = useState({
    name: profile.name || '',
    bio: profile.bio || '',
    location: profile.location || '',
    photo: profile.photo || null,
    ...(role === 'company' && {
      companyName: profile.companyName || '',
      tagline: profile.tagline || '',
      website: profile.website || '',
    }),
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateProfile(form)
    setSaved(true)
    // Auto-dismiss success message after 3s
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* photo is a URL string (existing) or a File object (newly selected) — only create blob URL for File instances */}
      <UploadField
        label="Profile photo"
        accept="image/*"
        onChange={(file) => setForm({ ...form, photo: file })}
        preview={form.photo ? (typeof form.photo === 'string' ? form.photo : URL.createObjectURL(form.photo)) : null}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          {role === 'company' ? 'Company name' : 'Full name'}
        </label>
        {/* Role-conditional binding: same input field serves dual purpose based on user role */}
        <input
          type="text"
          value={role === 'company' ? form.companyName : form.name}
          onChange={(e) => setForm({
            ...form,
            ...(role === 'company' ? { companyName: e.target.value } : { name: e.target.value }),
          })}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      </div>

      {role === 'company' && (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Website</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
          </div>
        </>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Bio</label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Location</label>
        <input
          type="text"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Save Changes
        </button>
        {saved && (
          <span className="text-sm font-medium text-success">Saved successfully!</span>
        )}
      </div>
    </div>
  )
}
