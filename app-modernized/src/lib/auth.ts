import type { LoginCredentials, LoginResponse, User } from '@/types/auth';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const TOKEN_KEY = 'token';

export async function login(
  credentials: LoginCredentials
): Promise<{ token: string; user: User }> {
  const response = await fetch(`${API_URL}/auth/getToken/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  const data: LoginResponse = await response.json();
  const decoded = jwtDecode<{ userName: string }>(data.token);

  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, data.token);
  }

  return { token: data.token, user: { userName: decoded.userName } };
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser(): User | null {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<{ userName: string }>(token);
    return { userName: decoded.userName };
  } catch {
    return null;
  }
}

export function getAuthHeader(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
