import { Mails, Globe, Send } from 'lucide-react'

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