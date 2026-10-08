import { Router } from "express";
import { deleteReview, getUserReviews } from "../controllers/reviewController.js";
import { authUser } from "../middleware/auth.js";

const router = Router();

router.get("/user", authUser, getUserReviews);
router.delete("/:id", authUser, deleteReview);

export default router;
