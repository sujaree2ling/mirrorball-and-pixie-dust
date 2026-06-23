import { useState } from 'react'

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex cursor-pointer items-center justify-center text-[#26231E] lg:hidden"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>

      {isMenuOpen && (
        <div className="flex flex-col gap-3 px-6 pb-4 lg:hidden">
          <button
            type="button"
            className="w-full cursor-pointer rounded-full border border-[#DAD6D1] bg-transparent px-[18px] py-3 text-sm font-medium text-[#26231E] transition-colors hover:border-[#26231E]"
          >
            Log in
          </button>
          <button
            type="button"
            className="w-full cursor-pointer rounded-full border border-[#26231E] bg-[#26231E] px-[18px] py-3 text-sm font-medium text-white transition-opacity hover:opacity-85"
          >
            Sign up
          </button>
        </div>
      )}
    </header>
  )
}