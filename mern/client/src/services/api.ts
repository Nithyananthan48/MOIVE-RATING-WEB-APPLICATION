import { Movie, User, Review, ReviewStats, HomeSections, AdminStats } from "../types";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

function getHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json"
  };
  const activeToken = token ?? localStorage.getItem("movie_da_token");
  if (activeToken) {
    headers["Authorization"] = `Bearer ${activeToken}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = { ...getHeaders(), ...(options.headers as any) };

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  register: (payload: { name: string; email: string; password: string }) =>
    request<{ token: string; user: User; message: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  login: (payload: { email: string; password: string }) =>
    request<{ token: string; user: User; message: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  getMe: () => request<{ user: User; favoritesCount: number; watchlistCount: number }>("/auth/me"),

  updateProfile: (payload: { name?: string; avatar?: string; currentPassword?: string; newPassword?: string }) =>
    request<{ user: User; message: string }>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(payload)
    }),

  // Movies
  getMovies: (params: Record<string, string | number>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.append(key, String(val));
      }
    });
    return request<{
      items: Movie[];
      page: number;
      totalPages: number;
      total: number;
      limit: number;
    }>(`/movies?${searchParams.toString()}`);
  },

  getHomeSections: () => request<HomeSections>("/movies/home-sections"),

  getMovieById: (id: string) => request<Movie>(`/movies/${id}`),

  getSimilarMovies: (id: string) => request<Movie[]>(`/movies/${id}/similar`),

  getFilterOptions: () => request<{ genres: string[]; languages: string[]; years: number[] }>("/movies/filters"),

  getRecommendations: () => request<Movie[]>("/movies/recommendations/user"),

  // Reviews
  getMovieReviews: (movieId: string) =>
    request<{ reviews: Review[]; stats: ReviewStats }>(`/movies/${movieId}/reviews`),

  addOrUpdateReview: (movieId: string, payload: { rating: number; comment: string }) =>
    request<{ message: string; review: Review }>(`/movies/${movieId}/reviews`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  deleteReview: (reviewId: string) =>
    request<{ message: string }>(`/reviews/${reviewId}`, {
      method: "DELETE"
    }),

  getUserReviews: () => request<Review[]>("/users/reviews"),

  // User lists
  getUserLists: () => request<{ favorites: string[]; watchlist: string[] }>("/users/lists"),

  getFavorites: () => request<Movie[]>("/users/favorites"),

  toggleFavorite: (movieId: string) =>
    request<{ message: string; isFavorited: boolean; favorites: string[] }>(`/users/favorites/${movieId}`, {
      method: "POST"
    }),

  getWatchlist: () => request<Movie[]>("/users/watchlist"),

  toggleWatchlist: (movieId: string) =>
    request<{ message: string; isInWatchlist: boolean; watchlist: string[] }>(`/users/watchlist/${movieId}`, {
      method: "POST"
    }),

  getProfileStats: () =>
    request<{
      user: User;
      stats: {
        favoritesCount: number;
        watchlistCount: number;
        reviewsCount: number;
        avgRating: number;
      };
    }>("/users/profile-stats"),

  // Admin
  getAdminStats: () =>
    request<{
      stats: AdminStats;
      recentReviews: Review[];
      recentUsers: User[];
    }>("/admin/stats"),

  createMovie: (payload: any) =>
    request<{ message: string; movie: Movie }>("/admin/movies", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  updateMovie: (id: string, payload: any) =>
    request<{ message: string; movie: Movie }>(`/admin/movies/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }),

  deleteMovie: (id: string) =>
    request<{ message: string }>(`/admin/movies/${id}`, {
      method: "DELETE"
    }),

  getAdminReviews: () => request<Review[]>("/admin/reviews"),

  deleteAdminReview: (id: string) =>
    request<{ message: string }>(`/admin/reviews/${id}`, {
      method: "DELETE"
    })
};
