import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { AdminPanelLayout } from '@/components/AdminPanelLayout'
import { FormField } from '@/components/FormField'
import { getCurrentUser, updateUserProfile } from '@/lib/auth'
import { cn } from '@/lib/utils'

const BIO_MAX_LENGTH = 120

export function ProfilePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const currentUser = getCurrentUser()

  const [form, setForm] = useState({
    name: currentUser?.name ?? '',
    username: currentUser?.username ?? '',
    email: currentUser?.email ?? '',
    bio: currentUser?.bio ?? '',
  })
  const [avatar, setAvatar] = useState(currentUser?.avatar ?? '/author-icon.jpg')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleBioChange = (event) => {
    const value = event.target.value.slice(0, BIO_MAX_LENGTH)
    setForm((prev) => ({ ...prev, bio: value }))
    setErrors((prev) => ({ ...prev, bio: undefined }))
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      if (!form.name.trim()) {
        setErrors({ name: 'Name is required' })
        return
      }

      if (!form.username.trim()) {
        setErrors({ username: 'Username is required' })
        return
      }

      updateUserProfile({
        name: form.name,
        username: form.username,
        avatar,
        bio: form.bio,
      })

      toast.success('Saved profile', {
        description: 'Your profile has been successfully updated.',
      })
      navigate('/profile', { replace: true, state: { updated: Date.now() } })
    } catch (error) {
      const message = error.message?.toLowerCase() ?? ''

      if (message.includes('username')) {
        setErrors({ username: 'Username is already taken, please try another username.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminPanelLayout
      title="Profile"
      activePage="/profile"
      headerAction={
        <button
          type="submit"
          form="profile-form"
          disabled={isSubmitting}
          className="cursor-pointer rounded-full border border-[#26231E] bg-[#26231E] px-6 py-2 text-[15px] font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      }
    >
      <form id="profile-form" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col items-start gap-5 border-b border-[#DAD6D1] pb-8 sm:flex-row sm:items-center">
          <img
            src={avatar}
            alt={form.name}
            className="h-24 w-24 rounded-full object-cover"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-full border border-[#26231E] bg-white px-5 py-2 text-[15px] font-medium text-[#26231E] transition-opacity hover:opacity-85"
          >
            Upload profile picture
          </button>
        </div>

        <div className="mt-8 max-w-[520px] flex flex-col gap-6">
          <FormField
            id="name"
            name="name"
            label="Name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            size="admin"
          />

          <FormField
            id="username"
            name="username"
            label="Username"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
            size="admin"
          />

          <FormField
            id="email"
            name="email"
            type="email"
            label="Email"
            value={form.email}
            readOnly
            size="admin"
          />
        </div>

        <div className="mt-6 flex w-full max-w-[calc(100%-1rem)] flex-col gap-1.5">
          <label htmlFor="bio" className="text-sm font-medium text-[#75716B]">
            Bio (max 120 letters)
          </label>
          <textarea
            id="bio"
            name="bio"
            value={form.bio}
            onChange={handleBioChange}
            maxLength={BIO_MAX_LENGTH}
            rows={5}
            className={cn(
              'w-full resize-y rounded-lg border bg-white px-3 py-3 text-[15px] leading-relaxed text-[#26231E] outline-none placeholder:text-[#75716B]/60 focus-visible:border-[#26231E]',
              errors.bio ? 'border-[#EB5164]' : 'border-[#DAD6D1]',
            )}
          />
          {errors.bio && <p className="text-sm text-[#EB5164]">{errors.bio}</p>}
        </div>
      </form>
    </AdminPanelLayout>
  )
}
