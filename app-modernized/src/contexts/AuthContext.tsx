'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import type { AuthState, LoginCredentials } from '@/types/auth';
import * as authLib from '@/lib/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const token = authLib.getToken();
    const user = authLib.getCurrentUser();
    setState({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading: false,
      error: null,
    });
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const { token, user } = await authLib.login(credentials);
        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        router.push('/protected');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        setState((prev) => ({ ...prev, isLoading: false, error: message }));
        throw error;
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    authLib.logout();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
