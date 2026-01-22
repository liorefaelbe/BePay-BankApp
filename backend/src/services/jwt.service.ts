import jwt from "jsonwebtoken";

const JWT_SECRET = "super-secret-key";

export function generateToken(email: string): string {
  return jwt.sign({ email }, JWT_SECRET, {
    expiresIn: "1h"
  });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}
