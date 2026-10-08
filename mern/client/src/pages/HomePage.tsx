import React, { useEffect, useState } from "react";
import { Flame, Star, Clock, Sparkles, TrendingUp } from "lucide-react";
import { HomeSections, Movie } from "../types";
import { api } from "../services/api";
import { HeroBanner } from "../components/HeroBanner";
import { MovieSection } from "../components/MovieSection";
import { SkeletonCard } from "../components/SkeletonCard";

interface HomePageProps {
  onSelectMovie: (movieId: string) => void;
  onWatchTrailer: (url: string, title: string) => void;
  onNavigateToDiscover: (filter?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectMovie,
  onWatchTrailer,
  onNavigateToDiscover
}) => {
  const [sections, setSections] = useState<HomeSections | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .getHomeSections()
      .then((data) => {
        if (mounted) setSections(data);
      })
      .catch((err) => console.error("Error fetching home sections:", err))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper home-page">
        <div className="hero-banner skeleton-hero" />
        <div className="home-sections-container">
          <div className="section-header">
            <div className="skeleton-bar title-bar w-48" />
          </div>
          <div className="movies-grid-container">
            <SkeletonCard count={4} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper home-page">
      {/* Hero Banner with Featured Movie */}
      <HeroBanner
        movie={sections?.featured || null}
        onWatchTrailer={onWatchTrailer}
        onViewDetails={onSelectMovie}
      />

      {/* Main Movie Carousels */}
      <div className="home-sections-container">
        {/* Trending Movies */}
        {sections?.trending && sections.trending.length > 0 && (
          <MovieSection
            title="Trending Movies"
            icon={<Flame size={22} className="text-orange-500" />}
            subtitle="Most viewed and engaged movies this week"
            movies={sections.trending}
            onSelectMovie={onSelectMovie}
            onWatchTrailer={onWatchTrailer}
            onViewAll={() => onNavigateToDiscover({ sort: "popular" })}
          />
        )}

        {/* Top Rated Cinema */}
        {sections?.topRated && sections.topRated.length > 0 && (
          <MovieSection
            title="Top Rated Masterpieces"
            icon={<Star size={22} className="fill-amber-400 text-amber-400" />}
            subtitle="Critically acclaimed films with highest community & expert scores"
            movies={sections.topRated}
            onSelectMovie={onSelectMovie}
            onWatchTrailer={onWatchTrailer}
            onViewAll={() => onNavigateToDiscover({ sort: "score" })}
          />
        )}

        {/* Recommended For You */}
        {sections?.recommended && sections.recommended.length > 0 && (
          <MovieSection
            title="Recommended For You"
            icon={<Sparkles size={22} className="text-indigo-400" />}
            subtitle="Personalized curation tailored to your favorite genres and watchlist"
            movies={sections.recommended}
            onSelectMovie={onSelectMovie}
            onWatchTrailer={onWatchTrailer}
            onViewAll={() => onNavigateToDiscover({})}
          />
        )}

        {/* Popular Tamil Classics */}
        {sections?.popular && sections.popular.length > 0 && (
          <MovieSection
            title="Fan Favorites & Blockbusters"
            icon={<TrendingUp size={22} className="text-emerald-400" />}
            subtitle="Audience champions and memorable box office giants"
            movies={sections.popular}
            onSelectMovie={onSelectMovie}
            onWatchTrailer={onWatchTrailer}
            onViewAll={() => onNavigateToDiscover({ sort: "popular" })}
          />
        )}

        {/* Recently Added */}
        {sections?.recentlyAdded && sections.recentlyAdded.length > 0 && (
          <MovieSection
            title="Recently Released & Added"
            icon={<Clock size={22} className="text-cyan-400" />}
            subtitle="Fresh additions to the Movie Da catalog"
            movies={sections.recentlyAdded}
            onSelectMovie={onSelectMovie}
            onWatchTrailer={onWatchTrailer}
            onViewAll={() => onNavigateToDiscover({ sort: "year" })}
          />
        )}
      </div>
    </div>
  );
};
