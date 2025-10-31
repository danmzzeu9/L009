const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); 

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

const EMAIL_HOST = 'smtp.hostinger.com'; 
const EMAIL_PORT = 587; 
const EMAIL_USER = 'contato@l009.com.br';
const EMAIL_PASS = '@448600Dd';
const EMAIL_DESTINO = 'contato@l009.com.br';

const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
    pool: true,
    maxConnections: 1,
    connectionTimeout: 15000,
    socketTimeout: 30000,
});

transporter.verify(function(error, success) {
    if (error) {
        console.error("ERRO DE CONEXÃO SMTP:", error.message);
    } else {
        console.log("Conexão SMTP estabelecida com sucesso!");
    }
});

app.post('/sendmail', async (req, res) => {
    const { contactName, contactPhone, contactSubject, contactMessage } = req.body;

    if (!contactName || !contactPhone || !contactSubject || !contactMessage) {
        return res.status(400).json({ error: 'All fields are mandatory.' });
    }

    const htmlContent = `
        <h3>Novo Contato Recebido</h3>
        <p><strong>Nome:</strong> ${contactName}</p>
        <p><strong>Telefone:</strong> ${contactPhone}</p>
        <p><strong>Assunto:</strong> ${contactSubject}</p>
        <p><strong>Mensagem:</strong><br>${contactMessage.replace(/\n/g, '<br>')}</p>
    `;

    const textContent = `
        Novo Contato Recebido
        Name: ${contactName}
        Phone: ${contactPhone}
        Subject: ${contactSubject}
        Message: ${contactMessage}
    `;

    const mailOptions = {
        from: `"${contactName}" <${EMAIL_USER}>`,
        to: EMAIL_DESTINO,
        subject: `L009 - Novo Contato: ${contactSubject}`,
        text: textContent,
        html: htmlContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);

        res.status(200).json({ 
            message: 'Email sent successfully!', 
            messageId: info.messageId 
        });

    } catch (error) {
        console.error("Error sending email:", error.message);
        res.status(500).json({ 
            error: 'Ocorreu um erro interno ao enviar o e-mail.',
            details: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});