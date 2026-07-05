import { Routes, Route } from 'react-router-dom'
import { NavBar } from './components/NavBar'
import { HeroSection } from './components/HeroSection'
import { Footer } from './components/Footer'
import { ArticleSection } from './components/ArticleSection'
import { ViewPostPage } from './pages/ViewPostPage'
import { NotFoundPage } from './pages/NotFoundPage'

function HomePage() {
  return (
    <>
      <NavBar />
      <HeroSection />
      <ArticleSection />
      <Footer />
    </>
  )
}

function App() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<ViewPostPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App
