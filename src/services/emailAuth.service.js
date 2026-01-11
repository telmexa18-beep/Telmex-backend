import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendOtpEmail = async (to, code) => {
  const msg = {
    to: to,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL, // 🔴 OBLIGATORIO
      name: "Telmex Soporte",                  // 🟢 Opcional
    },
    subject: "Código de verificación",
    text: `Tu código de verificación es: ${code}`,
    html: `<p>Tu código de verificación es: <b>${code}</b></p>`,
  };

  try {
    await sgMail.send(msg);
    console.log("📨 Correo enviado correctamente");
  } catch (error) {
    console.error("❌ ERROR SENDGRID:", error.response?.body || error);
    throw new Error("Error enviando correo");
  }
};
