import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
apiVersion: '2023-10-16',
});

// Initialize Supabase admin client for secure backend inserts
const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY! // Fallback to anon key if service role isn't set up yet
);

export async function POST(req: Request) {
try {
const { items } = await req.json();

const line_items = items.map((cartItem: any) => {
const prod = cartItem.product || cartItem;
const rawPrice = prod.price ?? prod.amount ?? prod.cost ?? 0;

const parsedPrice = typeof rawPrice === 'string'
? parseFloat(rawPrice.replace(/[^0-9.]/g, ''))
: rawPrice;

return {
price_data: {
currency: 'usd',
product_data: {
name: prod.title || prod.name || 'Auto Part',
images: prod.image ? [prod.image] : [],
},
unit_amount: Math.round((parsedPrice || 0) * 100),
},
quantity: cartItem.quantity || 1,
};
});

const session = await stripe.checkout.sessions.create({
payment_method_types: ['card'],
line_items,
mode: 'payment',
success_url: `${req.headers.get('origin')}/?success=true`,
cancel_url: `${req.headers.get('origin')}/checkout`,
});

// Calculate total amount for the database record
const totalAmount = line_items.reduce(
(acc, item) => acc + (item.price_data.unit_amount / 100) * item.quantity,
0
);

// Save a pending order directly to Supabase
await supabase.from('orders').insert({
stripe_session_id: session.id,
amount_total: totalAmount,
items: items,
status: 'pending',
});

return NextResponse.json({ url: session.url });
} catch (error: any) {
return NextResponse.json({ error: error.message }, { status: 500 });
}
}
