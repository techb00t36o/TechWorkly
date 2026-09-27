// Two-pane messaging page: conversation list + active chat thread.
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useMessages } from '../../context/MessageContext.jsx'
import DashboardLayout from '../../components/DashboardLayout.jsx'
import ConversationList from './components/ConversationList.jsx'
import ChatThread from './components/ChatThread.jsx'

export default function MessagesPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()
  const { conversations, getConversationById, markConversationRead } = useMessages()

  const active = id ? getConversationById(id) : null

  // Opening a conversation clears its unread badge
  useEffect(() => {
    if (id) markConversationRead(id)
    // markConversationRead identity is stable per provider instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleSelect = (conversationId) => {
    navigate(`/messages/${conversationId}`)
  }

  return (
    <DashboardLayout role={role || 'company'}>
      <div className="mx-auto max-w-5xl">
        <div className="grid h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border border-neutral-300 bg-white md:grid-cols-[320px_1fr]">
          {/* Conversation list — full width on mobile when no thread open */}
          <div
            className={`overflow-y-auto border-r border-neutral-200 ${
              active ? 'hidden md:block' : ''
            }`}
          >
            <ConversationList
              conversations={conversations}
              activeId={id}
              onSelect={handleSelect}
            />
          </div>

          {/* Thread pane */}
          <div className={active ? '' : 'hidden md:flex md:items-center md:justify-center'}>
            {active ? (
              <ChatThread conversation={active} />
            ) : (
              <div className="p-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
                  <MessageSquare className="h-7 w-7 text-primary" />
                </div>
                <p className="mt-4 text-lg font-semibold text-neutral-900">
                  Select a conversation
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  All communication stays on-platform for your safety.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
