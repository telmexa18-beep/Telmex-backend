import bcrypt from "bcryptjs";

// 🔢 Genera un código de 6 dígitos
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 🔐 Hashea el código
export async function hashOTP(code) {
  return await bcrypt.hash(code, 10);
}

// ⏱ Expiración (10 minutos)
export function getOTPExpiration(minutes = 10) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

// ✅ Verificar OTP
export async function verifyOTP(inputCode, hashedCode) {
  return await bcrypt.compare(inputCode, hashedCode);
}
