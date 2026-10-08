import express from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { User, IUser } from "../models/User.js";

export interface AuthRequest extends express.Request {
  user?: IUser;
}

export function sanitizeUser(user: IUser) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    createdAt: user.createdAt
  };
}

export function getToken(req: express.Request): string | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

export async function authUser(req: AuthRequest, res: express.Response, next: express.NextFunction) {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ error: "Authentication required. Please log in." });
  }

  try {
    const payload = jwt.verify(token, ENV.JWT_SECRET) as { sub: string; role: string };
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ error: "User session expired or invalid. Please log in again." });
    }
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired authentication token." });
  }
}

export async function optionalAuthUser(req: AuthRequest, _res: express.Response, next: express.NextFunction) {
  const token = getToken(req);
  if (!token) return next();

  try {
    const payload = jwt.verify(token, ENV.JWT_SECRET) as { sub: string; role: string };
    const user = await User.findById(payload.sub);
    if (user) {
      req.user = user;
    }
  } catch {
    // Ignore invalid token in optional auth
  }
  return next();
}

export async function requireAdmin(req: AuthRequest, res: express.Response, next: express.NextFunction) {
  await authUser(req, res, () => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Administrator privileges required." });
    }
    return next();
  });
}
