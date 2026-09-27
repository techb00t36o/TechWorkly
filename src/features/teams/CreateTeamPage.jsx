// Multi-step Create a Team wizard: basics → roles/budget → timeline/escrow → review.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTeams } from '../../context/TeamContext.jsx'
import { useNotifications } from '../../context/NotificationContext.jsx'
import DashboardLayout from '../../components/DashboardLayout.jsx'

const steps = ['Team Basics', 'Roles & Budget', 'Timeline & Escrow', 'Review & Publish']

const emptyRole = () => ({
  id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  title: '',
  subCategory: '',
  quantity: 1,
  skills: [],
  experience: 'Mid-level',
  budgetType: 'fixed',
  budget: '',
  escrowFunded: false,
})

export default function CreateTeamPage() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { createTeam, fundRoleEscrow } = useTeams()
  const { addNotification } = useNotifications()

  const [step, setStep] = useState(1)
  const [basics, setBasics] = useState({ title: '', description: '', projectType: 'One-time' })
  const [roles, setRoles] = useState([emptyRole()])
  const [timeline, setTimeline] = useState({ startDate: '', deadline: '' })

  const totalBudget = roles.reduce(
    (sum, r) => sum + (Number(r.budget) || 0) * (r.budgetType === 'fixed' ? Number(r.quantity) || 1 : 1),
    0,
  )

  const canNext =
    (step === 1 && basics.title.trim() && basics.description.trim()) ||
    (step === 2 && roles.every((r) => r.title.trim() && Number(r.budget) > 0 && r.quantity >= 1)) ||
    (step === 3 && timeline.startDate && timeline.deadline) ||
    step === 4

  const updateRole = (id, patch) => {
    setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  const addSkillToRole = (roleId, skill) => {
    const s = skill.trim()
    if (!s) return
    setRoles((prev) =>
      prev.map((r) =>
        r.id === roleId && !r.skills.includes(s) ? { ...r, skills: [...r.skills, s] } : r,
      ),
    )
  }

  const handleFundRole = (roleId) => {
    // Mock fund: mark role escrow funded in local state (persisted on publish via TeamContext)
    updateRole(roleId, { escrowFunded: true })
  }

  const handlePublish = () => {
    const teamId = createTeam({
      companyId: user?.id || 1,
      companyName: profile.name || user?.name || 'Company',
      title: basics.title.trim(),
      description: basics.description.trim(),
      projectType: basics.projectType,
      startDate: timeline.startDate,
      deadline: timeline.deadline,
      roles: roles.map((r) => ({
        ...r,
        budget: Number(r.budget),
        quantity: Number(r.quantity),
        filled: 0,
        subCategory: r.subCategory || null,
      })),
    })
    // Persist any escrow funds marked during this session
    roles.forEach((r) => {
      if (r.escrowFunded) fundRoleEscrow(teamId, r.id)
    })
    addNotification({
      type: 'system',
      title: 'Team posted',
      body: `${basics.title} is live with ${roles.length} role${roles.length !== 1 ? 's' : ''}.`,
      link: `/teams/${teamId}`,
      recipientId: user?.id || 1,
    })
    navigate(`/teams/${teamId}`)
  }

  return (
    <DashboardLayout role="company">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Create a Team</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Define roles, budgets, and escrow — then publish one listing Workers can apply to per role.
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    i + 1 <= step ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`ml-2 hidden text-sm font-medium sm:inline ${
                    i + 1 <= step ? 'text-neutral-900' : 'text-neutral-500'
                  }`}
                >
                  {s}
                </span>
                {i < steps.length - 1 && (
                  <div
                    className={`mx-4 hidden h-0.5 w-10 sm:block ${
                      i + 1 < step ? 'bg-primary' : 'bg-neutral-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-300 bg-white p-8">
          {/* Step 1 — Team Basics */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Team / Project name</label>
                <input
                  type="text"
                  value={basics.title}
                  onChange={(e) => setBasics((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. E-commerce Platform Rebuild"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Project description</label>
                <textarea
                  value={basics.description}
                  onChange={(e) => setBasics((p) => ({ ...p, description: e.target.value }))}
                  rows={5}
                  placeholder="Overview, goals, what's being built..."
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Project type</label>
                <div className="flex gap-2">
                  {['One-time', 'Ongoing'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setBasics((p) => ({ ...p, projectType: t }))}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                        basics.projectType === t
                          ? 'bg-primary text-white'
                          : 'border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Roles & Budget */}
          {step === 2 && (
            <div className="space-y-6">
              {roles.map((role, idx) => (
                <div key={role.id} className="rounded-xl border border-neutral-200 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-neutral-900">Role {idx + 1}</h3>
                    {roles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setRoles((prev) => prev.filter((r) => r.id !== role.id))}
                        className="text-xs font-medium text-danger hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-neutral-600">Role title</label>
                      <input
                        type="text"
                        value={role.title}
                        onChange={(e) => updateRole(role.id, { title: e.target.value })}
                        placeholder="e.g. Backend Developer"
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-neutral-600">Sub-category (Developer)</label>
                      <select
                        value={role.subCategory}
                        onChange={(e) => updateRole(role.id, { subCategory: e.target.value })}
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                      >
                        <option value="">None</option>
                        {['Web', 'Mobile', 'Desktop', 'Browser'].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-neutral-600">Quantity needed</label>
                      <input
                        type="number"
                        min="1"
                        value={role.quantity}
                        onChange={(e) => updateRole(role.id, { quantity: e.target.value })}
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-neutral-600">Experience level</label>
                      <select
                        value={role.experience}
                        onChange={(e) => updateRole(role.id, { experience: e.target.value })}
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                      >
                        {['Entry', 'Mid-level', 'Senior', 'Lead'].map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-neutral-600">Budget type</label>
                      <select
                        value={role.budgetType}
                        onChange={(e) => updateRole(role.id, { budgetType: e.target.value })}
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                      >
                        <option value="fixed">Fixed price</option>
                        <option value="hourly">Hourly</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-neutral-600">
                        Amount (USD{role.budgetType === 'hourly' ? '/hr' : ''})
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={role.budget}
                        onChange={(e) => updateRole(role.id, { budget: e.target.value })}
                        placeholder={role.budgetType === 'hourly' ? '50' : '4000'}
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="mb-1.5 block text-xs font-medium text-neutral-600">
                      Required skills (type + Enter)
                    </label>
                    <input
                      type="text"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addSkillToRole(role.id, e.target.value)
                          e.target.value = ''
                        }
                      }}
                      placeholder="Node.js, Playwright..."
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                    />
                    {role.skills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {role.skills.map((s) => (
                          <span
                            key={s}
                            className="rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-medium text-primary"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setRoles((prev) => [...prev, emptyRole()])}
                className="w-full rounded-lg border border-dashed border-neutral-300 py-3 text-sm font-medium text-neutral-600 hover:border-primary hover:text-primary"
              >
                + Add role
              </button>
              <div className="rounded-lg bg-neutral-100 px-4 py-3 text-sm text-neutral-700">
                Total project budget:{' '}
                <span className="font-semibold text-neutral-900">${totalBudget.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Step 3 — Timeline & Escrow */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Project start date</label>
                  <input
                    type="date"
                    value={timeline.startDate}
                    onChange={(e) => setTimeline((p) => ({ ...p, startDate: e.target.value }))}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Deadline</label>
                  <input
                    type="date"
                    value={timeline.deadline}
                    onChange={(e) => setTimeline((p) => ({ ...p, deadline: e.target.value }))}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                  />
                </div>
              </div>
              <p className="text-xs text-neutral-500">
                Milestones can be added later in the Team Workspace.
              </p>

              {/* Escrow per role — required before publishing */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-neutral-900">
                  Fund escrow per role <span className="font-normal text-neutral-500">(required before publishing)</span>
                </h3>
                <div className="space-y-2">
                  {roles.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-neutral-900">
                          {r.title || 'Untitled role'} × {r.quantity}
                        </p>
                        <p className="text-xs text-neutral-500">
                          ${(Number(r.budget) || 0).toLocaleString()}
                          {r.budgetType === 'hourly' ? '/hr' : ''} per seat
                        </p>
                      </div>
                      {r.escrowFunded ? (
                        <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                          Escrow funded
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleFundRole(r.id)}
                          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark"
                        >
                          Fund Escrow
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Review & Publish */}
          {step === 4 && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-neutral-900">Preview — how Workers will see it</h3>
              <div className="rounded-xl border border-neutral-200 p-5">
                <p className="text-xs uppercase tracking-wider text-neutral-400">{basics.projectType}</p>
                <h4 className="mt-1 text-xl font-bold text-neutral-900">{basics.title}</h4>
                <p className="mt-2 text-sm text-neutral-600">{basics.description}</p>
                <p className="mt-3 text-xs text-neutral-500">
                  {timeline.startDate} → {timeline.deadline} · Total budget ${totalBudget.toLocaleString()}
                </p>
                <div className="mt-4 space-y-3">
                  {roles.map((r) => (
                    <div key={r.id} className="flex items-start justify-between border-t border-neutral-100 pt-3">
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">
                          {r.title}
                          {r.subCategory ? ` (${r.subCategory})` : ''} × {r.quantity}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {r.experience} · {r.skills.join(', ') || 'No skills listed'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-neutral-900">
                          ${(Number(r.budget) || 0).toLocaleString()}
                          {r.budgetType === 'hourly' ? '/hr' : ''}
                        </p>
                        <p className={`text-xs ${r.escrowFunded ? 'text-success' : 'text-warning'}`}>
                          {r.escrowFunded ? 'Escrow funded' : 'Escrow unfunded'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {!roles.every((r) => r.escrowFunded) && (
                <p className="rounded-lg bg-warning/10 px-4 py-3 text-sm text-warning">
                  All roles need escrow funded before publishing. Go back to step 3 to fund remaining roles —
                  you can still publish as a draft workflow, but hiring will require funding first.
                </p>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            {step < 4 ? (
              <button
                type="button"
                disabled={!canNext}
                onClick={() => setStep((s) => s + 1)}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-40"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                Publish Team
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
