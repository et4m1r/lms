'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Course, Product } from '@/payload-types'

interface CourseGridProps {
  products: Product[]
}

export function CourseGrid({ products }: CourseGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-lg font-medium">No course found</div>
        <p className="mt-2 text-sm text-[#666] dark:text-[#888] max-w-md">
          Try adjusting your filters or search term to find what you're looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.course.id}
          className="group relative flex flex-col overflow-hidden rounded-lg border border-[#eaeaea] dark:border-[#333] bg-white dark:bg-black transition-all hover:shadow-md"
        >
          <div className="relative aspect-[16/9] overflow-hidden bg-[#fafafa] dark:bg-[#111]">
            <Image
              src={product.course.thumbnail.url || '/placeholder.svg'}
              alt={product.course.thumbnail.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/*{product.featured && (*/}
            {/*  <Badge className="absolute left-3 top-3 bg-black text-white dark:bg-white dark:text-black">*/}
            {/*    Featured*/}
            {/*  </Badge>*/}
            {/*)}*/}
            {/*{product.new && (*/}
            {/*  <Badge className="absolute left-3 top-3 bg-blue-500 text-white">New</Badge>*/}
            {/*)}*/}
          </div>

          <div className="flex flex-1 flex-col p-4">
            <div className="mb-2 flex items-center justify-between">
              <Badge
                variant="outline"
                className="rounded-md border-[#eaeaea] dark:border-[#333] text-xs font-normal"
              >
                {product.course.categories[0].title}
              </Badge>
              <div className="flex items-center text-sm font-medium">
                {/*<DollarSign className="mr-1 h-3.5 w-3.5 text-green-600" />*/}

                <span className="text-green-600 mr-2">
                  {product.productPrice[0].acceptedCurrency}{' '}
                </span>
                <span className="text-green-600">{product.productPrice[0].price}</span>
              </div>
            </div>

            <h3 className="text-lg font-medium leading-tight">{product.course.title}</h3>
            <p className="mt-1 flex-1 text-sm text-[#666] dark:text-[#888]">
              {product.course.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fafafa] dark:bg-[#111]">
                  <Image
                    src={product.course.thumbnail.url || '/placeholder.svg'}
                    alt={product.course.thumbnail.alt}
                    width={16}
                    height={16}
                  />
                </div>
                <span className="text-xs text-[#666] dark:text-[#888]">
                  {product.course.categories[0].title}
                </span>
              </div>
              <Link href={`/courses/${product.course.id}`}>
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
      ))}
    </div>
  )
}
