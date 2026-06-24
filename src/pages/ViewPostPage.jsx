import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Markdown from 'react-markdown'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { blogPosts } from '@/data/blogPosts'

const markdownComponents = {
  h2: ({ children }) => (
    <h2 className="mt-10 mb-2 text-2xl font-bold text-[#26231E]">{children}</h2>
  ),
  p: ({ children }) => (
    <p className="mb-5 text-base leading-[165%] text-[#75716B]">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-5 flex list-disc flex-col gap-2 pl-6">{children}</ul>
  ),
  li: ({ children }) => (
    <li className="text-base leading-[165%] text-[#75716B]">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-[#26231E]">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
}

function PostContent({ content }) {
  return <Markdown components={markdownComponents}>{content}</Markdown>
}

export function ViewPostPage() {
  const { id } = useParams()
  const post = blogPosts.find((item) => String(item.id) === id)

  if (!post) {
    return (
      <>
        <NavBar />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-[#26231E]">Article not found</h1>
          <Link to="/" className="text-[#12B279] underline underline-offset-2">
            Home
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <NavBar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 lg:py-16">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#75716B] transition-colors hover:text-[#26231E]"
        >
          <ArrowLeft size={16} />
          Home
        </Link>

        <img
          src={post.image}
          alt={post.title}
          style={{ objectPosition: post.imagePosition ?? 'center' }}
          className="mb-8 h-[260px] w-full rounded-2xl object-cover sm:h-[420px]"
        />

        <div className="mb-4 flex items-center gap-3 text-sm">
          <span className="rounded-full bg-green-200 px-3 py-1 font-semibold text-green-600">
            {post.category}
          </span>
          <span className="text-[#75716B]">{post.date}</span>
        </div>

        <h1 className="mb-6 text-3xl font-bold leading-tight text-[#26231E]">
          {post.title}
        </h1>

        <p className="mb-8 text-lg leading-[165%] text-[#43403B]">
          {post.description}
        </p>

        <PostContent content={post.content} />
      </main>
      <Footer />
    </>
  )
}
