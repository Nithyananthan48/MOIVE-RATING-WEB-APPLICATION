import express from "express";
import { Movie } from "../models/Movie.js";
import { User } from "../models/User.js";
import { Review } from "../models/Review.js";
import { AuthRequest } from "../middleware/auth.js";

export async function getAdminStats(_req: AuthRequest, res: express.Response) {
  try {
    const [totalUsers, totalMovies, totalReviews, users] = await Promise.all([
      User.countDocuments(),
      Movie.countDocuments(),
      Review.countDocuments(),
      User.find({}, "favorites watchlist createdAt name email role").sort({ createdAt: -1 }).limit(10).lean()
    ]);

    const totalFavorites = users.reduce((acc, u) => acc + (u.favorites?.length ?? 0), 0);
    const totalWatchlist = users.reduce((acc, u) => acc + (u.watchlist?.length ?? 0), 0);

    const recentReviews = await Review.find()
      .populate("movie", "title poster year")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const recentUsers = users.map((u) => ({
      id: String(u._id),
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt
    }));

    return res.json({
      stats: {
        totalUsers,
        totalMovies,
        totalReviews,
        totalFavorites,
        totalWatchlist
      },
      recentReviews,
      recentUsers
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to fetch admin stats: " + err.message });
  }
}

export async function createMovie(req: AuthRequest, res: express.Response) {
  try {
    const payload = req.body ?? {};
    if (!payload.title || !payload.year || !payload.description) {
      return res.status(400).json({ error: "Title, year, and description are required fields." });
    }

    if (typeof payload.genre === "string") {
      payload.genre = payload.genre.split(",").map((g: string) => g.trim()).filter(Boolean);
    }
    if (typeof payload.cast === "string") {
      payload.cast = payload.cast.split(",").map((c: string) => c.trim()).filter(Boolean);
    }

    if (!payload.poster) {
      payload.poster = `https://picsum.photos/seed/${encodeURIComponent(payload.title)}/600/900`;
    }

    const created = await Movie.create(payload);
    return res.status(201).json({
      message: "Movie created successfully!",
      movie: created
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to create movie: " + err.message });
  }
}

export async function updateMovie(req: AuthRequest, res: express.Response) {
  try {
    const payload = req.body ?? {};

    if (typeof payload.genre === "string") {
      payload.genre = payload.genre.split(",").map((g: string) => g.trim()).filter(Boolean);
    }
    if (typeof payload.cast === "string") {
      payload.cast = payload.cast.split(",").map((c: string) => c.trim()).filter(Boolean);
    }

    const updated = await Movie.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!updated) {
      return res.status(404).json({ error: "Movie not found" });
    }

    return res.json({
      message: "Movie updated successfully!",
      movie: updated
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to update movie: " + err.message });
  }
}

export async function deleteMovie(req: AuthRequest, res: express.Response) {
  try {
    const movieId = req.params.id;
    const deleted = await Movie.findByIdAndDelete(movieId);
    if (!deleted) {
      return res.status(404).json({ error: "Movie not found" });
    }

    // Clean up associated reviews and user bookmarks
    await Review.deleteMany({ movie: movieId });
    await User.updateMany(
      {},
      { $pull: { favorites: movieId as any, watchlist: movieId as any } }
    );

    return res.json({ message: "Movie and associated data deleted successfully." });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to delete movie: " + err.message });
  }
}

export async function getAllReviews(_req: AuthRequest, res: express.Response) {
  try {
    const reviews = await Review.find()
      .populate("movie", "title poster year")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.json(reviews);
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to fetch reviews: " + err.message });
  }
}

export async function deleteReviewAdmin(req: AuthRequest, res: express.Response) {
  try {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    const movieId = review.movie;
    await Review.findByIdAndDelete(reviewId);

    // Recalculate movie rating
    const remaining = await Review.find({ movie: movieId });
    const count = remaining.length;
    const avg = count > 0 ? Number((remaining.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1)) : 0;
    await Movie.findByIdAndUpdate(movieId, { userRatingAverage: avg, userRatingCount: count });

    return res.json({ message: "Review deleted successfully by administrator." });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to delete review: " + err.message });
  }
}
