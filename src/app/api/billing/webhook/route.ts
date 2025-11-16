import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import type Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  if (!sig) {
    return new NextResponse('Missing signature', { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature error', err?.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      if (!userId) {
        console.warn('No userId in session metadata');
        return new NextResponse('ok');
      }

      const subscriptionId = session.subscription as string | null;

      let renewsAt: Date | null = null;

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        if (subscription.current_period_end) {
          renewsAt = new Date(subscription.current_period_end * 1000);
        }
      }

      await prisma.plan.upsert({
        where: { userId },
        create: {
          userId,
          tier: 'PRO',
          renewsAt,
        },
        update: {
          tier: 'PRO',
          renewsAt,
        },
      });
    }

    // You might also handle 'customer.subscription.deleted' to downgrade to FREE

    return new NextResponse('ok');
  } catch (err) {
    console.error('Webhook processing error', err);
    return new NextResponse('Webhook handler failed', { status: 500 });
  }
}
