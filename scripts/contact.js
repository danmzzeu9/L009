const contactForm = document.getElementById('contact');
const contactError = document.getElementById('contact-error');
const contactStatus = document.getElementById('contact-status');
const contactButton = document.getElementById('contact-button');

contactForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    contactError.textContent = '';
    contactError.style.display = 'none';
    if (contactStatus) {
        contactStatus.textContent = '';
        contactStatus.style.display = 'none';
    }

    const contactName = document.getElementById('contact-name').value.trim();
    const contactPhone = document.getElementById('contact-phone').value.trim();
    const contactSubject = document.getElementById('contact-subject').value.trim();
    const contactMessage = document.getElementById('contact-message').value.trim();

    let isValid = true;
    let errorMessage = [];

    if (contactName === '') { errorMessage.push('The <strong>Name</strong> field is required.<br>'); isValid = false; }
    if (contactPhone === '') { errorMessage.push('The <strong>Phone</strong> field is required.<br>'); isValid = false; }
    if (contactSubject === '') { errorMessage.push('The <strong>Subject</strong> field is required.<br>'); isValid = false; }
    if (contactMessage === '') { errorMessage.push('The <strong>Message</strong> field is required.<br>'); isValid = false; }

    if (!isValid) {
        contactError.innerHTML = errorMessage.join('');
        contactError.style.display = 'block';
    } else {
        contactButton.disabled = true;
        if (contactStatus) { contactStatus.textContent = 'Sending...'; contactStatus.style.display = 'block'; }
        else { contactError.innerHTML = 'Sending...'; contactError.style.display = 'block'; }

        const formData = { contactName, contactPhone, contactSubject, contactMessage };

        try {
            const response = await fetch('https://l009-production.up.railway.app/apis/sendmail/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (contactStatus) contactStatus.style.display = 'none';

            if (!response.ok) {
                const errorData = await response.json();
                console.error(errorData.details || 'Unknown error.');
                contactError.innerHTML = 'There was an error sending your message. Please try again later.';
                contactError.style.display = 'block';
                return;
            }

            const data = await response.json();
            contactError.innerHTML = 'Your message was sent successfully!';
            contactError.style.display = 'block';
            contactForm.reset();
        } catch (error) {
            if (contactStatus) contactStatus.style.display = 'none';
            console.error("Network or CORS error:", error);
            contactError.innerHTML = 'Network error. Check your connection or try again.';
            contactError.style.display = 'block';
        } finally {
            contactButton.disabled = false;
        }
    }
});
