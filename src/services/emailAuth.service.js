import sgMail from "@sendgrid/mail";

// ⚠️ Solo configurar la API key si existe
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export const sendOtpEmail = async (to, code) => {

  // 🔎 Log de entorno
  console.log("📧 SENDGRID_FROM_EMAIL:", process.env.SENDGRID_FROM_EMAIL);
  console.log("🌍 NODE_ENV:", process.env.NODE_ENV);
  

  // 🧪 PROTECCIÓN: no romper endpoint en producción
  if (process.env.NODE_ENV === "production" && !process.env.SENDGRID_FROM_EMAIL) {
    console.warn("🚫 Email deshabilitado en producción (FROM no configurado)");
    return;
  }

  const msg = {
    to,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: "Telmex Soporte",
    },
    subject: "Código de verificación",
    text: `Tu código de verificación es: ${code}`,
    html: `<p>Tu código de verificación es: <b>${code}</b></p>`,
  };

  try {
    console.log("📤 Intentando enviar correo...");
    await sgMail.send(msg);
    console.log("📨 Correo enviado correctamente");
  } catch (error) {
    console.error("❌ ERROR SENDGRID:", error.response?.body || error);

    // 🚨 NO romper el flujo principal
    if (process.env.NODE_ENV === "production") {
      console.warn("⚠️ Error de correo ignorado en producción");
      return;
    }

    // ❌ En local sí lanzamos el error
    throw new Error("Error enviando correo");
  }
};

