// netlify/functions/create-checkout-session.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    try {
        const { package, email, customerDetails } = JSON.parse(event.body);

        // Create Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: package.name,
                            description: customerDetails.details || 'Website development package'
                        },
                        unit_amount: package.price // In cents
                    },
                    quantity: 1
                }
            ],
            customer_email: email,
            mode: 'payment',
            success_url: 'https://your-site.netlify.app/thanks.html',
            cancel_url: 'https://your-site.netlify.app/services.html',
            metadata: {
                customer_name: customerDetails.name,
                details: customerDetails.details
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ id: session.id })
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message })
        };
    }
};
