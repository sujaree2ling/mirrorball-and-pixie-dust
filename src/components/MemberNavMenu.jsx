import { Link, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, LogOut, RotateCcw, User } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getCurrentUser, logoutUser } from '@/lib/auth'

export function MemberNavMenu({ user, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    onLogout?.()
    navigate('/')
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label="Notifications"
        className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#DAD6D1] bg-white text-[#26231E] transition-opacity hover:opacity-80"
      >
        <Bell size={18} strokeWidth={1.75} />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#EB5164]" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger
          type="button"
          className="flex cursor-pointer items-center gap-2 rounded-full outline-none"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="hidden text-base font-medium text-[#26231E] sm:inline">
            {user.name}
          </span>
          <ChevronDown size={16} className="hidden text-[#75716B] sm:block" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={12}
          className="min-w-[220px] rounded-xl border border-[#DAD6D1] bg-white p-2 shadow-md"
        >
          <DropdownMenuItem asChild>
            <Link
              to="/profile"
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-base text-[#26231E] no-underline focus:bg-[#EFEEEB]"
            >
              <User size={18} strokeWidth={1.75} />
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 bg-[#DAD6D1]" />

          <DropdownMenuItem asChild>
            <Link
              to="/reset-password"
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-base text-[#26231E] no-underline focus:bg-[#EFEEEB]"
            >
              <RotateCcw size={18} strokeWidth={1.75} />
              Reset password
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 bg-[#DAD6D1]" />

          <DropdownMenuItem
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-base text-[#26231E] focus:bg-[#EFEEEB]"
          >
            <LogOut size={18} strokeWidth={1.75} />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function getMemberFromStorage() {
  return getCurrentUser()
}
