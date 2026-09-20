import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { MessageCircle, Send, X } from 'lucide-react'

import { sendChatMessage } from '@/api/chatApi'
import { cn } from '@/lib/utils'

const WELCOME =
  "Hi! I'm the LingLingS assistant. Ask me about Taylor Swift, Disney, or articles on this blog."

const HIDDEN_PATH_PREFIXES = [
  '/admin',
  '/login',
  '/signup',
  '/profile',
  '/reset-password',
]

function shouldHideChat(pathname) {
  return HIDDEN_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

export function ChatWidget() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: WELCOME },
  ])
  const bottomRef = useRef(null)

  const hidden = shouldHideChat(location.pathname)

  useEffect(() => {
    if (!open) return
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  useEffect(() => {
    if (hidden) setOpen(false)
  }, [hidden])

  if (hidden) return null

  const handleSend = async (event) => {
    event.preventDefault()
    const text = input.trim()
    if (!text || isSending) return

    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setIsSending(true)

    try {
      const history = nextMessages
        .filter((item) => item.role === 'user' || item.role === 'assistant')
        .slice(1, -1)
        .slice(-8)

      const { reply } = await sendChatMessage({
        message: text,
        history,
      })

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            error.message ||
            'Sorry, I could not reply right now. Please try again.',
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open && (
        <section
          aria-label="Blog chatbot"
          className="flex h-[min(520px,70vh)] w-[min(100vw-2rem,360px)] flex-col overflow-hidden rounded-2xl border border-[#DAD6D1] bg-white shadow-lg"
        >
          <header className="flex items-center justify-between border-b border-[#DAD6D1] bg-[#F9F8F6] px-4 py-3">
            <div>
              <p className="text-sm font-bold text-[#26231E]">LingLingS Chat</p>
              <p className="text-xs text-[#75716B]">Ask about the blog</p>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-full p-1.5 text-[#75716B] transition-colors hover:bg-[#EFEEEB] hover:text-[#26231E]"
            >
              <X size={18} />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn(
                  'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                  message.role === 'user'
                    ? 'ml-auto bg-[#26231E] text-white'
                    : 'mr-auto bg-[#EFEEEB] text-[#26231E]',
                )}
              >
                {message.content}
              </div>
            ))}
            {isSending && (
              <div className="mr-auto rounded-2xl bg-[#EFEEEB] px-3.5 py-2.5 text-sm text-[#75716B]">
                Thinking...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="flex items-end gap-2 border-t border-[#DAD6D1] p-3"
          >
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  handleSend(event)
                }
              }}
              rows={1}
              placeholder="Ask a question..."
              className="max-h-24 min-h-[42px] flex-1 resize-none rounded-xl border border-[#DAD6D1] px-3 py-2.5 text-sm text-[#26231E] outline-none placeholder:text-[#75716B] focus:border-[#26231E]"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              aria-label="Send message"
              className="flex h-[42px] w-[42px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#26231E] bg-[#26231E] text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        aria-label={open ? 'Close chat' : 'Open chat'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-[#26231E] bg-[#26231E] text-white shadow-md transition-opacity hover:opacity-90"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  )
}
