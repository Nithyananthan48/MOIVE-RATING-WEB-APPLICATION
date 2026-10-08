import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "../types";
import { MovieCard } from "./MovieCard";

interface MovieSectionProps {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  movies: Movie[];
  onSelectMovie: (id: string) => void;
  onWatchTrailer?: (url: string, title: string) => void;
  onViewAll?: () => void;
  viewAllLabel?: string;
}

export const MovieSection: React.FC<MovieSectionProps> = ({
  title,
  icon,
  subtitle,
  movies,
  onSelectMovie,
  onWatchTrailer,
  onViewAll,
  viewAllLabel = "View All"
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -450 : 450;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="movie-section">
      <div className="section-header">
        <div className="section-title-box">
          <div className="section-title-row">
            {icon && <span className="section-icon">{icon}</span>}
            <h2 className="section-title">{title}</h2>
          </div>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>

        <div className="section-controls">
          {onViewAll && (
            <button className="btn-view-all" onClick={onViewAll}>
              {viewAllLabel} →
            </button>
          )}

          <div className="scroll-arrows">
            <button
              className="scroll-btn"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="scroll-btn"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="section-scroll-container" ref={scrollRef}>
        {movies.map((m) => (
          <div key={m._id} className="scroll-item">
            <MovieCard
              movie={m}
              onSelect={onSelectMovie}
              onWatchTrailer={onWatchTrailer}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
