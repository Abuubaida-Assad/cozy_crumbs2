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

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${currentToken}` },
        });
        const data = await res.json();
        if (!res.ok || !data.success || data.user?.email?.toLowerCase() !== 'cozycrumbs6767@gmail.com') {
          logout();
        }
      } catch (e) {
        console.warn('Session verification error:', e);
      }
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed. Please check credentials.');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('cozy_crumbs_admin_token', data.token);
      localStorage.setItem('cozy_crumbs_admin_user', JSON.stringify(data.user));
      window.dispatchEvent(new CustomEvent('cozy_crumbs_auth_change'));

      return { success: true, user: data.user };
    } catch (err) {
      // Strict offline check only if exact credentials match
      if (
        email.toLowerCase().trim() === 'cozycrumbs6767@gmail.com' &&
        password === '@cozycrumbs6767@'
      ) {
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

      setError(err.message);
      return { success: false, error: err.message };
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
