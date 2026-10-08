import React, { useState } from "react";
import { Film, Lock, Mail, ArrowRight, UserCheck, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface LoginPageProps {
  onNavigateRegister: () => void;
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateRegister,
  onSuccess
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      onSuccess();
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
    setLoading(true);
    const ok = await login(demoEmail, demoPass);
    setLoading(false);
    if (ok) onSuccess();
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card-box">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-brand-icon">
            <Film size={28} className="text-sky-400" />
          </div>
          <h1 className="auth-title">Welcome to Movie Da</h1>
          <p className="auth-subtitle">Sign in to sync your favorites, watchlist, and ratings</p>
        </div>

        {error && <div className="form-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={16} className="field-icon" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input has-icon"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-with-icon">
              <Lock size={16} className="field-icon" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input has-icon"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full mt-2"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Quick Demo Logins Section */}
        <div className="demo-logins-section">
          <p className="demo-label">One-Click Portfolio Testing Logins:</p>
          <div className="demo-buttons-row">
            <button
              type="button"
              className="btn-demo"
              onClick={() => handleQuickDemoLogin("demo@movieda.com", "demo1234")}
              disabled={loading}
            >
              <UserCheck size={14} /> Demo User
            </button>
            <button
              type="button"
              className="btn-demo-admin"
              onClick={() => handleQuickDemoLogin("admin@moviehub.com", "admin123")}
              disabled={loading}
            >
              <Shield size={14} /> Admin Access
            </button>
          </div>
        </div>

        <div className="auth-footer-text">
          <span>Don't have an account yet?</span>
          <button className="auth-link-btn" onClick={onNavigateRegister}>
            Create an Account <ArrowRight size={14} className="inline-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};
