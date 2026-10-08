import React from "react";
import { Play, Info, Heart, Bookmark, Star, Clock } from "lucide-react";
import { Movie } from "../types";
import { useAuth } from "../context/AuthContext";

interface HeroBannerProps {
  movie: Movie | null;
  onWatchTrailer: (url: string, title: string) => void;
  onViewDetails: (movieId: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  movie,
  onWatchTrailer,
  onViewDetails
}) => {
  const { favorites, watchlist, toggleFavorite, toggleWatchlist } = useAuth();

  if (!movie) {
    return (
      <div className="hero-banner skeleton-hero">
        <div className="hero-content">
          <div className="skeleton-line w-40" />
          <div className="skeleton-line w-80 h-12" />
          <div className="skeleton-line w-full h-20" />
        </div>
      </div>
    );
  }

  const isFav = favorites.includes(movie._id);
  const isWatchlist = watchlist.includes(movie._id);
  const backdropImage = movie.backdrop || movie.poster;

  return (
    <section
      className="hero-banner"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(11, 16, 32, 0.95) 20%, rgba(11, 16, 32, 0.7) 60%, rgba(11, 16, 32, 0.4) 100%), url(${backdropImage})`
      }}
    >
      <div className="hero-inner">
        <div className="hero-content">
          {/* Spotlight Tag */}
          <div className="hero-badge-row">
            <span className="hero-spotlight-pill">FEATURED SPOTLIGHT</span>
            <span className="hero-rating-pill">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              Score: {movie.score}
            </span>
            <span className="hero-meta-item">
              <Clock size={14} />
              {movie.runtime} min
            </span>
            <span className="hero-meta-item">{movie.year}</span>
          </div>

          {/* Title */}
          <h1 className="hero-title">{movie.title}</h1>

          {/* Genre Pills */}
          <div className="hero-genre-list">
            {movie.genre?.map((g) => (
              <span key={g} className="genre-chip">
                {g}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <p className="hero-description">{movie.description}</p>

          {/* Director & Cast snippet */}
          {movie.director && (
            <p className="hero-credit">
              <strong>Director:</strong> {movie.director}
              {movie.cast && movie.cast.length > 0 && (
                <span> • <strong>Cast:</strong> {movie.cast.slice(0, 3).join(", ")}</span>
              )}
            </p>
          )}

          {/* Action Buttons */}
          <div className="hero-actions">
            {movie.trailerUrl && (
              <button
                className="btn-primary hero-btn"
                onClick={() => onWatchTrailer(movie.trailerUrl!, movie.title)}
              >
                <Play size={18} className="fill-current" />
                Watch Trailer
              </button>
            )}

            <button
              className="btn-secondary hero-btn"
              onClick={() => onViewDetails(movie._id)}
            >
              <Info size={18} />
              View Details
            </button>

            <button
              className={`icon-action-btn ${isFav ? "active-fav" : ""}`}
              onClick={() => toggleFavorite(movie._id)}
              title={isFav ? "Remove from Favorites" : "Add to Favorites"}
              aria-label="Toggle Favorite"
            >
              <Heart size={20} className={isFav ? "fill-current" : ""} />
            </button>

            <button
              className={`icon-action-btn ${isWatchlist ? "active-watchlist" : ""}`}
              onClick={() => toggleWatchlist(movie._id)}
              title={isWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              aria-label="Toggle Watchlist"
            >
              <Bookmark size={20} className={isWatchlist ? "fill-current" : ""} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
