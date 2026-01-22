import crypto from "crypto";

type ResetRecord = {
  tokenHash: string;
  email: string;
  expiresAt: number;
};

const store = new Map<string, ResetRecord>();

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function envInt(name: string, defaultValue: number): number {
  const v = process.env[name];
  if (!v) return defaultValue;
  const n = Number(v);
  return Number.isFinite(n) ? n : defaultValue;
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
