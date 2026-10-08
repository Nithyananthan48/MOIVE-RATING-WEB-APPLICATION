import React from "react";
import { Star, Heart, Bookmark, Play, Eye } from "lucide-react";
import { Movie } from "../types";
import { useAuth } from "../context/AuthContext";

interface MovieCardProps {
  movie: Movie;
  onSelect: (movieId: string) => void;
  onWatchTrailer?: (url: string, title: string) => void;
  viewMode?: "grid" | "list";
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelect,
  onWatchTrailer,
  viewMode = "grid"
}) => {
  const { favorites, watchlist, toggleFavorite, toggleWatchlist } = useAuth();
  const isFav = favorites.includes(movie._id);
  const isWatch = watchlist.includes(movie._id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(movie._id);
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWatchlist(movie._id);
  };

  const handleTrailerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (movie.trailerUrl && onWatchTrailer) {
      onWatchTrailer(movie.trailerUrl, movie.title);
    }
  };

  if (viewMode === "list") {
    return (
      <article className="movie-card-list" onClick={() => onSelect(movie._id)}>
        <div className="card-list-poster-box">
          <img
            src={movie.poster}
            alt={movie.title}
            loading="lazy"
            className="card-list-poster"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80";
            }}
          />
        </div>

        <div className="card-list-info">
          <div className="card-list-header">
            <h3 className="card-list-title">{movie.title}</h3>
            <span className="card-score-pill">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              {movie.score}
            </span>
          </div>

          <div className="card-list-meta">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.language}</span>
            <span>•</span>
            <span>{movie.runtime} min</span>
            {movie.director && (
              <>
                <span>•</span>
                <span>Dir: {movie.director}</span>
              </>
            )}
          </div>

          <div className="card-genre-tags">
            {movie.genre?.map((g) => (
              <span key={g} className="genre-tag-sm">
                {g}
              </span>
            ))}
          </div>

          <p className="card-list-desc">{movie.description}</p>

          <div className="card-list-actions">
            {movie.trailerUrl && (
              <button className="btn-sm btn-outline" onClick={handleTrailerClick}>
                <Play size={14} className="fill-current" />
                Trailer
              </button>
            )}
            <button
              className={`btn-sm ${isFav ? "btn-active-fav" : "btn-outline"}`}
              onClick={handleFavoriteClick}
            >
              <Heart size={14} className={isFav ? "fill-current" : ""} />
              {isFav ? "Favorited" : "Favorite"}
            </button>
            <button
              className={`btn-sm ${isWatch ? "btn-active-watch" : "btn-outline"}`}
              onClick={handleWatchlistClick}
            >
              <Bookmark size={14} className={isWatch ? "fill-current" : ""} />
              {isWatch ? "In Watchlist" : "Watchlist"}
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="movie-card-grid" onClick={() => onSelect(movie._id)}>
      <div className="poster-wrapper">
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          className="movie-poster"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80";
          }}
        />

        {/* Overlay on hover */}
        <div className="poster-overlay">
          <div className="overlay-top-buttons">
            <button
              className={`overlay-icon-btn ${isFav ? "active" : ""}`}
              onClick={handleFavoriteClick}
              title={isFav ? "Remove Favorite" : "Add Favorite"}
            >
              <Heart size={17} className={isFav ? "fill-current" : ""} />
            </button>
            <button
              className={`overlay-icon-btn ${isWatch ? "active" : ""}`}
              onClick={handleWatchlistClick}
              title={isWatch ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              <Bookmark size={17} className={isWatch ? "fill-current" : ""} />
            </button>
          </div>

          <div className="overlay-center-action">
            {movie.trailerUrl && (
              <button
                className="trailer-play-circle"
                onClick={handleTrailerClick}
                title="Watch Trailer"
              >
                <Play size={24} className="fill-white text-white ml-0.5" />
              </button>
            )}
          </div>

          <div className="overlay-bottom-bar">
            <span className="view-detail-hint">
              <Eye size={14} /> Details
            </span>
          </div>
        </div>

        {/* Score Badge */}
        <div className="card-score-badge">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          <span>{movie.score}</span>
        </div>

        {/* Year Pill */}
        <div className="card-year-badge">{movie.year}</div>
      </div>

      <div className="movie-card-details">
        <h3 className="card-movie-title" title={movie.title}>
          {movie.title}
        </h3>

        <div className="card-movie-meta">
          <span>{movie.language}</span>
          <span>•</span>
          <span>{movie.runtime}m</span>
        </div>

        <div className="card-genre-pills">
          {movie.genre?.slice(0, 2).map((g) => (
            <span key={g} className="genre-pill">
              {g}
            </span>
          ))}
          {movie.genre?.length > 2 && (
            <span className="genre-pill-more">+{movie.genre.length - 2}</span>
          )}
        </div>
      </div>
    </article>
  );
};
