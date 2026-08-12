import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'

import { registerUser } from '@/lib/auth'
import { AuthLayout } from '@/components/AuthLayout'
import { FormField } from '@/components/FormField'
import {
  mapRegisterApiError,
  validateSignUp,
} from '@/lib/validateAuth'

export function SignUpPage() {
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationErrors = validateSignUp(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    try {
      await registerUser(form)
      setIsSuccess(true)
    } catch (error) {
      setErrors(mapRegisterApiError(error.message))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <AuthLayout activePage="signup">
        <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
          <div
            className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#12B279]"
            aria-hidden
          >
            <Check className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>

          <h1 className="mb-10 text-[32px] font-bold leading-tight text-[#26231E]">
            Registration success
          </h1>

          <Link
            to="/login"
            className="inline-flex min-w-[140px] items-center justify-center rounded-full border border-[#26231E] bg-[#26231E] px-12 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-85"
          >
            Continue
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout activePage="signup">
      <h1 className="mb-10 text-center text-[32px] font-bold leading-tight text-[#26231E]">
        Sign up
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <FormField
          id="name"
          name="name"
          label="Name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Full name"
        />

        <FormField
          id="username"
          name="username"
          label="Username"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
          placeholder="Username"
        />

        <FormField
          id="email"
          name="email"
          type="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="email"
        />

        <FormField
          id="password"
          name="password"
          type="password"
          label="Password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Password"
        />

        {errors.form && (
          <p className="text-sm text-[#EB5164]">{errors.form}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mx-auto mt-2 min-w-[140px] cursor-pointer rounded-full border border-[#26231E] bg-[#26231E] px-12 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Signing up...' : 'Sign up'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-[#75716B]">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-[#26231E] underline underline-offset-2"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
