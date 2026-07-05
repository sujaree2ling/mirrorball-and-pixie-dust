import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { loginUser, saveToken } from '@/lib/auth'
import { AuthLayout } from '@/components/AuthLayout'
import { FormField } from '@/components/FormField'
import {
  LOGIN_ERROR_DESCRIPTION,
  LOGIN_ERROR_TITLE,
  mapLoginApiError,
  validateLogin,
} from '@/lib/validateAuth'

function showLoginErrorToast() {
  toast.custom(
    (t) => (
      <div className="flex w-full max-w-[400px] items-start gap-3 rounded-lg bg-[#EB5164] p-4 text-white shadow-md">
        <div className="flex-1">
          <p className="font-semibold leading-snug">{LOGIN_ERROR_TITLE}</p>
          <p className="mt-1 text-sm text-white/90">{LOGIN_ERROR_DESCRIPTION}</p>
        </div>
        <button
          type="button"
          onClick={() => toast.dismiss(t)}
          aria-label="Dismiss"
          className="shrink-0 cursor-pointer text-lg leading-none text-white/90 hover:text-white"
        >
          ×
        </button>
      </div>
    ),
    { position: 'bottom-right', duration: 5000 },
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasFormError = Boolean(errors.form)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationErrors = validateLogin(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const data = loginUser(form)
      saveToken(data.access_token)
      navigate('/')
    } catch {
      setErrors(mapLoginApiError())
      showLoginErrorToast()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout activePage="login">
      <h1 className="mb-10 text-center text-[32px] font-bold leading-tight text-[#26231E]">
        Log in
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <FormField
          id="email"
          name="email"
          type="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          invalid={Boolean(errors.email || hasFormError)}
          placeholder="Email"
        />

        <FormField
          id="password"
          name="password"
          type="password"
          label="Password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          invalid={Boolean(errors.password || hasFormError)}
          placeholder="Password"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="mx-auto mt-2 min-w-[140px] cursor-pointer rounded-full border border-[#26231E] bg-[#26231E] px-12 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-[#75716B]">
        Don&apos;t have any account?{' '}
        <Link
          to="/signup"
          className="font-medium text-[#26231E] underline underline-offset-2"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
