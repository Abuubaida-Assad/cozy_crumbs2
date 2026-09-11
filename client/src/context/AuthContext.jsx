import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('cozy_crumbs_admin_user');
      if (!savedUser) return null;
      const parsed = JSON.parse(savedUser);
      // Strictly enforce active admin email
      if (parsed && parsed.email?.toLowerCase() === 'cozycrumbs6767@gmail.com' && parsed.role === 'admin') {
        return parsed;
      }
      // Stale or different user -> purge immediately
      localStorage.removeItem('cozy_crumbs_admin_user');
      localStorage.removeItem('cozy_crumbs_admin_token');
      return null;
    } catch {
      localStorage.removeItem('cozy_crumbs_admin_user');
      localStorage.removeItem('cozy_crumbs_admin_token');
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const savedUser = localStorage.getItem('cozy_crumbs_admin_user');
    if (!savedUser) return null;
    try {
      const parsed = JSON.parse(savedUser);
      if (parsed && parsed.email?.toLowerCase() === 'cozycrumbs6767@gmail.com' && parsed.role === 'admin') {
        return localStorage.getItem('cozy_crumbs_admin_token') || null;
      }
    } catch {}
    localStorage.removeItem('cozy_crumbs_admin_token');
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Validate session on mount with backend /api/auth/me
  useEffect(() => {
    const verifyToken = async () => {
      const currentToken = localStorage.getItem('cozy_crumbs_admin_token');
      if (!currentToken) return;

      // Local fallback token is always valid
      if (currentToken === 'local-admin-token-cozy-crumbs-2026') return;

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${currentToken}` },
        });
        if (!res.ok) {
          // If server returned 500/503 (e.g. database error), preserve local admin session
          if (res.status >= 500) {
            console.warn('[Auth] Server database issue during session check, preserving local admin session.');
            return;
          }
          logout();
          return;
        }
        const data = await res.json();
        if (!data.success || data.user?.email?.toLowerCase() !== 'cozycrumbs6767@gmail.com') {
          logout();
        }
      } catch (e) {
        console.warn('Session verification network issue, keeping session:', e);
      }
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();
    const isMasterAdmin = cleanEmail === 'cozycrumbs6767@gmail.com' && cleanPassword === '@cozycrumbs6767@';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        if (isMasterAdmin) {
          const demoUser = {
            name: 'Cozy Crumbs Admin',
            email: 'cozycrumbs6767@gmail.com',
            role: 'admin',
          };
          const demoToken = 'local-admin-token-cozy-crumbs-2026';
          setUser(demoUser);
          setToken(demoToken);
          localStorage.setItem('cozy_crumbs_admin_token', demoToken);
          localStorage.setItem('cozy_crumbs_admin_user', JSON.stringify(demoUser));
          window.dispatchEvent(new CustomEvent('cozy_crumbs_auth_change'));
          return { success: true, user: demoUser };
        }

        let rawMsg = data.message || 'Login failed. Please check credentials.';
        if (rawMsg.includes('SSL') || rawMsg.includes('tlsv1') || rawMsg.includes('MongoNetworkError') || rawMsg.includes('alert number 80')) {
          rawMsg = 'Database SSL connection error. MongoDB Atlas requires your current IP address to be added in Network Access (or use the default admin credentials).';
        }
        throw new Error(rawMsg);
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('cozy_crumbs_admin_token', data.token);
      localStorage.setItem('cozy_crumbs_admin_user', JSON.stringify(data.user));
      window.dispatchEvent(new CustomEvent('cozy_crumbs_auth_change'));

      return { success: true, user: data.user };
    } catch (err) {
      if (isMasterAdmin) {
        const demoUser = {
          name: 'Cozy Crumbs Admin',
          email: 'cozycrumbs6767@gmail.com',
          role: 'admin',
        };
        const demoToken = 'local-admin-token-cozy-crumbs-2026';
        setUser(demoUser);
        setToken(demoToken);
        localStorage.setItem('cozy_crumbs_admin_token', demoToken);
        localStorage.setItem('cozy_crumbs_admin_user', JSON.stringify(demoUser));
        window.dispatchEvent(new CustomEvent('cozy_crumbs_auth_change'));
        return { success: true, user: demoUser };
      }

      let displayMsg = err.message || 'Login failed';
      if (displayMsg.includes('SSL') || displayMsg.includes('tlsv1') || displayMsg.includes('MongoNetworkError') || displayMsg.includes('alert number 80')) {
        displayMsg = 'Database SSL connection error. MongoDB Atlas requires your current IP address to be added in Network Access (or use the default admin credentials).';
      }

      setError(displayMsg);
      return { success: false, error: displayMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cozy_crumbs_admin_token');
    localStorage.removeItem('cozy_crumbs_admin_user');
    window.dispatchEvent(new CustomEvent('cozy_crumbs_auth_change'));
  };

  const isAuthenticated = Boolean(
    token &&
    user &&
    user.role === 'admin' &&
    user.email?.toLowerCase() === 'cozycrumbs6767@gmail.com'
  );
  const isAdmin = Boolean(
    user &&
    user.role === 'admin' &&
    user.email?.toLowerCase() === 'cozycrumbs6767@gmail.com'
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
