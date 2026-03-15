<<<<<<< HEAD
import { envInt } from "./readEnvVart.service";

type OtpEntry = {
  code: string;
  expiresAt: number;
};

const otpStore = new Map<string, OtpEntry>();

export function generateOtp(email: string): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const ttlMinutes = envInt("OTP_TTL_MINUTES", 5);
  otpStore.set(email, {
    code,
    expiresAt: Date.now() + ttlMinutes * 60 * 1000,
  });

  return code;
}

export function verifyOtp(email: string, code: string): boolean {
  const entry = otpStore.get(email);

  if (!entry) return false;
  if (entry.expiresAt < Date.now()) return false;

  const ok = entry.code === code;

  if (ok) {
    otpStore.delete(email); // invalidate on success
  }

  return ok;
}
=======
type OtpEntry = {
  code: string;
  expiresAt: number;
};

const otpStore = new Map<string, OtpEntry>();

function envInt(name: string, defaultValue: number): number {
  const v = process.env[name];
  if (!v) return defaultValue;
  const n = Number(v);
  return Number.isFinite(n) ? n : defaultValue;
}

export function generateOtp(email: string): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const ttlMinutes = envInt("OTP_TTL_MINUTES", 5);
  otpStore.set(email, {
    code,
    expiresAt: Date.now() + ttlMinutes * 60 * 1000,
  });

  return code;
}

export function verifyOtp(email: string, code: string): boolean {
  const entry = otpStore.get(email);

  if (!entry) return false;
  if (entry.expiresAt < Date.now()) return false;

  const ok = entry.code === code;

  if (ok) {
    otpStore.delete(email); // invalidate on success
  }

  return ok;
}
>>>>>>> 3021c2567a6c53da578b52677e4f94c9ea73a29f
