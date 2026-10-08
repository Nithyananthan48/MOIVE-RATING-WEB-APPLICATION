import React, { useState, useEffect } from "react";
import { Heart, Film } from "lucide-react";
import { Movie } from "../types";
import { api } from "../services/api";
import { MovieCard } from "../components/MovieCard";
import { SkeletonCard } from "../components/SkeletonCard";
import { EmptyState } from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";

interface FavoritesPageProps {
  onSelectMovie: (movieId: string) => void;
  onWatchTrailer: (url: string, title: string) => void;
  onNavigateToDiscover: () => void;
  onNavigateToLogin: () => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  onSelectMovie,
  onWatchTrailer,
  onNavigateToDiscover,
  onNavigateToLogin
}) => {
  const { user, favorites } = useAuth();
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    api
      .getFavorites()
      .then((data) => setFavoriteMovies(data))
      .catch((err) => console.error("Error loading favorites:", err))
      .finally(() => setLoading(false));
  }, [user, favorites.length]);

  if (!user) {
    return (
      <div className="page-wrapper">
        <EmptyState
          icon={<Heart size={48} className="text-pink-500" />}
          title="Sign in to view favorites"
          message="Keep track of your all-time favorite movies and cinema masterpieces by logging into your account."
          actionText="Sign In Now"
          onAction={onNavigateToLogin}
        />
      </div>
    );
  }

  return (
    <div className="page-wrapper favorites-page">
      <div className="page-title-banner">
        <div className="flex-center-gap">
          <Heart size={28} className="fill-pink-500 text-pink-500" />
          <h1 className="page-heading">My Favorites</h1>
        </div>
        <p className="page-subheading">
          Your personal collection of cherished films and top cinematic choices ({favoriteMovies.length} saved)
        </p>
      </div>

      <div className="movies-grid-container">
        {loading ? (
          <SkeletonCard count={4} />
        ) : favoriteMovies.length > 0 ? (
          favoriteMovies.map((m) => (
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
              icon={<Heart size={44} className="text-slate-500" />}
              title="Your favorites list is empty"
              message="You haven't saved any movies to your favorites yet. Explore our collection and click the heart icon to save your favorites!"
              actionText="Discover Movies"
              onAction={onNavigateToDiscover}
            />
          </div>
        )}
      </div>
    </div>
  );
};
