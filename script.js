// Order Form (Services Page)
document.getElementById('order-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const package = document.getElementById('package').value;
    const details = document.getElementById('details').value;

    // Basic validation
    if (!name || !email || !package) {
        document.getElementById('order-message').textContent = 'Please fill out all required fields.';
        return;
    }

    // Dummy submission feedback
    document.getElementById('order-message').textContent = `Thank you, ${name}! Your ${package} package order is received. We'll contact you at ${email}.`;
    this.reset();
});

// Contact Form (About Page)
document.getElementById('contact-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('message').value;

    // Basic validation
    if (!name || !email || !message) {
        document.getElementById('contact-message').textContent = 'Please fill out all required fields.';
        return;
    }

    // Dummy submission feedback
    document.getElementById('contact-message').textContent = `Thank you, ${name}! Your message has been sent.`;
    this.reset();
});