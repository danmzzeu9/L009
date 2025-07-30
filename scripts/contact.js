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

    if (contactName === '') {
        errorMessage.push('O campo <strong>Nome completo</strong> é obrigatório.<br>');
        isValid = false;
    }

    if (contactPhone === '') {
        errorMessage.push('O campo <strong>Telefone</strong> é obrigatório.<br>');
        isValid = false;
    }

    if (contactSubject === '') {
        errorMessage.push('O campo <strong>Assunto</strong> é obrigatório.<br>');
        isValid = false;
    }

    if (contactMessage === '') {
        errorMessage.push('O campo <strong>Mensagem</strong> é obrigatório.<br>');
        isValid = false;
    }

    if (!isValid) {
        contactError.innerHTML = errorMessage.join('');
        contactError.style.display = 'block';
    } else {
        contactButton.disabled = true;

        if (contactStatus) {
            contactStatus.textContent = 'Enviando...';
            contactStatus.style.display = 'block';
        } else {
            contactError.innerHTML = 'Enviando...';
            contactError.style.display = 'block';
        }

        const fullMessage = `
            <p><strong>Nome:</strong> ${contactName}</p>
            <p><strong>Telefone:</strong> ${contactPhone}</p>
            <p><strong>Assunto:</strong> ${contactSubject}</p>
            <p><strong>Mensagem:</strong><br>${contactMessage.replace(/\n/g, '<br>')}</p>
        `;

        const emailData = {
            to: "contato@l009.com.br",
            subject: `L009 - Novo Contato: ${contactSubject}`,
            text: `Nome: ${contactName}\nTelefone: ${contactPhone}\nAssunto: ${contactSubject}\nMensagem: ${contactMessage}`,
            html: fullMessage
        };

        try {
            const response = await fetch('https://server.l009.com.br/apis/sendmail/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailData)
            });

            if (contactStatus) {
                contactStatus.style.display = 'none';
            }

            if (!response.ok) {
                const errorData = await response.json();
                console.error(errorData.error || 'Erro desconhecido ao enviar email.');
                contactError.innerHTML = 'Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.';
                contactError.style.display = 'block';
                return;
            }

            const data = await response.json();
            console.log(data.message);

            contactError.innerHTML = 'Sua mensagem foi enviada com sucesso!';
            contactError.style.display = 'block';
            contactForm.reset();
        } catch (error) {
            if (contactStatus) {
                contactStatus.style.display = 'none';
            }
            console.error(error);
            contactError.innerHTML = 'Houve um problema de conexão. Verifique sua internet ou tente novamente.';
            contactError.style.display = 'block';
        } finally {
            contactButton.disabled = false;
        }
    }
});