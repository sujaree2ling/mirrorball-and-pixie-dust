import { Link } from 'react-router-dom'
import { CircleAlert } from 'lucide-react'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'

export function NotFoundPage() {
  return (
    <>
      <NavBar />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <CircleAlert
          size={48}
          strokeWidth={1.5}
          className="text-[#26231E]"
          aria-hidden
        />
        <h1 className="text-2xl font-bold text-[#26231E]">Page Not Found</h1>
        <Link
          to="/"
          className="mt-2 inline-flex rounded-full border border-[#26231E] bg-[#26231E] px-8 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-85"
        >
          Go To Homepage
        </Link>
      </main>
      <Footer />
    </>
  )
}
