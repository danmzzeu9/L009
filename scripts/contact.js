const contactForm = document.getElementById('contact');
const contactError = document.getElementById('contact-error');
const contactStatus = document.getElementById('contact-status');
const contactButton = document.getElementById('contact-button');

// *** SUBSTITUA ESTE VALOR PELA URL DO SEU GOOGLE APPS SCRIPT ***
const SPREADSHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxs4gwe4OzwEmn4JFSYlmb5aa6aQK519nnYoMd5r509ZpWOGfAYh_d_4KPPLIGMmvYW/exec';

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

    // --- Validações (mantidas do seu código original) ---
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
    // ----------------------------------------------------

    if (!isValid) {
        contactError.innerHTML = errorMessage.join('');
        contactError.style.display = 'block';
    } else {
        contactButton.disabled = true;

        if (contactStatus) {
            contactStatus.textContent = 'Enviando dados para a planilha...';
            contactStatus.style.display = 'block';
        } else {
            contactError.innerHTML = 'Enviando dados para a planilha...';
            contactError.style.display = 'block';
        }

        // Prepara os dados para o Apps Script
        const spreadsheetData = {
            name: contactName,
            phone: contactPhone,
            subject: contactSubject,
            message: contactMessage
        };

        try {
            // A requisição agora aponta para o seu Apps Script
            const response = await fetch(SPREADSHEET_ENDPOINT, {
                method: 'POST',
                headers: {
                    // O Apps Script espera JSON no body
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(spreadsheetData)
            });

            if (contactStatus) {
                contactStatus.style.display = 'none';
            }
            
            // O Apps Script sempre retorna um JSON, mesmo em caso de sucesso
            const data = await response.json(); 

            if (data.result === 'error') {
                console.error('Erro ao salvar na planilha:', data.message);
                contactError.innerHTML = 'Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.';
                contactError.style.display = 'block';
                return;
            }

            // Sucesso!
            console.log(data.message); 

            contactError.innerHTML = 'Sua mensagem foi enviada e registrada com sucesso na planilha!';
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