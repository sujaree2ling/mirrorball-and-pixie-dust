export function HeroSection() {
  return (
    <section className="grid grid-cols-1 items-center gap-8 px-6 py-8 text-center lg:grid-cols-3 lg:gap-12 lg:px-20 lg:py-16 lg:text-left">
      <div className="text-center lg:text-right">
        <h1 className="mb-6 text-5xl font-bold leading-[120%] tracking-[-1.5px] text-[#26231E]">
        Long Live
          <br />
          All The Magic
          <br />
          We Made
        </h1>
        <p className="text-base leading-[155%] text-[#75716B]">
        Shining Bright Through Every Chapter. Discover the Songs and Stories That Heal the Heart.
        </p>
      </div>

      <div>
        <img
          src="/author.JPG"
          alt="Sujaree S., the author, smiling at a Disney theme park"
          className="mx-auto block aspect-386/529 w-full rounded-2xl object-cover lg:aspect-auto lg:h-[529px] lg:w-[386px]"
        />
      </div>

      <div className="text-left">
        <p className="mb-2 text-sm text-[#75716B]">- Author</p>
        <p className="mb-5 text-2xl font-bold text-[#26231E]">Sujaree S.</p>
        <p className="mb-4 text-[15px] leading-[165%] text-[#75716B]">
        As a proud Swiftie and a massive Disney Animation enthusiast, music and storytelling are my ultimate sanctuaries. The lyrical genius of Taylor Swift and the magic of Disney have been my constants—healing my heart and guiding me through life's toughest chapters.
        </p>
        <p className="text-[15px] leading-[165%] text-[#75716B]">
        When I'm not working, you can find me getting lost in the magic of a Disney movie or listening to my favorite Taylor Swift tracks.
        </p>
      </div>
    </section>
  )
}