import { NextResponse, NextRequest } from 'next/server'
import Stripe from 'stripe'
import { payload } from '@/lib/payload'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export async function POST(req: NextRequest) {
  const signature = req.headers.get('signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const body = await req.text()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || '')
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handleSuccessfulPayment(paymentIntent)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionChange(subscription)
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCancellation(deletedSubscription)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error handling webhook:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
  const { courseId, userId } = paymentIntent.metadata

  if (!courseId || !userId) {
    console.error('Missing metadata in payment intent')
    return
  }

  try {
    // Get user
    const user = await payload.findByID({
      collection: 'users',
      id: userId,
    })

    if (!user) {
      console.error('User not found:', userId)
      return
    }

    // Add course to user's purchased courses
    const purchasedCourses = [...(user.purchasedCourses || []), courseId]
    await payload.update({
      collection: 'users',
      id: userId,
      data: {
        purchasedCourses,
      },
    })

    // Create subscription record
    await payload.create({
      collection: 'subscriptions',
      data: {
        user: userId,
        course: courseId,
        stripeSubscriptionId: paymentIntent.id, // Using payment intent ID as reference
        status: 'active',
        startDate: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Error processing successful payment:', error)
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  try {
    // Find subscription in database
    const { docs } = await payload.find({
      collection: 'subscriptions',
      where: {
        stripeSubscriptionId: {
          equals: subscription.id,
        },
      },
    })

    if (docs.length === 0) {
      console.error('Subscription not found:', subscription.id)
      return
    }

    // Update subscription status
    await payload.update({
      collection: 'subscriptions',
      id: docs[0].id,
      data: {
        status: subscription.status,
      },
    })
  } catch (error) {
    console.error('Error handling subscription change:', error)
  }
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  try {
    // Find subscription in database
    const { docs } = await payload.find({
      collection: 'subscriptions',
      where: {
        stripeSubscriptionId: {
          equals: subscription.id,
        },
      },
    })

    if (docs.length === 0) {
      console.error('Subscription not found:', subscription.id)
      return
    }

    // Update subscription status and end date
    await payload.update({
      collection: 'subscriptions',
      id: docs[0].id,
      data: {
        status: 'canceled',
        endDate: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Error handling subscription cancellation:', error)
  }
}
