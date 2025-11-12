console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
console.log('First 10 chars:', process.env.STRIPE_SECRET_KEY?.substring(0, 10));

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    try {
        const { selectedPackage, email, customerDetails } = JSON.parse(event.body);

        // Validate inputs
        if (!selectedPackage || !selectedPackage.name || !selectedPackage.price) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid or missing package data' })
            };
        }
        if (!email || !customerDetails || !customerDetails.name) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Create Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: selectedPackage.name,
                            description: customerDetails.details || 'Website development package'
                        },
                        unit_amount: selectedPackage.price
                    },
                    quantity: 1
                }
            ],
            customer_email: email,
            mode: 'payment',
            success_url: 'https://viska-tech.netlify.app/thanks.html',
            cancel_url: 'https://viska-tech.netlify.app/services.html',
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
            body: JSON.stringify({ error: error.message || 'Failed to create checkout session' })
        };
    }
};