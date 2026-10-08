import express from "express";
import { User } from "../models/User.js";
import { Movie } from "../models/Movie.js";
import { Review } from "../models/Review.js";
import { AuthRequest, sanitizeUser } from "../middleware/auth.js";
import { aggregateScore } from "./movieController.js";

export async function getUserLists(req: AuthRequest, res: express.Response) {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const user = await User.findById(req.user._id).lean();
  return res.json({
    favorites: (user?.favorites ?? []).map((id) => String(id)),
    watchlist: (user?.watchlist ?? []).map((id) => String(id))
  });
}

export async function getFavorites(req: AuthRequest, res: express.Response) {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  try {
    const user = await User.findById(req.user._id).populate("favorites").lean();
    const favs = (user?.favorites as any[] ?? []).map((m) => ({
      ...m,
      score: aggregateScore(m)
    }));
    return res.json(favs);
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to fetch favorites: " + err.message });
  }
}

export async function toggleFavorite(req: AuthRequest, res: express.Response) {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  try {
    const movieId = String(req.params.movieId);
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const exists = user.favorites.some((id: any) => String(id) === movieId);
    if (exists) {
      user.favorites = user.favorites.filter((id: any) => String(id) !== movieId);
    } else {
      user.favorites.push(movie._id as any);
    }

    await user.save();
    return res.json({
      message: exists ? "Removed from favorites" : "Added to favorites",
      isFavorited: !exists,
      favorites: user.favorites.map((id: any) => String(id))
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to update favorites: " + err.message });
  }
}

export async function getWatchlist(req: AuthRequest, res: express.Response) {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  try {
    const user = await User.findById(req.user._id).populate("watchlist").lean();
    const list = (user?.watchlist as any[] ?? []).map((m) => ({
      ...m,
      score: aggregateScore(m)
    }));
    return res.json(list);
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to fetch watchlist: " + err.message });
  }
}

export async function toggleWatchlist(req: AuthRequest, res: express.Response) {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  try {
    const movieId = String(req.params.movieId);
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const exists = user.watchlist.some((id: any) => String(id) === movieId);
    if (exists) {
      user.watchlist = user.watchlist.filter((id: any) => String(id) !== movieId);
    } else {
      user.watchlist.push(movie._id as any);
    }

    await user.save();
    return res.json({
      message: exists ? "Removed from watchlist" : "Added to watchlist",
      isInWatchlist: !exists,
      watchlist: user.watchlist.map((id: any) => String(id))
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to update watchlist: " + err.message });
  }
}

export async function getProfileStats(req: AuthRequest, res: express.Response) {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  try {
    const user = await User.findById(req.user._id).lean();
    const reviews = await Review.find({ user: req.user._id }).lean();

    const favoritesCount = user?.favorites?.length ?? 0;
    const watchlistCount = user?.watchlist?.length ?? 0;
    const reviewsCount = reviews.length;
    const avgRating = reviewsCount > 0 ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviewsCount).toFixed(1)) : 0;

    return res.json({
      user: sanitizeUser(req.user),
      stats: {
        favoritesCount,
        watchlistCount,
        reviewsCount,
        avgRating
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to fetch profile stats: " + err.message });
  }
}
