import express from "express";
import { Review } from "../models/Review.js";
import { Movie } from "../models/Movie.js";
import { AuthRequest } from "../middleware/auth.js";

async function recalculateMovieRating(movieId: any) {
  const reviews = await Review.find({ movie: movieId });
  if (reviews.length === 0) {
    await Movie.findByIdAndUpdate(movieId, {
      userRatingAverage: 0,
      userRatingCount: 0
    });
    return;
  }

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = Number((sum / reviews.length).toFixed(1));

  await Movie.findByIdAndUpdate(movieId, {
    userRatingAverage: avg,
    userRatingCount: reviews.length
  });
}

export async function getMovieReviews(req: express.Request, res: express.Response) {
  try {
    const movieId = req.params.id;
    if (!movieId || movieId.length !== 24) {
      return res.status(400).json({ error: "Invalid movie ID format" });
    }
    const reviews = await Review.find({ movie: movieId })
      .sort({ createdAt: -1 })
      .lean();

    const total = reviews.length;
    let distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    for (const r of reviews) {
      sum += r.rating;
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      distribution[rounded] = (distribution[rounded] || 0) + 1;
    }

    const average = total > 0 ? Number((sum / total).toFixed(1)) : 0;

    return res.json({
      reviews,
      stats: {
        total,
        average,
        distribution
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to fetch reviews: " + err.message });
  }
}

export async function addOrUpdateReview(req: AuthRequest, res: express.Response) {
  if (!req.user) {
    return res.status(401).json({ error: "Please log in to submit a review." });
  }

  try {
    const movieId = req.params.id;
    const rating = Number(req.body?.rating);
    const comment = String(req.body?.comment ?? "").trim();

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5 stars." });
    }

    if (!comment || comment.length < 2) {
      return res.status(400).json({ error: "Review comment must be at least 2 characters long." });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found." });
    }

    // Upsert review (one review per user per movie)
    let review = await Review.findOne({ movie: movieId, user: req.user._id });

    let isNew = false;
    if (review) {
      review.rating = rating;
      review.comment = comment;
      review.userName = req.user.name;
      review.userAvatar = req.user.avatar ?? "";
      await review.save();
    } else {
      isNew = true;
      review = await Review.create({
        movie: movieId,
        user: req.user._id,
        userName: req.user.name,
        userAvatar: req.user.avatar ?? "",
        rating,
        comment
      });
    }

    // Recalculate movie statistics
    await recalculateMovieRating(movieId);

    return res.status(isNew ? 201 : 200).json({
      message: isNew ? "Review submitted successfully!" : "Review updated successfully!",
      review
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to submit review: " + err.message });
  }
}

export async function deleteReview(req: AuthRequest, res: express.Response) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  try {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found." });
    }

    // Must be review author or admin
    const isOwner = String(review.user) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "You are not authorized to delete this review." });
    }

    const movieId = review.movie;
    await Review.findByIdAndDelete(reviewId);

    // Recalculate rating
    await recalculateMovieRating(movieId);

    return res.json({ message: "Review deleted successfully." });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to delete review: " + err.message });
  }
}

export async function getUserReviews(req: AuthRequest, res: express.Response) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate("movie", "title year poster genre language")
      .sort({ createdAt: -1 })
      .lean();

    return res.json(reviews);
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to fetch user reviews: " + err.message });
  }
}
