import { Router } from "express";
import {
  getAdminStats,
  createMovie,
  updateMovie,
  deleteMovie,
  getAllReviews,
  deleteReviewAdmin
} from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.use(requireAdmin);

router.get("/stats", getAdminStats);
router.post("/movies", createMovie);
router.put("/movies/:id", updateMovie);
router.delete("/movies/:id", deleteMovie);
router.get("/reviews", getAllReviews);
router.delete("/reviews/:id", deleteReviewAdmin);

export default router;
