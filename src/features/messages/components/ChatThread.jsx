// Active chat thread: message bubbles + composer with external-contact blocking.
import { useState, useRef, useEffect } from 'react'
import { Send, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useMessages } from '../../../context/MessageContext.jsx'
import { containsExternalContact } from '../contactFilter.js'

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ChatThread({ conversation }) {
  const { user, role } = useAuth()
  const { sendMessage } = useMessages()
  const [text, setText] = useState('')
  const [blockedWarning, setBlockedWarning] = useState(false)
  const bottomRef = useRef(null)

  // Live detection: warn as the user types, hard-block still happens on send
  const hasExternal = containsExternalContact(text)

  // Auto-scroll to newest message on mount and every message change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation.messages.length])

  const handleSend = (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    // PRD rule: external contact info never leaves the platform
    if (containsExternalContact(trimmed)) {
      setBlockedWarning(true)
      return
    }
    setBlockedWarning(false)
    sendMessage(conversation.id, user.id, role, trimmed)
    setText('')
  }

  const counterpartyName = role === 'worker' ? conversation.companyName : conversation.workerName

  return (
    <div className="flex h-full flex-col">
      {/* Thread header */}
      <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
          {counterpartyName[0]}
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900">{counterpartyName}</p>
          {conversation.contractId && (
            <p className="text-xs text-neutral-500">Contract conversation</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {conversation.messages.length === 0 && (
          <p className="py-12 text-center text-sm text-neutral-500">
            No messages yet — start the conversation below.
          </p>
        )}
        {conversation.messages.map((m) => {
          // Own messages align right; mirror messages left (single-user demo,
          // both sides share id 1, so role distinguishes the sender's bubble)
          const isOwn = m.senderRole === role
          return (
            <div key={m.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  isOwn
                    ? 'bg-primary text-white rounded-br-md'
                    : 'bg-neutral-100 text-neutral-800 rounded-bl-md'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{m.text}</p>
                <p
                  className={`mt-1 text-[10px] ${isOwn ? 'text-white/70' : 'text-neutral-400'}`}
                >
                  {formatTime(m.createdAt)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Composer with contact-info enforcement */}
      <form onSubmit={handleSend} className="border-t border-neutral-200 p-4">
        {blockedWarning && (
          <div className="mb-2 flex items-start gap-2 rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              External contact info (emails, phone numbers, messenger links) is not allowed.
              Keep conversations on-platform for your safety.
            </span>
          </div>
        )}
        {hasExternal && !blockedWarning && (
          <p className="mb-2 flex items-center gap-1.5 text-xs text-warning">
            <AlertTriangle className="h-3.5 w-3.5" />
            This message contains external contact info and will be blocked.
          </p>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              if (blockedWarning) setBlockedWarning(false)
            }}
            placeholder={`Message ${counterpartyName}…`}
            className="flex-1 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
