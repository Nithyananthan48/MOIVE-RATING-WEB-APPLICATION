import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: Number(process.env.PORT ?? 5000),
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET ?? "movie-da-mern-jwt-secret-key-2025",
  NODE_ENV: process.env.NODE_ENV ?? "development"
};
