import React, { useState, useEffect } from "react";
import {
  User as UserIcon,
  Heart,
  Bookmark,
  MessageSquare,
  Star,
  Calendar,
  Shield,
  Edit3,
  Trash2,
  Lock,
  X
} from "lucide-react";
import { Movie, Review } from "../types";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { MovieCard } from "../components/MovieCard";
import { EmptyState } from "../components/EmptyState";
import { ConfirmModal } from "../components/ConfirmModal";

interface ProfilePageProps {
  onSelectMovie: (id: string) => void;
  onWatchTrailer: (url: string, title: string) => void;
  onNavigateToDiscover: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onSelectMovie,
  onWatchTrailer,
  onNavigateToDiscover
}) => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"favorites" | "watchlist" | "reviews">("favorites");
  const [profileStats, setProfileStats] = useState<{
    favoritesCount: number;
    watchlistCount: number;
    reviewsCount: number;
    avgRating: number;
  }>({
    favoritesCount: 0,
    watchlistCount: 0,
    reviewsCount: 0,
    avgRating: 0
  });

  const [favoritesList, setFavoritesList] = useState<Movie[]>([]);
  const [watchlistList, setWatchlistList] = useState<Movie[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Profile Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  // Delete review
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [statsRes, favsRes, watchRes, reviewsRes] = await Promise.all([
        api.getProfileStats(),
        api.getFavorites().catch(() => []),
        api.getWatchlist().catch(() => []),
        api.getUserReviews().catch(() => [])
      ]);

      setProfileStats(statsRes.stats);
      setFavoritesList(favsRes);
      setWatchlistList(watchRes);
      setUserReviews(reviewsRes);
      if (user) setEditName(user.name);
    } catch (err: any) {
      console.error("Error loading profile details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    const ok = await updateProfile({
      name: editName.trim(),
      currentPassword: currentPassword ? currentPassword : undefined,
      newPassword: newPassword ? newPassword : undefined
    });
    setUpdating(false);

    if (ok) {
      setEditModalOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      await loadProfileData();
    }
  };

  const confirmDeleteReview = async () => {
    if (!reviewToDelete) return;
    try {
      const res = await api.deleteReview(reviewToDelete);
      showToast(res.message, "success");
      setDeleteConfirmOpen(false);
      setReviewToDelete(null);
      await loadProfileData();
    } catch (err: any) {
      showToast(err.message || "Failed to delete review", "error");
    }
  };

  if (!user) {
    return (
      <div className="page-wrapper">
        <EmptyState
          icon={<UserIcon size={48} />}
          title="Account Login Required"
          message="Please sign in to view your user dashboard, ratings, and list statistics."
          actionText="Discover Movies"
          onAction={onNavigateToDiscover}
        />
      </div>
    );
  }

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric"
      })
    : "Member";

  return (
    <div className="page-wrapper profile-page">
      {/* Profile Header Card */}
      <div className="profile-header-card">
        <div className="profile-header-left">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="profile-large-avatar" />
          ) : (
            <div className="profile-large-avatar-fallback">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="profile-user-details">
            <div className="profile-name-row">
              <h1 className="profile-display-name">{user.name}</h1>
              <span className={`profile-badge-pill ${user.role}`}>
                {user.role === "admin" && <Shield size={13} className="inline-icon" />}
                {user.role.toUpperCase()}
              </span>
            </div>
            <p className="profile-email-text">{user.email}</p>
            <p className="profile-joined-text">
              <Calendar size={14} className="inline-icon" /> Member since {joinDate}
            </p>
          </div>
        </div>

        <button
          className="btn-secondary flex-center-gap"
          onClick={() => {
            setEditName(user.name);
            setEditModalOpen(true);
          }}
        >
          <Edit3 size={16} /> Edit Profile
        </button>
      </div>

      {/* Analytics Statistics Row */}
      <div className="profile-stats-grid">
        <div className="profile-stat-box" onClick={() => setActiveTab("favorites")}>
          <div className="stat-icon-wrapper text-pink-500">
            <Heart size={22} className="fill-current" />
          </div>
          <div className="stat-numeric">{profileStats.favoritesCount}</div>
          <div className="stat-label">Favorites Saved</div>
        </div>

        <div className="profile-stat-box" onClick={() => setActiveTab("watchlist")}>
          <div className="stat-icon-wrapper text-amber-500">
            <Bookmark size={22} className="fill-current" />
          </div>
          <div className="stat-numeric">{profileStats.watchlistCount}</div>
          <div className="stat-label">Watchlist Queued</div>
        </div>

        <div className="profile-stat-box" onClick={() => setActiveTab("reviews")}>
          <div className="stat-icon-wrapper text-cyan-400">
            <MessageSquare size={22} />
          </div>
          <div className="stat-numeric">{profileStats.reviewsCount}</div>
          <div className="stat-label">Reviews Written</div>
        </div>

        <div className="profile-stat-box">
          <div className="stat-icon-wrapper text-amber-400">
            <Star size={22} className="fill-current" />
          </div>
          <div className="stat-numeric">
            {profileStats.avgRating > 0 ? `${profileStats.avgRating} ★` : "—"}
          </div>
          <div className="stat-label">Average Given</div>
        </div>
      </div>

      {/* Tab Controls */}
      <div className="profile-tabs-bar">
        <button
          className={`profile-tab-btn ${activeTab === "favorites" ? "active" : ""}`}
          onClick={() => setActiveTab("favorites")}
        >
          <Heart size={16} /> My Favorites ({favoritesList.length})
        </button>
        <button
          className={`profile-tab-btn ${activeTab === "watchlist" ? "active" : ""}`}
          onClick={() => setActiveTab("watchlist")}
        >
          <Bookmark size={16} /> My Watchlist ({watchlistList.length})
        </button>
        <button
          className={`profile-tab-btn ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          <MessageSquare size={16} /> My Reviews ({userReviews.length})
        </button>
      </div>

      {/* Tab Content Display */}
      <div className="profile-tab-content">
        {activeTab === "favorites" && (
          <div className="movies-grid-container">
            {favoritesList.length > 0 ? (
              favoritesList.map((m) => (
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
                  icon={<Heart size={44} />}
                  title="No Favorites Saved"
                  message="Explore movies and hit the heart icon to curate your personal collection here."
                  actionText="Discover Movies"
                  onAction={onNavigateToDiscover}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "watchlist" && (
          <div className="movies-grid-container">
            {watchlistList.length > 0 ? (
              watchlistList.map((m) => (
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
                  icon={<Bookmark size={44} />}
                  title="No Watchlist Items"
                  message="Queue films you plan to watch later by clicking the bookmark icon."
                  actionText="Explore Movies"
                  onAction={onNavigateToDiscover}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="user-reviews-container">
            {userReviews.length > 0 ? (
              userReviews.map((r) => {
                const mov = typeof r.movie === "object" ? (r.movie as Movie) : null;
                return (
                  <article key={r._id} className="profile-review-card">
                    {mov && mov.poster && (
                      <img
                        src={mov.poster}
                        alt={mov.title}
                        className="profile-review-poster"
                        onClick={() => onSelectMovie(mov._id)}
                      />
                    )}

                    <div className="profile-review-body">
                      <div className="profile-review-header">
                        <div>
                          <h3
                            className="profile-review-movie-title"
                            onClick={() => mov && onSelectMovie(mov._id)}
                          >
                            {mov?.title || "Movie"} {mov?.year && `(${mov.year})`}
                          </h3>
                          <span className="profile-review-date">
                            Reviewed on {new Date(r.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex-center-gap">
                          <div className="stars-row">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={15}
                                className={s <= r.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}
                              />
                            ))}
                          </div>

                          <button
                            className="btn-icon-danger"
                            onClick={() => {
                              setReviewToDelete(r._id);
                              setDeleteConfirmOpen(true);
                            }}
                            title="Delete review"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <p className="profile-review-text">{r.comment}</p>
                    </div>
                  </article>
                );
              })
            ) : (
              <EmptyState
                icon={<MessageSquare size={44} />}
                title="No Reviews Written Yet"
                message="Rate and review films you've watched to share your perspective with the Movie Da community!"
                actionText="Discover Movies"
                onAction={onNavigateToDiscover}
              />
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="modal-backdrop" onClick={() => setEditModalOpen(false)}>
          <div className="edit-profile-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Profile</h3>
              <button className="modal-close-btn" onClick={() => setEditModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProfileSave} className="edit-profile-form">
              <div className="input-group">
                <label className="input-label">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <hr className="form-divider" />
              <p className="password-change-hint">
                <Lock size={14} className="inline-icon" /> Change Password (optional)
              </p>

              <div className="input-group">
                <label className="input-label">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password to change"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="input-group">
                <label className="input-label">New Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input"
                  minLength={6}
                />
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={updating}
                >
                  {updating ? "Saving Changes..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Review */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="Delete Review"
        message="Are you sure you want to permanently delete this review? Your rating will be removed from the movie average."
        confirmText="Delete"
        onConfirm={confirmDeleteReview}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setReviewToDelete(null);
        }}
      />
    </div>
  );
};
