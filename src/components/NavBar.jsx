import { Menu } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function NavBar() {
  return (
    <header className="border-b border-[#DAD6D1] bg-white">
      <nav className="flex items-center justify-between px-6 py-4 lg:px-30 lg:py-5">
        <a
          href="/"
          className="text-2xl font-bold tracking-[-0.5px] text-[#26231E] no-underline"
        >
          hh<span className="text-[#12B279]">.</span>
        </a>

        <div className="hidden items-center gap-3 lg:flex lg:pr-5">
          <button
            type="button"
            className="cursor-pointer rounded-full border border-[#DAD6D1] bg-transparent px-6 py-2.5 text-[15px] font-medium text-[#26231E] transition-colors hover:border-[#26231E]"
          >
            Log in
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-full border border-[#26231E] bg-[#26231E] px-6 py-2.5 text-[15px] font-medium text-white transition-opacity hover:opacity-85"
          >
            Sign up
          </button>
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
            <DropdownMenuItem className="cursor-pointer justify-center rounded-full border border-[#DAD6D1] bg-transparent px-[18px] py-3 text-sm font-medium text-[#26231E] focus:bg-transparent">
              Log in
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer justify-center rounded-full border border-[#26231E] bg-[#26231E] px-[18px] py-3 text-sm font-medium text-white focus:bg-[#26231E] focus:text-white">
              Sign up
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  )
}
