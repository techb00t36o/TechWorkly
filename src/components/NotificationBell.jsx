// Bell icon with unread badge and dropdown panel of recent notifications.
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, MessageSquare, Briefcase, DollarSign, ShieldCheck, Settings } from 'lucide-react'
import { useNotifications } from '../context/NotificationContext.jsx'

// PRD categories → icon + color treatment
const typeMeta = {
  message: { icon: MessageSquare, color: 'text-blue-600 bg-blue-50' },
  application: { icon: Briefcase, color: 'text-teal-600 bg-teal-50' },
  payment: { icon: DollarSign, color: 'text-success bg-success/10' },
  verification: { icon: ShieldCheck, color: 'text-purple-600 bg-purple-50' },
  system: { icon: Settings, color: 'text-neutral-500 bg-neutral-100' },
}

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString)
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return days === 1 ? '1d ago' : `${days}d ago`
}

// align="right" (default) anchors the panel's right edge — for the Header bell.
// align="left" anchors the panel's left edge — for the Sidebar bell, so the
// 320px panel opens into the main content instead of off the left of the screen.
export default function NotificationBell({ align = 'right' }) {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const ref = useRef(null)

  // Close when clicking outside the bell/dropdown
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const handleItemClick = (n) => {
    markRead(n.id)
    setOpen(false)
    navigate(n.link)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className={`absolute top-full z-40 mt-2 w-80 rounded-xl border border-neutral-300 bg-white shadow-lg ${align === 'left' ? 'left-0' : 'right-0'}`}>
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
              <p className="text-sm font-semibold text-neutral-900">Notifications</p>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-medium text-primary hover:text-primary-dark"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-neutral-500">
                  No notifications yet.
                </p>
              ) : (
                notifications.slice(0, 10).map((n) => {
                  const meta = typeMeta[n.type] || typeMeta.system
                  const Icon = meta.icon
                  return (
                    <button
                      key={n.id}
                      onClick={() => handleItemClick(n)}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-neutral-50 ${
                        !n.read ? 'bg-primary-light/40' : ''
                      }`}
                    >
                      <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.color}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold text-neutral-900">
                            {n.title}
                          </span>
                          {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-neutral-600">{n.body}</span>
                        <span className="mt-0.5 block text-[11px] text-neutral-400">
                          {timeAgo(n.createdAt)}
                        </span>
                      </span>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
