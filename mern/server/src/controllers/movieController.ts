import express from "express";
import { Movie, IMovie } from "../models/Movie.js";
import { AuthRequest } from "../middleware/auth.js";
import { User } from "../models/User.js";

export function aggregateScore(m: any): number {
  const imdb = (m.ratings?.imdb ?? 0) * 10;
  const audience = m.ratings?.audience ?? 0;
  const critic = m.ratings?.critic ?? 0;

  if (m.userRatingCount > 0 && m.userRatingAverage > 0) {
    const userScaled = m.userRatingAverage * 20; // scale 1-5 to 100
    return Number((imdb * 0.35 + audience * 0.25 + critic * 0.20 + userScaled * 0.20).toFixed(1));
  }
  return Number(((imdb * 0.4 + audience * 0.35 + critic * 0.25) / 1).toFixed(1));
}

export async function getMovies(req: express.Request, res: express.Response) {
  try {
    const q = String(req.query.q ?? "").trim().toLowerCase();
    const genre = String(req.query.genre ?? "").trim();
    const language = String(req.query.language ?? "").trim();
    const year = Number(req.query.year ?? 0);
    const min = Number(req.query.min ?? 0);
    const sort = String(req.query.sort ?? "latest");
    const page = Math.max(1, Number(req.query.page ?? 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 12)));

    let query: any = {};

    if (genre) {
      query.genre = { $in: [new RegExp(`^${genre}$`, "i")] };
    }

    if (language) {
      query.language = { $regex: new RegExp(`^${language}$`, "i") };
    }

    if (year > 1900) {
      query.year = year;
    }

    let all = await Movie.find(query).lean();

    // Multi-field search
    if (q) {
      all = all.filter((m) => {
        const titleMatch = m.title.toLowerCase().includes(q);
        const directorMatch = (m.director ?? "").toLowerCase().includes(q);
        const castMatch = (m.cast ?? []).some((c) => c.toLowerCase().includes(q));
        const genreMatch = (m.genre ?? []).some((g) => g.toLowerCase().includes(q));
        const descMatch = (m.description ?? "").toLowerCase().includes(q);
        return titleMatch || directorMatch || castMatch || genreMatch || descMatch;
      });
    }

    // Enrich with computed aggregate score
    let enriched = all.map((m) => ({
      ...m,
      score: aggregateScore(m)
    }));

    if (min > 0) {
      enriched = enriched.filter((m) => m.score >= min);
    }

    // Sorting
    switch (sort) {
      case "score":
      case "rating":
        enriched.sort((a, b) => b.score - a.score);
        break;
      case "year":
        enriched.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
        break;
      case "oldest":
        enriched.sort((a, b) => (a.year ?? 0) - (b.year ?? 0));
        break;
      case "popular":
        enriched.sort((a, b) => ((b.viewsCount ?? 0) + (b.ratings?.audience ?? 0)) - ((a.viewsCount ?? 0) + (a.ratings?.audience ?? 0)));
        break;
      case "az":
        enriched.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        enriched.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "latest":
      default:
        enriched.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        break;
    }

    const total = enriched.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const items = enriched.slice((page - 1) * limit, page * limit);

    return res.json({
      items,
      page,
      totalPages,
      total,
      limit
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to fetch movies: " + err.message });
  }
}

export async function getHomeSections(req: AuthRequest, res: express.Response) {
  try {
    const all = await Movie.find().lean();
    const enriched = all.map((m) => ({
      ...m,
      score: aggregateScore(m)
    }));

    // Featured Movie (prefer explicit featured=true or highest score)
    const featured =
      enriched.find((m) => m.featured) ??
      [...enriched].sort((a, b) => b.score - a.score)[0] ??
      null;

    // Trending: High score with recent additions or high audience rating
    const trending = [...enriched]
      .sort((a, b) => ((b.ratings?.audience ?? 0) + b.score) - ((a.ratings?.audience ?? 0) + a.score))
      .slice(0, 10);

    // Top Rated by aggregate score
    const topRated = [...enriched]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    // Popular: Audience & view counts
    const popular = [...enriched]
      .sort((a, b) => (b.ratings?.imdb ?? 0) - (a.ratings?.imdb ?? 0))
      .slice(0, 10);

    // Recently Added (by release year or created date)
    const recentlyAdded = [...enriched]
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
      .slice(0, 10);

    // Recommendations (if user is authenticated)
    let recommended: any[] = [];
    if (req.user) {
      const user = await User.findById(req.user._id).populate("favorites").lean();
      const favGenres = (user?.favorites as any[] ?? []).flatMap((f) => f.genre ?? []);
      if (favGenres.length > 0) {
        const favGenreCounts = favGenres.reduce((acc: any, g: string) => {
          acc[g] = (acc[g] || 0) + 1;
          return acc;
        }, {});
        const topFavGenre = Object.keys(favGenreCounts).sort((a, b) => favGenreCounts[b] - favGenreCounts[a])[0];

        const favIds = new Set((user?.favorites as any[] ?? []).map((f) => String(f._id)));
        recommended = enriched
          .filter((m) => !favIds.has(String(m._id)) && (m.genre ?? []).includes(topFavGenre))
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
      }
    }

    if (recommended.length === 0) {
      recommended = [...topRated].reverse().slice(0, 10);
    }

    return res.json({
      featured,
      trending,
      popular,
      topRated,
      recentlyAdded,
      recommended
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to load home sections: " + err.message });
  }
}

export async function getMovieById(req: express.Request, res: express.Response) {
  try {
    const { id } = req.params;
    if (!id || id.length !== 24) {
      return res.status(400).json({ error: "Invalid movie ID format" });
    }

    const movie = await Movie.findById(id).lean();
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    // Fire-and-forget view count increment
    Movie.findByIdAndUpdate(id, { $inc: { viewsCount: 1 } }).catch(() => {});

    return res.json({
      ...movie,
      score: aggregateScore(movie)
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to retrieve movie: " + err.message });
  }
}

export async function getSimilarMovies(req: express.Request, res: express.Response) {
  try {
    const { id } = req.params;
    if (!id || id.length !== 24) {
      return res.status(400).json({ error: "Invalid movie ID format" });
    }

    const movie = await Movie.findById(id).lean();
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const genres = movie.genre ?? [];
    const similar = await Movie.find({
      _id: { $ne: movie._id },
      genre: { $in: genres }
    })
      .limit(8)
      .lean();

    const enriched = similar.map((m) => ({
      ...m,
      score: aggregateScore(m)
    }));

    return res.json(enriched);
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to find similar movies: " + err.message });
  }
}

export async function getFilterOptions(_req: express.Request, res: express.Response) {
  try {
    const movies = await Movie.find({}, { genre: 1, language: 1, year: 1 }).lean();
    const genres = [...new Set(movies.flatMap((m) => m.genre ?? []))].sort();
    const languages = [...new Set(movies.map((m) => m.language).filter(Boolean))].sort();
    const years = [...new Set(movies.map((m) => m.year).filter(Boolean))].sort((a, b) => b - a);

    return res.json({ genres, languages, years });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to fetch filter options: " + err.message });
  }
}

export async function getPersonalizedRecommendations(req: AuthRequest, res: express.Response) {
  try {
    const all = await Movie.find().lean();
    const enriched = all.map((m) => ({ ...m, score: aggregateScore(m) }));

    if (!req.user) {
      return res.json(enriched.sort((a, b) => b.score - a.score).slice(0, 10));
    }

    const user = await User.findById(req.user._id).populate("favorites watchlist").lean();
    const userMovieIds = new Set([
      ...(user?.favorites as any[] ?? []).map((m) => String(m._id)),
      ...(user?.watchlist as any[] ?? []).map((m) => String(m._id))
    ]);

    const userGenres = [
      ...(user?.favorites as any[] ?? []).flatMap((m) => m.genre ?? []),
      ...(user?.watchlist as any[] ?? []).flatMap((m) => m.genre ?? [])
    ];

    if (userGenres.length === 0) {
      return res.json(enriched.sort((a, b) => b.score - a.score).slice(0, 10));
    }

    const genreFreq: Record<string, number> = {};
    for (const g of userGenres) {
      genreFreq[g] = (genreFreq[g] || 0) + 1;
    }

    // Rank candidate movies not yet in user lists by genre overlap and score
    const scoredCandidates = enriched
      .filter((m) => !userMovieIds.has(String(m._id)))
      .map((m) => {
        let genreScore = 0;
        for (const g of m.genre ?? []) {
          if (genreFreq[g]) genreScore += genreFreq[g];
        }
        return {
          movie: m,
          rank: genreScore * 10 + m.score
        };
      })
      .sort((a, b) => b.rank - a.rank)
      .map((item) => item.movie)
      .slice(0, 12);

    return res.json(scoredCandidates.length > 0 ? scoredCandidates : enriched.slice(0, 10));
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to get recommendations: " + err.message });
  }
}
