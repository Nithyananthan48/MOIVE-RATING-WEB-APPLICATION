import React, { useState } from "react";
import {
  Film,
  Search,
  Heart,
  Bookmark,
  Sun,
  Moon,
  User as UserIcon,
  LogOut,
  Shield,
  Menu,
  X,
  Compass
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
  onSearchSubmit?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onSearchSubmit
}) => {
  const { user, favorites, watchlist, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [navSearch, setNavSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && navSearch.trim()) {
      if (onSearchSubmit) {
        onSearchSubmit(navSearch.trim());
      } else {
        onNavigate("movies", { q: navSearch.trim() });
      }
      setNavSearch("");
      setMobileMenuOpen(false);
    }
  };

  const navItemClick = (page: string, params?: any) => {
    onNavigate(page, params);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => navItemClick("home")}>
          <div className="brand-icon-box">
            <Film className="brand-icon" size={24} />
          </div>
          <span className="brand-text">
            Movie <span className="brand-accent">Da</span>
          </span>
          <span className="brand-tag">MERN</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="navbar-links">
          <button
            className={`nav-link ${currentPage === "home" ? "active" : ""}`}
            onClick={() => navItemClick("home")}
          >
            Home
          </button>
          <button
            className={`nav-link ${currentPage === "movies" ? "active" : ""}`}
            onClick={() => navItemClick("movies")}
          >
            <Compass size={16} className="inline-icon" />
            Discover
          </button>
          <button
            className={`nav-link ${currentPage === "favorites" ? "active" : ""}`}
            onClick={() => navItemClick("favorites")}
          >
            <Heart size={16} className="inline-icon" />
            Favorites
            {favorites.length > 0 && <span className="nav-badge">{favorites.length}</span>}
          </button>
          <button
            className={`nav-link ${currentPage === "watchlist" ? "active" : ""}`}
            onClick={() => navItemClick("watchlist")}
          >
            <Bookmark size={16} className="inline-icon" />
            Watchlist
            {watchlist.length > 0 && <span className="nav-badge">{watchlist.length}</span>}
          </button>
          {isAdmin && (
            <button
              className={`nav-link nav-admin ${currentPage === "admin" ? "active" : ""}`}
              onClick={() => navItemClick("admin")}
            >
              <Shield size={16} className="inline-icon text-amber-400" />
              Admin
            </button>
          )}
        </nav>

        {/* Navbar Search & Right Controls */}
        <div className="navbar-controls">
          <div className="nav-search-bar">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search movies, cast..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              onKeyDown={handleSearchKey}
              className="nav-search-input"
            />
            {navSearch && (
              <button
                className="search-clear-btn"
                onClick={() => setNavSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            className="control-icon-btn theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* User Profile or Auth */}
          {user ? (
            <div className="profile-dropdown-wrapper">
              <button
                className="user-profile-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="user-avatar-sm" />
                ) : (
                  <div className="user-avatar-placeholder">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="user-name-label">{user.name.split(" ")[0]}</span>
              </button>

              {profileDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <p className="dropdown-user-name">{user.name}</p>
                    <p className="dropdown-user-email">{user.email}</p>
                    <span className={`dropdown-role-badge ${user.role}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                  <hr className="dropdown-divider" />
                  <button
                    className="dropdown-item"
                    onClick={() => navItemClick("profile")}
                  >
                    <UserIcon size={16} />
                    My Profile
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => navItemClick("favorites")}
                  >
                    <Heart size={16} />
                    Favorites ({favorites.length})
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => navItemClick("watchlist")}
                  >
                    <Bookmark size={16} />
                    Watchlist ({watchlist.length})
                  </button>
                  {isAdmin && (
                    <button
                      className="dropdown-item"
                      onClick={() => navItemClick("admin")}
                    >
                      <Shield size={16} />
                      Admin Dashboard
                    </button>
                  )}
                  <hr className="dropdown-divider" />
                  <button
                    className="dropdown-item text-red"
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons-group">
              <button
                className="btn-text"
                onClick={() => navItemClick("login")}
              >
                Sign In
              </button>
              <button
                className="btn-primary-sm"
                onClick={() => navItemClick("register")}
              >
                Register
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search movies, actors, directors..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              onKeyDown={handleSearchKey}
            />
          </div>
          <button
            className={`mobile-nav-item ${currentPage === "home" ? "active" : ""}`}
            onClick={() => navItemClick("home")}
          >
            Home
          </button>
          <button
            className={`mobile-nav-item ${currentPage === "movies" ? "active" : ""}`}
            onClick={() => navItemClick("movies")}
          >
            Discover All Movies
          </button>
          <button
            className={`mobile-nav-item ${currentPage === "favorites" ? "active" : ""}`}
            onClick={() => navItemClick("favorites")}
          >
            My Favorites ({favorites.length})
          </button>
          <button
            className={`mobile-nav-item ${currentPage === "watchlist" ? "active" : ""}`}
            onClick={() => navItemClick("watchlist")}
          >
            My Watchlist ({watchlist.length})
          </button>
          {isAdmin && (
            <button
              className={`mobile-nav-item ${currentPage === "admin" ? "active" : ""}`}
              onClick={() => navItemClick("admin")}
            >
              Admin Dashboard
            </button>
          )}
          {user ? (
            <>
              <button
                className={`mobile-nav-item ${currentPage === "profile" ? "active" : ""}`}
                onClick={() => navItemClick("profile")}
              >
                Profile ({user.name})
              </button>
              <button
                className="mobile-nav-item text-red"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="mobile-auth-actions">
              <button
                className="btn-secondary w-full"
                onClick={() => navItemClick("login")}
              >
                Sign In
              </button>
              <button
                className="btn-primary w-full"
                onClick={() => navItemClick("register")}
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
