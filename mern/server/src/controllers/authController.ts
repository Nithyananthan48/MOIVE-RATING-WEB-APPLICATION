import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { ENV } from "../config/env.js";
import { AuthRequest, sanitizeUser } from "../middleware/auth.js";

export async function register(req: express.Request, res: express.Response) {
  try {
    const name = String(req.body?.name ?? "").trim();
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");

    if (!name || !email || password.length < 6) {
      return res.status(400).json({ error: "Please provide a valid name, email, and password of at least 6 characters." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ error: "An account with this email address already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: "user",
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`
    });

    const token = jwt.sign({ sub: String(user._id), role: user.role }, ENV.JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({
      message: "Registration successful!",
      token,
      user: sanitizeUser(user)
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Registration failed: " + err.message });
  }
}

export async function login(req: express.Request, res: express.Response) {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign({ sub: String(user._id), role: user.role }, ENV.JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      message: "Login successful!",
      token,
      user: sanitizeUser(user)
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Login failed: " + err.message });
  }
}

export async function getMe(req: AuthRequest, res: express.Response) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return res.json({
    user: sanitizeUser(req.user),
    favoritesCount: req.user.favorites?.length ?? 0,
    watchlistCount: req.user.watchlist?.length ?? 0
  });
}

export async function updateProfile(req: AuthRequest, res: express.Response) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { name, avatar, currentPassword, newPassword } = req.body ?? {};

    if (name && typeof name === "string") {
      req.user.name = name.trim();
    }
    if (avatar && typeof avatar === "string") {
      req.user.avatar = avatar.trim();
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Current password is required to change password." });
      }
      const match = await bcrypt.compare(currentPassword, req.user.passwordHash);
      if (!match) {
        return res.status(400).json({ error: "Current password does not match." });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters." });
      }
      req.user.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await req.user.save();

    return res.json({
      message: "Profile updated successfully!",
      user: sanitizeUser(req.user)
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to update profile: " + err.message });
  }
}
