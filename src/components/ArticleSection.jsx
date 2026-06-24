import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BlogCard } from '@/components/BlogCard'
import { blogPosts } from '@/data/blogPosts'

const categories = ['Highlight', 'Taylor Swift', 'Disney', 'Movies']

export function ArticleSection() {
  return (
    <section className="px-6 py-12 lg:px-30">
      <h2 className="mb-6 text-2xl font-bold text-[#26231E]">Latest articles</h2>

      <div className="flex flex-col gap-4 rounded-2xl bg-[#EFEEEB] px-4 py-5 lg:flex-row lg:items-center lg:justify-between lg:py-4">
        <div className="hidden items-center gap-2 lg:flex">
          {categories.map((category, index) => (
            <button
              key={category}
              type="button"
              className={
                index === 0
                  ? 'cursor-pointer rounded-lg bg-[#DAD6D1] px-5 py-3 text-base font-medium text-[#43403B]'
                  : 'cursor-pointer rounded-lg px-5 py-3 text-base font-medium text-[#75716B] transition-colors hover:bg-[#DAD6D1]/60'
              }
            >
              {category}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-[360px]">
          <Input
            type="text"
            placeholder="Search"
            className="h-12 rounded-lg border-[#DAD6D1] bg-white pr-10 text-base"
          />
          <Search
            size={20}
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#75716B]"
          />
        </div>

        <div className="flex flex-col gap-1.5 lg:hidden">
          <label className="text-base font-medium text-[#75716B]">Category</label>
          <Select defaultValue="Highlight">
            <SelectTrigger className="h-12! w-full rounded-lg border-[#DAD6D1] bg-white px-3 text-base [&_svg:not([class*='size-'])]:size-5">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="text-base">
                  {category}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-2">
        {blogPosts.map((post) => (
          <BlogCard
            key={post.id}
            id={post.id}
            image={post.image}
            imagePosition={post.imagePosition}
            category={post.category}
            title={post.title}
            description={post.description}
            author={post.author}
            date={post.date}
          />
        ))}
      </div>
    </section>
  )
}