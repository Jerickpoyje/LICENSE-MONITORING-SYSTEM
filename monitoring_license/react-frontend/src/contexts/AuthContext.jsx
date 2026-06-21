import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = window.localStorage.getItem('monitoring-user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (userData) => {
    window.localStorage.setItem('monitoring-user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    window.localStorage.removeItem('monitoring-user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
