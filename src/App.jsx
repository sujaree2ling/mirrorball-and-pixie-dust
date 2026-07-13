import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { NavBar } from './components/NavBar'
import { HeroSection } from './components/HeroSection'
import { Footer } from './components/Footer'
import { ArticleSection } from './components/ArticleSection'
import { ViewPostPage } from './pages/ViewPostPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { LoginPage } from './pages/LoginPage'
import { SignUpPage } from './pages/SignUpPage'
import { ProfilePage } from './pages/ProfilePage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { AdminPage } from './pages/AdminPage'
import { AdminCategoryPage } from './pages/AdminCategoryPage'
import { AdminCategoryFormPage } from './pages/AdminCategoryFormPage'
import { AdminNotificationPage } from './pages/AdminNotificationPage'
import { AdminArticleFormPage } from './pages/AdminArticleFormPage'

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
      <Toaster position="bottom-right" richColors closeButton />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/articles/create" element={<AdminArticleFormPage mode="create" />} />
        <Route path="/admin/articles/:id/edit" element={<AdminArticleFormPage mode="edit" />} />
        <Route path="/admin/category" element={<AdminCategoryPage />} />
        <Route path="/admin/category/create" element={<AdminCategoryFormPage mode="create" />} />
        <Route path="/admin/category/:id/edit" element={<AdminCategoryFormPage mode="edit" />} />
        <Route path="/admin/notification" element={<AdminNotificationPage />} />
        <Route path="/post/:id" element={<ViewPostPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App
