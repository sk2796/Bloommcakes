# Architecture

This document describes the architectural foundation for the **Bloomcakes** frontend application.

## Core Architectural Layout

Bloomcakes utilizes a feature-based structure to ensure high cohesion and modularity:

```text
src/
├── app/          # App config, routing, global providers
├── components/   # Shared presentation elements (UI, layout, common components)
├── features/     # Feature modules (auth, products, checkout, cart)
├── pages/        # Route entrypoint wrapper screens
├── hooks/        # Global utilities hooks
├── lib/          # External services wrappers (supabase client, validation utilities)
└── store/        # UI and transient client stores (Zustand)
```

## Separation of Concerns (Data Access Layer)

To isolate backend implementation details from UI components:

1. **Supabase client (`src/lib/supabase/client.ts`)** exposes configured client instance.
2. **Feature services** define the queries, schemas, and supabase interactions.
3. **Custom Hooks** wrap these service methods using TanStack Query.
4. **UI components** consume data *only* via these custom hooks.

```text
ProductCard (UI component)
   ↓
useProducts (Custom Hook)
   ↓
product.service.ts (Feature API Layer)
   ↓
Supabase Client
```

## State Management Principles

* **Server State**: Managed strictly using **TanStack Query** to handle caching, background updates, retry logic, and pagination.
* **Client UI State**: Handled using **Zustand** only for transient client state (such as cart UI slideover visibility, settings, active modals).

## Key Design Patterns
* **Strict TypeScript**: Typed inputs, custom validation schemas with **Zod**, strict type safety.
* **A11y**: Clean, semantic HTML tags, keyboard accessibility controls.
* **Lazy Loading**: Route-level code splitting using `Suspense` and dynamic imports (`lazy`).
