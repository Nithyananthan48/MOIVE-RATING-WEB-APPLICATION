import React, { useState, useEffect } from "react";
import { Movie } from "../types";
import { api } from "../services/api";
import { FilterBar } from "../components/FilterBar";
import { MovieCard } from "../components/MovieCard";
import { SkeletonCard } from "../components/SkeletonCard";
import { EmptyState } from "../components/EmptyState";
import { Film } from "lucide-react";

interface MoviesPageProps {
  initialSearchQuery?: string;
  initialSort?: string;
  initialGenre?: string;
  onSelectMovie: (movieId: string) => void;
  onWatchTrailer: (url: string, title: string) => void;
}

export const MoviesPage: React.FC<MoviesPageProps> = ({
  initialSearchQuery = "",
  initialSort = "latest",
  initialGenre = "",
  onSelectMovie,
  onWatchTrailer
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [minScore, setMinScore] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Options
  const [filterOptions, setFilterOptions] = useState<{
    genres: string[];
    languages: string[];
    years: number[];
  }>({
    genres: [],
    languages: [],
    years: []
  });

  // Load filter options once
  useEffect(() => {
    api
      .getFilterOptions()
      .then((opts) => setFilterOptions(opts))
      .catch((err) => console.error("Error fetching filter options:", err));
  }, []);

  // Sync props if changed
  useEffect(() => {
    if (initialSearchQuery) setSearchQuery(initialSearchQuery);
    if (initialGenre) setSelectedGenre(initialGenre);
    if (initialSort) setSelectedSort(initialSort);
  }, [initialSearchQuery, initialGenre, initialSort]);

  // Fetch movies when filters or page changes
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      api
        .getMovies({
          q: searchQuery,
          genre: selectedGenre,
          language: selectedLanguage,
          year: selectedYear,
          min: minScore,
          sort: selectedSort,
          page,
          limit: 12
        })
        .then((res) => {
          setMovies(res.items || []);
          setTotalPages(res.totalPages || 1);
          setTotalCount(res.total || 0);
        })
        .catch((err) => {
          console.error("Error fetching movies:", err);
          setMovies([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 250); // slight debounce for search input

    return () => clearTimeout(timeout);
  }, [searchQuery, selectedGenre, selectedLanguage, selectedYear, minScore, selectedSort, page]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedGenre("");
    setSelectedLanguage("");
    setSelectedYear(0);
    setSelectedSort("latest");
    setMinScore(0);
    setPage(1);
  };

  return (
    <div className="page-wrapper movies-page">
      <div className="page-title-banner">
        <h1 className="page-heading">Discover Movies</h1>
        <p className="page-subheading">
          Explore our extensive catalog with precision filters, genre breakdowns, and community scores
        </p>
      </div>

      {/* Filter Controls Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        selectedGenre={selectedGenre}
        onGenreChange={(g) => {
          setSelectedGenre(g);
          setPage(1);
        }}
        selectedLanguage={selectedLanguage}
        onLanguageChange={(l) => {
          setSelectedLanguage(l);
          setPage(1);
        }}
        selectedYear={selectedYear}
        onYearChange={(y) => {
          setSelectedYear(y);
          setPage(1);
        }}
        selectedSort={selectedSort}
        onSortChange={(s) => {
          setSelectedSort(s);
          setPage(1);
        }}
        minScore={minScore}
        onMinScoreChange={(m) => {
          setMinScore(m);
          setPage(1);
        }}
        genres={filterOptions.genres}
        languages={filterOptions.languages}
        years={filterOptions.years}
        viewMode={viewMode}
        onViewModeToggle={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
        onResetFilters={handleResetFilters}
        totalResults={totalCount}
      />

      {/* Movie Results Grid or List */}
      <div className={viewMode === "grid" ? "movies-grid-container" : "movies-list-container"}>
        {loading ? (
          <SkeletonCard count={8} viewMode={viewMode} />
        ) : movies.length > 0 ? (
          movies.map((m) => (
            <MovieCard
              key={m._id}
              movie={m}
              onSelect={onSelectMovie}
              onWatchTrailer={onWatchTrailer}
              viewMode={viewMode}
            />
          ))
        ) : (
          <div className="empty-results-box w-full">
            <EmptyState
              icon={<Film size={48} />}
              title="No movies found"
              message={`We couldn't find any movies matching your current search or filter criteria.`}
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-bar">
          <button
            className="pagination-btn"
            disabled={page <= 1}
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            ← Previous
          </button>

          <span className="pagination-info">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </span>

          <button
            className="pagination-btn"
            disabled={page >= totalPages}
            onClick={() => {
              setPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};
