export function HeroSection() {
  return (
    <section className="grid grid-cols-1 items-center gap-8 px-6 py-8 text-center lg:grid-cols-3 lg:gap-12 lg:px-20 lg:py-16 lg:text-left">
      <div className="text-center lg:text-right">
        <h1 className="mb-6 text-5xl font-bold leading-[108%] tracking-[-1.5px] text-[#26231E]">
          Stay{' '}
          <br className="hidden lg:block" />
          Informed,
          <br />
          Stay Inspired
        </h1>
        <p className="text-base leading-[155%] text-[#75716B]">
          Discover a World of Knowledge at Your Fingertips. Your Daily Dose of
          Inspiration and Information.
        </p>
      </div>

      <div>
        <img
          src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
          alt="A man with a cat on his shoulder outdoors"
          className="mx-auto block aspect-386/529 w-full rounded-2xl object-cover lg:aspect-auto lg:h-[529px] lg:w-[386px]"
        />
      </div>

      <div className="text-left">
        <p className="mb-2 text-sm text-[#75716B]">- Author</p>
        <p className="mb-5 text-2xl font-bold text-[#26231E]">Thompson P.</p>
        <p className="mb-4 text-[15px] leading-[165%] text-[#75716B]">
          I am a pet enthusiast and freelance writer who specializes in animal
          behavior and care. With a deep love for cats, I enjoy sharing insights
          on feline companionship and wellness.
        </p>
        <p className="text-[15px] leading-[165%] text-[#75716B]">
          When I'm not writing, I spend time volunteering at my local animal
          shelter, helping cats find loving homes.
        </p>
      </div>
    </section>
  )
}