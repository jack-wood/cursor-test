# DevContracts.co.uk Setup Guide

## Prerequisites

- Node.js 22.21.0 or higher
- pnpm 10.19.0 or higher
- A Supabase project

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
POSTGRES_URL=postgresql://user:password@host:5432/database

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Getting Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the following:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Getting Database URL

1. Go to Settings > Database
2. Copy the connection string under "Connection string"
3. Use the "URI" format and replace `[YOUR-PASSWORD]` with your database password

## Installation

```bash
# Install dependencies
pnpm install

# Push database schema to Supabase
pnpm db:push

# (Optional) Open Drizzle Studio to view database
pnpm db:studio
```

## Development

```bash
# Start all apps in development mode
pnpm dev

# Start only the Next.js app
pnpm dev:next
```

The Next.js app will be available at `http://localhost:3000`

## Database Schema

The database includes the following tables:

- `companies` - Company information for job sources
- `jobs` - Job listings with full-text search index
- `ignored_jobs` - Jobs to exclude from results
- `profiles` - User profiles linked to Supabase Auth

## Supabase Auth Setup

1. In your Supabase dashboard, go to Authentication > Providers
2. Enable "Email" provider
3. Configure email templates if needed
4. The magic link authentication is already configured in the app

## Running Migrations

```bash
# Push schema changes to database
pnpm db:push

# Generate migration files (if using migrations)
cd packages/db
pnpm drizzle-kit generate
```

## Type Checking & Linting

```bash
# Type check all packages
pnpm typecheck

# Lint all packages
pnpm lint

# Format code
pnpm format:fix
```

## Building for Production

```bash
# Build all packages
pnpm build
```
