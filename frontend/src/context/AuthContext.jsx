import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, clearSession, getStoredUser, getToken, saveSession } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (getToken() ? getStoredUser() : null));
  const [guest, setGuest] = useState(() => localStorage.getItem('ceagapGuest') === '1');

  useEffect(() => {
    const onLogout = () => setUser(null);
    window.addEventListener('ceagap:logout', onLogout);
    return () => window.removeEventListener('ceagap:logout', onLogout);
  }, []);

  const finish = useCallback(d => {
    saveSession(d.token, d.user);
    setUser(d.user);
    setGuest(false);
    return d.user;
  }, []);

  const login = useCallback(async (mobile, password) => {
    const d = await api('/api/auth/login', { method: 'POST', body: { mobile, password } });
    return finish(d);
  }, [finish]);

  const adminLogin = useCallback(async (username, password) => {
    const d = await api('/api/auth/admin-login', { method: 'POST', body: { username, password } });
    return finish(d);
  }, [finish]);

  const register = useCallback(async form => {
    const d = await api('/api/auth/register', { method: 'POST', body: form });
    return finish(d);
  }, [finish]);

  const logout = useCallback(() => {
    clearSession();
    localStorage.removeItem('ceagapGuest');
    setUser(null);
    setGuest(false);
  }, []);

  const continueAsGuest = useCallback(() => {
    localStorage.setItem('ceagapGuest', '1');
    setGuest(true);
  }, []);

  const value = useMemo(
    () => ({ user, guest, isAdmin: user?.role === 'admin', login, adminLogin, register, logout, continueAsGuest }),
    [user, guest, login, adminLogin, register, logout, continueAsGuest]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
