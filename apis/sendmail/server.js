import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
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
    <h3>New contact message</h3>
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

    console.log("Email sent successfully");
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email.",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
