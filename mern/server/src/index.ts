import express from "express";
import cors from "cors";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { seedDatabaseIfEmpty } from "./services/seedData.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Movie Da MERN API is healthy and operational",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled Error:", err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "An unexpected internal server error occurred."
  });
});

// Start Server
async function startServer() {
  try {
    await connectDB();
    await seedDatabaseIfEmpty();

    app.listen(ENV.PORT, () => {
      console.log(`====================================================`);
      console.log(`🎬 Movie Da MERN API running on http://localhost:${ENV.PORT}`);
      console.log(`📡 Health Check: http://localhost:${ENV.PORT}/api/health`);
      console.log(`====================================================`);
    });
  } catch (err: any) {
    console.error("Server startup aborted due to critical error:", err.message);
    process.exit(1);
  }
}

startServer();
