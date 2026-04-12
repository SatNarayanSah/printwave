'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthUserDto } from '@/lib/api/types';
import { authApi } from '@/lib/api';

type AuthState = {
  user: AuthUserDto | null;
  loading: boolean;
  login: (payload: { email: string; password: string }) => Promise<{ mustChangePassword: boolean; data?: { user: AuthUserDto } }>;
  register: (payload: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUserDto | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await authApi.me();
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (payload: { email: string; password: string }) => {
    const res = await authApi.login(payload);
    setUser(res.data.user);
    return {
      mustChangePassword: (res as any).mustChangePassword || res.data.user?.mustChangePassword || false,
      data: res.data,
    };
  }, []);

  const register = useCallback(
    async (payload: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => {
      await authApi.register(payload);
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, loading, login, register, logout, refresh }),
    [user, loading, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

