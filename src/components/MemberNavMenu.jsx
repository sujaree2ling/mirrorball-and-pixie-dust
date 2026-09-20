import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  ExternalLink,
  LogOut,
  RotateCcw,
  User,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getCurrentUser, logoutUser } from '@/lib/auth'
import { getAdminNotifications } from '@/lib/adminNotifications'
import { cn } from '@/lib/utils'

const notifications = [
  {
    id: 1,
    author: 'Thompson P.',
    avatar: '/icon.png',
    message: 'Published new article.',
    time: '2 hours ago',
    viewTo: '/post/1',
  },
  {
    id: 2,
    author: 'Jacob Lash',
    avatar: '/icon.png',
    message: 'Comment on the article you have commented on.',
    time: '12 September 2024 at 18:30',
    viewTo: '/post/1',
  },
]

function getDropdownNotifications(isAdmin) {
  if (!isAdmin) return notifications

  return getAdminNotifications().map((notification) => ({
    id: notification.id,
    author: notification.author,
    avatar: notification.avatar,
    message: notification.action.replace(/:$/, '.'),
    time: notification.time,
    viewTo: notification.viewTo,
  }))
}

function NotificationList({ items }) {
  const navigate = useNavigate()

  return (
    <>
      {items.map((notification) => (
        <DropdownMenuItem
          key={notification.id}
          className="cursor-pointer rounded-lg p-3 focus:bg-[#EFEEEB]"
          onSelect={() => {
            if (notification.viewTo) {
              navigate(notification.viewTo)
            }
          }}
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
    </>
  )
}

export function MemberNotificationMenu({ className, isAdmin = false }) {
  const items = getDropdownNotifications(isAdmin)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        aria-label="Notifications"
        className={cn(
          'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#DAD6D1] bg-white text-[#26231E] outline-none transition-opacity hover:opacity-80',
          className,
        )}
      >
        <Bell size={18} strokeWidth={1.75} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="w-[min(100vw-2rem,400px)] rounded-xl border border-[#DAD6D1] bg-white p-2 shadow-md"
      >
        <NotificationList items={items} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AccountMenuItems({
  onLogout,
  onItemClick,
  itemClassName,
  showAdminPanel = true,
}) {
  const linkProps = onItemClick ? { onClick: onItemClick } : {}

  return (
    <>
      <Link
        to="/profile"
        {...linkProps}
        className={cn(
          'flex items-center gap-3 text-base text-[#26231E] no-underline transition-colors hover:bg-[#EFEEEB]',
          itemClassName,
        )}
      >
        <User size={18} strokeWidth={1.75} />
        Profile
      </Link>

      <Link
        to="/reset-password"
        {...linkProps}
        className={cn(
          'flex items-center gap-3 text-base text-[#26231E] no-underline transition-colors hover:bg-[#EFEEEB]',
          itemClassName,
        )}
      >
        <RotateCcw size={18} strokeWidth={1.75} />
        Reset password
      </Link>

      {showAdminPanel && (
        <Link
          to="/admin"
          {...linkProps}
          className={cn(
            'flex items-center gap-3 text-base text-[#26231E] no-underline transition-colors hover:bg-[#EFEEEB]',
            itemClassName,
          )}
        >
          <ExternalLink size={18} strokeWidth={1.75} />
          Admin panel
        </Link>
      )}

      <div className="mx-6 my-1 h-px bg-[#DAD6D1]" />

      <button
        type="button"
        onClick={onLogout}
        className={cn(
          'flex w-full cursor-pointer items-center gap-3 text-left text-base text-[#26231E] transition-colors hover:bg-[#EFEEEB]',
          itemClassName,
        )}
      >
        <LogOut size={18} strokeWidth={1.75} />
        Log out
      </button>
    </>
  )
}

export function MemberMobileMenuPanel({
  user,
  onLogout,
  onNavigate,
  isAdmin = false,
}) {
  return (
    <div className="border-t border-[#DAD6D1] bg-white lg:hidden">
      <div className="flex items-center justify-between border-b border-[#DAD6D1] bg-[#F9F8F6] px-6 py-4">
        <Link
          to="/profile"
          onClick={onNavigate}
          className="flex min-w-0 flex-1 items-center gap-3 no-underline"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
          <span className="truncate text-base font-medium text-[#26231E]">{user.name}</span>
        </Link>

        <MemberNotificationMenu isAdmin={isAdmin} />
      </div>

      <nav>
        <AccountMenuItems
          onLogout={onLogout}
          onItemClick={onNavigate}
          showAdminPanel={isAdmin}
          itemClassName="px-6 py-4"
        />
      </nav>
    </div>
  )
}

export function MemberNavMenu({ user, onLogout, showAdminPanel = true }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    onLogout?.()
    navigate('/')
  }

  return (
    <div className="hidden items-center gap-3 lg:flex">
      <MemberNotificationMenu isAdmin={showAdminPanel} />

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
          <span className="text-base font-medium text-[#26231E]">{user.name}</span>
          <ChevronDown size={16} className="text-[#75716B]" />
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

          <DropdownMenuItem asChild>
            <Link
              to="/reset-password"
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-base text-[#26231E] no-underline focus:bg-[#EFEEEB]"
            >
              <RotateCcw size={18} strokeWidth={1.75} />
              Reset password
            </Link>
          </DropdownMenuItem>

          {showAdminPanel && (
            <DropdownMenuItem asChild>
              <Link
                to="/admin"
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-base text-[#26231E] no-underline focus:bg-[#EFEEEB]"
              >
                <ExternalLink size={18} strokeWidth={1.75} />
                Admin panel
              </Link>
            </DropdownMenuItem>
          )}

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
