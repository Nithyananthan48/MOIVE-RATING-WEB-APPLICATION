import React, { useState } from "react";
import { Film, Lock, Mail, User, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface RegisterPageProps {
  onNavigateLogin: () => void;
  onSuccess: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigateLogin,
  onSuccess
}) => {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Please enter your name (at least 2 characters).");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const ok = await register(name.trim(), email.trim(), password);
    setLoading(false);
    if (ok) {
      onSuccess();
    } else {
      setError("Registration failed. Please check your details or try another email.");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card-box">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-brand-icon">
            <Film size={28} className="text-sky-400" />
          </div>
          <h1 className="auth-title">Join Movie Da</h1>
          <p className="auth-subtitle">Create your free account to curate lists and rate movies</p>
        </div>

        {error && <div className="form-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <div className="input-with-icon">
              <User size={16} className="field-icon" />
              <input
                type="text"
                placeholder="Nithyananthan N"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input has-icon"
              />
            </div>
          </div>

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
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="form-input has-icon"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Confirm Password</label>
            <div className="input-with-icon">
              <ShieldCheck size={16} className="field-icon" />
              <input
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="form-input has-icon"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full mt-3"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer-text">
          <span>Already have an account?</span>
          <button className="auth-link-btn" onClick={onNavigateLogin}>
            Sign In <ArrowRight size={14} className="inline-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};
