'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type AuthUser = { id: string; name?: string; email: string; phone?: string; avatarUrl?: string; role: 'customer' | 'admin'; emailVerified: boolean };
type AuthContextValue = { user: AuthUser | null; status: 'loading' | 'authenticated' | 'unauthenticated'; refresh: () => Promise<void>; updateUser: (user: AuthUser) => void; login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>; logout: () => Promise<void>; googleLogin: (credential: string) => Promise<{ ok: boolean; error?: string }> };
const AuthContext = createContext<AuthContextValue | null>(null);

async function request(path: string, options?: RequestInit) { return fetch(path, { credentials: 'include', headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) }, ...options }); }

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthContextValue['status']>('loading');
  const refresh = async () => { try { const response = await request('/api/auth/me'); const data = await response.json(); setUser(response.ok ? data.user : null); setStatus(response.ok ? 'authenticated' : 'unauthenticated'); } catch { setUser(null); setStatus('unauthenticated'); } };
  useEffect(() => { void refresh(); }, []);
  const value = useMemo<AuthContextValue>(() => ({ user, status, refresh, updateUser: (nextUser) => setUser(nextUser), login: async (email, password) => { const response = await request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }); const data = await response.json(); if (response.ok) { setUser(data.user); setStatus('authenticated'); return { ok: true }; } return { ok: false, error: data.error }; }, googleLogin: async (credential) => { const response = await request('/api/auth/google', { method: 'POST', body: JSON.stringify({ credential }) }); const data = await response.json(); if (response.ok) { setUser(data.user); setStatus('authenticated'); return { ok: true }; } return { ok: false, error: data.error }; }, logout: async () => { await request('/api/auth/logout', { method: 'POST' }); setUser(null); setStatus('unauthenticated'); } }), [user, status]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used inside AuthProvider'); return context; }
