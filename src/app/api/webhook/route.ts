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
html: `
<div style="background-color: #09090b; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #ffffff;">
<div style="max-width: 500px; margin: 0 auto; background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 32px;">
<h1 style="margin: 0 0 12px; font-size: 20px; font-weight: 600; color: #ffffff;">Order Confirmed</h1>
<p style="margin: 0 0 24px; font-size: 14px; line-height: 1.5; color: #a1a1aa;">
Thanks for your purchase! We’ve received your order and are getting it ready for processing.
</p>
<div style="border-top: 1px solid #27272a; padding-top: 20px; font-size: 12px; color: #71717a;">
<p style="margin: 0;">Order Reference: <span style="color: #a1a1aa; font-family: monospace;">${session.id}</span></p>
</div>
</div>
</div>
`,
});
}
}
return NextResponse.json({ received: true });
}
