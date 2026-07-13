import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

import {
  MemberMobileMenuPanel,
  MemberNavMenu,
  getMemberFromStorage,
} from '@/components/MemberNavMenu'
import { logoutUser } from '@/lib/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function NavBar({ activePage, variant = 'default' }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [member, setMember] = useState(() => getMemberFromStorage())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMember(getMemberFromStorage())
  }, [location.pathname, location.state])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const loginIsActive = activePage === 'login'
  const signUpIsActive = activePage === 'signup' || !activePage

  const headerClassName = cn(
    'border-b border-[#DAD6D1]',
    variant === 'auth' ? 'bg-[#F9F8F6]' : 'bg-white',
  )

  const loginClassName = cn(
    'cursor-pointer rounded-full px-6 py-2.5 text-[15px] font-medium no-underline transition-colors',
    loginIsActive
      ? 'border border-[#26231E] bg-[#26231E] text-white hover:opacity-85'
      : 'border border-[#DAD6D1] bg-transparent text-[#26231E] hover:border-[#26231E]',
  )

  const signUpClassName = cn(
    'cursor-pointer rounded-full px-6 py-2.5 text-[15px] font-medium no-underline transition-colors',
    signUpIsActive
      ? 'border border-[#26231E] bg-[#26231E] text-white hover:opacity-85'
      : 'border border-[#DAD6D1] bg-transparent text-[#26231E] hover:border-[#26231E]',
  )

  const handleLogout = () => {
    logoutUser()
    setMember(null)
    setMobileMenuOpen(false)
    navigate('/')
  }

  return (
    <header className={headerClassName}>
      <nav className="flex items-center justify-between px-6 py-4 lg:px-30 lg:py-5">
        <Link
          to="/"
          className="text-2xl font-bold tracking-[-0.5px] text-[#26231E] no-underline"
        >
          hh<span className="text-[#12B279]">.</span>
        </Link>

        {member ? (
          <>
            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex cursor-pointer items-center justify-center text-[#26231E] outline-none lg:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <MemberNavMenu user={member} onLogout={() => setMember(null)} />
          </>
        ) : (
          <>
            <div className="hidden items-center gap-3 lg:flex lg:pr-5">
              <Link to="/login" className={loginClassName}>
                Log in
              </Link>
              <Link to="/signup" className={signUpClassName}>
                Sign up
              </Link>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                type="button"
                aria-label="Open menu"
                className="flex cursor-pointer items-center justify-center text-[#26231E] outline-none lg:hidden"
              >
                <Menu size={24} />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={12}
                className="flex w-[calc(100vw-3rem)] flex-col gap-3 border-none bg-white p-0 shadow-none ring-0"
              >
                <DropdownMenuItem asChild>
                  <Link
                    to="/login"
                    className={cn(
                      'cursor-pointer justify-center rounded-full px-[18px] py-3 text-sm font-medium no-underline focus:bg-transparent',
                      loginIsActive
                        ? 'border border-[#26231E] bg-[#26231E] text-white focus:bg-[#26231E] focus:text-white'
                        : 'border border-[#DAD6D1] bg-transparent text-[#26231E]',
                    )}
                  >
                    Log in
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/signup"
                    className={cn(
                      'cursor-pointer justify-center rounded-full px-[18px] py-3 text-sm font-medium no-underline focus:bg-transparent',
                      signUpIsActive
                        ? 'border border-[#26231E] bg-[#26231E] text-white focus:bg-[#26231E] focus:text-white'
                        : 'border border-[#DAD6D1] bg-transparent text-[#26231E]',
                    )}
                  >
                    Sign up
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </nav>

      {member && mobileMenuOpen && (
        <MemberMobileMenuPanel
          user={member}
          onLogout={handleLogout}
          onNavigate={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  )
}
