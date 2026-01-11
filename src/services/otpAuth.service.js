const otpStore = new Map();
// email -> { code, expiresAt }

export function generateOtp(email) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpStore.set(email, { code, expiresAt });
  return code;
}

export function verifyOtp(email, inputCode) {
  const data = otpStore.get(email);
  if (!data) return false;

  if (Date.now() > data.expiresAt) {
    otpStore.delete(email);
    return false;
  }

  if (data.code !== inputCode) return false;

  otpStore.delete(email);
  return true;
}

