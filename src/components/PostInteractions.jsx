import { useState } from 'react'
import { Copy, X } from 'lucide-react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const IS_LOGGED_IN = false

const comments = [
  {
    id: 1,
    author: 'Jacob Lash',
    avatar: '/author-icon.jpg',
    date: '12 September 2024 at 18:30',
    content:
      'I loved this article! It really captures how independent yet loving cats can be. The purring section was super interesting.',
  },
  {
    id: 2,
    author: 'Ahri',
    avatar: '/author-icon.jpg',
    date: '12 September 2024 at 18:30',
    content:
      "Such a great read. I've always wondered how cat slow blinks work as a sign of trust — this explained it perfectly.",
  },
  {
    id: 3,
    author: 'Mimi mama',
    avatar: '/author-icon.jpg',
    date: '12 September 2024 at 18:30',
    content:
      'Appreciated the section on cat purring and how it could help with healing. Definitely sharing this with friends who have cats!',
  },
]

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

function TwitterIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function FacebookIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 8.5V6.75c0-.69.56-1.25 1.25-1.25H17V2.5h-2.75c-2.07 0-3.75 1.68-3.75 3.75V8.5H8.5v3h2V21h3.5v-9.5h2.38L17 8.5h-3z" />
    </svg>
  )
}

function LinkedInIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.5 8.5h3v10h-3v-10zm1.5-4.5a1.75 1.75 0 110 3.5 1.75 1.75 0 010-3.5zM10 8.5h2.88v1.36h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59V18.5h-3v-4.86c0-1.16-.02-2.65-1.62-2.65-1.76 0-2.03 1.37-2.03 2.79v4.72H10V8.5z" />
    </svg>
  )
}

export function PostInteractions({ likes = 0 }) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const requireLogin = () => {
    if (!IS_LOGGED_IN) {
      setDialogOpen(true)
      return true
    }
    return false
  }

  const handleLike = () => {
    requireLogin()
  }

  const handleCommentInteraction = () => {
    requireLogin()
  }

  const handleSend = () => {
    requireLogin()
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

  return (
    <div className="mb-12 border-t border-[#DAD6D1] pt-10">
      <div className="flex flex-col gap-4 rounded-xl bg-[#EFEEEB] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <button
          type="button"
          onClick={handleLike}
          aria-label={`Like post, ${likes} likes`}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[#26231E] bg-white px-5 py-2.5 text-base font-medium text-[#26231E] transition-colors hover:bg-[#FAFAF9] sm:w-fit sm:justify-start"
        >
          <LikeIcon />
          {likes}
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#26231E] bg-white px-4 py-2.5 text-sm font-medium text-[#26231E] transition-colors hover:bg-[#FAFAF9] sm:flex-none"
          >
            <Copy size={16} />
            <span className="sm:hidden">Copy link</span>
            <span className="hidden sm:inline">Copy</span>
          </button>

          <button
            type="button"
            aria-label="Share on Facebook"
            onClick={() => handleShare('facebook')}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1877F2] text-white transition-opacity hover:opacity-85 sm:border sm:border-[#26231E] sm:bg-white sm:text-[#26231E] sm:hover:bg-[#FAFAF9]"
          >
            <FacebookIcon size={16} />
          </button>

          <button
            type="button"
            aria-label="Share on LinkedIn"
            onClick={() => handleShare('linkedin')}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#0A66C2] text-white transition-opacity hover:opacity-85 sm:border sm:border-[#26231E] sm:bg-white sm:text-[#26231E] sm:hover:bg-[#FAFAF9]"
          >
            <LinkedInIcon size={16} />
          </button>

          <button
            type="button"
            aria-label="Share on X"
            onClick={() => handleShare('twitter')}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1DA1F2] text-white transition-opacity hover:opacity-85 sm:border sm:border-[#26231E] sm:bg-white sm:text-[#26231E] sm:hover:bg-[#FAFAF9]"
          >
            <TwitterIcon size={14} />
          </button>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-[#26231E]">Comment</h2>
        <div className="rounded-xl border border-[#DAD6D1] bg-white p-4 sm:relative sm:pb-16">
          <textarea
            placeholder="What are your thoughts?"
            readOnly={!IS_LOGGED_IN}
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
            onClick={() => setDialogOpen(false)}
            className="mt-2 w-full cursor-pointer rounded-full border border-[#26231E] bg-[#26231E] px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-85"
          >
            Create account
          </button>

          <p className="text-center text-sm text-[#75716B]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setDialogOpen(false)}
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
