'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { use } from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface CheckoutFormProps {
  productId: string
  clientSecret: string
}

function CheckoutForm({ productId, clientSecret }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success?product=${productId}`,
        },
        redirect: 'if_required',
      })

      if (submitError) {
        setError(submitError.message || 'An error occurred during payment')
        setLoading(false)
        return
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        router.push(`/success?product=${productId}`)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Payment error:', err)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <PaymentElement />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" className="w-full" disabled={!stripe || loading}>
          {loading ? 'Processing...' : 'Complete Payment'}
        </Button>
      </div>
    </form>
  )
}

interface Params {
  id: string
}

export default function Page({ params }: { params: Promise<Params> }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [product, setProduct] = useState<any>(null)
  const [price, setPrice] = useState<any>(null)
  const [currency, setCurrency] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { id } = use(params)

  useEffect(() => {
    const fetchProductAndCreateIntent = async () => {
      try {
        const productRes = await fetch(`/api/get-products/${id}`)
        if (!productRes.ok) throw new Error('Product not found')

        const productData = await productRes.json()
        setProduct(productData)

        if (productData.productPrice && productData.productPrice.length > 0) {
          setPrice(productData.productPrice[0].price)
          setCurrency(productData.productPrice[0].acceptedCurrency)
        } else {
          throw new Error('Product price not found')
        }

        // Create payment intent
        const paymentRes = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: id,
            priceId: productData.stripePriceId,
          }),
        })

        if (!paymentRes.ok) throw new Error('Failed to create payment intent')
        const { clientSecret } = await paymentRes.json()
        setClientSecret(clientSecret)
      } catch (err) {
        console.error('Error in checkout:', err)
        setError('Failed to load checkout. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchProductAndCreateIntent()
  }, [id])

  if (loading) {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Loading checkout...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error || 'Course not found'}</CardDescription>
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
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
          <CardDescription>You&#39;re enrolling in {product.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Course Price:</span>
              <span>${price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${price.toFixed(2)}</span>
            </div>
          </div>
          {clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                },
              }}
            >
              <CheckoutForm productId={id} clientSecret={clientSecret} />
            </Elements>
          ) : (
            <div>Loading payment form...</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
