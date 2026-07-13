import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  Bell,
  ExternalLink,
  FileText,
  FolderOpen,
  KeyRound,
  LogOut,
  User,
} from 'lucide-react'

import { getCurrentUser, logoutUser } from '@/lib/auth'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/admin', label: 'Article management', icon: FileText },
  { to: '/admin/category', label: 'Category management', icon: FolderOpen },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/admin/notification', label: 'Notification', icon: Bell },
  { to: '/reset-password', label: 'Reset password', icon: KeyRound },
]

export function AdminPanelLayout({ title, activePage, headerAction, children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(() => getCurrentUser())

  useEffect(() => {
    setUser(getCurrentUser())
  }, [location.pathname, location.state])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen w-full bg-white">
      <aside className="flex w-[260px] shrink-0 flex-col bg-[#EAE7E2] py-8">
        <div className="mb-8 flex flex-col gap-1 px-8">
          <Link
            to="/"
            className="text-2xl font-bold leading-none tracking-[-0.5px] text-[#26231E] no-underline"
          >
            hh<span className="text-[#12B279]">.</span>
          </Link>
          <span className="text-base font-bold text-[#F2B68C]">Admin panel</span>
        </div>

        <nav className="flex flex-1 flex-col">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = activePage === to

            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-3 px-8 py-3 text-[15px] font-medium no-underline transition-colors',
                  isActive
                    ? 'bg-[#DAD6D1] text-[#26231E]'
                    : 'text-[#75716B] hover:bg-[#DAD6D1]/40 hover:text-[#26231E]',
                )}
              >
                <Icon size={18} strokeWidth={1.75} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 flex flex-col">
          <Link
            to="/"
            className="flex items-center gap-3 px-8 py-3 text-[15px] font-medium text-[#75716B] no-underline transition-colors hover:bg-[#DAD6D1]/40 hover:text-[#26231E]"
          >
            <ExternalLink size={18} strokeWidth={1.75} />
            hh. website
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-3 px-8 py-3 text-left text-[15px] font-medium text-[#75716B] transition-colors hover:bg-[#DAD6D1]/40 hover:text-[#26231E]"
          >
            <LogOut size={18} strokeWidth={1.75} />
            Log out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 bg-white px-12 py-8">
        <div className="flex items-center justify-between gap-4 border-b border-[#DAD6D1] pb-6">
          <h1 className="text-2xl font-bold text-[#26231E]">{title}</h1>
          {headerAction}
        </div>

        <div className="pt-8">{children}</div>
      </main>
    </div>
  )
}
