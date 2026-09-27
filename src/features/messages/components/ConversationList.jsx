// Left-hand conversation list for the two-pane messages layout.
import { useAuth } from '../../../context/AuthContext.jsx'

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString)
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return days === 1 ? '1d' : `${days}d`
}

export default function ConversationList({ conversations, activeId, onSelect }) {
  const { role } = useAuth()

  // Counterparty = the other side of the conversation relative to current role
  const getCounterparty = (cv) =>
    role === 'worker'
      ? { name: cv.companyName, initial: cv.companyName[0] }
      : { name: cv.workerName, initial: cv.workerName[0] }

  return (
    <div className="flex flex-col">
      <div className="border-b border-neutral-200 px-4 py-3">
        <h1 className="text-lg font-bold text-neutral-900">Messages</h1>
      </div>

      {conversations.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-neutral-500">
          No conversations yet.
        </p>
      ) : (
        conversations.map((cv) => {
          const counterparty = getCounterparty(cv)
          const last = cv.messages[cv.messages.length - 1]
          const isActive = cv.id === activeId
          return (
            <button
              key={cv.id}
              onClick={() => onSelect(cv.id)}
              className={`flex items-start gap-3 border-b border-neutral-100 px-4 py-3 text-left transition ${
                isActive ? 'bg-primary-light' : 'hover:bg-neutral-50'
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                {counterparty.initial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className={`truncate text-sm ${cv.unreadCount ? 'font-bold text-neutral-900' : 'font-semibold text-neutral-800'}`}>
                    {counterparty.name}
                  </p>
                  <span className="shrink-0 text-[11px] text-neutral-400">
                    {timeAgo(cv.lastActivity)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className={`truncate text-xs ${cv.unreadCount ? 'font-medium text-neutral-700' : 'text-neutral-500'}`}>
                    {last ? last.text : 'No messages yet'}
                  </p>
                  {cv.unreadCount > 0 && (
                    <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                      {cv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })
      )}
    </div>
  )
}
