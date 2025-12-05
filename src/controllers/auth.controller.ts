import { Request, Response, NextFunction } from "express";
import {prisma} from "../prisma.js"
import bcrypt from "bcrypt";
import {signToken} from "../utils/token.js"

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = (req as any).validated as { email: string; password: string };

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { email, password: hashed } });

    const token = signToken({ id: user.id, email: user.email });
    return res.status(201).json({ message: "Signup successful", user: { id: user.id, email: user.email }, token });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = (req as any).validated as { email: string; password: string };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken({ id: user.id, email: user.email });
    return res.json({ message: "Login successful", token, user: { id: user.id, email: user.email } });
  } catch (err) {
    next(err);
  }
}