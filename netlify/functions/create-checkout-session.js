const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    console.log('Function invoked');
    console.log('Body:', event.body);

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405 };
    }

    try {
        const { selectedPackage, email } = JSON.parse(event.body);

        // ENSURE price is in CENTS
        const amount = Math.round(selectedPackage.price * 100);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { name: selectedPackage.name },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.URL}/success.html`,
            cancel_url: `${process.env.URL}/services.html`,
            customer_email: email,
        });

        console.log('Session created:', session.id);

        return {
            statusCode: 200,
            body: JSON.stringify({ id: session.id }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};