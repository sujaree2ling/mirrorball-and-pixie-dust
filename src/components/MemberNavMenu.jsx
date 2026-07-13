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

const notifications = [
  {
    id: 1,
    author: 'Thompson P.',
    avatar: '/author-icon.jpg',
    message: 'Published new article.',
    time: '2 hours ago',
  },
  {
    id: 2,
    author: 'Jacob Lash',
    avatar: '/author-icon.jpg',
    message: 'Comment on the article you have commented on.',
    time: '12 September 2024 at 18:30',
  },
]

export function MemberNavMenu({ user, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    onLogout?.()
    navigate('/')
  }

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger
          type="button"
          aria-label="Notifications"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#DAD6D1] bg-white text-[#26231E] outline-none transition-opacity hover:opacity-80"
        >
          <Bell size={18} strokeWidth={1.75} />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={12}
          className="w-[min(100vw-2rem,400px)] rounded-xl border border-[#DAD6D1] bg-white p-2 shadow-md"
        >
          {notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="cursor-pointer rounded-lg p-3 focus:bg-[#EFEEEB]"
            >
              <div className="flex w-full gap-3">
                <img
                  src={notification.avatar}
                  alt={notification.author}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug text-[#26231E]">
                    <span className="font-semibold">{notification.author}</span>{' '}
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-[#F2B68C]">{notification.time}</p>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

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
