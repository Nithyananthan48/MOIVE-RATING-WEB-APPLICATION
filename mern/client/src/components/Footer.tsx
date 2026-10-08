import React from "react";
import { Film, Heart, Shield, Globe } from "lucide-react";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <div className="footer-brand" onClick={() => onNavigate("home")}>
            <Film className="footer-logo-icon" size={26} />
            <span className="footer-logo-text">
              Movie <span className="brand-accent">Da</span>
            </span>
          </div>
          <p className="footer-desc">
            A premier full-stack movie discovery, aggregation, and community rating platform celebrating the brilliance of Tamil cinema and global entertainment.
          </p>
          <div className="footer-social-links">
            <a
              href="https://github.com/Nithyananthan48/movie-da-mern"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              title="GitHub Repository"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/nithyananthan959794/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              title="LinkedIn Profile"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Navigation</h4>
          <ul className="footer-list">
            <li><button onClick={() => onNavigate("home")}>Home</button></li>
            <li><button onClick={() => onNavigate("movies")}>Discover Movies</button></li>
            <li><button onClick={() => onNavigate("favorites")}>My Favorites</button></li>
            <li><button onClick={() => onNavigate("watchlist")}>My Watchlist</button></li>
            <li><button onClick={() => onNavigate("profile")}>User Profile</button></li>
          </ul>
        </div>

        {/* Architecture & Stack */}
        <div className="footer-col">
          <h4 className="footer-heading">Tech Stack</h4>
          <ul className="footer-list static-list">
            <li><span>MongoDB & Mongoose</span></li>
            <li><span>Express.js REST APIs</span></li>
            <li><span>React 18 & TypeScript</span></li>
            <li><span>Node.js & Vite Tooling</span></li>
            <li><span>JWT & Bcrypt Security</span></li>
          </ul>
        </div>

        {/* Author / Portfolio */}
        <div className="footer-col">
          <h4 className="footer-heading">Developer</h4>
          <p className="footer-dev-name">Nithyananthan N</p>
          <p className="footer-dev-sub">MCA Student | Full Stack Developer</p>
          <div className="footer-badge-box">
            <span className="footer-badge">MERN Stack Certified</span>
            <span className="footer-badge">Production Ready</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Movie Da. Built with <Heart size={14} className="inline-heart" /> by{" "}
          <a
            href="https://github.com/Nithyananthan48"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-author-link"
          >
            Nithyananthan N
          </a>
          .
        </p>
      </div>
    </footer>
  );
};
