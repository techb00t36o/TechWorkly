// Team Workspace: overview, chat, files, milestones, members, activity log.
// Access: company owner or hired team members (PRD 5.5 Team Workspace).
import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTeams } from '../../context/TeamContext.jsx'
import { containsExternalContact } from '../messages/contactFilter.js'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import {
  MessageSquare,
  FolderOpen,
  CheckCircle,
  Clock,
  Users,
  Activity,
  Upload,
  Send,
} from 'lucide-react'

const tabs = [
  { key: 'overview', label: 'Overview', icon: Activity },
  { key: 'chat', label: 'Chat', icon: MessageSquare },
  { key: 'files', label: 'Files', icon: FolderOpen },
  { key: 'milestones', label: 'Milestones', icon: CheckCircle },
  { key: 'members', label: 'Members', icon: Users },
]

const milestoneMeta = {
  not_started: { label: 'Not started', cls: 'bg-neutral-200 text-neutral-600' },
  in_progress: { label: 'In progress', cls: 'bg-warning/10 text-warning' },
  completed: { label: 'Completed', cls: 'bg-primary-light text-primary' },
  approved: { label: 'Approved', cls: 'bg-success/10 text-success' },
}

function timeAgo(dateString) {
  const mins = Math.floor((Date.now() - new Date(dateString)) / 60000)
  if (mins < 60) return `${Math.max(mins, 1)}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return days === 1 ? '1d ago' : `${days}d ago`
}

export default function TeamWorkspacePage() {
  const { id } = useParams()
  const { user, role } = useAuth()
  const {
    getTeamById,
    isTeamMember,
    addChatMessage,
    addFile,
    updateMilestoneStatus,
  } = useTeams()

  const [tab, setTab] = useState('overview')
  const [draft, setDraft] = useState('')
  const [warning, setWarning] = useState('')
  const [fileName, setFileName] = useState('')
  const chatEndRef = useRef(null)

  const team = getTeamById(id)

  // Jump to latest message when chat opens or a message lands
  useEffect(() => {
    if (tab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [tab, team?.chat?.length])

  if (!team) {
    return (
      <DashboardLayout role={role || 'company'}>
        <div className="mx-auto max-w-2xl rounded-2xl border border-neutral-300 bg-white p-12 text-center">
          <p className="text-lg font-semibold text-neutral-900">Team not found</p>
          <Link to="/" className="mt-4 inline-block text-sm text-primary hover:underline">
            Back home
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const member = user && isTeamMember(team.id, user.id)
  if (!member) {
    return (
      <DashboardLayout role={role || 'company'}>
        <div className="mx-auto max-w-2xl rounded-2xl border border-neutral-300 bg-white p-12 text-center">
          <p className="text-lg font-semibold text-neutral-900">Workspace is private</p>
          <p className="mt-2 text-sm text-neutral-500">
            Only the company and hired team members can open this workspace.
          </p>
          <Link
            to={`/teams/${team.id}`}
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            View public team listing
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const isCompany = String(team.companyId) === String(user?.id)
  const senderRole = isCompany ? 'company' : 'worker'
  const approvedCount = team.milestones.filter((m) => m.status === 'approved').length
  const progressPct = team.milestones.length
    ? Math.round((approvedCount / team.milestones.length) * 100)
    : 0

  const handleSend = () => {
    const text = draft.trim()
    if (!text) return
    if (containsExternalContact(text)) {
      setWarning('External contact info is blocked. Keep communication on-platform.')
      return
    }
    setWarning('')
    addChatMessage(team.id, {
      senderId: user?.id || 1,
      senderName: isCompany ? team.companyName : user?.name || 'Member',
      senderRole,
      text,
      createdAt: new Date().toISOString(),
    })
    setDraft('')
  }

  const handleUpload = (e) => {
    e.preventDefault()
    const name = fileName.trim()
    if (!name) return
    addFile(team.id, {
      name,
      size: '1.2 MB',
      uploadedBy: isCompany ? team.companyName : user?.name || 'Member',
      uploadedAt: new Date().toISOString(),
    })
    setFileName('')
  }

  return (
    <DashboardLayout role={role || 'company'}>
      {/* Header */}
      <div className="mb-6 rounded-2xl border border-neutral-300 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-neutral-900">{team.title}</h1>
              <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">
                {team.status.replace('_', ' ')}
              </span>
              {isCompany && (
                <Link
                  to={`/dashboard/company/teams/${team.id}/applicants`}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Review applicants →
                </Link>
              )}
            </div>
            <p className="mt-1 text-sm text-neutral-500">{team.companyName}</p>
          </div>
          {team.teamLeadId && (
            <Link
              to={`/teams/${team.id}/manage`}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Team Management
            </Link>
          )}
        </div>

        {/* Members strip */}
        <div className="mt-4 flex flex-wrap gap-2">
          {team.members.map((m) => (
            <span
              key={`${m.workerId}-${m.roleId}`}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
                m.isLead ? 'border-primary/40 bg-primary-light text-primary' : 'border-neutral-300 text-neutral-700'
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                {m.workerName[0]}
              </span>
              {m.workerName}
              <span className="text-neutral-400">· {m.roleTitle}</span>
              {m.isLead && '★'}
            </span>
          ))}
          {team.members.length === 0 && (
            <span className="text-sm text-neutral-500">No members hired yet.</span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition ${
              tab === t.key
                ? 'bg-primary text-white'
                : 'border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-neutral-300 bg-white p-6">
            <h2 className="mb-3 text-lg font-semibold text-neutral-900">Project recap</h2>
            <p className="text-sm leading-relaxed text-neutral-600">{team.description}</p>
            <div className="mt-4 flex gap-6 text-sm">
              <div>
                <p className="text-xs text-neutral-500">Start</p>
                <p className="font-semibold text-neutral-900">{team.startDate}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Deadline</p>
                <p className="font-semibold text-neutral-900">{team.deadline}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Type</p>
                <p className="font-semibold text-neutral-900">{team.projectType}</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-6">
              <div className="mb-1 flex justify-between text-xs text-neutral-500">
                <span>Overall progress</span>
                <span>{progressPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-200">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-300 bg-white p-6">
            <h3 className="mb-3 text-sm font-semibold text-neutral-900">Milestones</h3>
            {team.milestones.length === 0 ? (
              <p className="text-sm text-neutral-500">No milestones yet.</p>
            ) : (
              <ul className="space-y-3">
                {team.milestones.map((m) => (
                  <li key={m.id} className="flex items-start justify-between gap-2 text-sm">
                    <div>
                      <p className="font-medium text-neutral-800">{m.title}</p>
                      <p className="text-xs text-neutral-500">{m.dueDate}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${milestoneMeta[m.status].cls}`}>
                      {milestoneMeta[m.status].label}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Chat */}
      {tab === 'chat' && (
        <div className="rounded-2xl border border-neutral-300 bg-white flex flex-col" style={{ height: '520px' }}>
          <div className="border-b border-neutral-200 px-4 py-3">
            <p className="text-sm font-semibold text-neutral-900">Team chat</p>
            <p className="text-xs text-neutral-500">Whole team + company · external contact info blocked</p>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {team.chat.map((msg) => {
              const mine =
                String(msg.senderId) === String(user?.id) && msg.senderRole === senderRole
              return (
                <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      mine ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    {!mine && (
                      <p className={`mb-0.5 text-[11px] font-semibold ${mine ? 'text-white/70' : 'text-primary'}`}>
                        {msg.senderName}
                        {msg.senderRole === 'company' ? ' (Company)' : ''}
                      </p>
                    )}
                    <p className="text-sm">{msg.text}</p>
                    <p className={`mt-1 text-[10px] ${mine ? 'text-white/60' : 'text-neutral-400'}`}>
                      {timeAgo(msg.createdAt)}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={chatEndRef} />
          </div>
          {warning && (
            <p className="border-t border-warning/30 bg-warning/10 px-4 py-2 text-xs text-warning">{warning}</p>
          )}
          <div className="border-t border-neutral-200 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value)
                  if (warning) setWarning('')
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message the team..."
                className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
              />
              <button
                onClick={handleSend}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Files */}
      {tab === 'files' && (
        <div className="rounded-2xl border border-neutral-300 bg-white p-6">
          <form onSubmit={handleUpload} className="mb-4 flex gap-2">
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="File name (mock upload) e.g. sprint-brief.pdf"
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              <Upload className="h-4 w-4" />
              Upload
            </button>
          </form>
          {team.files.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-500">No files shared yet.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {team.files.map((f) => (
                <li key={f.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <FolderOpen className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{f.name}</p>
                      <p className="text-xs text-neutral-500">
                        {f.uploadedBy} · {timeAgo(f.uploadedAt)} · {f.size}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Milestones */}
      {tab === 'milestones' && (
        <div className="rounded-2xl border border-neutral-300 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Milestones & Tasks</h2>
            <p className="text-sm text-neutral-500">
              {approvedCount}/{team.milestones.length} approved
            </p>
          </div>
          {team.milestones.length === 0 ? (
            <p className="py-6 text-center text-sm text-neutral-500">No milestones yet.</p>
          ) : (
            <div className="space-y-3">
              {team.milestones.map((m) => (
                <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 p-4">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{m.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-neutral-500">
                      <Clock className="h-3.5 w-3.5" />
                      Due {m.dueDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${milestoneMeta[m.status].cls}`}>
                      {milestoneMeta[m.status].label}
                    </span>
                    {isCompany && m.status === 'completed' && (
                      <button
                        onClick={() => updateMilestoneStatus(team.id, m.id, 'approved')}
                        className="rounded-lg border border-success/30 px-3 py-1 text-xs font-medium text-success hover:bg-success/10"
                      >
                        Approve
                      </button>
                    )}
                    {!isCompany && m.status === 'in_progress' && (
                      <button
                        onClick={() => updateMilestoneStatus(team.id, m.id, 'completed')}
                        className="rounded-lg border border-primary/30 px-3 py-1 text-xs font-medium text-primary hover:bg-primary-light"
                      >
                        Mark complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Task breakdown per role */}
          <h3 className="mb-3 mt-8 text-sm font-semibold text-neutral-900">Tasks</h3>
          <div className="space-y-2">
            {team.tasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg bg-neutral-50 px-4 py-3">
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
              </div>
            ))}
            {team.tasks.length === 0 && (
              <p className="text-sm text-neutral-500">No tasks yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Members */}
      {tab === 'members' && (
        <div className="rounded-2xl border border-neutral-300 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Members</h2>
          {team.members.length === 0 ? (
            <p className="py-6 text-center text-sm text-neutral-500">No members hired yet.</p>
          ) : (
            <div className="space-y-3">
              {team.members.map((m) => {
                const prior = Math.max((m.workCount || 1) - 1, 0)
                return (
                  <div
                    key={`${m.workerId}-${m.roleId}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                        {m.workerName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">
                          {m.workerName}
                          {m.isLead && (
                            <span className="ml-2 rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-medium text-primary">
                              Team Lead
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-neutral-500">{m.roleTitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-500">Work count with this team</p>
                      <p className="text-sm font-semibold text-neutral-900">
                        {prior === 0
                          ? '1st project together'
                          : prior === 1
                            ? '2nd project together'
                            : `${prior + 1}rd project together`}
                      </p>
                    </div>
                    <Link
                      to="/messages"
                      className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                    >
                      Message
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
