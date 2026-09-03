import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
apiVersion: '2023-10-16',
});

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');
const supabaseAdmin = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
);
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

// Update Supabase order status
await supabaseAdmin
.from('orders')
.update({ status: 'paid' })
.eq('stripe_session_id', session.id);

// Fetch line items from Stripe
const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

const customerEmail = session.customer_details?.email;
if (customerEmail) {
// Build HTML rows for each purchased item
const itemsHtml = lineItems.data
.map(
(item) => `
<tr style="border-bottom: 1px solid #27272a;">
<td style="padding: 12px 0; color: #ffffff; font-size: 14px;">${item.description}</td>
<td style="padding: 12px 0; color: #a1a1aa; font-size: 14px; text-align: center;">x${item.quantity}</td>
<td style="padding: 12px 0; color: #ffffff; font-size: 14px; text-align: right;">$${((item.amount_total || 0) / 100).toFixed(2)}</td>
</tr>
`
)
.join('');

const totalAmount = ((session.amount_total || 0) / 100).toFixed(2);

await resend.emails.send({
from: 'AutoPartsPro <onboarding@resend.dev>',
to: customerEmail,
subject: 'Order Confirmed - AutoPartsPro',
html: `
<div style="background-color: #09090b; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #ffffff;">
<div style="max-width: 500px; margin: 0 auto; background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 32px;">
<h1 style="margin: 0 0 12px; font-size: 20px; font-weight: 600; color: #ffffff;">Order Confirmed</h1>
<p style="margin: 0 0 24px; font-size: 14px; line-height: 1.5; color: #a1a1aa;">
Thanks for your purchase! Here is what you ordered:
</p>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
<thead>
<tr style="border-bottom: 1px solid #3f3f46; text-align: left;">
<th style="padding-bottom: 8px; color: #71717a; font-size: 12px; font-weight: 500;">ITEM</th>
<th style="padding-bottom: 8px; color: #71717a; font-size: 12px; font-weight: 500; text-align: center;">QTY</th>
<th style="padding-bottom: 8px; color: #71717a; font-size: 12px; font-weight: 500; text-align: right;">PRICE</th>
</tr>
</thead>
<tbody>
${itemsHtml}
</tbody>
</table>

<div style="border-top: 1px solid #27272a; padding-top: 16px; margin-bottom: 20px; display: flex; justify-content: space-between;">
<span style="font-size: 14px; font-weight: 600; color: #ffffff;">Total Paid</span>
<span style="font-size: 14px; font-weight: 600; color: #ffffff;">$${totalAmount}</span>
</div>

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
