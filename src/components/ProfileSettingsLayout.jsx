import { Link, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { RotateCcw, User } from 'lucide-react'

import { Footer } from '@/components/Footer'
import { NavBar } from '@/components/NavBar'
import { getCurrentUser } from '@/lib/auth'
import { cn } from '@/lib/utils'

const sidebarLinks = [
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/reset-password', label: 'Reset password', icon: RotateCcw },
]

export function ProfileSettingsLayout({ title, activePage, children }) {
  const location = useLocation()
  const [user, setUser] = useState(() => getCurrentUser())

  useEffect(() => {
    setUser(getCurrentUser())
  }, [location.pathname, location.state])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F9F8F6]">
      <NavBar />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-10 lg:px-8 lg:py-12">
        <div className="mb-10 flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-14 w-14 rounded-full object-cover"
          />
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-[#26231E]">{user.name}</span>
            <span className="h-6 w-px bg-[#DAD6D1]" aria-hidden />
            <h1 className="text-2xl font-bold text-[#26231E]">{title}</h1>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
          <aside className="flex shrink-0 flex-col gap-4 lg:w-[200px]">
            {sidebarLinks.map(({ to, label, icon: Icon }) => {
              const isActive = activePage === to

              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    'flex items-center gap-3 text-base font-medium no-underline transition-colors',
                    isActive ? 'text-[#26231E]' : 'text-[#75716B] hover:text-[#26231E]',
                  )}
                >
                  <Icon size={18} strokeWidth={1.75} />
                  {label}
                </Link>
              )
            })}
          </aside>

          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
