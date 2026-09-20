import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Copy, X } from 'lucide-react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { getCurrentUser, isLoggedIn } from '@/lib/auth'

const INITIAL_COMMENTS = [
  {
    id: 1,
    author: 'Jacob Lash',
    avatar: '/icon.png',
    date: '12 September 2024 at 18:30',
    content:
      'I loved this article! It really captures how independent yet loving cats can be. The purring section was super interesting.',
  },
  {
    id: 2,
    author: 'Ahri',
    avatar: '/icon.png',
    date: '12 September 2024 at 18:30',
    content:
      "Such a great read. I've always wondered how cat slow blinks work as a sign of trust — this explained it perfectly.",
  },
  {
    id: 3,
    author: 'Mimi mama',
    avatar: '/icon.png',
    date: '12 September 2024 at 18:30',
    content:
      'Appreciated the section on cat purring and how it could help with healing. Definitely sharing this with friends who have cats!',
  },
]

function formatCommentDate(date = new Date()) {
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(',', ' at')
}

function LikeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
      <path
        d="M9 14c.667.667 1.333 1 3 1s2.333-.333 3-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M17 7h3v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FacebookIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 8.5V6.75c0-.69.56-1.25 1.25-1.25H17V3h-2.75c-2.07 0-3.75 1.68-3.75 3.75V8.5H8.5v3h2v9.5h3.5v-9.5h2.38L17 8.5h-3z" />
    </svg>
  )
}

function LinkedInIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zM7.119 20.452H3.555V9h3.564v11.452z" />
    </svg>
  )
}

function XIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function PostInteractions({ likes = 0 }) {
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(likes)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState(INITIAL_COMMENTS)

  const requireLogin = () => {
    if (!isLoggedIn()) {
      setDialogOpen(true)
      return true
    }
    return false
  }

  const goToSignUp = () => {
    setDialogOpen(false)
    navigate('/signup')
  }

  const goToLogin = () => {
    setDialogOpen(false)
    navigate('/login')
  }

  const handleLike = () => {
    if (requireLogin()) return

    if (liked) {
      setLiked(false)
      setLikeCount((count) => Math.max(0, count - 1))
      return
    }

    setLiked(true)
    setLikeCount((count) => count + 1)
  }

  const handleCommentInteraction = () => {
    requireLogin()
  }

  const handleSend = () => {
    if (requireLogin()) return

    const content = commentText.trim()
    if (!content) {
      toast.error('Please write a comment first')
      return
    }

    const user = getCurrentUser()
    const newComment = {
      id: Date.now(),
      author: user?.name || user?.username || 'User',
      avatar: user?.avatar || '/icon.png',
      date: formatCommentDate(),
      content,
    }

    setComments((prev) => [newComment, ...prev])
    setCommentText('')
    toast.success('Comment posted')
  }

  const articleUrl = window.location.href

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl)
      toast.success('Copied!', {
        description: 'This article has been copied to your clipboard.',
      })
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(articleUrl)
    const shareUrls = {
      facebook: `https://www.facebook.com/share.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      twitter: `https://www.twitter.com/share?&url=${encodedUrl}`,
    }

    window.open(shareUrls[platform], '_blank', 'noopener,noreferrer')
  }

  const loggedIn = isLoggedIn()

  return (
    <div className="mb-12 border-t border-[#DAD6D1] pt-10">
      <div className="flex flex-col gap-4 rounded-xl bg-[#EFEEEB] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <button
          type="button"
          onClick={handleLike}
          aria-label={`Like post, ${likeCount} likes`}
          aria-pressed={liked}
          className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-base font-medium transition-colors sm:w-fit sm:justify-start ${
            liked
              ? 'border-[#12B279] bg-[#DCFCE7] text-[#12B279] hover:bg-[#BBF7D0]'
              : 'border-[#26231E] bg-white text-[#26231E] hover:bg-[#FAFAF9]'
          }`}
        >
          <LikeIcon />
          {likeCount}
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#26231E] bg-white px-4 py-2.5 text-sm font-medium text-[#26231E] transition-colors hover:bg-[#FAFAF9] sm:flex-none"
          >
            <Copy size={16} />
            Copy link
          </button>

          <button
            type="button"
            aria-label="Share on Facebook"
            onClick={() => handleShare('facebook')}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1877F2] text-white transition-opacity hover:opacity-85"
          >
            <FacebookIcon />
          </button>

          <button
            type="button"
            aria-label="Share on LinkedIn"
            onClick={() => handleShare('linkedin')}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#0A66C2] text-white transition-opacity hover:opacity-85"
          >
            <LinkedInIcon />
          </button>

          <button
            type="button"
            aria-label="Share on X"
            onClick={() => handleShare('twitter')}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#000000] text-white transition-opacity hover:opacity-85"
          >
            <XIcon />
          </button>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-[#26231E]">Comment</h2>
        <div className="rounded-xl border border-[#DAD6D1] bg-white p-4 sm:relative sm:pb-16">
          <textarea
            placeholder="What are your thoughts?"
            value={commentText}
            readOnly={!loggedIn}
            onChange={(event) => setCommentText(event.target.value)}
            onFocus={handleCommentInteraction}
            onClick={handleCommentInteraction}
            className="min-h-[120px] w-full resize-none bg-transparent text-base text-[#26231E] outline-none placeholder:text-[#75716B]"
          />
          <button
            type="button"
            onClick={handleSend}
            className="mt-4 cursor-pointer rounded-full border border-[#26231E] bg-[#26231E] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 sm:absolute sm:right-4 sm:bottom-4 sm:mt-0"
          >
            Send
          </button>
        </div>
      </section>

      <section className="mt-8">
        <ul className="flex flex-col">
          {comments.map((comment, index) => (
            <li
              key={comment.id}
              className={
                index < comments.length - 1
                  ? 'border-b border-[#DAD6D1] py-6 first:pt-0'
                  : 'py-6 first:pt-0'
              }
            >
              <div className="flex gap-3">
                <img
                  src={comment.avatar}
                  alt={comment.author}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
                <div className="flex flex-col gap-2">
                  <div>
                    <p className="text-base font-bold text-[#26231E]">
                      {comment.author}
                    </p>
                    <p className="text-sm text-[#75716B]">{comment.date}</p>
                  </div>
                  <p className="text-base leading-[165%] text-[#43403B]">
                    {comment.content}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="max-w-md rounded-2xl border-none p-8 shadow-lg ring-0">
          <button
            type="button"
            onClick={() => setDialogOpen(false)}
            aria-label="Close dialog"
            className="absolute top-4 right-4 cursor-pointer text-[#75716B] transition-colors hover:text-[#26231E]"
          >
            <X size={20} />
          </button>

          <AlertDialogHeader className="place-items-center text-center">
            <AlertDialogTitle className="text-2xl font-bold text-[#26231E]">
              Create an account to continue
            </AlertDialogTitle>
          </AlertDialogHeader>

          <button
            type="button"
            onClick={goToSignUp}
            className="mt-2 w-full cursor-pointer rounded-full border border-[#26231E] bg-[#26231E] px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-85"
          >
            Create account
          </button>

          <p className="text-center text-sm text-[#75716B]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={goToLogin}
              className="cursor-pointer font-medium text-[#26231E] underline underline-offset-2"
            >
              Log in
            </button>
          </p>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
