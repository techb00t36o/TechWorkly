// Team Lead coordination view: roster, task assignment, milestones, performance.
// Access: Team Lead (hired worker with isLead) or the company owner.
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTeams } from '../../context/TeamContext.jsx'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import { MessageSquare, UserCircle, AlertTriangle } from 'lucide-react'

export default function TeamManagementPage() {
  const { id } = useParams()
  const { user, role } = useAuth()
  const {
    getTeamById,
    isTeamMember,
    addTask,
    updateTask,
    updateMilestoneStatus,
  } = useTeams()

  const [taskTitle, setTaskTitle] = useState('')
  const [taskAssignee, setTaskAssignee] = useState('')
  const [taskDue, setTaskDue] = useState('')
  const [flagged, setFlagged] = useState(false)

  const team = getTeamById(id)

  if (!team) {
    return (
      <DashboardLayout role={role || 'worker'}>
        <div className="mx-auto max-w-2xl rounded-2xl border border-neutral-300 bg-white p-12 text-center">
          <p className="text-lg font-semibold text-neutral-900">Team not found</p>
          <Link to="/" className="mt-4 inline-block text-sm text-primary hover:underline">
            Back home
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  if (!user || !isTeamMember(team.id, user.id)) {
    return (
      <DashboardLayout role={role || 'worker'}>
        <div className="mx-auto max-w-2xl rounded-2xl border border-neutral-300 bg-white p-12 text-center">
          <p className="text-lg font-semibold text-neutral-900">Access restricted</p>
          <p className="mt-2 text-sm text-neutral-500">Only team members can open management.</p>
        </div>
      </DashboardLayout>
    )
  }

  const isCompany = String(team.companyId) === String(user.id)
  const myMember = team.members.find((m) => String(m.workerId) === String(user.id))
  const isLead = Boolean(myMember?.isLead) || isCompany
  const youAreLead = Boolean(myMember?.isLead)

  const handleAddTask = (e) => {
    e.preventDefault()
    if (!taskTitle.trim()) return
    const assignee = team.members.find((m) => String(m.workerId) === String(taskAssignee))
    addTask(team.id, {
      title: taskTitle.trim(),
      assigneeId: assignee ? assignee.workerId : null,
      assigneeName: assignee ? assignee.workerName : 'Unassigned',
      status: 'not_started',
      dueDate: taskDue || 'TBD',
    })
    setTaskTitle('')
    setTaskAssignee('')
    setTaskDue('')
  }

  const cycleTaskStatus = (task) => {
    const next =
      task.status === 'not_started' ? 'in_progress' : task.status === 'in_progress' ? 'done' : 'not_started'
    updateTask(team.id, task.id, { status: next })
  }

  // Performance snapshot: tasks done vs assigned per member
  const performance = team.members.map((m) => {
    const assigned = team.tasks.filter((t) => String(t.assigneeId) === String(m.workerId))
    const done = assigned.filter((t) => t.status === 'done')
    return { member: m, total: assigned.length, done: done.length }
  })

  return (
    <DashboardLayout role={role || 'worker'}>
      {/* Header */}
      <div className="mb-6 rounded-2xl border border-neutral-300 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-neutral-900">{team.title}</h1>
              <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">
                {team.status.replace('_', ' ')}
              </span>
              {youAreLead && (
                <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
                  You are Team Lead
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-neutral-500">{team.companyName}</p>
          </div>
          <Link
            to={`/teams/${team.id}/workspace`}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Open Team Workspace
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Team Roster */}
        <div className="rounded-2xl border border-neutral-300 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Team Roster</h2>
          {team.members.length === 0 ? (
            <p className="text-sm text-neutral-500">No members yet.</p>
          ) : (
            <div className="space-y-3">
              {team.members.map((m) => (
                <div
                  key={`${m.workerId}-${m.roleId}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                      {m.workerName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        {m.workerName}
                        {m.isLead && (
                          <span className="ml-2 rounded-full bg-primary-light px-2 py-0.5 text-[10px] text-primary">
                            Lead
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {m.roleTitle} · {m.workCount} project{m.workCount !== 1 ? 's' : ''} together
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to="/messages"
                      className="rounded-lg border border-neutral-300 p-1.5 text-neutral-500 hover:bg-neutral-100"
                      title="Message"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/workers/elena-r"
                      className="rounded-lg border border-neutral-300 p-1.5 text-neutral-500 hover:bg-neutral-100"
                      title="View profile"
                    >
                      <UserCircle className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Task Assignment */}
        <div className="rounded-2xl border border-neutral-300 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Task Assignment</h2>
          {isLead && (
            <form onSubmit={handleAddTask} className="mb-4 space-y-2">
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Task title"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
              />
              <div className="flex gap-2">
                <select
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  {team.members.map((m) => (
                    <option key={m.workerId} value={m.workerId}>
                      {m.workerName}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={taskDue}
                  onChange={(e) => setTaskDue(e.target.value)}
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  Add
                </button>
              </div>
            </form>
          )}
          <div className="space-y-2">
            {team.tasks.map((t) => (
              <button
                key={t.id}
                onClick={() => isLead && cycleTaskStatus(t)}
                className="flex w-full items-center justify-between rounded-lg bg-neutral-50 px-4 py-3 text-left hover:bg-neutral-100"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-800">{t.title}</p>
                  <p className="text-xs text-neutral-500">
                    {t.assigneeName} · due {t.dueDate}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    t.status === 'done'
                      ? 'bg-success/10 text-success'
                      : t.status === 'in_progress'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {t.status.replace('_', ' ')}
                </span>
              </button>
            ))}
            {team.tasks.length === 0 && (
              <p className="text-sm text-neutral-500">No tasks yet{isLead ? ' — add one above.' : '.'}</p>
            )}
          </div>
        </div>

        {/* Milestone Coordination */}
        <div className="rounded-2xl border border-neutral-300 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Milestone Coordination</h2>
          <div className="space-y-3">
            {team.milestones.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{m.title}</p>
                  <p className="text-xs text-neutral-500">Due {m.dueDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      m.status === 'approved'
                        ? 'bg-success/10 text-success'
                        : m.status === 'completed'
                          ? 'bg-primary-light text-primary'
                          : m.status === 'in_progress'
                            ? 'bg-warning/10 text-warning'
                            : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {m.status.replace('_', ' ')}
                  </span>
                  {isCompany && m.status === 'completed' && (
                    <button
                      onClick={() => updateMilestoneStatus(team.id, m.id, 'approved')}
                      className="rounded-lg border border-success/30 px-2 py-1 text-[11px] font-medium text-success hover:bg-success/10"
                    >
                      Approve
                    </button>
                  )}
                  {youAreLead && m.status === 'in_progress' && (
                    <button
                      onClick={() => updateMilestoneStatus(team.id, m.id, 'completed')}
                      className="rounded-lg border border-primary/30 px-2 py-1 text-[11px] font-medium text-primary hover:bg-primary-light"
                    >
                      Ready for review
                    </button>
                  )}
                </div>
              </div>
            ))}
            {team.milestones.length === 0 && (
              <p className="text-sm text-neutral-500">No milestones yet.</p>
            )}
          </div>
        </div>

        {/* Performance Overview (lead-only snapshot) */}
        <div className="rounded-2xl border border-neutral-300 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Performance Overview</h2>
          {performance.length === 0 ? (
            <p className="text-sm text-neutral-500">No members to track yet.</p>
          ) : (
            <div className="space-y-3">
              {performance.map(({ member, total, done }) => (
                <div key={`${member.workerId}-${member.roleId}`} className="rounded-lg bg-neutral-50 px-4 py-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-neutral-800">{member.workerName}</span>
                    <span className="text-neutral-500">
                      {done}/{total} tasks done
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-neutral-200">
                    <div
                      className={`h-1.5 rounded-full ${total > 0 && done < total / 2 ? 'bg-warning' : 'bg-primary'}`}
                      style={{ width: total ? `${(done / total) * 100}%` : '0%' }}
                    />
                  </div>
                  {total > 0 && done === 0 && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-warning">
                      <AlertTriangle className="h-3 w-3" /> No tasks completed yet
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Escalation / Support */}
          <div className="mt-6 border-t border-neutral-200 pt-4">
            <h3 className="mb-2 text-sm font-semibold text-neutral-900">Escalation / Support</h3>
            {flagged ? (
              <p className="rounded-lg bg-success/10 px-3 py-2 text-xs text-success">
                Issue flagged to the company. Support will follow up.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFlagged(true)}
                  className="rounded-lg border border-warning/30 px-3 py-1.5 text-xs font-medium text-warning hover:bg-warning/10"
                >
                  Flag an issue with a member
                </button>
                <Link
                  to="/help/contact"
                  className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Contact Support
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
