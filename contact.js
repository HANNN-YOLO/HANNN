const EMAILJS_PUBLIC_KEY = 'lkLJzniL9wPwr1_ac';
const EMAILJS_SERVICE_ID = 'service_ctwsd2l';
const EMAILJS_TEMPLATE_ID = 'template_jmqm90o';
const DEFAULT_CV_FILE = 'assets/cv.pdf';
const DEFAULT_CV_FILENAME = 'Reyhan-Rafaidhil-CV.pdf';

const form = document.getElementById('contactForm');
const statusText = document.getElementById('formStatus');
const submitButton = form?.querySelector('button[type="submit"]');
const downloadCvButton = document.getElementById('downloadCv');

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

async function downloadFile(fileUrl, fileName) {
    const response = await fetch(fileUrl);

    if (!response.ok) {
        throw new Error(`Gagal mengambil file: ${response.status}`);
    }

    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(objectUrl);
}

downloadCvButton?.addEventListener('click', async (event) => {
    event.preventDefault();

    const fileUrl = downloadCvButton.dataset.cvSrc || DEFAULT_CV_FILE;
    const fileName = downloadCvButton.dataset.cvFilename || DEFAULT_CV_FILENAME;

    try {
        downloadCvButton.setAttribute('aria-busy', 'true');
        await downloadFile(fileUrl, fileName);
    } catch (error) {
        console.error('CV download error:', error);
        alert('File CV belum ditemukan. Pastikan PDF sudah disimpan di folder assets.');
    } finally {
        downloadCvButton.removeAttribute('aria-busy');
    }
});

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

        const formData = new FormData(form);
        const templateParams = {
            name: formData.get('name') || '',
            email: formData.get('email') || '',
            subject: formData.get('subject') || '',
            title: formData.get('subject') || '',
            message: formData.get('message') || '',
            reply_to: formData.get('email') || '',
        };

        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

        form.reset();
        setStatus('Pesan berhasil dikirim', 'is-success');
    } catch (error) {
        console.error('EmailJS error:', error);
        setStatus('Pesan gagal dikirim', 'is-error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'SEND MESSAGE';
    }
});
