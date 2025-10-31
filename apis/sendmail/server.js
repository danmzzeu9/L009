import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.set('trust proxy', 1);

const allowedOrigins = [
  'https://l009.com.br',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(express.json());
app.use(cors(corsOptions));


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post("/", async (req, res) => {
  const { contactName, contactPhone, contactSubject, contactMessage } = req.body;

  if (!contactName || !contactPhone || !contactSubject || !contactMessage) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  const content = `
    <h3>New contact from website</h3>
    <p><strong>Name:</strong> ${contactName}</p>
    <p><strong>Phone:</strong> ${contactPhone}</p>
    <p><strong>Subject:</strong> ${contactSubject}</p>
    <p><strong>Message:</strong><br>${contactMessage}</p>
  `;

  try {
    await transporter.sendMail({
      from: `"Website Form" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `Contact: ${contactSubject}`,
      html: content,
    });

    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send email.",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
