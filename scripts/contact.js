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

    if (contactName === '') { errorMessage.push('O campo <strong>Nome</strong> é obrigatório.<br>'); isValid = false; }
    if (contactPhone === '') { errorMessage.push('O campo <strong>Telefone</strong> é obrigatório.<br>'); isValid = false; }
    if (contactSubject === '') { errorMessage.push('O campo <strong>Assunto</strong> é obrigatório.<br>'); isValid = false; }
    if (contactMessage === '') { errorMessage.push('O campo <strong>Mensagem</strong> é obrigatório.<br>'); isValid = false; }

    if (!isValid) {
        contactError.innerHTML = errorMessage.join('');
        contactError.style.display = 'block';
    } else {
        contactButton.disabled = true;
        if (contactStatus) { contactStatus.textContent = 'Enviando...'; contactStatus.style.display = 'block'; }
        else { contactError.innerHTML = 'Enviando...'; contactError.style.display = 'block'; }

        const formData = { contactName, contactPhone, contactSubject, contactMessage };

        try {
            const response = await fetch('https://l009-production.up.railway.app/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (contactStatus) contactStatus.style.display = 'none';

            if (!response.ok) {
                const errorData = await response.json();
                console.error(errorData.details || 'Erro desconhecido.');
                contactError.innerHTML = 'Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.';
                contactError.style.display = 'block';
                return;
            }

            const data = await response.json();
            contactError.innerHTML = 'Sua mensagem foi enviada com sucesso!';
            contactError.style.display = 'block';
            contactForm.reset();
        } catch (error) {
            if (contactStatus) contactStatus.style.display = 'none';
            console.error("Network or CORS error:", error);
            contactError.innerHTML = 'Erro de rede. Verifique sua conexão ou tente novamente.';
            contactError.style.display = 'block';
        } finally {
            contactButton.disabled = false;
        }
    }
});