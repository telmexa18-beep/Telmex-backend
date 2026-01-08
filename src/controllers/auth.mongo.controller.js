import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Worker from "../models/Worker.js";
import { sendResetEmail } from "../services/email.service.js";
import {
  generateOTP,
  hashOTP,
  verifyOTP,
  getOTPExpiration
} from "../services/otp.service.js";


/* ======================================================
   LOGIN
====================================================== */
export const login = async (req, res) => {
  const { email, mail, password } = req.body || {};
  const userEmail = email || mail || "";

  if (!userEmail || !password) {
    return res.status(400).json({
      success: false,
      message: "Email y contraseña son requeridos"
    });
  }

  try {
    const normalizedEmail = userEmail.toLowerCase().trim();
    const worker = await Worker.findOne({ email: normalizedEmail });

    if (!worker) {
      return res.status(401).json({
        success: false,
        message: "Email o contraseña incorrectos"
      });
    }

    const match = await bcrypt.compare(password, worker.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Email o contraseña incorrectos"
      });
    }

    const token = jwt.sign(
      { id: worker._id, email: worker.email, role: worker.role },
      process.env.JWT_SECRET || "1234567890abcdef",
      { expiresIn: "24h" }
    );

    const { _id, email: email, name, last_name, role, zone } = worker;

    res.json({
      success: true,
      message: "Login exitoso",
      token,
      worker: {
        id: _id,
        email: email,
        name,
        lastName: last_name,
        role,
        zone
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error al procesar el login"
    });
  }
};

/* ======================================================
   VERIFY TOKEN
====================================================== */
export const verifyToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token no proporcionado"
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "1234567890abcdef"
    );

    res.json({
      success: true,
      message: "Token válido",
      user: decoded
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token inválido o expirado"
    });
  }
};

/* ======================================================
   SEND RESET CODE
====================================================== */
export const sendResetCode = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const worker = await Worker.findOne({ email: normalizedEmail });
    if (!worker) {
      return res.status(404).json({
        message: "Trabajador no encontrado"
      });
    }

    // ⏱ Evitar spam (2 minutos)
    if (
      worker.resetCodeExpires &&
      worker.resetCodeExpires > new Date(Date.now() - 2 * 60 * 1000)
    ) {
      return res.status(429).json({
        message: "Espera un momento antes de solicitar otro código"
      });
    }

    const code = generateOTP();

    worker.resetCode = await hashOTP(code);
    worker.resetCodeExpires = getOTPExpiration(10); // 10 minutos
    worker.resetCodeVerified = false;

    await worker.save();
    await sendResetEmail(normalizedEmail, code);

    res.json({
      message: "Código enviado al correo"
    });
  } catch (error) {
    console.error("Error enviando código:", error);
    res.status(500).json({
      message: "Error enviando código"
    });
  }
};

/* ======================================================
   VERIFY RESET CODE
====================================================== */
export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const worker = await Worker.findOne({ email: normalizedEmail });
    if (!worker || !worker.resetCode) {
      return res.status(400).json({
        message: "Solicitud inválida"
      });
    }

    if (worker.resetCodeExpires < new Date()) {
      return res.status(400).json({
        message: "Código expirado"
      });
    }

    const valid = await verifyOTP(code, worker.resetCode);
    if (!valid) {
      return res.status(400).json({
        message: "Código incorrecto"
      });
    }

    worker.resetCodeVerified = true;
    await worker.save();

    res.json({
      message: "Código válido"
    });
  } catch (error) {
    console.error("Error validando código:", error);
    res.status(500).json({
      message: "Error validando código"
    });
  }
};

/* ======================================================
   SET NEW PASSWORD
====================================================== */
export const setNewPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const worker = await Worker.findOne({ email: normalizedEmail });
    if (!worker) {
      return res.status(404).json({
        message: "Trabajador no encontrado"
      });
    }

    if (!worker.resetCodeVerified) {
      return res.status(403).json({
        message: "Código no verificado"
      });
    }

    worker.password = await bcrypt.hash(newPassword, 10);
    worker.resetCode = null;
    worker.resetCodeExpires = null;
    worker.resetCodeVerified = false;

    await worker.save();

    res.json({
      message: "Contraseña actualizada correctamente"
    });
  } catch (error) {
    console.error("Error actualizando contraseña:", error);
    res.status(500).json({
      message: "Error actualizando contraseña"
    });
  }
};


