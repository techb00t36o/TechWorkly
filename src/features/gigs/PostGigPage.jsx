// Post a Gig: worker creates Basic/Standard/Premium service packages (Phase 4).
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useGigs, gigCategories, gigSubCategories } from '../../context/GigContext.jsx'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import { Plus, Trash2 } from 'lucide-react'

const emptyPackage = (tier) => ({
  tier,
  name: tier.charAt(0).toUpperCase() + tier.slice(1),
  price: '',
  deliveryDays: 3,
  revisions: 1,
  features: [''],
})

export default function PostGigPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { createGig, updateGig, getGigById } = useGigs()
  const isEditing = Boolean(id)
  const existing = isEditing ? getGigById(id) : null

  const [title, setTitle] = useState(existing?.title || '')
  const [description, setDescription] = useState(existing?.description || '')
  const [category, setCategory] = useState(existing?.category || 'developer')
  const [subCategory, setSubCategory] = useState(existing?.subCategory || 'web')
  const [tags, setTags] = useState(existing?.tags?.join(', ') || '')
  const [image, setImage] = useState(existing?.image || '')
  const [tools, setTools] = useState(existing?.tools?.join(', ') || '')
  const [packages, setPackages] = useState(
    existing?.packages?.length
      ? existing.packages.map((p) => ({ ...p, price: String(p.price) }))
      : ['basic', 'standard', 'premium'].map(emptyPackage),
  )
  const [requirements, setRequirements] = useState(
    existing?.requirements?.length ? existing.requirements : [{ id: 'r1', label: '', type: 'text' }],
  )
  const [error, setError] = useState('')

  const updatePackage = (i, patch) => {
    setPackages((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)))
  }

  const updateFeature = (pi, fi, value) => {
    setPackages((prev) =>
      prev.map((p, idx) =>
        idx === pi
          ? { ...p, features: p.features.map((f, j) => (j === fi ? value : f)) }
          : p,
      ),
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.')
      return
    }
    const cleanedPackages = packages
      .filter((p) => Number(p.price) > 0)
      .map((p) => ({
        ...p,
        price: Number(p.price),
        deliveryDays: Number(p.deliveryDays),
        revisions: Number(p.revisions),
        features: p.features.map((f) => f.trim()).filter(Boolean),
      }))
    if (cleanedPackages.length === 0) {
      setError('Add at least one package with a price.')
      return
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      category,
      subCategory: category === 'developer' ? subCategory : null,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      tools: tools
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      image:
        image.trim() ||
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=400&fit=crop',
      gallery: [
        image.trim() ||
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=400&fit=crop',
      ],
      packages: cleanedPackages,
      requirements: requirements
        .filter((r) => r.label.trim())
        .map((r) => ({ ...r, label: r.label.trim() })),
      faq: existing?.faq || [],
      workerId: user?.id || 1,
      workerName: profile?.name || user?.name || 'Amina K.',
      workerSlug: 'amina-k',
      workerAvatar: user?.id === 1 ? 'https://i.pravatar.cc/300?img=47' : 'https://i.pravatar.cc/300?img=15',
      verified: true,
    }

    if (isEditing && existing) {
      updateGig({ id: existing.id, ...payload })
      navigate('/dashboard/worker/gigs')
    } else {
      createGig(payload)
      navigate('/dashboard/worker/gigs')
    }
  }

  return (
    <DashboardLayout role="worker">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-neutral-900">
          {isEditing ? 'Edit Gig' : 'Post a Gig'}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Package your skills into fixed-price offers companies can order instantly.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {error && (
            <div className="rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <section className="rounded-2xl border border-neutral-300 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">
              Gig details
            </h2>
            <label className="block text-sm font-medium text-neutral-800">
              Title *
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. React Performance Audit"
                className="mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
              />
            </label>
            <label className="mt-4 block text-sm font-medium text-neutral-800">
              Description *
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="What's included, your process, who it's for…"
                className="mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
              />
            </label>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-neutral-800">
                Category
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  {gigCategories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              {category === 'developer' && (
                <label className="block text-sm font-medium text-neutral-800">
                  Sub-category
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  >
                    {gigSubCategories.developer.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-neutral-800">
                Tags (comma-separated)
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="React, Performance, Audit"
                  className="mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </label>
              <label className="block text-sm font-medium text-neutral-800">
                Tools / tech stack
                <input
                  value={tools}
                  onChange={(e) => setTools(e.target.value)}
                  placeholder="React, Vite, Lighthouse"
                  className="mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </label>
            </div>
            <label className="mt-4 block text-sm font-medium text-neutral-800">
              Cover image URL
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://…"
                className="mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </label>
          </section>

          <section className="rounded-2xl border border-neutral-300 bg-white p-6">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-neutral-500">
              Packages
            </h2>
            <p className="mb-4 text-xs text-neutral-400">
              Leave price empty to skip a tier. At least one priced package is required.
            </p>
            <div className="space-y-4">
              {packages.map((p, i) => (
                <div key={p.tier} className="rounded-xl border border-neutral-200 p-4">
                  <div className="grid gap-3 sm:grid-cols-4">
                    <div className="sm:col-span-1">
                      <p className="text-sm font-semibold text-neutral-900">{p.name}</p>
                    </div>
                    <label className="text-xs text-neutral-500">
                      Price ($)
                      <input
                        type="number"
                        min="0"
                        value={p.price}
                        onChange={(e) => updatePackage(i, { price: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 focus:border-primary focus:outline-none"
                      />
                    </label>
                    <label className="text-xs text-neutral-500">
                      Delivery (days)
                      <input
                        type="number"
                        min="1"
                        value={p.deliveryDays}
                        onChange={(e) => updatePackage(i, { deliveryDays: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 focus:border-primary focus:outline-none"
                      />
                    </label>
                    <label className="text-xs text-neutral-500">
                      Revisions
                      <input
                        type="number"
                        min="0"
                        value={p.revisions}
                        onChange={(e) => updatePackage(i, { revisions: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 focus:border-primary focus:outline-none"
                      />
                    </label>
                  </div>
                  <div className="mt-3 space-y-2">
                    {p.features.map((f, fi) => (
                      <div key={fi} className="flex gap-2">
                        <input
                          value={f}
                          onChange={(e) => updateFeature(i, fi, e.target.value)}
                          placeholder={`Feature ${fi + 1}`}
                          className="flex-1 rounded-lg border border-neutral-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
                        />
                        {p.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              updatePackage(i, {
                                features: p.features.filter((_, j) => j !== fi),
                              })
                            }
                            className="text-neutral-400 hover:text-danger"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => updatePackage(i, { features: [...p.features, ''] })}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      <Plus className="h-3 w-3" /> Add feature
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-300 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">
              Buyer requirements
            </h2>
            <div className="space-y-3">
              {requirements.map((r, i) => (
                <div key={r.id} className="flex gap-2">
                  <input
                    value={r.label}
                    onChange={(e) =>
                      setRequirements((prev) =>
                        prev.map((req, j) =>
                          j === i ? { ...req, label: e.target.value } : req,
                        ),
                      )
                    }
                    placeholder="e.g. Brand colors / Figma link"
                    className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                  <select
                    value={r.type}
                    onChange={(e) =>
                      setRequirements((prev) =>
                        prev.map((req, j) =>
                          j === i ? { ...req, type: e.target.value } : req,
                        ),
                      )
                    }
                    className="rounded-lg border border-neutral-300 bg-white px-2 py-2 text-sm"
                  >
                    <option value="text">Text</option>
                    <option value="file">File</option>
                  </select>
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setRequirements((prev) => prev.filter((_, j) => j !== i))
                      }
                      className="text-neutral-400 hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setRequirements((prev) => [
                    ...prev,
                    { id: `r${prev.length + 1}`, label: '', type: 'text' },
                  ])
                }
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                <Plus className="h-4 w-4" /> Add requirement
              </button>
            </div>
          </section>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/worker/gigs')}
              className="rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              {isEditing ? 'Save changes' : 'Publish Gig'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
