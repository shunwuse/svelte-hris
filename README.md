# Svelte HRIS

Svelte HRIS is a SvelteKit-based human resources frontend application that provides the following core features:

- User authentication and session management (cookie-based)
- Employee management (search, pagination, role filtering, create, edit)
- Approvals management (status filtering, cursor pagination, auto-load, create, review)
- Dashboard overview (recent approvals, recent users)
- Internationalization support via Paraglide (English and Traditional Chinese)

## Tech stack

- SvelteKit 2 + Svelte 5 + TypeScript
- Vite
- Tailwind CSS 4
- bits-ui
- Paraglide (i18n)
- ESLint + Prettier
- pnpm

## Requirements

- Node.js 20+
- pnpm 10+

## Quick start

1. Install dependencies

```sh
pnpm install
```

2. (Optional) Set backend API base URL

If not provided, the app defaults to:

```text
http://localhost:8080
```

To run against a different backend, set the environment variable before starting the dev server:

```sh
API_BASE_URL=http://your-api-host:8080 pnpm dev
```

3. Start the development server

```sh
pnpm dev
```

Or open the app automatically in your browser:

```sh
pnpm dev --open
```

## Common scripts

```sh
# Start development server
pnpm dev

# Type checking
pnpm check

# Lint
pnpm lint

# Format check
pnpm format:check

# Format files
pnpm format

# Build for production
pnpm build

# Preview a production build locally
pnpm preview

# Full project validation (recommended for CI/PR)
pnpm run validate
```

## Pages / Routes

- `/login` — Login page
- `/` — Dashboard overview (recent approvals and users)
- `/users` — Employee management (offset pagination, search, role filter)
- `/users/create` — Create a new user
- `/users/[id]` — Edit user
- `/approvals` — Approvals management (status filtering, cursor pagination, auto-load)
- `/approvals/create` — Create an approval request
- `/approvals/[id]` — Approval details and approve/reject actions

## Authentication and API proxy

- Frontend API requests are proxied through SvelteKit at `/api/[...path]`.
- Proxy target is controlled by the `API_BASE_URL` environment variable (default: `http://localhost:8080`).
- Authentication tokens are stored in cookies:
  - `access_token`
  - `refresh_token`
  - `user_info`
- Unauthenticated access to protected routes redirects to `/login`.
- Authenticated users navigating to `/login` are redirected to `/`.

## Project layout (summary)

```text
src/
	routes/
		(app)/            # Auth-protected pages
		login/            # Login
		logout/           # Logout
		api/[...path]/    # Server-side API proxy
	lib/
		api/              # API client and error handling
		components/       # Shared and UI components
		constants/        # Routes, query keys, defaults, cookie keys
		domain/           # Domain types and helpers
		server/           # Server-only utilities (auth cookies, helpers)
messages/
	en.json
	zh-TW.json
```

## Docker

The repository includes a multi-stage `Dockerfile` that uses `pnpm` during build. Example:

```sh
docker build -t svelte-hris .
docker run --rm -p 3000:3000 -e API_BASE_URL=http://host.docker.internal:8080 svelte-hris
```

Then open http://localhost:3000 to access the app.

## Quality gate

After changes, run the project validation pipeline:

```sh
pnpm run validate
```

The expected result is 0 errors and 0 warnings.
