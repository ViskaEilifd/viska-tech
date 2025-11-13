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