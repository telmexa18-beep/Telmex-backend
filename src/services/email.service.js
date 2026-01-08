// Depuración: mostrar el valor de la API Key
import dotenv from "dotenv";
dotenv.config();

import SibApiV3Sdk from "sib-api-v3-sdk";
const client = SibApiV3Sdk.ApiClient.instance;

// 🔑 API KEY DE BREVO
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

export async function sendResetEmail(to, code) {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    await apiInstance.sendTransacEmail({
      sender: {
        email: process.env.EMAIL_SENDER,
        name: "Soporte Telmexa"
      },
      to: [{ email: to }],
      subject: "Código de recuperación de contraseña",
      htmlContent: `
        <h3>Recuperación de contraseña</h3>
        <p>Tu código de verificación es:</p>
        <h1 style="letter-spacing: 5px;">${code}</h1>
        <p>Este código expira en <b>10 minutos</b>.</p>
        <p>Si no solicitaste este cambio, ignora este mensaje.</p>
      `
    });

  } catch (error) {
    console.error("Error enviando correo:", error);
    throw new Error("No se pudo enviar el correo");
  }
}
