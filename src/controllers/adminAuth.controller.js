import { generateOtp, verifyOtp } from "../services/otpAuth.service.js";
import { sendOtpEmail } from "../services/emailAuth.service.js";

export const requestCode = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("EMAIL RECIBIDO:", email);

    if (email !== process.env.EMAIL_USER) {
      return res.status(400).json({ message: "Correo invalido" });
    }

    const code = generateOtp(email);
    console.log("CÓDIGO GENERADO:", code);
    await sendOtpEmail(email, code);
    console.log("EMAIL ENVIADO A:", email);
    res.json({ message: "Código enviado al correo" });
  } catch (error) {
    console.error("ERROR REAL:", error); // 👈 CLAVE
    res.status(500).json({
      message: "Error enviando código",
      error: error.message,
    });
  }
};

export const verifyCode = (req, res) => {
  const { email, code } = req.body;

  const isValid = verifyOtp(email, code);

  if (!isValid) {
    return res.status(401).json({ message: "Código inválido o expirado" });
  }

  res.json({ message: "Acceso permitido" });
};
