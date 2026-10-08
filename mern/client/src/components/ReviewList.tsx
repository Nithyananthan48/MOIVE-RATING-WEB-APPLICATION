import React from "react";
import { Star, Trash2, Edit2, MessageSquare, ThumbsUp } from "lucide-react";
import { Review, ReviewStats } from "../types";
import { useAuth } from "../context/AuthContext";

interface ReviewListProps {
  reviews: Review[];
  stats: ReviewStats;
  onOpenReviewModal: () => void;
  onDeleteReview: (reviewId: string) => void;
  onEditReview: (review: Review) => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  stats,
  onOpenReviewModal,
  onDeleteReview,
  onEditReview
}) => {
  const { user, isAdmin } = useAuth();
  const userReview = reviews.find((r) => r.user === user?.id);

  return (
    <section className="reviews-section-card">
      <div className="reviews-header-row">
        <div>
          <h2 className="reviews-title">
            <MessageSquare size={20} className="inline-icon" />
            Audience Reviews & Community Ratings
          </h2>
          <p className="reviews-subtitle">
            Real feedback from verified viewers and cinema enthusiasts
          </p>
        </div>

        <div>
          {user ? (
            <button className="btn-primary" onClick={onOpenReviewModal}>
              <Star size={16} className="fill-current" />
              {userReview ? "Edit Your Review" : "Write a Review"}
            </button>
          ) : (
            <p className="login-to-review-hint">
              Log in to rate this movie & write a review
            </p>
          )}
        </div>
      </div>

      {/* Stats Summary & Breakdown */}
      <div className="review-stats-grid">
        <div className="overall-score-box">
          <div className="huge-rating-number">{stats.average > 0 ? stats.average.toFixed(1) : "—"}</div>
          <div className="stars-display">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={16}
                className={s <= Math.round(stats.average) ? "fill-amber-400 text-amber-400" : "text-slate-600"}
              />
            ))}
          </div>
          <p className="total-ratings-count">Based on {stats.total} {stats.total === 1 ? "review" : "reviews"}</p>
        </div>

        {/* Rating Distribution Progress Bars */}
        <div className="distribution-bars-box">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.distribution[star as 1 | 2 | 3 | 4 | 5] || 0;
            const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;

            return (
              <div key={star} className="dist-row">
                <span className="dist-star-label">{star} ★</span>
                <div className="dist-bar-track">
                  <div
                    className="dist-bar-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="dist-count-label">{count} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Cards List */}
      <div className="review-items-list">
        {reviews.length === 0 ? (
          <div className="empty-reviews-box">
            <p>No community reviews posted yet for this title.</p>
            <p className="subtext">Be the first to share your rating and review!</p>
          </div>
        ) : (
          reviews.map((r) => {
            const isOwner = user && r.user === user.id;
            const canDelete = isOwner || isAdmin;

            return (
              <article key={r._id} className="review-card-item">
                <div className="review-card-header">
                  <div className="review-author-info">
                    {r.userAvatar ? (
                      <img src={r.userAvatar} alt={r.userName} className="author-avatar" />
                    ) : (
                      <div className="author-avatar-fallback">
                        {r.userName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                    <div>
                      <h4 className="author-name">
                        {r.userName}
                        {isOwner && <span className="you-badge">You</span>}
                      </h4>
                      <span className="review-date">
                        {new Date(r.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="review-card-meta">
                    <div className="review-star-pills">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={s <= r.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}
                        />
                      ))}
                      <span className="rating-num-label">{r.rating}.0</span>
                    </div>

                    <div className="review-actions-group">
                      {isOwner && (
                        <button
                          className="review-action-btn edit"
                          onClick={() => onEditReview(r)}
                          title="Edit your review"
                        >
                          <Edit2 size={14} />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          className="review-action-btn delete"
                          onClick={() => onDeleteReview(r._id)}
                          title="Delete review"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <p className="review-comment-body">{r.comment}</p>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
};
