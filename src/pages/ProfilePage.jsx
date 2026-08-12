import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { AdminPanelLayout } from '@/components/AdminPanelLayout'
import { FormField } from '@/components/FormField'
import { getCurrentUser, updateUserProfile } from '@/lib/auth'
import { cn } from '@/lib/utils'

const BIO_MAX_LENGTH = 120

const saveButtonClassName =
  'cursor-pointer rounded-full border border-[#26231E] bg-[#26231E] px-6 py-2.5 text-[15px] font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60'

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
  const [avatar, setAvatar] = useState(currentUser?.avatar ?? '/icon.png')
  const [avatarFile, setAvatarFile] = useState(null)
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

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        avatar: 'Please upload a valid image file (JPEG, PNG, GIF, WebP).',
      }))
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        avatar: 'The file is too large. Please upload an image smaller than 5MB.',
      }))
      return
    }

    setAvatarFile(file)
    setAvatar(URL.createObjectURL(file))
    setErrors((prev) => ({ ...prev, avatar: undefined }))
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

      const updatedUser = await updateUserProfile({
        name: form.name,
        username: form.username,
        bio: form.bio,
        imageFile: avatarFile,
      })

      setAvatar(updatedUser.avatar)
      setAvatarFile(null)

      toast.success('Saved profile', {
        description: 'Your profile has been successfully updated.',
      })
      navigate('/profile', { replace: true, state: { updated: Date.now() } })
    } catch (error) {
      const message = error.message?.toLowerCase() ?? ''

      if (message.includes('username')) {
        setErrors({
          username: 'Username is already taken, please try another username.',
        })
      } else {
        toast.error('Failed to save profile', {
          description: error.message || 'Please try again.',
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminPanelLayout
      title="Profile"
      activePage="/profile"
      variant="settings"
      headerAction={
        <button
          type="submit"
          form="profile-form"
          disabled={isSubmitting}
          className={cn(saveButtonClassName, 'hidden lg:inline-flex')}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      }
    >
      <form id="profile-form" onSubmit={handleSubmit} noValidate>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4 border-b border-[#DAD6D1] pb-6 lg:hidden">
          <img
            src={avatar}
            alt={form.name}
            className="h-24 w-24 rounded-full object-cover"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full cursor-pointer rounded-full border border-[#26231E] bg-white px-6 py-2.5 text-[15px] font-medium text-[#26231E] transition-opacity hover:opacity-85"
          >
            Upload profile picture
          </button>
          {errors.avatar && (
            <p className="text-sm text-[#EB5164]">{errors.avatar}</p>
          )}
        </div>

        <div className="hidden flex-col items-start gap-5 border-b border-[#DAD6D1] pb-8 lg:flex lg:flex-row lg:items-center">
          <img
            src={avatar}
            alt={form.name}
            className="h-24 w-24 rounded-full object-cover"
          />
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-full border border-[#26231E] bg-white px-5 py-2 text-[15px] font-medium text-[#26231E] transition-opacity hover:opacity-85"
            >
              Upload profile picture
            </button>
            {errors.avatar && (
              <p className="text-sm text-[#EB5164]">{errors.avatar}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-5 lg:mt-8 lg:max-w-[520px] lg:gap-6">
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

        <div className="mt-5 hidden flex-col gap-1.5 lg:mt-6 lg:flex lg:w-full lg:max-w-[calc(100%-1rem)]">
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

        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(saveButtonClassName, 'mt-6 lg:hidden')}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </form>
    </AdminPanelLayout>
  )
}
