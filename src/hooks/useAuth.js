// Demo auth — module-level shared state
// MUHIM: bu hook bir necha komponentdan chaqirilsa ham, hammasi BIR XIL holatni ko'radi.
// (Avval har chaqiruvi alohida useState yaratardi — login bug shu sababli)

import { useEffect, useState, useCallback } from 'react';

const TOKEN_KEY = 'signhand_token';
const USER_KEY  = 'signhand_user';

const DEMO_USERS = [
  { username: 'admin',  password: 'admin123',  full_name: 'Administrator', role: 'admin' },
  { username: 'talaba', password: 'talaba123', full_name: 'Talaba',        role: 'student' },
  { username: 'demo',   password: 'demo',      full_name: 'Demo User',     role: 'student' },
];

function readUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

// ── Module-level holat — barcha chaqiruvlar shu yerdan o'qiydi ──
let _user = readUser();
const _listeners = new Set();

function _setUser(u) {
  _user = u;
  _listeners.forEach(fn => fn(u));
}

export default function useAuth() {
  // Tinglovchi: shared state o'zgarganda re-render
  const [, force] = useState(0);
  useEffect(() => {
    const onChange = () => force(x => x + 1);
    _listeners.add(onChange);
    return () => _listeners.delete(onChange);
  }, []);

  const login = useCallback(async (username, password) => {
    const u = DEMO_USERS.find(x => x.username === username && x.password === password);
    if (!u) throw new Error("Login yoki parol noto'g'ri");
    const userData = { username: u.username, full_name: u.full_name, role: u.role };
    try {
      localStorage.setItem(TOKEN_KEY, btoa(username + ':' + Date.now()));
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch {}
    _setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {}
    _setUser(null);
  }, []);

  return { user: _user, login, logout, isLoggedIn: !!_user };
}
