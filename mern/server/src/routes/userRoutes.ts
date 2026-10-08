import { Router } from "express";
import {
  getUserLists,
  getFavorites,
  toggleFavorite,
  getWatchlist,
  toggleWatchlist,
  getProfileStats
} from "../controllers/userController.js";
import { getUserReviews } from "../controllers/reviewController.js";
import { authUser } from "../middleware/auth.js";

const router = Router();

router.get("/lists", authUser, getUserLists);
router.get("/favorites", authUser, getFavorites);
router.post("/favorites/:movieId", authUser, toggleFavorite);
router.get("/watchlist", authUser, getWatchlist);
router.post("/watchlist/:movieId", authUser, toggleWatchlist);
router.get("/profile-stats", authUser, getProfileStats);
router.get("/reviews", authUser, getUserReviews);

export default router;
