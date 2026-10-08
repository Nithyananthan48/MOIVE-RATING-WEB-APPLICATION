import React, { useState, useEffect } from "react";
import {
  Shield,
  Film,
  Users,
  MessageSquare,
  Heart,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Star,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { Movie, Review, User, AdminStats } from "../types";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ConfirmModal } from "../components/ConfirmModal";
import { EmptyState } from "../components/EmptyState";

interface AdminDashboardPageProps {
  onNavigateHome: () => void;
  onSelectMovie: (id: string) => void;
}

const DEFAULT_MOVIE_FORM = {
  title: "",
  year: 2024,
  genre: "Action, Drama",
  language: "Tamil",
  runtime: 140,
  director: "",
  cast: "",
  description: "",
  poster: "",
  backdrop: "",
  trailerUrl: "",
  imdb: 8.0,
  audience: 85,
  critic: 80,
  featured: false
};

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigateHome,
  onSelectMovie
}) => {
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"movies" | "reviews" | "users">("movies");
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalMovies: 0,
    totalReviews: 0,
    totalFavorites: 0,
    totalWatchlist: 0
  });

  const [moviesList, setMoviesList] = useState<Movie[]>([]);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Movie Search filter in admin
  const [movieFilter, setMovieFilter] = useState("");

  // Add/Edit Movie Modal
  const [movieModalOpen, setMovieModalOpen] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);
  const [movieForm, setMovieForm] = useState(DEFAULT_MOVIE_FORM);
  const [submittingMovie, setSubmittingMovie] = useState(false);

  // Delete Confirmations
  const [deleteMovieConfirm, setDeleteMovieConfirm] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<{ id: string; title: string } | null>(null);

  const [deleteReviewConfirm, setDeleteReviewConfirm] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, moviesRes, reviewsRes] = await Promise.all([
        api.getAdminStats(),
        api.getMovies({ limit: 100 }),
        api.getAdminReviews()
      ]);

      setStats(statsRes.stats);
      setUsersList(statsRes.recentUsers || []);
      setMoviesList(moviesRes.items || []);
      setReviewsList(reviewsRes || []);
    } catch (err: any) {
      showToast(err.message || "Failed to load admin metrics", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const handleOpenAddMovie = () => {
    setEditingMovieId(null);
    setMovieForm(DEFAULT_MOVIE_FORM);
    setMovieModalOpen(true);
  };

  const handleOpenEditMovie = (m: Movie) => {
    setEditingMovieId(m._id);
    setMovieForm({
      title: m.title,
      year: m.year,
      genre: Array.isArray(m.genre) ? m.genre.join(", ") : (m.genre || ""),
      language: m.language,
      runtime: m.runtime,
      director: m.director || "",
      cast: Array.isArray(m.cast) ? m.cast.join(", ") : "",
      description: m.description,
      poster: m.poster,
      backdrop: m.backdrop || "",
      trailerUrl: m.trailerUrl || "",
      imdb: m.ratings?.imdb ?? 8.0,
      audience: m.ratings?.audience ?? 85,
      critic: m.ratings?.critic ?? 80,
      featured: m.featured || false
    });
    setMovieModalOpen(true);
  };

  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieForm.title.trim() || !movieForm.description.trim()) {
      showToast("Movie title and description are required.", "error");
      return;
    }

    setSubmittingMovie(true);
    try {
      const payload = {
        title: movieForm.title.trim(),
        year: Number(movieForm.year),
        genre: movieForm.genre,
        language: movieForm.language.trim(),
        runtime: Number(movieForm.runtime),
        director: movieForm.director.trim(),
        cast: movieForm.cast,
        description: movieForm.description.trim(),
        poster: movieForm.poster.trim(),
        backdrop: movieForm.backdrop.trim(),
        trailerUrl: movieForm.trailerUrl.trim(),
        ratings: {
          imdb: Number(movieForm.imdb),
          audience: Number(movieForm.audience),
          critic: Number(movieForm.critic)
        },
        featured: movieForm.featured
      };

      if (editingMovieId) {
        await api.updateMovie(editingMovieId, payload);
        showToast("Movie updated successfully!", "success");
      } else {
        await api.createMovie(payload);
        showToast("Movie created successfully!", "success");
      }

      setMovieModalOpen(false);
      await loadAdminData();
    } catch (err: any) {
      showToast(err.message || "Failed to save movie", "error");
    } finally {
      setSubmittingMovie(false);
    }
  };

  const handleConfirmDeleteMovie = async () => {
    if (!movieToDelete) return;
    try {
      const res = await api.deleteMovie(movieToDelete.id);
      showToast(res.message, "success");
      setDeleteMovieConfirm(false);
      setMovieToDelete(null);
      await loadAdminData();
    } catch (err: any) {
      showToast(err.message || "Failed to delete movie", "error");
    }
  };

  const handleConfirmDeleteReview = async () => {
    if (!reviewToDelete) return;
    try {
      const res = await api.deleteAdminReview(reviewToDelete);
      showToast(res.message, "success");
      setDeleteReviewConfirm(false);
      setReviewToDelete(null);
      await loadAdminData();
    } catch (err: any) {
      showToast(err.message || "Failed to delete review", "error");
    }
  };

  if (!isAdmin) {
    return (
      <div className="page-wrapper">
        <EmptyState
          icon={<Shield size={50} className="text-red-500" />}
          title="Access Restricted"
          message="Administrator credentials are required to view the management dashboard."
          actionText="Return to Home"
          onAction={onNavigateHome}
        />
      </div>
    );
  }

  const filteredMovies = moviesList.filter((m) =>
    m.title.toLowerCase().includes(movieFilter.toLowerCase()) ||
    m.director?.toLowerCase().includes(movieFilter.toLowerCase())
  );

  return (
    <div className="page-wrapper admin-page">
      {/* Page Header */}
      <div className="admin-header-row">
        <div>
          <div className="flex-center-gap">
            <Shield size={28} className="text-amber-400" />
            <h1 className="page-heading">Platform Administration</h1>
          </div>
          <p className="page-subheading">
            Manage movies catalog, moderate reviews, and inspect platform analytics
          </p>
        </div>

        <button className="btn-primary flex-center-gap" onClick={handleOpenAddMovie}>
          <Plus size={18} /> Add New Movie
        </button>
      </div>

      {/* Analytics Metric Cards */}
      <div className="admin-stats-grid">
        <div className="admin-metric-card">
          <div className="metric-icon-box bg-blue">
            <Film size={22} className="text-blue-400" />
          </div>
          <div className="metric-value">{stats.totalMovies}</div>
          <div className="metric-label">Total Catalog Movies</div>
        </div>

        <div className="admin-metric-card">
          <div className="metric-icon-box bg-purple">
            <Users size={22} className="text-purple-400" />
          </div>
          <div className="metric-value">{stats.totalUsers}</div>
          <div className="metric-label">Registered Users</div>
        </div>

        <div className="admin-metric-card">
          <div className="metric-icon-box bg-cyan">
            <MessageSquare size={22} className="text-cyan-400" />
          </div>
          <div className="metric-value">{stats.totalReviews}</div>
          <div className="metric-label">Audience Reviews</div>
        </div>

        <div className="admin-metric-card">
          <div className="metric-icon-box bg-pink">
            <Heart size={22} className="text-pink-400" />
          </div>
          <div className="metric-value">{stats.totalFavorites}</div>
          <div className="metric-label">Total Favorited Items</div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="admin-tabs-bar">
        <button
          className={`admin-tab-btn ${activeTab === "movies" ? "active" : ""}`}
          onClick={() => setActiveTab("movies")}
        >
          <Film size={16} /> Movie Catalog ({moviesList.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          <MessageSquare size={16} /> Review Moderation ({reviewsList.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <Users size={16} /> User Accounts ({usersList.length})
        </button>
      </div>

      {/* TAB 1: Movie Catalog Management */}
      {activeTab === "movies" && (
        <div className="admin-panel-card">
          <div className="admin-panel-toolbar">
            <div className="admin-search-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search movies in catalog..."
                value={movieFilter}
                onChange={(e) => setMovieFilter(e.target.value)}
                className="admin-search-input"
              />
            </div>

            <span className="text-subtle">
              Showing {filteredMovies.length} of {moviesList.length} movies
            </span>
          </div>

          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Movie</th>
                  <th>Year</th>
                  <th>Genres</th>
                  <th>Language</th>
                  <th>Score</th>
                  <th>Trailer</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovies.map((m) => (
                  <tr key={m._id}>
                    <td>
                      <div className="table-movie-cell">
                        <img
                          src={m.poster}
                          alt={m.title}
                          className="table-poster-thumb"
                          onClick={() => onSelectMovie(m._id)}
                        />
                        <div>
                          <p
                            className="table-movie-title"
                            onClick={() => onSelectMovie(m._id)}
                          >
                            {m.title}
                          </p>
                          <span className="table-movie-dir">
                            {m.director || "Director not listed"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>{m.year}</td>
                    <td>
                      <div className="table-genre-tags">
                        {m.genre?.slice(0, 2).map((g) => (
                          <span key={g} className="badge-micro">{g}</span>
                        ))}
                      </div>
                    </td>
                    <td>{m.language}</td>
                    <td>
                      <span className="table-score-badge">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        {m.score}
                      </span>
                    </td>
                    <td>
                      {m.trailerUrl ? (
                        <span className="badge-trailer-ok">Active</span>
                      ) : (
                        <span className="badge-trailer-none">None</span>
                      )}
                    </td>
                    <td className="text-right">
                      <div className="table-actions-cell">
                        <button
                          className="btn-icon-edit"
                          onClick={() => handleOpenEditMovie(m)}
                          title="Edit movie"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn-icon-danger"
                          onClick={() => {
                            setMovieToDelete({ id: m._id, title: m.title });
                            setDeleteMovieConfirm(true);
                          }}
                          title="Delete movie"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Review Moderation */}
      {activeTab === "reviews" && (
        <div className="admin-panel-card">
          <div className="admin-panel-toolbar">
            <h3 className="section-title-sm">Platform Reviews</h3>
            <span className="text-subtle">{reviewsList.length} total reviews</span>
          </div>

          <div className="admin-reviews-stream">
            {reviewsList.length > 0 ? (
              reviewsList.map((r) => {
                const mov = typeof r.movie === "object" ? (r.movie as Movie) : null;
                return (
                  <div key={r._id} className="admin-review-item">
                    <div className="admin-review-top">
                      <div>
                        <h4 className="admin-review-title">
                          {mov?.title || "Movie"} • By <strong>{r.userName}</strong>
                        </h4>
                        <div className="flex-center-gap">
                          <span className="stars-row">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={13}
                                className={s <= r.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}
                              />
                            ))}
                          </span>
                          <span className="admin-review-date">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <button
                        className="btn-danger-sm flex-center-gap"
                        onClick={() => {
                          setReviewToDelete(r._id);
                          setDeleteReviewConfirm(true);
                        }}
                      >
                        <Trash2 size={14} /> Remove Review
                      </button>
                    </div>

                    <p className="admin-review-comment">{r.comment}</p>
                  </div>
                );
              })
            ) : (
              <p className="empty-subtext">No user reviews submitted yet.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Registered Users */}
      {activeTab === "users" && (
        <div className="admin-panel-card">
          <div className="admin-panel-toolbar">
            <h3 className="section-title-sm">Registered Accounts</h3>
            <span className="text-subtle">{usersList.length} users</span>
          </div>

          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="flex-center-gap">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="user-avatar-sm" />
                        ) : (
                          <div className="user-avatar-placeholder">{u.name.charAt(0)}</div>
                        )}
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`dropdown-role-badge ${u.role}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Active"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Movie Modal */}
      {movieModalOpen && (
        <div className="modal-backdrop" onClick={() => setMovieModalOpen(false)}>
          <div className="movie-form-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingMovieId ? "Edit Movie Details" : "Add New Movie to Catalog"}
              </h3>
              <button className="modal-close-btn" onClick={() => setMovieModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveMovie} className="movie-admin-form">
              <div className="form-grid-2">
                <div className="input-group">
                  <label className="input-label">Title *</label>
                  <input
                    type="text"
                    value={movieForm.title}
                    onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Release Year *</label>
                  <input
                    type="number"
                    value={movieForm.year}
                    onChange={(e) => setMovieForm({ ...movieForm, year: Number(e.target.value) })}
                    required
                    className="form-input"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Genres (comma separated) *</label>
                  <input
                    type="text"
                    value={movieForm.genre}
                    onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                    placeholder="Action, Thriller, Drama"
                    required
                    className="form-input"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Language</label>
                  <input
                    type="text"
                    value={movieForm.language}
                    onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Runtime (minutes)</label>
                  <input
                    type="number"
                    value={movieForm.runtime}
                    onChange={(e) => setMovieForm({ ...movieForm, runtime: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Director</label>
                  <input
                    type="text"
                    value={movieForm.director}
                    onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="input-group col-span-2">
                  <label className="input-label">Key Cast (comma separated)</label>
                  <input
                    type="text"
                    value={movieForm.cast}
                    onChange={(e) => setMovieForm({ ...movieForm, cast: e.target.value })}
                    placeholder="Kamal Haasan, Vijay Sethupathi, Fahadh Faasil"
                    className="form-input"
                  />
                </div>

                <div className="input-group col-span-2">
                  <label className="input-label">Poster Image URL</label>
                  <input
                    type="text"
                    value={movieForm.poster}
                    onChange={(e) => setMovieForm({ ...movieForm, poster: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="form-input"
                  />
                </div>

                <div className="input-group col-span-2">
                  <label className="input-label">Backdrop Image URL (banner)</label>
                  <input
                    type="text"
                    value={movieForm.backdrop}
                    onChange={(e) => setMovieForm({ ...movieForm, backdrop: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="form-input"
                  />
                </div>

                <div className="input-group col-span-2">
                  <label className="input-label">YouTube Trailer URL</label>
                  <input
                    type="text"
                    value={movieForm.trailerUrl}
                    onChange={(e) => setMovieForm({ ...movieForm, trailerUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=... or embed URL"
                    className="form-input"
                  />
                </div>

                <div className="input-group col-span-2">
                  <label className="input-label">Description Synopsis *</label>
                  <textarea
                    rows={3}
                    value={movieForm.description}
                    onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                    required
                    className="review-textarea"
                  />
                </div>

                {/* Score Controls */}
                <div className="input-group">
                  <label className="input-label">IMDb (0 - 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={movieForm.imdb}
                    onChange={(e) => setMovieForm({ ...movieForm, imdb: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Audience (0 - 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={movieForm.audience}
                    onChange={(e) => setMovieForm({ ...movieForm, audience: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-actions-row mt-4">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setMovieModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submittingMovie}
                >
                  {submittingMovie ? "Saving..." : editingMovieId ? "Update Movie" : "Create Movie"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Movie Confirm Modal */}
      <ConfirmModal
        isOpen={deleteMovieConfirm}
        title="Delete Movie"
        message={`Are you sure you want to permanently remove "${movieToDelete?.title}" from the catalog? All associated user reviews will also be deleted.`}
        confirmText="Delete Movie"
        onConfirm={handleConfirmDeleteMovie}
        onCancel={() => {
          setDeleteMovieConfirm(false);
          setMovieToDelete(null);
        }}
      />

      {/* Delete Review Confirm Modal */}
      <ConfirmModal
        isOpen={deleteReviewConfirm}
        title="Delete User Review"
        message="Are you sure you want to delete this community review as an administrator?"
        confirmText="Remove Review"
        onConfirm={handleConfirmDeleteReview}
        onCancel={() => {
          setDeleteReviewConfirm(false);
          setReviewToDelete(null);
        }}
      />
    </div>
  );
};
