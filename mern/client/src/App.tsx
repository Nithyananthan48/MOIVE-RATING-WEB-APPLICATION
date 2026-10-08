import React, { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";

// Components
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { TrailerModal } from "./components/TrailerModal";

// Pages
import { HomePage } from "./pages/HomePage";
import { MoviesPage } from "./pages/MoviesPage";
import { MovieDetailPage } from "./pages/MovieDetailPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { WatchlistPage } from "./pages/WatchlistPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

import "./styles.css";

export function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  // Discover page initial filter states
  const [discoverParams, setDiscoverParams] = useState<{
    q?: string;
    sort?: string;
    genre?: string;
  }>({});

  // Trailer Modal
  const [trailerModal, setTrailerModal] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
  }>({
    isOpen: false,
    url: "",
    title: ""
  });

  const navigate = (page: string, params?: any) => {
    if (page === "movie-detail" && params?.id) {
      setSelectedMovieId(params.id);
    } else if (page === "movies" && params) {
      setDiscoverParams(params);
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openTrailer = (url: string, title: string) => {
    setTrailerModal({
      isOpen: true,
      url,
      title
    });
  };

  const closeTrailer = () => {
    setTrailerModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="app-layout">
      {/* Global Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigate}
        onSearchSubmit={(q) => navigate("movies", { q })}
      />

      {/* Main Page Body */}
      <main className="app-main-content">
        {currentPage === "home" && (
          <HomePage
            onSelectMovie={(id) => navigate("movie-detail", { id })}
            onWatchTrailer={openTrailer}
            onNavigateToDiscover={(params) => navigate("movies", params)}
          />
        )}

        {currentPage === "movies" && (
          <MoviesPage
            initialSearchQuery={discoverParams.q}
            initialSort={discoverParams.sort}
            initialGenre={discoverParams.genre}
            onSelectMovie={(id) => navigate("movie-detail", { id })}
            onWatchTrailer={openTrailer}
          />
        )}

        {currentPage === "movie-detail" && selectedMovieId && (
          <MovieDetailPage
            movieId={selectedMovieId}
            onBack={() => navigate("movies")}
            onSelectMovie={(id) => navigate("movie-detail", { id })}
            onWatchTrailer={openTrailer}
          />
        )}

        {currentPage === "favorites" && (
          <FavoritesPage
            onSelectMovie={(id) => navigate("movie-detail", { id })}
            onWatchTrailer={openTrailer}
            onNavigateToDiscover={() => navigate("movies")}
            onNavigateToLogin={() => navigate("login")}
          />
        )}

        {currentPage === "watchlist" && (
          <WatchlistPage
            onSelectMovie={(id) => navigate("movie-detail", { id })}
            onWatchTrailer={openTrailer}
            onNavigateToDiscover={() => navigate("movies")}
            onNavigateToLogin={() => navigate("login")}
          />
        )}

        {currentPage === "profile" && (
          <ProfilePage
            onSelectMovie={(id) => navigate("movie-detail", { id })}
            onWatchTrailer={openTrailer}
            onNavigateToDiscover={() => navigate("movies")}
          />
        )}

        {currentPage === "admin" && (
          <AdminDashboardPage
            onNavigateHome={() => navigate("home")}
            onSelectMovie={(id) => navigate("movie-detail", { id })}
          />
        )}

        {currentPage === "login" && (
          <LoginPage
            onNavigateRegister={() => navigate("register")}
            onSuccess={() => navigate("home")}
          />
        )}

        {currentPage === "register" && (
          <RegisterPage
            onNavigateLogin={() => navigate("login")}
            onSuccess={() => navigate("home")}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigate} />

      {/* Global YouTube Trailer Modal */}
      <TrailerModal
        isOpen={trailerModal.isOpen}
        trailerUrl={trailerModal.url}
        movieTitle={trailerModal.title}
        onClose={closeTrailer}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
