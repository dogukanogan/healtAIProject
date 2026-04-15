import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/mockApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser  = localStorage.getItem('healthai_user');
    const savedToken = localStorage.getItem('healthai_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('healthai_user', JSON.stringify(data.user));
    localStorage.setItem('healthai_token', data.token);
    return data;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('healthai_user');
    localStorage.removeItem('healthai_token');
  };

  const isAdmin       = user?.role === 'admin';
  const isEngineer    = user?.role === 'engineer';
  const isHealthcare  = user?.role === 'healthcare';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isEngineer, isHealthcare }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
