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
    <div className="min-h-screen bg-[#112229] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-[#F8F8F2]">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#147C98]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#FFA7EE]/20 blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-[#162D36]/90 backdrop-blur-xl border border-white/15 rounded-[36px] p-8 sm:p-10 shadow-2xl relative z-10"
      >
        {/* Header Branding */}
        <div className="text-center space-y-2 mb-8">
          <Link to="/" className="inline-block">
            <span className="font-hero font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-white block">
              COZY CRUMBS
            </span>
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-[#FFA7EE]/20 border border-[#FFA7EE]/40 text-[#FFA7EE] font-title text-[11px] font-extrabold uppercase tracking-widest">
            <span>Admin Management Studio</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#F8F8F2]/75 mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@cozycrumbs.local"
              className="w-full px-4 py-3.5 rounded-2xl bg-[#112229] border border-white/15 text-white placeholder-white/40 text-sm font-semibold focus:border-[#FFA7EE] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#F8F8F2]/75 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 rounded-2xl bg-[#112229] border border-white/15 text-white placeholder-white/40 text-sm font-semibold focus:border-[#FFA7EE] outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-pill bg-[#FFA7EE] text-[#112229] font-title font-extrabold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-lg hover:shadow-pink-500/25 disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In To Dashboard →'}
          </button>
        </form>

        {/* Quick Demo One-Click Access */}
        <div className="mt-6 pt-6 border-t border-white/10 text-center space-y-3">
          <p className="text-xs text-[#F8F8F2]/60 font-semibold">
            Pre-configured with local MongoDB Atlas admin
          </p>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="w-full py-3 rounded-pill bg-[#147C98] hover:bg-[#1994b6] text-white font-title font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
          >
            ⚡ 1-Click Sign In (Atlas Admin)
          </button>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs font-bold uppercase tracking-wider text-white/60 hover:text-[#FFA7EE] transition-colors"
          >
            ← Back to Cozy Crumbs Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
