import { ProductMdxFrontmatter } from '@/lib/markdown'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { payload } from '@/lib/payload'
import { Category, Media, Product, Course } from '@/payload-types'
import { buttonVariants } from '@/components/ui/button'
import { ShoppingBasket } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Courses',
}

export default async function CoursesIndexPage() {
  try {
    const products = await payload.find({
      collection: 'products',
      depth: 2,
    })

    if (!products || products.totalDocs == 0) {
      return (
        <div className="flex flex-col gap-1 sm:min-h-[91vh] min-h-[88vh] pt-2">
          <div className="mb-7 flex flex-col gap-2">
            <h1 className="sm:text-3xl text-2xl font-extrabold">
              Hey there! It looks like things are a little quiet on the course front right now. But
              hey, think of it as a blank canvas – full of potential for awesome things to come!
              Stay tuned, exciting learning adventures might be just around the corner. 😉
            </h1>
          </div>
        </div>
      )
    }

    const productsArray: ProductMdxFrontmatter[] = products.docs.map((doc: Product) => {
      const course = doc.course as Course
      const imageUrl = (doc.productImage as Media).url || ''
      const categoryName =
        course.categories && course.categories?.length > 0
          ? (course.categories[0] as Category).title
          : ''
      const price = doc.productPrice.length > 0 ? doc.productPrice[0].price : null

      return {
        title: doc.name,
        description: doc.description,
        price: price,
        cover: imageUrl,
        productId: doc.id,
        courseId: course.id,
        categoryName: categoryName,
      }
    })

    return (
      <div className="flex flex-col items-start justify-center pt-8 pb-10 w-full mx-auto">
        <div className="flex flex-col gap-1 sm:min-h-[91vh] min-h-[88vh] pt-2">
          <div className="mb-7 flex flex-col gap-2">
            <h1 className="sm:text-3xl text-2xl font-extrabold">LMS Title</h1>
            <p className="text-muted-foreground sm:text-[16.5px] text-[14.5px]">lms desc</p>
          </div>
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-8 gap-4 mb-5">
            {productsArray.map((product) => (
              <ProductCard {...product} key={product.productId} />
            ))}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error getting courses:', error)
  }
}

function ProductCard({
  productId,
  title,
  description,
  cover,
  categoryName,
  price,
  courseId,
}: ProductMdxFrontmatter) {
  return (
    <div className="flex flex-col gap-2 items-start border rounded-md py-5 px-3 min-h-[400px]">
      <Link href={`/courses/${courseId}`}>Fake Link</Link>
      <Link href={`/checkout/${productId}`}>
        <h3 className="text-md font-semibold -mt-1 pr-7">{title}</h3>
        <div className="w-full">
          <Image
            src={cover}
            alt={title}
            width={400}
            height={150}
            quality={80}
            className="w-full rounded-md object-cover h-[180px] border"
          />
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </Link>
      <div className="flex items-center justify-between w-full mt-auto">
        <p className="text-[13px] text-secondary-foreground">{categoryName}</p>
        <Link
          className={buttonVariants({
            variant: 'outline',
            className:
              'no-underline  flex flex-col sm:pl-7 pl-3 sm:py-5 py-4 !items-start text-xs sm:text-sm',
          })}
          href={`/checkout/${productId}`}
        >
          <span className="flex items-center text-muted-foreground text-xs">
            {price}$
            <ShoppingBasket className="w-[1rem] h-[1rem] mr-1 ml-1" />
          </span>
        </Link>
      </div>
    </div>
  )
}
