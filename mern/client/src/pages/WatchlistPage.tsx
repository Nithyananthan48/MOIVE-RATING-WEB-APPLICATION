import React, { useState, useEffect } from "react";
import { Bookmark, Film } from "lucide-react";
import { Movie } from "../types";
import { api } from "../services/api";
import { MovieCard } from "../components/MovieCard";
import { SkeletonCard } from "../components/SkeletonCard";
import { EmptyState } from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";

interface WatchlistPageProps {
  onSelectMovie: (movieId: string) => void;
  onWatchTrailer: (url: string, title: string) => void;
  onNavigateToDiscover: () => void;
  onNavigateToLogin: () => void;
}

export const WatchlistPage: React.FC<WatchlistPageProps> = ({
  onSelectMovie,
  onWatchTrailer,
  onNavigateToDiscover,
  onNavigateToLogin
}) => {
  const { user, watchlist } = useAuth();
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    api
      .getWatchlist()
      .then((data) => setWatchlistMovies(data))
      .catch((err) => console.error("Error loading watchlist:", err))
      .finally(() => setLoading(false));
  }, [user, watchlist.length]);

  if (!user) {
    return (
      <div className="page-wrapper">
        <EmptyState
          icon={<Bookmark size={48} className="text-amber-500" />}
          title="Sign in to view your watchlist"
          message="Queue upcoming films, classic must-watches, and weekend movie plans by signing into your account."
          actionText="Sign In Now"
          onAction={onNavigateToLogin}
        />
      </div>
    );
  }

  return (
    <div className="page-wrapper watchlist-page">
      <div className="page-title-banner">
        <div className="flex-center-gap">
          <Bookmark size={28} className="fill-amber-500 text-amber-500" />
          <h1 className="page-heading">My Watchlist</h1>
        </div>
        <p className="page-subheading">
          Movies queued for your upcoming movie nights and weekend binges ({watchlistMovies.length} saved)
        </p>
      </div>

      <div className="movies-grid-container">
        {loading ? (
          <SkeletonCard count={4} />
        ) : watchlistMovies.length > 0 ? (
          watchlistMovies.map((m) => (
            <MovieCard
              key={m._id}
              movie={m}
              onSelect={onSelectMovie}
              onWatchTrailer={onWatchTrailer}
            />
          ))
        ) : (
          <div className="w-full">
            <EmptyState
              icon={<Bookmark size={44} className="text-slate-500" />}
              title="Your watchlist is empty"
              message="No movies queued to watch yet. Browse the collection and tap the bookmark icon on any movie card to add it here!"
              actionText="Browse Movies to Queue"
              onAction={onNavigateToDiscover}
            />
          </div>
        )}
      </div>
    </div>
  );
};
