import { NavBar } from './components/NavBar'
import { HeroSection } from './components/HeroSection'
import { Footer } from './components/Footer'
import { ArticleSection } from './components/ArticleSection'

function App() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <NavBar />
      <HeroSection />
      <ArticleSection />
      <Footer />
    </div>
  )
}

export default App
