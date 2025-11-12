// Contact Form (runs only on about.html)
if (document.getElementById('contact-form')) {
    const contactForm = document.getElementById('contact-form');
    const submitButton = contactForm?.querySelector('button[type="submit"]');
    const fields = [
        {
            id: 'contact-name',
            errorId: 'name-error',
            touched: false,
            validate: (value) => {
                if (!value.trim()) return 'Name is required.';
                if (value.length > 50) return 'Name must be 50 characters or less.';
                return '';
            }
        },
        {
            id: 'contact-email',
            errorId: 'email-error',
            touched: false,
            validate: (value) => {
                if (!value.trim()) return 'Email is required.';
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email address.';
                if (value.length > 100) return 'Email must be 100 characters or less.';
                return '';
            }
        },
        {
            id: 'message',
            errorId: 'message-error',
            touched: false,
            validate: (value) => {
                if (!value.trim()) return 'Message is required.';
                if (value.length < 10) return 'Message must be at least 10 characters.';
                if (value.length > 500) return 'Message must be 500 characters or less.';
                return '';
            }
        }
    ];

    const sanitizeInput = (value) => {
        const div = document.createElement('div');
        div.textContent = value;
        return div.innerHTML;
    };

    const validateField = (field) => {
        const input = document.getElementById(field.id);
        const error = field.touched ? field.validate(input.value) : '';
        const errorElement = document.getElementById(field.errorId);
        if (errorElement) {
            errorElement.textContent = error;
        }
        if (error) {
            input.classList.add('has-error');
        } else {
            input.classList.remove('has-error');
        }
        return error === '';
    };

    const updateFormValidity = () => {
        const allValid = fields.every(field => !field.touched || validateField(field));
        submitButton.disabled = !allValid;
    };

    fields.forEach(field => {
        const input = document.getElementById(field.id);
        
        input.addEventListener('focus', () => {
            field.touched = true;
        });

        input.addEventListener('input', () => {
            if (field.touched) {
                validateField(field);
                updateFormValidity();
            }
        });

        input.addEventListener('blur', () => {
            if (field.touched) {
                validateField(field);
                updateFormValidity();
            }
        });
    });

    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        fields.forEach(field => {
            field.touched = true;
            validateField(field);
        });

        const isValid = fields.every(field => validateField(field));
        if (!isValid) {
            document.getElementById('contact-message').textContent = 'Please fix the errors above.';
            return;
        }

        const name = sanitizeInput(document.getElementById('contact-name').value);
        const email = sanitizeInput(document.getElementById('contact-email').value);
        const message = sanitizeInput(document.getElementById('message').value);

        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    'form-name': 'contact',
                    name,
                    email,
                    message
                }).toString()
            });

            if (response.ok) {
                document.getElementById('contact-message').textContent = `Thank you, ${name}! Your message has been sent.`;
                contactForm.reset();
                fields.forEach(field => {
                    field.touched = false;
                    const errorElement = document.getElementById(field.errorId);
                    if (errorElement) {
                        errorElement.textContent = '';
                    }
                    document.getElementById(field.id).classList.remove('has-error');
                });
                submitButton.disabled = true;
            } else {
                document.getElementById('contact-message').textContent = 'Error sending message. Please try again.';
            }
        } catch (error) {
            document.getElementById('contact-message').textContent = 'Error sending message. Please try again.';
        }
    });

    submitButton.disabled = true;
}

// Order Form and Stripe (runs only on services.html)
if (document.getElementById('order-form')) {
    const stripe = Stripe('pk_live_51SAYIk3gxBNCNtyB1q2x3y4z5t6y7u8i9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z'); // Replace with your live key

    const orderForm = document.getElementById('order-form');
    const submitButton = orderForm?.querySelector('button[type="submit"]');
    const fields = [
        {
            id: 'name',
            errorId: 'name-error',
            touched: false,
            validate: (value) => {
                if (!value.trim()) return 'Name is required.';
                if (value.length > 50) return 'Name must be 50 characters or less.';
                return '';
            }
        },
        {
            id: 'email',
            errorId: 'email-error',
            touched: false,
            validate: (value) => {
                if (!value.trim()) return 'Email is required.';
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email address.';
                if (value.length > 100) return 'Email must be 100 characters or less.';
                return '';
            }
        },
        {
            id: 'package',
            errorId: 'package-error',
            touched: false,
            validate: (value) => {
                const prices = {
                    basic: { price: 50000, name: 'Basic' },
                    standard: { price: 120000, name: 'Standard' },
                    premium: { price: 250000, name: 'Premium' },

                    'basic+hosting': { price: 50000 + 12000, name: 'Basic + Hosting' },
                    'standard+hosting': { price: 120000 + 12000, name: 'Standard + Hosting' },
                    'premium+hosting': { price: 250000 + 12000, name: 'Premium + Hosting' }
                };
                if (!value || !prices[value]) return 'Please select a valid package.';
                return '';
            }
        }
    ];

    const validateField = (field) => {
        const input = document.getElementById(field.id);
        const error = field.touched ? field.validate(input.value) : '';
        const errorElement = document.getElementById(field.errorId);
        if (errorElement) {
            errorElement.textContent = error;
        }
        if (error) {
            input.classList.add('has-error');
        } else {
            input.classList.remove('has-error');
        }
        return error === '';
    };

    const updateFormValidity = () => {
        const allValid = fields.every(field => !field.touched || validateField(field));
        submitButton.disabled = !allValid;
    };

    fields.forEach(field => {
        const input = document.getElementById(field.id);
        input.addEventListener('focus', () => {
            field.touched = true;
        });
        input.addEventListener('input', () => {
            if (field.touched) {
                validateField(field);
                updateFormValidity();
            }
        });
        input.addEventListener('blur', () => {
            if (field.touched) {
                validateField(field);
                updateFormValidity();
            }
        });
    });

    orderForm?.addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log('Form submitted'); // Log 1: Starts

        fields.forEach(field => {
            field.touched = true;
            validateField(field);
        });

        const isValid = fields.every(field => validateField(field));
        if (!isValid) {
            console.log('Validation failed');
            document.getElementById('order-message').textContent = 'Please fix the errors above.';
            return;
        }

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const selectedPackage = document.getElementById('package').value;
        const details = document.getElementById('details').value;

        console.log('Form data:', { name, email, selectedPackage, details }); // Log 2: Data

        const prices = {
            basic: { price: 500, name: 'Basic' }, //  Dollars for logging; function expects cents
            standard: { price: 1200, name: 'Standard' },
            premium: { price: 2500, name: 'Premium' },
            'basic+hosting': { price: 620, name: 'Basic + Hosting' },
            'standard+hosting': { price: 1320, name: 'Standard + Hosting' },
            'premium+hosting': { price: 2620, name: 'Premium + Hosting' }
        };

        const packageData = prices[selectedPackage];
        if (!packageData) {
            console.log('Invalid package:', selectedPackage);
            document.getElementById('order-message').textContent = 'Invalid package selected.';
            return;
        }

        console.log('Package data:', packageData); // Log 3: Package

        try {
            const payload = {
                selectedPackage: { ...packageData, price: packageData.price * 100 }, // Convert to cents
                email: email,
                customerDetails: { name, details }
            };
            console.log('Payload for function:', payload); // Log 4: Payload

            const response = await fetch('/.netlify/functions/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            console.log('Fetch response status:', response.status); // Log 5: Response
            console.log('Fetch response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.log('Function error response:', errorText);
                document.getElementById('order-message').textContent = `Server error: ${response.status}`;
                return;
            }

            const session = await response.json();
            console.log('Session data:', session); // Log 6: Session

            if (session.error) {
                console.log('Session error:', session.error);
                document.getElementById('order-message').textContent = session.error;
                return;
            }

            const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
            if (error) {
                console.log('Stripe redirect error:', error);
                document.getElementById('order-message').textContent = error.message;
            }
        } catch (err) {
            console.error('Catch error:', err); // Log 7: Catch
            document.getElementById('order-message').textContent = 'Error processing payment. Please try again.';
        }
    });

    submitButton.disabled = true;
}

// Scroll Animations
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => observer.observe(section));
});