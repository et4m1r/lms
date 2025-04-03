import { Product, Category } from '@/payload-types'
import { FilterAndGrid } from '@/app/(frontend)/courses/components/filter-grid'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { TopNavbar } from '@/components/NavBar'

export default async function TemplatesPage() {
  const payload = await getPayload({ config: configPromise })

  const product = await payload.find({
    collection: 'products',
  })

  const categories = await payload.find({
    collection: 'categories',
  })

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black">
      <TopNavbar />
      <div className="flex flex-1 flex-col gap-4 px-4 py-10">
        <div className="mx-auto h-24 w-full max-w-5xl">
          <FilterAndGrid
            products={product.docs as Product[]}
            categories={categories.docs as Category[]}
          />
        </div>
      </div>
    </div>
  )
}
