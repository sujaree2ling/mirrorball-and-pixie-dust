import { useState } from 'react'
import { Mails, Globe, Send } from 'lucide-react'

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

export function HeroSection() {
  return (
    <section className="grid grid-cols-1 items-center gap-8 px-6 py-8 text-center lg:grid-cols-3 lg:gap-12 lg:px-20 lg:py-16 lg:text-left">
      <div className="text-center lg:text-right">
        <h1 className="mb-6 text-5xl font-bold leading-[108%] tracking-[-1.5px] text-[#26231E]">
          Stay{' '}
          <br className="hidden lg:block" />
          Informed,
          <br />
          Stay Inspired
        </h1>
        <p className="text-base leading-[155%] text-[#75716B]">
          Discover a World of Knowledge at Your Fingertips. Your Daily Dose of
          Inspiration and Information.
        </p>
      </div>

      <div>
        <img
          src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
          alt="A man with a cat on his shoulder outdoors"
          className="mx-auto block aspect-386/529 w-full rounded-2xl object-cover lg:aspect-auto lg:h-[529px] lg:w-[386px]"
        />
      </div>

      <div className="text-left">
        <p className="mb-2 text-sm text-[#75716B]">- Author</p>
        <p className="mb-5 text-2xl font-bold text-[#26231E]">Thompson P.</p>
        <p className="mb-4 text-[15px] leading-[165%] text-[#75716B]">
          I am a pet enthusiast and freelance writer who specializes in animal
          behavior and care. With a deep love for cats, I enjoy sharing insights
          on feline companionship and wellness.
        </p>
        <p className="text-[15px] leading-[165%] text-[#75716B]">
          When I'm not writing, I spend time volunteering at my local animal
          shelter, helping cats find loving homes.
        </p>
      </div>
    </section>
  )
}

export function Footer() {
  const socials = [
    { label: 'Email', href: 'mailto:hello@example.com', Icon: Mails },
    { label: 'Website', href: '#', Icon: Globe },
    { label: 'Message', href: '#', Icon: Send },
  ]

  return (
    <footer className="mt-auto border-t border-[#DAD6D1] bg-[#EFEEEB]">
      <div className="flex flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row lg:px-30">
        <div className="flex items-center gap-4">
          <span className="text-base font-medium text-[#26231E]">
            Get in touch
          </span>
          <div className="flex items-center gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-[#26231E] text-white transition-opacity hover:opacity-80"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        <a
          href="/"
          className="text-base font-medium text-[#26231E] underline underline-offset-2 hover:opacity-80"
        >
          Home page
        </a>
      </div>
    </footer>
  )
}
