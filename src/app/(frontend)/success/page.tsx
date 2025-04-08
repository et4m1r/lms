'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const productId = searchParams.get('product')
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!productId) {
      router.push('/courses')
      return
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`)
        if (!res.ok) throw new Error('Course not found')
        const data = await res.json()
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId, router])

  if (loading) {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Course not found</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/courses">Back to Courses</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>Thank you for enrolling in {product.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>Your enrollment has been confirmed and you now have access to the course content.</p>
            <p>You will receive a confirmation email with details shortly.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <a href={`/dashboard/courses/${productId}`}>Start Learning</a>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <a href="/dashboard">Go to Dashboard</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
