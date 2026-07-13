import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { deleteCategory, fetchCategories } from '@/lib/adminCategories'
import { cn } from '@/lib/utils'

export function AdminCategoryPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const toastShownForKey = useRef(null)
  const [categories, setCategories] = useState([])
  const [keyword, setKeyword] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    const toastData = location.state?.toast
    if (!toastData) return
    if (toastShownForKey.current === location.key) return

    toastShownForKey.current = location.key
    const { title, description } = toastData
    toast.success(title, { id: `admin-category-toast-${location.key}`, description })

    navigate(
      { pathname: location.pathname, search: location.search },
      { replace: true, state: null },
    )
  }, [location.key, location.pathname, location.search, location.state, navigate])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), 400)
    return () => clearTimeout(timer)
  }, [keyword])

  useEffect(() => {
    setCategories(fetchCategories({ keyword: debouncedKeyword }))
  }, [debouncedKeyword])

  const handleConfirmDelete = () => {
    if (!deleteTarget) return

    deleteCategory(deleteTarget.id)
    setDeleteTarget(null)
    setCategories((current) => current.filter((category) => category.id !== deleteTarget.id))
    toast.success('Delete category', {
      description: 'Category has been successfully deleted.',
    })
  }

  return (
    <AdminPanelLayout
      title="Category management"
      activePage="/admin/category"
      headerAction={
        <Link
          to="/admin/category/create"
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#26231E] bg-[#26231E] px-5 py-2 text-[15px] font-medium text-white no-underline transition-opacity hover:opacity-85"
        >
          <Plus size={16} />
          Create category
        </Link>
      }
    >
      <div className="relative max-w-full">
        <Search
          size={18}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#75716B]"
        />
        <Input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Search..."
          className="h-11 border-[#DAD6D1] bg-white pl-10 text-[15px]"
        />
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-[#DAD6D1]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#DAD6D1] bg-[#F9F8F6] text-[#75716B]">
            <tr>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-4 py-4 text-right font-medium" aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-12 text-center text-[#75716B]">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((category, index) => (
                <tr
                  key={category.id}
                  className={cn(
                    'border-t border-[#DAD6D1]',
                    index % 2 === 1 && 'bg-[#FAFAF9]',
                  )}
                >
                  <td className="px-6 py-5 text-base text-[#26231E]">
                    {category.name}
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        to={`/admin/category/${category.id}/edit`}
                        aria-label={`Edit ${category.name}`}
                        className="text-[#75716B] no-underline transition-opacity hover:opacity-80"
                      >
                        <Pencil size={18} strokeWidth={1.75} />
                      </Link>
                      <button
                        type="button"
                        aria-label={`Delete ${category.name}`}
                        onClick={() => setDeleteTarget(category)}
                        className="cursor-pointer text-[#75716B] transition-opacity hover:opacity-80"
                      >
                        <Trash2 size={18} strokeWidth={1.75} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="max-w-[400px] rounded-2xl border border-[#DAD6D1] bg-white p-8 text-center">
          <AlertDialogHeader className="text-center">
            <AlertDialogTitle className="text-xl font-bold text-[#26231E]">
              Delete category
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-[#75716B]">
              Do you want to delete this category?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 justify-center gap-3 border-none bg-transparent p-0 sm:justify-center">
            <AlertDialogCancel className="cursor-pointer rounded-full border border-[#26231E] bg-white px-6 py-2.5 text-[15px] font-medium text-[#26231E] hover:bg-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
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
