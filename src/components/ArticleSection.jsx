import { useState } from 'react'
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
  const [selectedCategory, setSelectedCategory] = useState('Highlight')

  const filteredPosts =
    selectedCategory === 'Highlight'
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory)

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
              onClick={() => setSelectedCategory(category)}
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
              className="h-12 rounded-lg border-[#DAD6D1] bg-white pr-10 text-base"
            />
            <Search
              size={20}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#75716B]"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
        {filteredPosts.map((post) => (
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