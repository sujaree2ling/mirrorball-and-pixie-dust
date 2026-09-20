import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'

export function AdminOnlyPage() {
  return (
    <>
      <NavBar />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <ShieldAlert size={48} strokeWidth={1.5} className="text-[#26231E]" />
        <h1 className="text-2xl font-bold text-[#26231E]">Admin only</h1>
        <p className="max-w-md text-base text-[#75716B]">
          This page is available to administrators only. Please sign in with an
          admin account to continue.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex rounded-full border border-[#26231E] bg-[#26231E] px-8 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-85"
          >
            Go to Homepage
          </Link>
          <Link
            to="/login"
            className="inline-flex rounded-full border border-[#26231E] bg-white px-8 py-3 text-[15px] font-medium text-[#26231E] transition-opacity hover:opacity-85"
          >
            Log in
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
