import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { AdminPanelLayout } from '@/components/AdminPanelLayout'
import { FormField } from '@/components/FormField'
import { createCategory, getCategory, updateCategory } from '@/lib/adminCategories'

export function AdminCategoryFormPage({ mode = 'create' }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = mode === 'edit'

  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(isEdit)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isEdit || !id) return

    const category = getCategory(id)

    if (!category) {
      navigate('/admin/category', { replace: true })
      return
    }

    setName(category.name)
    setIsLoading(false)
  }, [id, isEdit, navigate])

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Category name is required')
      return
    }

    setIsSubmitting(true)

    try {
      if (isEdit) {
        updateCategory(id, name)
      } else {
        createCategory(name)
      }

      navigate('/admin/category', {
        replace: true,
        state: {
          toast: isEdit
            ? {
                title: 'Edit category',
                description: 'Category has been successfully updated.',
              }
            : {
                title: 'Create category',
                description: 'Category has been successfully created.',
              },
        },
      })
    } catch (submitError) {
      setError(submitError.message || 'Unable to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <AdminPanelLayout title="Create category" activePage="/admin/category">
        <p className="text-sm text-[#75716B]">Loading category...</p>
      </AdminPanelLayout>
    )
  }

  return (
    <AdminPanelLayout
      title="Create category"
      activePage="/admin/category"
      headerAction={
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="cursor-pointer rounded-full border border-[#26231E] bg-[#26231E] px-5 py-2 text-[15px] font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      }
    >
      <form
        onSubmit={(event) => {
          event.preventDefault()
          handleSubmit()
        }}
        className="max-w-[760px]"
        noValidate
      >
        <FormField
          id="name"
          name="name"
          label="Category name"
          value={name}
          onChange={(event) => {
            setName(event.target.value)
            setError('')
          }}
          error={error}
          placeholder="Category name"
          size="admin"
          className="[&_input]:bg-white"
        />
      </form>
    </AdminPanelLayout>
  )
}
