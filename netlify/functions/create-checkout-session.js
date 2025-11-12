const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    console.log('Function invoked with method:', event.httpMethod);
    console.log('Raw body:', event.body);

    if (event.httpMethod !== 'POST') {
        console.log('Non-POST request');
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body);
        console.log('Parsed body:', body);

        const { selectedPackage, email, customerDetails } = body;

        if (!selectedPackage || !selectedPackage.price || !email) {
            console.log('Missing required fields');
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        console.log('Creating session with price:', selectedPackage.price, 'for', email);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: selectedPackage.name,
                            description: customerDetails?.details || 'Website development package'
                        },
                        unit_amount: selectedPackage.price  // Assumes cents
                    },
                    quantity: 1
                }
            ],
            customer_email: email,
            mode: 'payment',
            success_url: 'https://viska-tech.netlify.app/thanks.html',
            cancel_url: 'https://viska-tech.netlify.app/services.html',
            metadata: customerDetails || {}
        });

        console.log('Session created successfully:', session.id);

        return {
            statusCode: 200,
            body: JSON.stringify({ id: session.id })
        };
    } catch (error) {
        console.error('Function error:', error.message);
        console.error('Full error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};