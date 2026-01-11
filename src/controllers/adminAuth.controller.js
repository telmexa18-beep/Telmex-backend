import { generateOtp, verifyOtp } from "../services/otpAuth.service.js";
import { sendOtpEmail } from "../services/emailAuth.service.js";

export const requestCode = async (req, res) => {
  console.log("➡️ Entró a /requestCode");

  try {
    const { email } = req.body;

    console.log("📩 EMAIL RECIBIDO:", email);
    console.log("🔐 EMAIL USER ENV:", process.env.EMAIL_USER);

    if (email !== process.env.EMAIL_USER) {
      console.log("❌ Email no coincide");
      return res.status(400).json({ message: "Correo invalido" });
    }

    console.log("✅ Email válido, generando código...");
    const code = generateOtp(email);
    console.log("🔢 CÓDIGO GENERADO:", code);

    console.log("📤 Antes de enviar email...");
    await sendOtpEmail(email, code);

    console.log("📨 EMAIL ENVIADO CORRECTAMENTE");
    res.json({ message: "Código enviado al correo" });

  } catch (error) {
    console.error("🔥 ERROR EN requestCode:", error);
    console.error("🔥 STACK:", error?.stack);

    res.status(500).json({
      message: "Error enviando código",
      error: error.message,
    });
  }
};

export const verifyCode = (req, res) => {
  console.log("➡️ Entró a /verifyCode");

  const { email, code } = req.body;

  console.log("📩 EMAIL:", email);
  console.log("🔢 CODE:", code);

  const isValid = verifyOtp(email, code);
  console.log("🧪 OTP válido?", isValid);

  if (!isValid) {
    return res.status(401).json({ message: "Código inválido o expirado" });
  }

  res.json({ message: "Acceso permitido" });
};
