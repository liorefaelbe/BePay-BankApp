<<<<<<< HEAD
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
=======
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
>>>>>>> 3021c2567a6c53da578b52677e4f94c9ea73a29f
