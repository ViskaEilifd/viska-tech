// services.js - all JS from the <script> block

// Core-features accordion
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
        price: '$10/month (billed annually – $120)',
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

    card.querySelector('h2').textContent = `${pkg.name} – ${pkg.price}`;
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