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

        const formData = {
            contactName: contactName,
            contactPhone: contactPhone,
            contactSubject: contactSubject,
            contactMessage: contactMessage
        };

        try {
            const response = await fetch('https://sendmail-production-b393.up.railway.app/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (contactStatus) {
                contactStatus.style.display = 'none';
            }

            if (!response.ok) {
                const errorData = await response.json();
                const detailedError = errorData.details 
                    ? `Erro interno detalhado: ${errorData.details}` 
                    : 'Erro desconhecido ao enviar e-mail.';

                console.error(detailedError);
                
                contactError.innerHTML = 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.';
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
        
            console.error("Falha na Rede ou Bloqueio CORS:", error);
            
            contactError.innerHTML = 'Houve um problema de conexão. Verifique sua internet ou tente novamente.';
            contactError.style.display = 'block';
        } finally {
            contactButton.disabled = false;
        }
    }
});