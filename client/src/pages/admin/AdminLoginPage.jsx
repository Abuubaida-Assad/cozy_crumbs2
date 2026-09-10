import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@cozycrumbs.local');
  const [password, setPassword] = useState('ChangeThisBeforeDeploying123!');
  const [errorMessage, setErrorMessage] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const res = await login(email, password);
    if (res.success) {
      navigate('/admin');
    } else {
      setErrorMessage(res.error || 'Failed to authenticate');
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('admin@cozycrumbs.local');
    setPassword('ChangeThisBeforeDeploying123!');
    setErrorMessage('');
    const res = await login('admin@cozycrumbs.local', 'ChangeThisBeforeDeploying123!');
    if (res.success) {
      navigate('/admin');
    } else {
      setErrorMessage(res.error || 'Failed to authenticate');
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
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#ECE5D8]/70 mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cozycrumbs6767@gmail.com"
              className="w-full px-4 py-3 rounded-xl bg-[#1B130E] border border-white/10 text-white placeholder-white/30 text-xs font-semibold focus:border-[#C06B3E] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#ECE5D8]/70 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#1B130E] border border-white/10 text-white placeholder-white/30 text-xs font-semibold focus:border-[#C06B3E] outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#C06B3E] hover:bg-[#a8582d] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md mt-2 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In To Dashboard →'}
          </button>
        </form>

        {/* Quick Demo One-Click Access */}
        <div className="mt-6 pt-5 border-t border-white/10 text-center space-y-2.5">
          <p className="text-[11px] text-[#ECE5D8]/50 font-medium">
            Pre-configured with admin credentials
          </p>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
          >
            ⚡ 1-Click Instant Sign In
          </button>
        </div>

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
