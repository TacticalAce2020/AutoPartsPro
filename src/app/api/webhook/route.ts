import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
apiVersion: '2023-10-16',
});

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);
export async function POST(req: Request) {
const body = await req.text();
const signature = req.headers.get('stripe-signature')!;

let event: Stripe.Event;

try {
event = stripe.webhooks.constructEvent(
body,
signature,
process.env.STRIPE_WEBHOOK_SECRET!
);
} catch (err: any) {
return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
}

if (event.type === 'checkout.session.completed') {
const session = event.data.object as Stripe.Checkout.Session;

await supabase
.from('orders')
.update({ status: 'paid' })
.eq('stripe_session_id', session.id);

  const customerEmail = session.customer_details?.email;
if (customerEmail) {
await resend.emails.send({
from: 'AutoPartsPro <onboarding@resend.dev>',
to: customerEmail,
subject: 'Order Confirmed - AutoPartsPro',
html: `<p>Thanks for your purchase! Your order has been confirmed and is being processed.</p>`,
});
}
}
return NextResponse.json({ received: true });
}
