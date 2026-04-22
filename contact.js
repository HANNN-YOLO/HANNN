const EMAILJS_PUBLIC_KEY = 'lkLJzniL9wPwr1_ac';
const EMAILJS_SERVICE_ID = 'service_ctwsd2l';
const EMAILJS_TEMPLATE_ID = 'template_jmqm90o';

const form = document.getElementById('contactForm');
const statusText = document.getElementById('formStatus');
const submitButton = form?.querySelector('button[type="submit"]');

function setStatus(message, type) {
    if (!statusText) {
        return;
    }

    statusText.textContent = message;
    statusText.classList.remove('is-success', 'is-error');

    if (type) {
        statusText.classList.add(type);
    }
}

function isConfigured() {
    return ![
        EMAILJS_PUBLIC_KEY,
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
    ].some((value) => value.includes('YOUR_'));
}

if (window.emailjs && isConfigured()) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

form?.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!window.emailjs) {
        setStatus('Email library belum dimuat. Cek koneksi internet atau CDN.', 'is-error');
        return;
    }

    if (!isConfigured()) {
        setStatus('Isi dulu EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, dan EMAILJS_TEMPLATE_ID di contact.js.', 'is-error');
        return;
    }

    try {
        submitButton.disabled = true;
        submitButton.textContent = 'SENDING...';
        setStatus('Mengirim pesan...', null);

        await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);

        form.reset();
        setStatus('Pesan berhasil dikirim ke Gmail yang kamu atur di EmailJS.', 'is-success');
    } catch (error) {
        console.error('EmailJS error:', error);
        setStatus('Pesan gagal dikirim. Cek service, template, dan public key EmailJS.', 'is-error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'SEND MESSAGE';
    }
});
