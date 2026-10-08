import React from "react";

interface SkeletonCardProps {
  count?: number;
  viewMode?: "grid" | "list";
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ count = 8, viewMode = "grid" }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton-card-item ${viewMode === "list" ? "skeleton-list" : "skeleton-grid"}`}
        >
          <div className="skeleton-poster" />
          <div className="skeleton-details">
            <div className="skeleton-bar title-bar" />
            <div className="skeleton-bar meta-bar" />
            <div className="skeleton-bar tags-bar" />
          </div>
        </div>
      ))}
    </>
  );
};
