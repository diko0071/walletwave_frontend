'use client'

export default function About() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 grid md:grid-cols-2 gap-8 items-center">

      <div className="flex justify-start">
        <iframe
          width={400}
          height={400}
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0"
          className="h-[400px] w-full rounded-lg shadow-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Us</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-[600px]">
          We are a team of passionate designers and developers who are dedicated to creating beautiful and functional
          digital experiences. Our mission is to help our clients achieve their goals and make a positive impact on the
          world.
        </p>
      </div>
    </div>
  )
}