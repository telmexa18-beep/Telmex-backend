// src/services/email.service.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOtpEmail(email, code) {
  return transporter.sendMail({
    from: `"Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Tu código de acceso",
    html: `
      <h2>Código de inicio de sesión</h2>
      <h1>${code}</h1>
      <p>Expira en 5 minutos</p>
    `,
  });
}

