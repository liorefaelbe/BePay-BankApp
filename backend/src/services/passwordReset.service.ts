import crypto from "crypto";
import { envInt } from "./readEnvVart.service";

type ResetRecord = {
  tokenHash: string;
  email: string;
  expiresAt: number;
};

const store = new Map<string, ResetRecord>();

// Using a hash of the token allows us to avoid storing the raw token,
// which is more secure in case of a data leak.
function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function createPasswordResetToken(email: string) {
  const ttlMinutes = envInt("RESET_TTL_MINUTES", 15);
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = sha256(rawToken);

  store.set(tokenHash, {
    tokenHash,
    email: email.trim().toLowerCase(),
    expiresAt: Date.now() + ttlMinutes * 60_000,
  });

  return { rawToken, ttlMinutes };
}

export function consumePasswordResetToken(rawToken: string) {
  const token = (rawToken || "").trim();
  if (!token) return { ok: false as const, reason: "INVALID" as const };

  const tokenHash = sha256(token);
  const rec = store.get(tokenHash);
  if (!rec) return { ok: false as const, reason: "INVALID" as const };

  if (Date.now() > rec.expiresAt) {
    store.delete(tokenHash);
    return { ok: false as const, reason: "EXPIRED" as const };
  }

  store.delete(tokenHash);
  return { ok: true as const, email: rec.email };
}
