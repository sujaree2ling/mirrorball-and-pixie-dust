import { Footer } from '@/components/Footer'
import { NavBar } from '@/components/NavBar'

export function AuthLayout({ children, activePage }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F9F8F6]">
      <NavBar activePage={activePage} variant="auth" />

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10 lg:px-8 lg:py-16">
        <div className="w-full max-w-[520px] rounded-2xl bg-[#EFEEEB] px-8 py-10 lg:max-w-[560px] lg:px-14 lg:py-16">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  )
}
