# React Authentication App Modernization Guide

This guide provides step-by-step instructions for modernizing React-based JWT authentication applications to a modern tech stack. It is designed to work with any of the three client applications in the DevinAI-workshop organization, regardless of their current React version or state management approach.

## Target Tech Stack

The modernization process will migrate your application to the following technologies:

- **Bun** - Fast JavaScript runtime and package manager
- **Next.js with Turbopack** - React framework with blazing-fast bundler
- **TypeScript** - Type-safe JavaScript
- **Oxlint** - High-performance JavaScript/TypeScript linter
- **Biome** - Fast formatter and linter

## Prerequisites

Before starting the modernization process, ensure you have the following installed on your system:

```bash
# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
```

## Current Application Analysis

Before modernizing, identify which type of application you have:

**Type A (client-app-1 pattern):** React 0.14.x with Redux, redux-router, and isomorphic-fetch. Uses class components with mixins, Webpack 1.x, and Babel 5.x. Authentication uses JWT tokens stored in localStorage with redux-thunk for async actions.

**Type B (client-app-2 pattern):** React 18.x without Redux, using react-router-dom v6. Uses class components with local state, axios for HTTP requests, and Bootstrap for styling. Authentication service is a singleton class pattern.

**Type C (client-app-3 pattern):** React 16.x with Redux, react-router-dom v4, and a fake backend for testing. Uses class components connected to Redux store, Webpack 4.x, and Babel 7.x. Authentication uses redux-thunk with action creators.

## Step 1: Create a New Next.js Project with Bun

Start by creating a fresh Next.js project alongside your existing code. This approach allows you to incrementally migrate components while keeping the old application as reference.

```bash
# Navigate to your project's parent directory
cd /path/to/your/projects

# Create a new Next.js project with Bun and TypeScript
bun create next-app@latest your-app-modernized --typescript --turbopack --tailwind --eslint --app --src-dir --import-alias "@/*"

# Navigate into the new project
cd your-app-modernized
```

When prompted, select the following options:
- Would you like to use TypeScript? **Yes**
- Would you like to use ESLint? **Yes**
- Would you like to use Tailwind CSS? **Yes** (optional, but recommended)
- Would you like to use `src/` directory? **Yes**
- Would you like to use App Router? **Yes**
- Would you like to customize the default import alias? **Yes** (use `@/*`)

## Step 2: Configure Bun as the Package Manager

Ensure Bun is properly configured as your package manager:

```bash
# Remove any existing lock files from other package managers
rm -f package-lock.json yarn.lock pnpm-lock.yaml

# Install dependencies with Bun
bun install

# Verify the bun.lockb file was created
ls -la bun.lockb
```

## Step 3: Enable Turbopack for Development

Turbopack is Next.js's Rust-based successor to Webpack. It's enabled by default in Next.js 15+ when using `bun create next-app`. Verify your `package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

If the `--turbopack` flag is missing, add it to the `dev` script.

## Step 4: Install and Configure Oxlint

Oxlint is a high-performance linter written in Rust that can replace ESLint for many use cases while being significantly faster.

```bash
# Install oxlint
bun add -d oxlint

# Create oxlint configuration file
touch oxlintrc.json
```

Create the `oxlintrc.json` configuration:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "warn",
    "eqeqeq": "error",
    "no-var": "error",
    "prefer-const": "error"
  },
  "plugins": ["typescript", "react", "react-hooks", "jsx-a11y"],
  "ignorePatterns": [
    "node_modules",
    ".next",
    "out",
    "dist"
  ]
}
```

Add oxlint scripts to your `package.json`:

```json
{
  "scripts": {
    "lint:oxlint": "oxlint .",
    "lint:oxlint:fix": "oxlint . --fix"
  }
}
```

## Step 5: Install and Configure Biome

Biome is a fast formatter and linter that can replace Prettier and partially replace ESLint.

```bash
# Install Biome
bun add -d @biomejs/biome

# Initialize Biome configuration
bunx @biomejs/biome init
```

Update the generated `biome.json` configuration:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "complexity": {
        "noExtraBooleanCast": "error",
        "noMultipleSpacesInRegularExpressionLiterals": "error"
      },
      "correctness": {
        "noUnusedVariables": "warn",
        "useExhaustiveDependencies": "warn",
        "useHookAtTopLevel": "error"
      },
      "style": {
        "noNonNullAssertion": "warn",
        "useConst": "error"
      },
      "suspicious": {
        "noExplicitAny": "warn"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "always",
      "trailingCommas": "es5"
    }
  },
  "files": {
    "ignore": [
      "node_modules",
      ".next",
      "out",
      "dist",
      "*.config.js",
      "*.config.ts"
    ]
  }
}
```

Add Biome scripts to your `package.json`:

```json
{
  "scripts": {
    "format": "biome format --write .",
    "format:check": "biome format .",
    "lint:biome": "biome lint .",
    "lint:biome:fix": "biome lint --write .",
    "check": "biome check --write ."
  }
}
```

## Step 6: Configure TypeScript

Update your `tsconfig.json` for strict type checking:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    },
    "forceConsistentCasingInFileNames": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Step 7: Set Up Project Structure

Create the following directory structure for your modernized application:

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (protected)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   └── auth/
│   │       ├── login/
│   │       │   └── route.ts
│   │       ├── logout/
│   │       │   └── route.ts
│   │       └── register/
│   │           └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── LogoutButton.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Navigation.tsx
├── lib/
│   ├── auth.ts
│   ├── api.ts
│   └── utils.ts
├── hooks/
│   ├── useAuth.ts
│   └── useUser.ts
├── types/
│   ├── auth.ts
│   └── user.ts
└── middleware.ts
```

Create the directories:

```bash
mkdir -p src/app/\(auth\)/login src/app/\(auth\)/register
mkdir -p src/app/\(protected\)/dashboard src/app/\(protected\)/profile
mkdir -p src/app/api/auth/login src/app/api/auth/logout src/app/api/auth/register
mkdir -p src/components/auth src/components/ui src/components/layout
mkdir -p src/lib src/hooks src/types
```

## Step 8: Create TypeScript Type Definitions

Create type definitions for your authentication system in `src/types/auth.ts`:

```typescript
export interface User {
  id: string;
  username: string;
  email: string;
  roles: UserRole[];
  accessToken?: string;
}

export type UserRole = 'ROLE_USER' | 'ROLE_MODERATOR' | 'ROLE_ADMIN';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface ApiError {
  message: string;
  status: number;
}
```

Create user types in `src/types/user.ts`:

```typescript
import type { User, UserRole } from './auth';

export interface UserProfile extends User {
  createdAt: string;
  updatedAt: string;
}

export interface UserPermissions {
  canViewUserBoard: boolean;
  canViewModeratorBoard: boolean;
  canViewAdminBoard: boolean;
}

export function getUserPermissions(roles: UserRole[]): UserPermissions {
  return {
    canViewUserBoard: roles.includes('ROLE_USER'),
    canViewModeratorBoard: roles.includes('ROLE_MODERATOR'),
    canViewAdminBoard: roles.includes('ROLE_ADMIN'),
  };
}
```

## Step 9: Create Authentication Library

Create the authentication utility functions in `src/lib/auth.ts`:

```typescript
import type { User, LoginCredentials, RegisterData, LoginResponse } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const data: LoginResponse = await response.json();

  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  return data;
}

export async function register(data: RegisterData): Promise<void> {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export function getAuthHeader(): Record<string, string> {
  const token = getToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}
```

## Step 10: Create API Utility Functions

Create API helper functions in `src/lib/api.ts`:

```typescript
import { getAuthHeader, logout } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requireAuth = true, headers = {}, ...restOptions } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (requireAuth) {
    Object.assign(requestHeaders, getAuthHeader());
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...restOptions,
    headers: requestHeaders,
  });

  if (response.status === 401) {
    logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};
```

## Step 11: Create Authentication Hook

Create a custom hook for authentication in `src/hooks/useAuth.ts`:

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, LoginCredentials, RegisterData, AuthState } from '@/types/auth';
import * as authLib from '@/lib/auth';

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const user = authLib.getCurrentUser();
    setState({
      user,
      isAuthenticated: user !== null,
      isLoading: false,
      error: null,
    });
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await authLib.login(credentials);
        setState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        router.push('/dashboard');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        throw error;
      }
    },
    [router]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        await authLib.register(data);
        setState((prev) => ({ ...prev, isLoading: false }));
        router.push('/login');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        throw error;
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    authLib.logout();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    router.push('/login');
  }, [router]);

  return {
    ...state,
    login,
    register,
    logout,
  };
}
```

## Step 12: Create Middleware for Route Protection

Create `src/middleware.ts` to protect routes:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile', '/user', '/mod', '/admin'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## Step 13: Create UI Components

Create reusable UI components. Here's an example for `src/components/ui/Button.tsx`:

```typescript
import { forwardRef, type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

Create `src/components/ui/Input.tsx`:

```typescript
import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

## Step 14: Create Login Form Component

Create `src/components/auth/LoginForm.tsx`:

```typescript
'use client';

import { useState, type FormEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!username.trim()) {
      errors.username = 'Username is required';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await login({ username, password });
    } catch {
      // Error is handled by useAuth hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Input
        label="Username"
        name="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={validationErrors.username}
        autoComplete="username"
      />

      <Input
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={validationErrors.password}
        autoComplete="current-password"
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
```

## Step 15: Create Login Page

Create `src/app/(auth)/login/page.tsx`:

```typescript
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
```

## Step 16: Create Protected Layout

Create `src/app/(protected)/layout.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
```

## Step 17: Create Header Component with Navigation

Create `src/components/layout/Header.tsx`:

```typescript
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getUserPermissions } from '@/types/user';
import { Button } from '@/components/ui/Button';

export function Header() {
  const { user, logout } = useAuth();
  const permissions = user?.roles ? getUserPermissions(user.roles) : null;

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              MyApp
            </Link>

            <div className="hidden md:flex space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>

              {permissions?.canViewUserBoard && (
                <Link href="/user" className="text-gray-600 hover:text-gray-900">
                  User Board
                </Link>
              )}

              {permissions?.canViewModeratorBoard && (
                <Link href="/mod" className="text-gray-600 hover:text-gray-900">
                  Moderator Board
                </Link>
              )}

              {permissions?.canViewAdminBoard && (
                <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                  Admin Board
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                  {user.username}
                </Link>
                <Button variant="secondary" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
```

## Step 18: Migration Checklist

Use this checklist to track your migration progress:

### Phase 1: Setup
- [ ] Create new Next.js project with Bun
- [ ] Configure Turbopack
- [ ] Install and configure Oxlint
- [ ] Install and configure Biome
- [ ] Set up TypeScript with strict mode

### Phase 2: Core Infrastructure
- [ ] Create type definitions
- [ ] Implement authentication library
- [ ] Create API utility functions
- [ ] Set up authentication hook
- [ ] Configure middleware for route protection

### Phase 3: Component Migration
- [ ] Create UI component library (Button, Input, Card, etc.)
- [ ] Migrate Login component
- [ ] Migrate Register component
- [ ] Migrate Profile component
- [ ] Migrate Home/Dashboard component
- [ ] Migrate role-based board components (if applicable)

### Phase 4: State Management Migration

If migrating from Redux (client-app-1 or client-app-3 patterns):

- [ ] Identify Redux actions that can become server actions
- [ ] Convert async thunks to React hooks with fetch
- [ ] Replace Redux store with React Context or Zustand (if needed)
- [ ] Remove Redux dependencies

If migrating from class component state (client-app-2 pattern):

- [ ] Convert class components to functional components
- [ ] Replace `this.state` with `useState`
- [ ] Replace lifecycle methods with `useEffect`
- [ ] Convert event handlers to arrow functions

### Phase 5: Testing and Validation
- [ ] Run Oxlint and fix all errors
- [ ] Run Biome format and lint
- [ ] Test all authentication flows
- [ ] Test protected routes
- [ ] Test role-based access control
- [ ] Verify API integration

### Phase 6: Cleanup
- [ ] Remove old dependencies from package.json
- [ ] Delete old configuration files (webpack.config.js, .babelrc, etc.)
- [ ] Update environment variables
- [ ] Update README with new setup instructions

## Step 19: Update Package Scripts

Your final `package.json` scripts should look like this:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "bun run lint:next && bun run lint:oxlint && bun run lint:biome",
    "lint:next": "next lint",
    "lint:oxlint": "oxlint .",
    "lint:oxlint:fix": "oxlint . --fix",
    "lint:biome": "biome lint .",
    "lint:biome:fix": "biome lint --write .",
    "format": "biome format --write .",
    "format:check": "biome format .",
    "check": "biome check --write .",
    "typecheck": "tsc --noEmit"
  }
}
```

## Step 20: Environment Variables

Create a `.env.local` file for your environment variables:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Authentication
JWT_SECRET=your-jwt-secret-key

# App Configuration
NEXT_PUBLIC_APP_NAME=MyApp
```

Create a `.env.example` file to document required variables:

```bash
# Copy this file to .env.local and fill in the values

# API Configuration
NEXT_PUBLIC_API_URL=

# Authentication
JWT_SECRET=

# App Configuration
NEXT_PUBLIC_APP_NAME=
```

## Common Migration Patterns

### Converting Class Components to Functional Components

**Before (Class Component):**
```javascript
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { username: '', password: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    // login logic
  }

  render() {
    return <form onSubmit={this.handleSubmit}>...</form>;
  }
}
```

**After (Functional Component with TypeScript):**
```typescript
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // login logic
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Converting Redux Actions to Hooks

**Before (Redux Thunk):**
```javascript
export function loginUser(username, password) {
  return (dispatch) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    return fetch('/api/login', { ... })
      .then(response => response.json())
      .then(data => dispatch({ type: 'LOGIN_SUCCESS', payload: data }))
      .catch(error => dispatch({ type: 'LOGIN_FAILURE', error }));
  };
}
```

**After (Custom Hook):**
```typescript
function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', { ... });
      const data = await response.json();
      // Handle success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
```

### Converting Axios to Fetch

**Before (Axios):**
```javascript
import axios from 'axios';

const response = await axios.post('/api/login', { username, password });
return response.data;
```

**After (Fetch with TypeScript):**
```typescript
const response = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password }),
});

if (!response.ok) {
  throw new Error('Login failed');
}

return response.json() as Promise<LoginResponse>;
```

## Troubleshooting

### Bun Installation Issues

If you encounter issues with Bun, try:
```bash
# Reinstall Bun
curl -fsSL https://bun.sh/install | bash

# Clear Bun cache
rm -rf ~/.bun/install/cache
```

### TypeScript Errors

For TypeScript errors during migration:
1. Start with `strict: false` in tsconfig.json
2. Gradually enable strict options
3. Use `// @ts-expect-error` temporarily for complex migrations

### Next.js App Router Issues

If you encounter hydration errors:
1. Ensure client components have `'use client'` directive
2. Check for browser-only APIs (localStorage, window)
3. Use dynamic imports for client-only components

## Conclusion

This guide provides a comprehensive path for modernizing React authentication applications to use Bun, Next.js with Turbopack, TypeScript, Oxlint, and Biome. The migration process preserves your authentication logic while significantly improving developer experience and application performance.

Key benefits of the modernized stack:
- **Bun**: 3-4x faster package installation and script execution
- **Turbopack**: Near-instant hot module replacement
- **TypeScript**: Catch errors at compile time
- **Oxlint**: Lightning-fast linting (50-100x faster than ESLint)
- **Biome**: Unified formatting and linting with excellent performance

For questions or issues, refer to the official documentation:
- [Bun Documentation](https://bun.sh/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Oxlint Documentation](https://oxc-project.github.io/docs/guide/usage/linter.html)
- [Biome Documentation](https://biomejs.dev/guides/getting-started)
