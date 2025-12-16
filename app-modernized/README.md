# React JWT Auth Example (Modernized)

Modern authentication example using Next.js, TypeScript, and JWT.

## Tech Stack

- **Bun** - Fast JavaScript runtime and package manager
- **Next.js 16** with Turbopack - React framework with blazing-fast bundler
- **TypeScript** - Type-safe JavaScript
- **Oxlint** - High-performance JavaScript/TypeScript linter
- **Biome** - Fast formatter and linter
- **Tailwind CSS** - Utility-first CSS framework

## Getting Started

```bash
cd app-modernized
bun install
bun run dev
```

Then visit `http://localhost:3000` in your browser.

## Demo Credentials

- Email: `hello@test.com`
- Password: `test`

Note: The demo server from the legacy app (`server.js` in the root directory) needs to be running for authentication to work:

```bash
# In the root directory
node server.js
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server with Turbopack |
| `bun run build` | Build for production |
| `bun run lint` | Run Oxlint and Next.js ESLint |
| `bun run format` | Format code with Biome |
| `bun run typecheck` | Run TypeScript type checking |

## Authentication Flow

1. User navigates to `/login` and enters credentials
2. `useAuth` hook calls `login()` which POSTs to the API
3. Server validates credentials and returns a JWT token
4. Token is stored in localStorage and decoded to get user info
5. User is redirected to `/protected` page
6. Protected page fetches data using the JWT token in Authorization header
7. Logout clears the token from localStorage and redirects to `/login`

## Migration from Legacy App

This modernized version replaces the following legacy patterns:

| Legacy Pattern | Modern Equivalent |
|----------------|-------------------|
| `@connect` decorator | `useAuth()` hook |
| `requireAuthentication(Component)` HOC | Route guards in page components |
| `redux-router pushState` | `useRouter().push()` |
| Redux store | React Context API |
| Webpack 1.x | Next.js with Turbopack |
| Babel 5.x | TypeScript + SWC |
