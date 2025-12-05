import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) throw new Error("JWT_SECRET not defined in environment");

export function signToken(payload: Record<string, unknown>, options?: jwt.SignOptions) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d", ...(options ?? {}) });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { [k: string]: any };
}