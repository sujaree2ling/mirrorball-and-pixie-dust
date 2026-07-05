import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'

import { getPosts } from '@/api/blogApi'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BlogCard } from '@/components/BlogCard'
import { formatDate } from '@/lib/formatDate'

const categories = ['Highlight', 'Cat', 'Inspiration', 'General']
const POSTS_PER_PAGE = 6

function formatPosts(posts) {
  return posts.map((post) => ({
    ...post,
    date: formatDate(post.date),
  }))
}

function dedupePostsById(posts) {
  const seen = new Set()

  return posts.filter((post) => {
    if (seen.has(post.id)) return false
    seen.add(post.id)
    return true
  })
}

export function ArticleSection() {
  const [selectedCategory, setSelectedCategory] = useState('Highlight')
  const [keyword, setKeyword] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const isLoadingMoreRef = useRef(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), 500)
    return () => clearTimeout(timer)
  }, [keyword])

  useEffect(() => {
    let cancelled = false
    isLoadingMoreRef.current = false

    ;(async () => {
      try {
        const data = await getPosts({
          page: 1,
          limit: POSTS_PER_PAGE,
          category: selectedCategory === 'Highlight' ? '' : selectedCategory,
          keyword: debouncedKeyword,
        })

        if (cancelled) return

        setPosts(dedupePostsById(formatPosts(data.posts)))
        setPage(data.currentPage)
        setHasMore(data.currentPage < data.totalPages)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [selectedCategory, debouncedKeyword])

  const handleLoadMore = async () => {
    if (isLoading || isLoadingMoreRef.current || !hasMore) return

    isLoadingMoreRef.current = true
    setIsLoading(true)

    const nextPage = page + 1

    try {
      const data = await getPosts({
        page: nextPage,
        limit: POSTS_PER_PAGE,
        category: selectedCategory === 'Highlight' ? '' : selectedCategory,
        keyword: debouncedKeyword,
      })

      setPosts((prevPosts) =>
        dedupePostsById([...prevPosts, ...formatPosts(data.posts)]),
      )
      setPage(data.currentPage)
      setHasMore(data.currentPage < data.totalPages)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      isLoadingMoreRef.current = false
      setIsLoading(false)
    }
  }

  return (
    <section className="px-6 py-12 lg:px-30">
      <h2 className="mb-6 text-2xl font-bold text-[#26231E]">Latest articles</h2>

      <div className="flex flex-col gap-4 rounded-2xl bg-[#EFEEEB] px-4 py-5 lg:flex-row lg:items-center lg:justify-between lg:py-4">
        <div className="hidden items-center gap-2 lg:flex">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              disabled={category === selectedCategory}
              onClick={() => {
                setIsLoading(true)
                setSelectedCategory(category)
              }}
              className={
                category === selectedCategory
                  ? 'cursor-default rounded-lg bg-[#DAD6D1] px-5 py-3 text-base font-medium text-[#43403B] disabled:opacity-100'
                  : 'cursor-pointer rounded-lg px-5 py-3 text-base font-medium text-[#75716B] transition-colors hover:bg-white'
              }
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex w-full flex-col gap-4 lg:w-[360px] lg:flex-none">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              className="h-12 rounded-lg border-[#DAD6D1] bg-white pr-10 text-base"
            />
            <Search
              size={20}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#75716B]"
            />
          </div>

          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setIsLoading(true)
              setSelectedCategory(value)
            }}
          >
            <SelectTrigger className="h-12! w-full rounded-lg border-[#DAD6D1] bg-white px-3 text-base text-[#43403B] lg:hidden [&_svg:not([class*='size-'])]:size-5">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={4}
              className="w-[var(--radix-select-trigger-width)] rounded-lg border border-[#DAD6D1] bg-white p-2 shadow-md lg:hidden"
            >
              {categories.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="rounded-lg py-3 pl-8 text-base text-[#43403B] focus:bg-[#EFEEEB] data-highlighted:bg-[#EFEEEB]"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-2">
        {posts.map((post) => (
          <BlogCard
            key={post.id}
            id={post.id}
            image={post.image}
            category={post.category}
            title={post.title}
            description={post.description}
            author={post.author}
            date={post.date}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={handleLoadMore}
            className="font-medium underline hover:text-muted-foreground"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'View more'}
          </button>
        </div>
      )}
    </section>
  )
}
