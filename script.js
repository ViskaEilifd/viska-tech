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

    // Sanitize input to prevent XSS
    const sanitizeInput = (value) => {
        const div = document.createElement('div');
        div.textContent = value;
        return div.innerHTML;
    };

    // Validate a single field and update its error message and border
    const validateField = (field) => {
        const input = document.getElementById(field.id);
        const error = field.touched ? field.validate(input.value) : '';
        document.getElementById(field.errorId).textContent = error;
        if (error) {
            input.classList.add('has-error');
        } else {
            input.classList.remove('has-error');
        }
        return error === '';
    };

    // Check if all touched fields are valid to enable submit button
    const updateFormValidity = () => {
        const allValid = fields.every(field => !field.touched || validateField(field));
        submitButton.disabled = !allValid;
    };

    // Set up event listeners for each field
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        
        // Mark field as touched on first focus
        input.addEventListener('focus', () => {
            field.touched = true;
        });

        // Validate on input (real-time feedback)
        input.addEventListener('input', () => {
            if (field.touched) {
                validateField(field);
                updateFormValidity();
            }
        });

        // Validate on blur
        input.addEventListener('blur', () => {
            if (field.touched) {
                validateField(field);
                updateFormValidity();
            }
        });
    });

    // Form submission
    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Mark all fields as touched on submit attempt
        fields.forEach(field => {
            field.touched = true;
            validateField(field);
        });

        // Check all fields for final validation
        const isValid = fields.every(field => validateField(field));
        if (!isValid) {
            document.getElementById('contact-message').textContent = 'Please fix the errors above.';
            return;
        }

        const name = sanitizeInput(document.getElementById('contact-name').value);
        const email = sanitizeInput(document.getElementById('contact-email').value);
        const message = sanitizeInput(document.getElementById('message').value);

        try {
            // Submit to Netlify Forms
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
                    document.getElementById(field.errorId).textContent = '';
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

    // Initialize submit button as disabled
    submitButton.disabled = true;
}

// Order Form and Stripe (runs only on services.html)
if (document.getElementById('order-form')) {
    const stripe = Stripe('pk_live_51SAYIB3QVEDyGnrHmz0LObAHrwGiqKTW83OxmlSxAmhPYTcI3MCDAkfwTXo03fuBGISErEFhP18X589sglQRq5kC00Lodmwnb5');

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
                    basic: { price: 50000, name: 'Basic Website Package' },
                    standard: { price: 75000, name: 'Standard Website Package' },
                    premium: { price: 100000, name: 'Premium Website Package' },
                    mnt_basic: { price: 25000, name: 'Basic Website Maintenance' },
                    mnt_standard: { price: 50000, name: 'Standard Website Maintenance' },
                    mnt_premium: { price: 75000, name: 'Premium Website Maintenance' }
                };
                console.log('Selected package:', value); // Debug
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

        fields.forEach(field => {
            field.touched = true;
            validateField(field);
        });

        const isValid = fields.every(field => validateField(field));
        if (!isValid) {
            document.getElementById('order-message').textContent = 'Please fix the errors above.';
            return;
        }

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const selectedPackage = document.getElementById('package').value;
        const details = document.getElementById('details').value;

        const prices = {
            basic: { price: 50000, name: 'Basic Website Package' },
            standard: { price: 75000, name: 'Standard Website Package' },
            premium: { price: 100000, name: 'Premium Website Package' },
            mnt_basic: { price: 25000, name: 'Basic Website Maintenance' },
            mnt_standard: { price: 50000, name: 'Standard Website Maintenance' },
            mnt_premium: { price: 75000, name: 'Premium Website Maintenance' }
        };

        const packageData = prices[selectedPackage];
        if (!packageData) {
            document.getElementById('order-message').textContent = 'Invalid package selected.';
            return;
        }

        try {
            const response = await fetch('/.netlify/functions/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    selectedPackage: packageData,
                    email: email,
                    customerDetails: { name, details }
                })
            });

            const session = await response.json();
            if (session.error) {
                document.getElementById('order-message').textContent = session.error;
                return;
            }

            const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
            if (error) {
                document.getElementById('order-message').textContent = error.message;
            }
        } catch (err) {
            document.getElementById('order-message').textContent = 'Error processing payment. Please try again.';
        }
    });

    submitButton.disabled = true;
}