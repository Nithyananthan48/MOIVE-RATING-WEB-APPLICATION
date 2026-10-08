import React, { useState, useEffect, useCallback } from "react";
import {
  Star,
  Clock,
  Heart,
  Bookmark,
  Play,
  ArrowLeft,
  Users,
  Award,
  Globe,
  Film
} from "lucide-react";
import { Movie, Review, ReviewStats } from "../types";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ReviewList } from "../components/ReviewList";
import { ReviewModal } from "../components/ReviewModal";
import { MovieSection } from "../components/MovieSection";
import { ConfirmModal } from "../components/ConfirmModal";

interface MovieDetailPageProps {
  movieId: string;
  onBack: () => void;
  onSelectMovie: (id: string) => void;
  onWatchTrailer: (url: string, title: string) => void;
}

export const MovieDetailPage: React.FC<MovieDetailPageProps> = ({
  movieId,
  onBack,
  onSelectMovie,
  onWatchTrailer
}) => {
  const { user, favorites, watchlist, toggleFavorite, toggleWatchlist } = useAuth();
  const { showToast } = useToast();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    total: 0,
    average: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [loading, setLoading] = useState(true);

  // Modal states
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const loadMovieDetails = useCallback(async () => {
    try {
      setLoading(true);
      const [movieData, similarData, reviewsData] = await Promise.all([
        api.getMovieById(movieId),
        api.getSimilarMovies(movieId).catch(() => []),
        api.getMovieReviews(movieId).catch(() => ({
          reviews: [],
          stats: { total: 0, average: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }
        }))
      ]);

      setMovie(movieData);
      setSimilarMovies(similarData);
      setReviews(reviewsData.reviews || []);
      setReviewStats(reviewsData.stats || {
        total: 0,
        average: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    } catch (err: any) {
      showToast(err.message || "Failed to load movie details", "error");
    } finally {
      setLoading(false);
    }
  }, [movieId, showToast]);

  useEffect(() => {
    loadMovieDetails();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [loadMovieDetails]);

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!movie) return;
    const res = await api.addOrUpdateReview(movie._id, { rating, comment });
    showToast(res.message, "success");
    // Reload reviews & movie details
    await loadMovieDetails();
  };

  const confirmDeleteReview = async () => {
    if (!reviewToDelete) return;
    try {
      const res = await api.deleteReview(reviewToDelete);
      showToast(res.message, "success");
      setDeleteConfirmOpen(false);
      setReviewToDelete(null);
      await loadMovieDetails();
    } catch (err: any) {
      showToast(err.message || "Failed to delete review", "error");
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper movie-detail-page">
        <div className="detail-banner-skeleton" />
        <div className="detail-content-container">
          <div className="skeleton-line w-1/3 h-10" />
          <div className="skeleton-line w-full h-32" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="page-wrapper movie-detail-page">
        <button className="btn-secondary back-btn" onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="empty-state-box">
          <h2>Movie not found</h2>
          <p>The requested movie could not be located in our catalog.</p>
        </div>
      </div>
    );
  }

  const isFav = favorites.includes(movie._id);
  const isWatch = watchlist.includes(movie._id);
  const backdropImg = movie.backdrop || movie.poster;

  return (
    <div className="page-wrapper movie-detail-page">
      {/* Back Button */}
      <div className="detail-top-nav">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={18} /> Back to Movies
        </button>
      </div>

      {/* Immersive Header Banner */}
      <div
        className="detail-hero-banner"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(11, 16, 32, 0.4) 0%, rgba(11, 16, 32, 0.95) 85%, var(--bg) 100%), url(${backdropImg})`
        }}
      >
        <div className="detail-hero-inner">
          {/* Poster Column */}
          <div className="detail-poster-col">
            <img
              src={movie.poster}
              alt={movie.title}
              className="detail-main-poster"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";
              }}
            />
            {movie.trailerUrl && (
              <button
                className="btn-primary w-full mt-3 flex-center-gap"
                onClick={() => onWatchTrailer(movie.trailerUrl!, movie.title)}
              >
                <Play size={18} className="fill-current" /> Watch Trailer
              </button>
            )}
          </div>

          {/* Metadata Column */}
          <div className="detail-info-col">
            <div className="detail-badges-row">
              <span className="badge-year">{movie.year}</span>
              <span className="badge-meta">{movie.language}</span>
              <span className="badge-meta flex-center-gap">
                <Clock size={13} /> {movie.runtime} min
              </span>
              <span className="badge-score-hero">
                <Star size={15} className="fill-amber-400 text-amber-400" />
                Score: {movie.score}
              </span>
            </div>

            <h1 className="detail-title">{movie.title}</h1>

            <div className="detail-genres-row">
              {movie.genre?.map((g) => (
                <span key={g} className="detail-genre-chip">
                  {g}
                </span>
              ))}
            </div>

            <p className="detail-synopsis">{movie.description}</p>

            {/* Crew Details */}
            <div className="detail-crew-grid">
              {movie.director && (
                <div className="crew-item">
                  <span className="crew-label">Director</span>
                  <span className="crew-val">{movie.director}</span>
                </div>
              )}
              {movie.cast && movie.cast.length > 0 && (
                <div className="crew-item cast-span">
                  <span className="crew-label">Key Cast</span>
                  <span className="crew-val">{movie.cast.join(", ")}</span>
                </div>
              )}
            </div>

            {/* Rating Breakdown Cards */}
            <div className="rating-breakdown-row">
              <div className="score-card">
                <span className="score-card-label">IMDb Rating</span>
                <span className="score-card-val">★ {movie.ratings?.imdb || "—"} / 10</span>
              </div>
              <div className="score-card">
                <span className="score-card-label">Audience Score</span>
                <span className="score-card-val">🍿 {movie.ratings?.audience || "—"}%</span>
              </div>
              <div className="score-card">
                <span className="score-card-label">Critic Score</span>
                <span className="score-card-val">🎯 {movie.ratings?.critic || "—"}%</span>
              </div>
              <div className="score-card highlight">
                <span className="score-card-label">Community Rating</span>
                <span className="score-card-val">
                  ⭐ {movie.userRatingAverage ? `${movie.userRatingAverage} / 5` : "No ratings yet"}
                </span>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="detail-actions-row">
              <button
                className={`btn-action-lg ${isFav ? "active-fav" : ""}`}
                onClick={() => toggleFavorite(movie._id)}
              >
                <Heart size={18} className={isFav ? "fill-current" : ""} />
                {isFav ? "Favorited" : "Add to Favorites"}
              </button>

              <button
                className={`btn-action-lg ${isWatch ? "active-watch" : ""}`}
                onClick={() => toggleWatchlist(movie._id)}
              >
                <Bookmark size={18} className={isWatch ? "fill-current" : ""} />
                {isWatch ? "In Watchlist" : "Add to Watchlist"}
              </button>

              <button
                className="btn-action-lg"
                onClick={() => {
                  setEditingReview(null);
                  setReviewModalOpen(true);
                }}
              >
                <Star size={18} /> Rate & Review
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Community Section */}
      <div className="detail-bottom-section">
        <ReviewList
          reviews={reviews}
          stats={reviewStats}
          onOpenReviewModal={() => {
            const myReview = reviews.find((r) => r.user === user?.id);
            setEditingReview(myReview || null);
            setReviewModalOpen(true);
          }}
          onEditReview={(rev) => {
            setEditingReview(rev);
            setReviewModalOpen(true);
          }}
          onDeleteReview={(revId) => {
            setReviewToDelete(revId);
            setDeleteConfirmOpen(true);
          }}
        />

        {/* Similar Movies Carousel */}
        {similarMovies.length > 0 && (
          <div className="mt-8">
            <MovieSection
              title="Similar Movies"
              icon={<Film size={20} className="text-sky-400" />}
              subtitle="Titles sharing matching genres and cinematic style"
              movies={similarMovies}
              onSelectMovie={onSelectMovie}
              onWatchTrailer={onWatchTrailer}
            />
          </div>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        movieTitle={movie.title}
        initialRating={editingReview?.rating || 5}
        initialComment={editingReview?.comment || ""}
        onClose={() => {
          setReviewModalOpen(false);
          setEditingReview(null);
        }}
        onSubmit={handleReviewSubmit}
      />

      {/* Delete Review Confirm Modal */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="Delete Review"
        message="Are you sure you want to remove your review? This action cannot be undone."
        confirmText="Delete Review"
        onConfirm={confirmDeleteReview}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setReviewToDelete(null);
        }}
      />
    </div>
  );
};
