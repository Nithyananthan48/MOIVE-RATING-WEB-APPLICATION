import React from "react";
import { Search, Filter, RotateCcw, LayoutGrid, List } from "lucide-react";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  selectedYear: number;
  onYearChange: (year: number) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
  minScore: number;
  onMinScoreChange: (score: number) => void;
  genres: string[];
  languages: string[];
  years: number[];
  viewMode: "grid" | "list";
  onViewModeToggle: () => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  selectedLanguage,
  onLanguageChange,
  selectedYear,
  onYearChange,
  selectedSort,
  onSortChange,
  minScore,
  onMinScoreChange,
  genres,
  languages,
  years,
  viewMode,
  onViewModeToggle,
  onResetFilters,
  totalResults
}) => {
  const hasActiveFilters =
    searchQuery || selectedGenre || selectedLanguage || selectedYear > 0 || minScore > 0 || selectedSort !== "latest";

  return (
    <div className="filter-panel-card">
      {/* Top Search & Primary Filters */}
      <div className="filter-main-row">
        {/* Search Input */}
        <div className="filter-search-box">
          <Search size={18} className="search-box-icon" />
          <input
            type="text"
            placeholder="Search by title, director, cast, or genre..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="filter-search-input"
          />
          {searchQuery && (
            <button
              className="search-clear-inline"
              onClick={() => onSearchChange("")}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* View Mode & Reset Controls */}
        <div className="filter-aux-controls">
          <button
            className="view-toggle-btn"
            onClick={onViewModeToggle}
            title={viewMode === "grid" ? "Switch to List View" : "Switch to Grid View"}
          >
            {viewMode === "grid" ? <List size={18} /> : <LayoutGrid size={18} />}
            <span>{viewMode === "grid" ? "List View" : "Grid View"}</span>
          </button>

          {hasActiveFilters && (
            <button className="reset-filter-btn" onClick={onResetFilters}>
              <RotateCcw size={15} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Filters Row */}
      <div className="filter-dropdowns-row">
        {/* Genre */}
        <div className="filter-item">
          <label className="filter-label">Genre</label>
          <select
            className="filter-select"
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div className="filter-item">
          <label className="filter-label">Language</label>
          <select
            className="filter-select"
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
          >
            <option value="">All Languages</option>
            {languages.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div className="filter-item">
          <label className="filter-label">Release Year</label>
          <select
            className="filter-select"
            value={selectedYear || ""}
            onChange={(e) => onYearChange(Number(e.target.value) || 0)}
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="filter-item">
          <label className="filter-label">Sort By</label>
          <select
            className="filter-select"
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="latest">Latest Releases</option>
            <option value="score">Top Score / Rating</option>
            <option value="popular">Most Popular</option>
            <option value="year">Newest Year</option>
            <option value="oldest">Oldest Year</option>
            <option value="az">Title (A-Z)</option>
            <option value="za">Title (Z-A)</option>
          </select>
        </div>

        {/* Minimum Score Slider */}
        <div className="filter-item min-score-item">
          <div className="score-slider-header">
            <label className="filter-label">Min Score</label>
            <span className="slider-score-value">{minScore > 0 ? `${minScore}+` : "Any"}</span>
          </div>
          <input
            type="range"
            min="0"
            max="95"
            step="5"
            value={minScore}
            onChange={(e) => onMinScoreChange(Number(e.target.value))}
            className="score-range-slider"
          />
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="filter-results-bar">
        <span>Showing <strong>{totalResults}</strong> {totalResults === 1 ? "movie" : "movies"}</span>
        {selectedGenre && <span className="active-filter-tag">Genre: {selectedGenre}</span>}
        {selectedLanguage && <span className="active-filter-tag">Language: {selectedLanguage}</span>}
        {selectedYear > 0 && <span className="active-filter-tag">Year: {selectedYear}</span>}
        {minScore > 0 && <span className="active-filter-tag">Score: ≥{minScore}</span>}
      </div>
    </div>
  );
};
