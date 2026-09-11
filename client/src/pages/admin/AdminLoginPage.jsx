import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    const res = await login(cleanEmail, cleanPassword);
    if (res.success) {
      navigate('/admin', { replace: true });
    } else {
      setErrorMessage(res.error || 'Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#1B130E] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-[#ECE5D8]">
      {/* Background Decorative Warm Ambient Glows */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#C06B3E]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#C06B3E]/10 blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-[#241B15] border border-white/10 rounded-[32px] p-8 sm:p-10 shadow-2xl relative z-10"
      >
        {/* Header Branding */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#ECE5D8] text-[#1B130E] flex items-center justify-center mx-auto shadow-md">
            <span className="text-2xl">🎂</span>
          </div>
          <div>
            <Link to="/" className="inline-block">
              <span className="font-hero font-extrabold text-2xl uppercase tracking-tight text-white block">
                COZY CRUMBS
              </span>
            </Link>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C06B3E] block mt-1">
              ADMIN PORTAL
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#ECE5D8]/70 mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              name="admin_email_field"
              required
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              className="w-full px-4 py-3 rounded-xl bg-[#1B130E] border border-white/10 text-white placeholder-white/30 text-xs font-semibold focus:border-[#C06B3E] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#ECE5D8]/70 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="admin_password_field"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 rounded-xl bg-[#1B130E] border border-white/10 text-white placeholder-white/30 text-xs font-semibold focus:border-[#C06B3E] outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#C06B3E] hover:bg-[#a8582d] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md mt-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In To Dashboard →'}
          </button>

        </form>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs font-medium text-[#ECE5D8]/50 hover:text-white transition-colors"
          >
            ← Back to Customer Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
