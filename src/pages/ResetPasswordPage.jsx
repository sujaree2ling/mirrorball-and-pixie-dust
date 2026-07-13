import { useState } from 'react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { FormField } from '@/components/FormField'
import { AdminPanelLayout } from '@/components/AdminPanelLayout'
import { resetUserPassword } from '@/lib/auth'

export function ResetPasswordPage() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }))
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!form.currentPassword) {
      nextErrors.currentPassword = 'Current password is required'
    }

    if (!form.newPassword) {
      nextErrors.newPassword = 'New password is required'
    } else if (form.newPassword.length < 8) {
      nextErrors.newPassword = 'Password must be at least 8 characters'
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your new password'
    } else if (form.confirmPassword !== form.newPassword) {
      nextErrors.confirmPassword = 'Passwords do not match'
    }

    return nextErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setShowConfirm(true)
  }

  const handleConfirmReset = () => {
    setIsSubmitting(true)

    try {
      resetUserPassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })

      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowConfirm(false)

      toast.success('Password reset', {
        description: 'Your password has been successfully updated.',
      })
    } catch (error) {
      setShowConfirm(false)

      if (error.message === 'Current password is incorrect') {
        setErrors({ currentPassword: 'Current password is incorrect' })
      } else {
        setErrors({ form: 'Something went wrong. Please try again.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminPanelLayout title="Reset password" activePage="/reset-password">
      <div className="max-w-[520px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          <FormField
            id="currentPassword"
            name="currentPassword"
            type="password"
            label="Current password"
            value={form.currentPassword}
            onChange={handleChange}
            error={errors.currentPassword}
            placeholder="Current password"
            size="admin"
          />

          <FormField
            id="newPassword"
            name="newPassword"
            type="password"
            label="New password"
            value={form.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            placeholder="New password"
            size="admin"
          />

          <FormField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm new password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Confirm new password"
            size="admin"
          />

          {errors.form && (
            <p className="text-sm text-[#EB5164]">{errors.form}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 w-fit cursor-pointer rounded-full border border-[#26231E] bg-[#26231E] px-6 py-2 text-[15px] font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Reset password
          </button>
        </form>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="max-w-[400px] rounded-2xl border border-[#DAD6D1] bg-white p-8">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="text-xl font-bold text-[#26231E]">
              Reset password
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-[#75716B]">
              Do you want to reset your password?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-3 border-none bg-transparent p-0 sm:justify-end">
            <AlertDialogCancel className="cursor-pointer rounded-full border border-[#26231E] bg-white px-6 py-2.5 text-[15px] font-medium text-[#26231E] hover:bg-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReset}
              className="cursor-pointer rounded-full border border-[#26231E] bg-[#26231E] px-6 py-2.5 text-[15px] font-medium text-white hover:bg-[#26231E]"
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPanelLayout>
  )
}
