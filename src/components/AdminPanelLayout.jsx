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

import { NavBar } from '@/components/NavBar'
import { getCurrentUser, logoutUser } from '@/lib/auth'
import { cn } from '@/lib/utils'

const adminNavLinks = [
  { to: '/admin', label: 'Article management', icon: FileText },
  { to: '/admin/category', label: 'Category management', icon: FolderOpen },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/admin/notification', label: 'Notification', icon: Bell },
  { to: '/reset-password', label: 'Reset password', icon: KeyRound },
]

const settingsTabs = [
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/reset-password', label: 'Reset password', icon: KeyRound },
]

function SettingsTabs({ activePage }) {
  return (
    <div className="flex border-b border-[#DAD6D1] bg-white">
      {settingsTabs.map(({ to, label, icon: Icon }) => {
        const isActive = activePage === to

        return (
          <Link
            key={to}
            to={to}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3.5 text-sm font-medium no-underline transition-colors',
              isActive
                ? 'border-[#26231E] text-[#26231E]'
                : 'border-transparent text-[#75716B]',
            )}
          >
            <Icon size={16} strokeWidth={1.75} />
            {label}
          </Link>
        )
      })}
    </div>
  )
}

function UserPageHeader({ user, title }) {
  return (
    <div className="flex items-center gap-3 border-b border-[#DAD6D1] bg-white px-6 py-5">
      <img
        src={user.avatar}
        alt={user.name}
        className="h-12 w-12 shrink-0 rounded-full object-cover"
      />
      <div className="flex min-w-0 items-center gap-3">
        <span className="truncate text-base font-medium text-[#26231E]">{user.name}</span>
        <span className="h-5 w-px shrink-0 bg-[#DAD6D1]" aria-hidden />
        <h1 className="truncate text-base font-bold text-[#26231E]">{title}</h1>
      </div>
    </div>
  )
}

function AdminSidebar({ activePage, onLogout }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 flex-col bg-[#EAE7E2] lg:flex">
      <div className="flex flex-col gap-0.5 px-6 pt-8 pb-6">
        <Link
          to="/"
          className="text-[22px] font-bold leading-none tracking-[-0.5px] text-[#26231E] no-underline"
        >
          hh<span className="text-[#12B279]">.</span>
        </Link>
        <span className="text-sm font-bold text-[#F2B68C]">Admin panel</span>
      </div>

      <nav className="flex flex-1 flex-col">
        {adminNavLinks.map(({ to, label, icon: Icon }) => {
          const isActive = activePage === to

          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex w-full items-center gap-3 px-6 py-3 text-sm font-medium no-underline transition-colors',
                isActive
                  ? 'bg-[#DAD6D1] font-semibold text-[#26231E]'
                  : 'text-[#75716B] hover:bg-[#DAD6D1]/40 hover:text-[#26231E]',
              )}
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto flex flex-col pb-8">
        <Link
          to="/"
          className="flex w-full items-center gap-3 px-6 py-3 text-sm font-medium text-[#75716B] no-underline transition-colors hover:bg-[#DAD6D1]/40 hover:text-[#26231E]"
        >
          <ExternalLink size={16} strokeWidth={1.75} />
          hh. website
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full cursor-pointer items-center gap-3 px-6 py-3 text-left text-sm font-medium text-[#75716B] transition-colors hover:bg-[#DAD6D1]/40 hover:text-[#26231E]"
        >
          <LogOut size={16} strokeWidth={1.75} />
          Log out
        </button>
      </div>
    </aside>
  )
}

export function AdminPanelLayout({
  title,
  activePage,
  variant = 'admin',
  headerAction,
  children,
}) {
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

  const isSettings = variant === 'settings'

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F9F8F6] lg:bg-white">
      <div className="lg:hidden">
        <NavBar />
        {isSettings && <SettingsTabs activePage={activePage} />}
        {isSettings && <UserPageHeader user={user} title={title} />}
      </div>

      <div className="flex min-h-0 flex-1">
        <AdminSidebar activePage={activePage} onLogout={handleLogout} />

        <main className="min-w-0 flex-1 bg-[#F9F8F6] lg:bg-white">
          <div className="hidden items-center justify-between gap-4 border-b border-[#DAD6D1] px-12 py-8 lg:flex">
            <h1 className="text-2xl font-bold text-[#26231E]">{title}</h1>
            {headerAction}
          </div>

          {!isSettings && (
            <h1 className="px-6 pt-6 text-xl font-bold text-[#26231E] lg:hidden">{title}</h1>
          )}

          <div
            className={cn(
              isSettings ? 'px-4 py-6 lg:px-12 lg:py-8' : 'px-6 py-6 lg:px-12 lg:pt-8',
            )}
          >
            <div
              className={cn(
                isSettings &&
                  'rounded-2xl bg-[#EFEEEB] px-6 py-8 lg:rounded-none lg:bg-transparent lg:px-0 lg:py-0',
              )}
            >
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
