import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ImageIcon, Trash2 } from 'lucide-react'
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
import { AdminPanelLayout } from '@/components/AdminPanelLayout'
import { FormField } from '@/components/FormField'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ARTICLE_IMAGE_POSITIONS,
  createArticle,
  deleteArticle,
  getAdminArticle,
  getArticleCategories,
  updateArticle,
} from '@/lib/adminArticles'
import { cn } from '@/lib/utils'

const INTRO_MAX_LENGTH = 120
const BLOG_AUTHOR = 'Sujaree S.'

const emptyForm = {
  title: '',
  description: '',
  content: '',
  category: '',
  image: '',
  imagePosition: 'center',
  author: BLOG_AUTHOR,
}

export function AdminArticleFormPage({ mode = 'create' }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const fileInputRef = useRef(null)
  const isEdit = mode === 'edit'

  const [articleCategories, setArticleCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [articleStatus, setArticleStatus] = useState('draft')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittingAs, setSubmittingAs] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const categories = await getArticleCategories()
        if (cancelled) return

        setArticleCategories(categories)

        if (!isEdit) {
          setForm((prev) => ({
            ...prev,
            category: prev.category || categories[0] || '',
          }))
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        if (!cancelled && !isEdit) setIsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [isEdit])

  useEffect(() => {
    if (!isEdit || !id) return

    let cancelled = false

    ;(async () => {
      try {
        const article = await getAdminArticle(id)
        if (cancelled) return

        if (!article) {
          navigate('/admin', { replace: true })
          return
        }

        setForm({
          title: article.title,
          description: article.description,
          content: article.content,
          category: article.category,
          image: article.image,
          imagePosition: article.imagePosition ?? 'center',
          author: BLOG_AUTHOR,
        })
        setArticleStatus(article.status)
      } catch (error) {
        console.error('Error loading article:', error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [id, isEdit, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleIntroChange = (event) => {
    const value = event.target.value.slice(0, INTRO_MAX_LENGTH)
    setForm((prev) => ({ ...prev, description: value }))
    setErrors((prev) => ({ ...prev, description: undefined }))
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: 'Please upload a valid image file (JPEG, PNG, GIF, WebP).',
      }))
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        image: 'The file is too large. Please upload an image smaller than 5MB.',
      }))
      return
    }

    setImageFile(file)
    setForm((prev) => ({
      ...prev,
      image: URL.createObjectURL(file),
    }))
    setErrors((prev) => ({ ...prev, image: undefined }))
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!form.title.trim()) nextErrors.title = 'Title is required'
    if (!form.description.trim()) nextErrors.description = 'Introduction is required'
    if (!form.content.trim()) nextErrors.content = 'Content is required'
    if (!form.category) nextErrors.category = 'Category is required'
    if (!imageFile && !form.image.trim()) {
      nextErrors.image = 'Thumbnail image is required'
    }

    return nextErrors
  }

  const handleSubmit = async (nextStatus) => {
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setSubmittingAs(nextStatus)

    try {
      const payload = {
        ...form,
        author: BLOG_AUTHOR,
        status: nextStatus,
      }

      // Don't send blob: preview URLs to the API — only real image URLs or a new file
      if (imageFile) {
        payload.image = undefined
      }

      if (isEdit) {
        await updateArticle(id, payload, imageFile)
      } else {
        await createArticle(payload, imageFile)
      }

      const isPublished = nextStatus === 'published'

      navigate('/admin', {
        replace: true,
        state: {
          toast: isPublished
            ? {
                title: isEdit
                  ? 'Edited article and published'
                  : 'Create article and published',
                description: 'Your article has been successfully published',
              }
            : {
                title: isEdit
                  ? 'Edited article and saved as draft'
                  : 'Create article and saved as draft',
                description: 'You can publish article later',
              },
        },
      })
    } catch (error) {
      console.error('Error saving article:', error)
      toast.error('Failed to save article', {
        description:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          'Please try again.',
      })
    } finally {
      setIsSubmitting(false)
      setSubmittingAs(null)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteArticle(id)
      setShowDeleteConfirm(false)
      navigate('/admin', {
        replace: true,
        state: {
          toast: {
            title: 'Article deleted!',
            description: 'Article deleted successfully.',
          },
        },
      })
    } catch (error) {
      console.error('Error deleting article:', error)
      toast.error('Failed to delete article', {
        description:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          'Please try again.',
      })
    }
  }

  if (isLoading) {
    return (
      <AdminPanelLayout title={isEdit ? 'Edit article' : 'Create article'} activePage="/admin">
        <p className="text-sm text-[#75716B]">Loading article...</p>
      </AdminPanelLayout>
    )
  }

  return (
    <AdminPanelLayout
      title={isEdit ? 'Edit article' : 'Create article'}
      activePage="/admin"
      headerAction={
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('draft')}
            className="cursor-pointer rounded-full border border-[#26231E] bg-white px-5 py-2 text-[15px] font-medium text-[#26231E] transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && submittingAs === 'draft' ? 'Saving...' : 'Save as draft'}
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('published')}
            className="cursor-pointer rounded-full border border-[#26231E] bg-[#26231E] px-5 py-2 text-[15px] font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && submittingAs !== 'draft'
              ? 'Saving...'
              : isEdit && articleStatus === 'published'
                ? 'Save'
                : 'Save and publish'}
          </button>
        </div>
      }
    >
      <form onSubmit={(event) => event.preventDefault()} className="max-w-[760px]" noValidate>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-[160px] w-[240px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#DAD6D1] bg-[#F9F8F6]">
            {form.image ? (
              <img
                src={form.image}
                alt={form.title || 'Article thumbnail'}
                className="h-full w-full object-cover"
                style={{ objectPosition: form.imagePosition ?? 'center' }}
              />
            ) : (
              <ImageIcon size={40} className="text-[#DAD6D1]" strokeWidth={1.25} />
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-full border border-[#26231E] bg-white px-5 py-2 text-[15px] font-medium text-[#26231E] transition-opacity hover:opacity-85"
            >
              Upload thumbnail image
            </button>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="imagePosition" className="text-sm font-medium text-[#75716B]">
                Image position
              </label>
              <Select
                value={form.imagePosition}
                onValueChange={(value) => {
                  setForm((prev) => ({ ...prev, imagePosition: value }))
                }}
              >
                <SelectTrigger
                  id="imagePosition"
                  className="h-11 w-full border border-[#DAD6D1] bg-white text-[15px] sm:w-[220px]"
                >
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {ARTICLE_IMAGE_POSITIONS.map((position) => (
                    <SelectItem key={position} value={position} className="capitalize">
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errors.image && <p className="text-sm text-[#EB5164]">{errors.image}</p>}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className="text-sm font-medium text-[#75716B]">
              Category
            </label>
            <Select
              value={form.category}
              onValueChange={(value) => {
                setForm((prev) => ({ ...prev, category: value }))
                setErrors((prev) => ({ ...prev, category: undefined }))
              }}
            >
              <SelectTrigger
                id="category"
                className={cn(
                  'h-11 w-full border bg-white text-[15px]',
                  errors.category ? 'border-[#EB5164]' : 'border-[#DAD6D1]',
                )}
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {articleCategories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-[#EB5164]">{errors.category}</p>}
          </div>

          <FormField
            id="author"
            name="author"
            label="Author name"
            value={form.author}
            readOnly
            disabled
            size="admin"
            className="[&_input]:bg-[#F9F8F6] [&_input]:text-[#75716B]"
          />

          <FormField
            id="title"
            name="title"
            label="Title"
            value={form.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="Article title"
            size="admin"
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-[#75716B]">
              Introduction (max 120 letters)
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleIntroChange}
              maxLength={INTRO_MAX_LENGTH}
              rows={3}
              placeholder="Introduction"
              className={cn(
                'w-full resize-none rounded-lg border bg-white px-3 py-3 text-[15px] leading-relaxed text-[#26231E] outline-none placeholder:text-[#75716B]/60 focus-visible:border-[#26231E]',
                errors.description ? 'border-[#EB5164]' : 'border-[#DAD6D1]',
              )}
            />
            {errors.description && (
              <p className="text-sm text-[#EB5164]">{errors.description}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="content" className="text-sm font-medium text-[#75716B]">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={14}
              placeholder="Content"
              className={cn(
                'w-full resize-y rounded-lg border bg-white px-3 py-3 text-[15px] leading-relaxed text-[#26231E] outline-none placeholder:text-[#75716B]/60 focus-visible:border-[#26231E]',
                errors.content ? 'border-[#EB5164]' : 'border-[#DAD6D1]',
              )}
            />
            {errors.content && <p className="text-sm text-[#EB5164]">{errors.content}</p>}
          </div>
        </div>

        {isEdit && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="mt-10 flex cursor-pointer items-center gap-2 text-[15px] font-medium text-[#75716B] transition-colors hover:text-[#26231E]"
          >
            <Trash2 size={18} strokeWidth={1.75} />
            Delete article
          </button>
        )}
      </form>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="max-w-[400px] rounded-2xl border border-[#DAD6D1] bg-white p-8 text-center">
          <AlertDialogHeader className="text-center">
            <AlertDialogTitle className="text-xl font-bold text-[#26231E]">
              Delete article
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-[#75716B]">
              Do you want to delete this article?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 justify-center gap-3 border-none bg-transparent p-0 sm:justify-center">
            <AlertDialogCancel className="cursor-pointer rounded-full border border-[#26231E] bg-white px-6 py-2.5 text-[15px] font-medium text-[#26231E] hover:bg-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="cursor-pointer rounded-full border border-[#26231E] bg-[#26231E] px-6 py-2.5 text-[15px] font-medium text-white hover:bg-[#26231E]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPanelLayout>
  )
}
