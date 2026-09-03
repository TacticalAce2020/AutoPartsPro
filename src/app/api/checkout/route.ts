import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
try {
const { items } = await req.json();

const line_items = items.map((item: any) => {
const rawPrice = typeof item.price === 'string'
? parseFloat(item.price.replace(/[^0-9.]/g, ''))
: item.price;

return {
price_data: {
currency: 'usd',
product_data: {
name: item.title || item.name || 'Auto Part',
images: item.image ? [item.image] : [],
},
unit_amount: Math.round((rawPrice || 0) * 100),
},
quantity: item.quantity || 1,
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
