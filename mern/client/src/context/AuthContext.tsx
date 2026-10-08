import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User } from "../types";
import { api } from "../services/api";
import { useToast } from "./ToastContext";

interface AuthContextType {
  user: User | null;
  token: string | null;
  favorites: string[];
  watchlist: string[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  toggleFavorite: (movieId: string) => Promise<boolean>;
  toggleWatchlist: (movieId: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  updateProfile: (payload: { name?: string; avatar?: string; currentPassword?: string; newPassword?: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  favorites: [],
  watchlist: [],
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  toggleFavorite: async () => false,
  toggleWatchlist: async () => false,
  refreshUser: async () => {},
  updateProfile: async () => false
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("movie_da_token"));
  const [favorites, setFavorites] = useState<string[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadUserData = useCallback(async () => {
    const currentToken = localStorage.getItem("movie_da_token");
    if (!currentToken) {
      setUser(null);
      setFavorites([]);
      setWatchlist([]);
      setLoading(false);
      return;
    }

    try {
      const [meRes, listsRes] = await Promise.all([
        api.getMe(),
        api.getUserLists()
      ]);
      setUser(meRes.user);
      setFavorites(listsRes.favorites || []);
      setWatchlist(listsRes.watchlist || []);
    } catch (err) {
      console.warn("Session check failed or expired:", err);
      localStorage.removeItem("movie_da_token");
      setToken(null);
      setUser(null);
      setFavorites([]);
      setWatchlist([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.login({ email, password });
      localStorage.setItem("movie_da_token", res.token);
      setToken(res.token);
      setUser(res.user);
      showToast(`Welcome back, ${res.user.name}!`, "success");

      // Load user favorites and watchlist
      const lists = await api.getUserLists().catch(() => ({ favorites: [], watchlist: [] }));
      setFavorites(lists.favorites);
      setWatchlist(lists.watchlist);
      return true;
    } catch (err: any) {
      showToast(err.message || "Login failed", "error");
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.register({ name, email, password });
      localStorage.setItem("movie_da_token", res.token);
      setToken(res.token);
      setUser(res.user);
      showToast(`Welcome to Movie Da, ${res.user.name}! Account created.`, "success");
      setFavorites([]);
      setWatchlist([]);
      return true;
    } catch (err: any) {
      showToast(err.message || "Registration failed", "error");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("movie_da_token");
    setToken(null);
    setUser(null);
    setFavorites([]);
    setWatchlist([]);
    showToast("Logged out successfully.", "info");
  };

  const toggleFavorite = async (movieId: string): Promise<boolean> => {
    if (!token) {
      showToast("Please log in to add movies to your favorites.", "info");
      return false;
    }

    // Optimistic UI update
    const isCurrentlyFavorited = favorites.includes(movieId);
    setFavorites((prev) =>
      isCurrentlyFavorited ? prev.filter((id) => id !== movieId) : [...prev, movieId]
    );

    try {
      const res = await api.toggleFavorite(movieId);
      setFavorites(res.favorites);
      showToast(res.message, "success");
      return res.isFavorited;
    } catch (err: any) {
      // Revert optimistic update
      setFavorites((prev) =>
        isCurrentlyFavorited ? [...prev, movieId] : prev.filter((id) => id !== movieId)
      );
      showToast(err.message || "Could not update favorites.", "error");
      return isCurrentlyFavorited;
    }
  };

  const toggleWatchlist = async (movieId: string): Promise<boolean> => {
    if (!token) {
      showToast("Please log in to add movies to your watchlist.", "info");
      return false;
    }

    // Optimistic UI update
    const isCurrentlyInWatchlist = watchlist.includes(movieId);
    setWatchlist((prev) =>
      isCurrentlyInWatchlist ? prev.filter((id) => id !== movieId) : [...prev, movieId]
    );

    try {
      const res = await api.toggleWatchlist(movieId);
      setWatchlist(res.watchlist);
      showToast(res.message, "success");
      return res.isInWatchlist;
    } catch (err: any) {
      // Revert optimistic update
      setWatchlist((prev) =>
        isCurrentlyInWatchlist ? [...prev, movieId] : prev.filter((id) => id !== movieId)
      );
      showToast(err.message || "Could not update watchlist.", "error");
      return isCurrentlyInWatchlist;
    }
  };

  const refreshUser = async () => {
    await loadUserData();
  };

  const updateProfile = async (payload: {
    name?: string;
    avatar?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<boolean> => {
    try {
      const res = await api.updateProfile(payload);
      setUser(res.user);
      showToast(res.message, "success");
      return true;
    } catch (err: any) {
      showToast(err.message || "Failed to update profile", "error");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        favorites,
        watchlist,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        loading,
        login,
        register,
        logout,
        toggleFavorite,
        toggleWatchlist,
        refreshUser,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
