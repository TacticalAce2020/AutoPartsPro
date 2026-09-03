import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
try {
const { items } = await req.json();

const line_items = items.map((cartItem: any) => {
// Access nested product object from CartItem structure
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

return NextResponse.json({ url: session.url });
} catch (error: any) {
return NextResponse.json({ error: error.message }, { status: 500 });
}
}
