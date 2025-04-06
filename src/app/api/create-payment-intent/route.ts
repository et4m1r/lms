import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { payload } from '@/lib/payload'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, priceId } = await req.json()

    // Get course from database
    const product = await payload.findByID({
      collection: 'products',
      id: productId,
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    let price
    let currency

    if (product.productPrice && product.productPrice.length > 0) {
      price = product.productPrice[0].price
      currency = product.productPrice[0].acceptedCurrency
    } else {
      price = null
      currency = null
      console.log('price is null or empty for item ID:', productId)
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price * 100, // Convert to cents
      currency: currency,
      metadata: {
        productId,
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
