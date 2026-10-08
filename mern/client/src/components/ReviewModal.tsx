import React, { useState, useEffect } from "react";
import { Star, X } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  movieTitle: string;
  initialRating?: number;
  initialComment?: string;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

const RATING_LABELS: Record<number, string> = {
  1: "Poor (1★)",
  2: "Fair (2★)",
  3: "Good (3★)",
  4: "Great (4★)",
  5: "Masterpiece! (5★)"
};

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  movieTitle,
  initialRating = 5,
  initialComment = "",
  onClose,
  onSubmit
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setRating(initialRating || 5);
    setComment(initialComment || "");
    setError("");
  }, [initialRating, initialComment, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || comment.trim().length < 2) {
      setError("Please write at least a few words for your review.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await onSubmit(rating, comment.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="review-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Write a Review</h3>
            <p className="modal-subtitle">{movieTitle}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          {error && <div className="form-error-banner">{error}</div>}

          {/* Interactive Star Rating */}
          <div className="rating-select-group">
            <label className="input-label">Your Rating</label>
            <div className="stars-picker" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className="star-pick-btn"
                  onMouseEnter={() => setHoverRating(star)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={28}
                    className={`star-icon ${(hoverRating || rating) >= star ? "fill-amber-400 text-amber-400" : "text-slate-500"}`}
                  />
                </button>
              ))}
            </div>
            <span className="rating-hint-text">
              {RATING_LABELS[hoverRating || rating]}
            </span>
          </div>

          {/* Review Text */}
          <div className="input-group">
            <label className="input-label">Your Review & Thoughts</label>
            <textarea
              className="review-textarea"
              placeholder="What made this movie special? Share your thoughts on the acting, plot, screenplay, or music..."
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions-row">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : initialComment ? "Update Review" : "Post Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
