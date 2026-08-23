# Development Guide

This guide describes how to run, test, and contribute to the Bloomcakes frontend project.

## Local Development Commands

### Install dependencies
```bash
npm install
```

### Start Local Dev Server
```bash
npm run dev
```

### Build Production Bundle
```bash
npm run build
```

### Run Linter
```bash
npm run lint
```

### Run Tests
```bash
npx vitest run
# or run in watch mode
npx vitest
```

## Environment Configuration

Copy the example environment file and define the configuration values locally:

```bash
cp .env.example .env
```

Define target parameters:
* `VITE_SUPABASE_URL`: Supabase project URL endpoint.
* `VITE_SUPABASE_ANON_KEY`: Supabase client-safe authorization key.
