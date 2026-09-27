// Reusable job form with validation for title, description, category, and budget.
import { useState } from 'react'

const categories = ['Web', 'Mobile', 'Desktop', 'Browser']

export default function JobForm({ initialData, onSubmit, submitLabel }) {
  // Spread initialData after defaults so edit mode overrides blank fields
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Web',
    skills: [],
    budget: '',
    duration: '',
    ...initialData,
  })
  const [skillInput, setSkillInput] = useState('')
  const [errors, setErrors] = useState({})

  // Clear per-field error on edit so the red state doesn't persist after correction
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Enter key adds skill; preventDefault stops form submission, guard prevents duplicates
  const handleAddSkill = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const skill = skillInput.trim()
      if (skill && !form.skills.includes(skill)) {
        setForm((prev) => ({ ...prev, skills: [...prev.skills, skill] }))
        setSkillInput('')
      }
    }
  }

  const handleRemoveSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  // Early-return validation: builds all errors then checks count; single setErrors call
  const validate = () => {
    const newErrors = {}
    if (!form.title.trim()) newErrors.title = 'Title is required'
    if (!form.description.trim()) newErrors.description = 'Description is required'
    if (form.skills.length === 0) newErrors.skills = 'Add at least one skill'
    if (!form.budget || Number(form.budget) <= 0) newErrors.budget = 'Budget must be greater than 0'
    if (!form.duration.trim()) newErrors.duration = 'Duration is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Coerce budget from string input to number before passing to parent
  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({
        ...form,
        budget: Number(form.budget),
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">Job Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Senior React Developer"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
        {errors.title && (
          <p className="mt-1 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          placeholder="Describe the role, responsibilities, and requirements..."
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
        {errors.description && (
          <p className="mt-1 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{errors.description}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">Category</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, category: cat }))}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                form.category === cat
                  ? 'bg-primary text-white'
                  : 'border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">Required Skills</label>
        <input
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleAddSkill}
          placeholder="Type a skill and press Enter"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
        {errors.skills && (
          <p className="mt-1 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{errors.skills}</p>
        )}
        {form.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {form.skills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-1.5 rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Budget & Duration */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">Budget (USD)</label>
          <input
            type="number"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            placeholder="5000"
            min="0"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
          {errors.budget && (
            <p className="mt-1 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{errors.budget}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">Duration</label>
          <input
            type="text"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="e.g. 3 months"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
          {errors.duration && (
            <p className="mt-1 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{errors.duration}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        {submitLabel || 'Publish Job'}
      </button>
    </form>
  )
}
