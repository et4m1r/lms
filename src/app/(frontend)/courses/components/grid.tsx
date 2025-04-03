'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Course, Product, Media, Category } from '@/payload-types'

interface CourseGridProps {
  products: Product[]
}

export function CourseGrid({ products }: CourseGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-lg font-medium">No course found</div>
        <p className="mt-2 text-sm text-[#666] dark:text-[#888] max-w-md">
          Try adjusting your filters or search term to find what you&#39;re looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => {
        const course = product.course as Course
        const thumbnail = course.thumbnail as Media
        const category =
          course.categories && course.categories?.length > 0
            ? (course.categories[0] as Category).title
            : ''

        return course ? (
          <div
            key={course.id}
            className="group relative flex flex-col overflow-hidden rounded-lg border border-[#eaeaea] dark:border-[#333] bg-white dark:bg-black transition-all hover:shadow-md"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-[#fafafa] dark:bg-[#111]">
              <Image
                src={thumbnail.url || '/placeholder.svg'}
                alt={thumbnail.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <Badge className="absolute left-3 top-3 bg-black text-white dark:bg-white dark:text-black">
                Featured
              </Badge>
            </div>

            <div className="flex flex-1 flex-col p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center text-sm font-medium">
                  <span className="text-green-600 mr-1 text-right">
                    {product.productPrice[0].acceptedCurrency}$
                  </span>
                  <span className="text-green-600">{product.productPrice[0].price}</span>
                </div>
              </div>

              <h3 className="text-lg font-medium leading-tight">{course.title}</h3>
              <p className="mt-1 flex-1 text-sm text-[#666] dark:text-[#888]">
                {course.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#666] dark:text-[#888]">{category}</span>
                </div>
                <Link href={`/courses/${course.id}`}>
                  <Button
                    variant="ghost"
                    size="default"
                    className="cursor-pointer h-8 gap-1 text-md font-normal"
                  >
                    Enroll
                    <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : null
      })}
    </div>
  )
}
