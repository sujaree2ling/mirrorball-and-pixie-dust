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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { deleteArticle, fetchAdminArticles, getArticleCategories } from '@/lib/adminArticles'
import { cn } from '@/lib/utils'

function StatusLabel({ status }) {
  const isPublished = status === 'published'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-sm font-medium capitalize',
        isPublished ? 'text-[#12B279]' : 'text-[#75716B]',
      )}
    >
      <span
        className={cn(
          'h-2 w-2 rounded-full',
          isPublished ? 'bg-[#12B279]' : 'bg-[#75716B]',
        )}
      />
      {status}
    </span>
  )
}

export function AdminPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const toastShownForKey = useRef(null)
  const [articles, setArticles] = useState([])
  const [keyword, setKeyword] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const articleCategories = getArticleCategories()

  useEffect(() => {
    if (category && !articleCategories.includes(category)) {
      setCategory('')
    }
  }, [category, articleCategories])

  useEffect(() => {
    const toastData = location.state?.toast
    if (!toastData) return
    if (toastShownForKey.current === location.key) return

    toastShownForKey.current = location.key
    const { title, description } = toastData
    toast.success(title, { id: `admin-toast-${location.key}`, description })

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
    setPage(1)
  }, [debouncedKeyword, status, category])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      setIsLoading(true)

      try {
        const data = await fetchAdminArticles({
          page,
          limit: 6,
          keyword: debouncedKeyword,
          status,
          category,
        })

        if (cancelled) return

        setArticles(data.posts)
        setTotalPages(data.totalPages)
      } catch (error) {
        console.error('Error fetching admin articles:', error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [page, debouncedKeyword, status, category])

  const handleConfirmDelete = () => {
    if (!deleteTarget) return

    deleteArticle(deleteTarget.id)
    setDeleteTarget(null)
    setArticles((current) => current.filter((article) => article.id !== deleteTarget.id))
    toast.success('Article deleted!', {
      description: 'Article deleted successfully.',
    })
  }

  return (
    <AdminPanelLayout
      title="Article management"
      activePage="/admin"
      headerAction={
        <Link
          to="/admin/articles/create"
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#26231E] bg-[#26231E] px-5 py-2 text-[15px] font-medium text-white no-underline transition-opacity hover:opacity-85"
        >
          <Plus size={16} />
          Create article
        </Link>
      }
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
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

        <Select
          value={status || 'all'}
          onValueChange={(value) => setStatus(value === 'all' ? '' : value)}
        >
          <SelectTrigger className="h-11 min-w-[140px] border-[#DAD6D1] bg-white text-[15px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={category || 'all'}
          onValueChange={(value) => setCategory(value === 'all' ? '' : value)}
        >
          <SelectTrigger className="h-11 min-w-[140px] border-[#DAD6D1] bg-white text-[15px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Category</SelectItem>
            {articleCategories.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-[#DAD6D1]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#DAD6D1] bg-[#F9F8F6] text-[#75716B]">
            <tr>
              <th className="px-6 py-4 font-medium">Article title</th>
              <th className="px-4 py-4 font-medium">Category</th>
              <th className="px-4 py-4 font-medium">Status</th>
              <th className="px-4 py-4 text-right font-medium" aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-[#75716B]">
                  Loading articles...
                </td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-[#75716B]">
                  No articles found.
                </td>
              </tr>
            ) : (
              articles.map((article, index) => (
                <tr
                  key={article.id}
                  className={cn(
                    'border-t border-[#DAD6D1]',
                    index % 2 === 1 && 'bg-[#FAFAF9]',
                  )}
                >
                  <td className="px-6 py-5 text-base text-[#26231E]">
                    {article.title}
                  </td>
                  <td className="px-4 py-5 text-[#75716B]">{article.category}</td>
                  <td className="px-4 py-5">
                    <StatusLabel status={article.status} />
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        to={`/admin/articles/${article.id}/edit`}
                        aria-label={`Edit ${article.title}`}
                        className="text-[#75716B] no-underline transition-opacity hover:opacity-80"
                      >
                        <Pencil size={18} strokeWidth={1.75} />
                      </Link>
                      <button
                        type="button"
                        aria-label={`Delete ${article.title}`}
                        onClick={() => setDeleteTarget(article)}
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

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
            className="cursor-pointer rounded-full border border-[#DAD6D1] px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-[#75716B]">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((current) => current + 1)}
            className="cursor-pointer rounded-full border border-[#DAD6D1] px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
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
