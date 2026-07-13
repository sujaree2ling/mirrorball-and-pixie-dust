import { Navigate } from 'react-router-dom'

import { Footer } from '@/components/Footer'
import { NavBar } from '@/components/NavBar'
import { getCurrentUser } from '@/lib/auth'

export function AdminPage() {
  const user = getCurrentUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F9F8F6]">
      <NavBar />

      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center px-6 py-16">
        <h1 className="text-3xl font-bold text-[#26231E]">Admin panel</h1>
        <p className="mt-3 text-base text-[#75716B]">
          Welcome, {user.name}
        </p>
      </main>

      <Footer />
    </div>
  )
}
