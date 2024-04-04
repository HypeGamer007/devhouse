import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { subscriptionCreated } from '@/lib/stripe/stripe-actions'

// Define the events you care about for connected accounts
const connectedAccountStripeWebhookEvents = new Set([
  'invoice.created',
  'invoice.paid',
  'invoice.payment_failed',
  'checkout.session.completed',
  'checkout.session.expired',
  'customer.subscription.created',
  'customer.subscription.deleted',
  'customer.subscription.updated',
  'price.created',
  'price.deleted',
  'price.updated',
  'product.created',
  'product.deleted',
  'product.updated',
  // Add more events as needed
])

export async function POST(req: NextRequest) {
  let stripeEvent: Stripe.Event
  const body = await req.text()
  const sig = headers().get('Stripe-Signature')
  const webhookSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET

  try {
    if (!sig || !webhookSecret) {
      console.log('🔴 Error: Stripe connect webhook secret or the signature does not exist.')
      return new NextResponse('Webhook Error: Missing secret or signature', { status: 400 })
    }
    stripeEvent = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (error: any) {
    console.log(`🔴 Error: ${error.message}`)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  try {
    if (connectedAccountStripeWebhookEvents.has(stripeEvent.type)) {
      // Handle the event for connected accounts
      await handleConnectedAccountEvent(stripeEvent)
      console.log(`Handled connected account event: ${stripeEvent.type}`)
    } else {
      console.log(`Unhandled event type: ${stripeEvent.type}`)
    }
  } catch (error) {
    console.log(`🔴 Error handling event: ${error}`)
    return new NextResponse('Webhook Error: Error handling event', { status: 400 })
  }

  return NextResponse.json({ webhookActionReceived: true }, { status: 200 })
}

function handleConnectedAccountEvent(stripeEvent: Stripe.Event) {
  throw new Error('Function not implemented.')
}
