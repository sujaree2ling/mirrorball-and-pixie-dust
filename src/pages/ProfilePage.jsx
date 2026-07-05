import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { FormField } from '@/components/FormField'
import { ProfileSettingsLayout } from '@/components/ProfileSettingsLayout'
import { getCurrentUser, updateUserProfile } from '@/lib/auth'

export function ProfilePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const currentUser = getCurrentUser()

  const [form, setForm] = useState({
    name: currentUser?.name ?? '',
    username: currentUser?.username ?? '',
    email: currentUser?.email ?? '',
  })
  const [avatar, setAvatar] = useState(currentUser?.avatar ?? '/author-icon.jpg')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
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
    <ProfileSettingsLayout title="Profile" activePage="/profile">
      <div className="rounded-2xl bg-[#EFEEEB] px-8 py-10 lg:px-10 lg:py-12">
        <div className="flex flex-col items-start gap-6 border-b border-[#DAD6D1] pb-8 sm:flex-row sm:items-center">
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
            className="cursor-pointer rounded-full border border-[#26231E] bg-white px-6 py-2.5 text-[15px] font-medium text-[#26231E] transition-opacity hover:opacity-85"
          >
            Upload profile picture
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6" noValidate>
          <FormField
            id="name"
            name="name"
            label="Name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />

          <FormField
            id="username"
            name="username"
            label="Username"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
          />

          <FormField
            id="email"
            name="email"
            type="email"
            label="Email"
            value={form.email}
            readOnly
            disabled
            className="opacity-70"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-fit min-w-[120px] cursor-pointer rounded-full border border-[#26231E] bg-[#26231E] px-10 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </ProfileSettingsLayout>
  )
}
