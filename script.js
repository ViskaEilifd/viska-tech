// Responsive Nav Menu
const navToggle = document.getElementById('nav-toggle');
const navList = document.getElementById('nav-list');

navToggle.addEventListener('click', function () {
  navList.classList.toggle('active');
});

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

// Services.html)
if (document.getElementById('consult-container')) {
    document.querySelectorAll('.features-accordion .feature').forEach(el => {
        el.addEventListener('click', () => el.classList.toggle('active'));
    });

    // Package data
    const packages = {
        basic: {
            name: 'Basic',
            price: '$500',
            items: [
                'All core features.',
                'Up to 5 pages (Home, About/Contact, Services/Products, Blog).',
                '1 round of revisions; 30-day support.',
                'WordPress setup + basic training.'
            ]
        },
        standard: {
            name: 'Standard',
            price: '$1,200',
            items: [
                'Everything in Basic.',
                'Up to 10 pages + 1 custom landing page.',
                'Advanced SEO',
                'Customized features & graphics.',
                '2 rounds revisions; 90-day support + monthly check-in.'
            ]
        },
        premium: {
            name: 'Premium',
            price: '$2,500',
            items: [
                'Everything in Standard.',
                'Unlimited pages; full e-store (up to 50 products).',
                'Custom integrations (booking calendar, advanced payments).',
                'Performance audit + ongoing tweaks (3 months).',
                '3 rounds revisions; 6-month support + quarterly updates.'
            ]
        },
        hosting: {
            name: 'Worry-Free Hosting & Maintenance',
            price: '$10/month (billed annually - $120)',
            items: [
                'Lightning-fast, secure hosting',
                'Daily backups & weekly updates',
                'SSL certificate & malware protection',
                '24/7 uptime monitoring',
                'One point of contact for everything'
            ]
        }
    };

    // Modal HTML (injected once)
    const modalHTML = `
<div id="package-modal">
    <div class="modal-card">
        <button class="close" aria-label="Close">X</button>
        <button class="nav-arrow nav-left" aria-label="Previous Package">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M15 18l-6-6 6-6"/>
            </svg>
        </button>
        <button class="nav-arrow nav-right" aria-label="Next Package">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M9 18l6-6-6-6"/>
            </svg>
        </button>
        <h2></h2>
        <ul></ul>
    </div>
</div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Modal functions
    let currentPkg = null;

    function renderModal(key) {
        const pkg = packages[key];
        const modal = document.getElementById('package-modal');
        const card = modal.querySelector('.modal-card');

        card.querySelector('h2').textContent = `${pkg.name} - ${pkg.price}`;
        const ul = card.querySelector('ul');
        ul.innerHTML = '';
        pkg.items.forEach(i => {
            const li = document.createElement('li');
            li.textContent = i;
            ul.appendChild(li);
        });

        const keys = Object.keys(packages);
        const idx = keys.indexOf(key);
        const left = card.querySelector('.nav-left');
        const right = card.querySelector('.nav-right');

        left.onclick = () => renderModal(keys[(idx - 1 + keys.length) % keys.length]);
        right.onclick = () => renderModal(keys[(idx + 1) % keys.length]);

        currentPkg = key;
        modal.classList.add('active');
    }

    function closeModal() {
        document.getElementById('package-modal').classList.remove('active');
    }

    // Click handlers
    document.querySelectorAll('.package-card').forEach(card => {
        card.addEventListener('click', () => {
            const key = card.dataset.pkg;
            renderModal(key);
        });
    });

    document.querySelector('#package-modal .close').addEventListener('click', closeModal);
    document.getElementById('package-modal').addEventListener('click', e => {
        if (e.target.id === 'package-modal') closeModal();
    });
}

// Scroll Animations (global)
/*
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
*/