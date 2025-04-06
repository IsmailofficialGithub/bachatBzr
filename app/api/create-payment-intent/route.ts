import { NextResponse } from 'next/server';

const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
    try {
        const { amount } = await req.json(); // Amount in paisa (smallest currency unit for PKR)

        const paymentIntent = await stripe.paymentIntents.create({
            amount, // PKR amount in paisa (e.g., 5000 PKR = 500000 paisa)
            currency: 'pkr', // Currency set to PKR
            automatic_payment_methods: {enabled:true},
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to create payment intent',error }, { status: 500 });
    }
}
