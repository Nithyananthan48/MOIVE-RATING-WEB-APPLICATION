import { Router } from "express";
import {
  getMovies,
  getMovieById,
  getHomeSections,
  getSimilarMovies,
  getFilterOptions,
  getPersonalizedRecommendations
} from "../controllers/movieController.js";
import { getMovieReviews, addOrUpdateReview } from "../controllers/reviewController.js";
import { authUser, optionalAuthUser, requireAdmin } from "../middleware/auth.js";
import { createMovie } from "../controllers/adminController.js";

const router = Router();

router.get("/", getMovies);
router.get("/home-sections", optionalAuthUser, getHomeSections);
router.get("/filters", getFilterOptions);
router.get("/recommendations/user", optionalAuthUser, getPersonalizedRecommendations);
router.get("/:id", getMovieById);
router.get("/:id/similar", getSimilarMovies);

// Direct create movie for admin compatibility
router.post("/", requireAdmin, createMovie);

// Reviews for this movie
router.get("/:id/reviews", getMovieReviews);
router.post("/:id/reviews", authUser, addOrUpdateReview);

export default router;
