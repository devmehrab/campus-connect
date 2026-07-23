# Project Overview

This is a full-stack Next.js social networking application featuring real-time messaging, a personalized feed, user profiles, notifications, and an integrated AI chatbot.

## Tech Stack & Core Technologies

- **Framework:** Next.js 15+ (App Router strictly)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI (`components/ui`)
- **Real-time:** WebSockets (managed via `SocketProvider.tsx`)
- **Data Mutation:** Next.js Server Actions (`actions/` directory)

## Architecture & Directory Guidelines

### 1. Routing (`app/`)

- We use Next.js App Router with Route Groups for layout segregation (`(auth)`, `(dashboard)`).
- **Rule:** Page components (`page.tsx`) should primarily be Server Components. Pass data down to Client Components as props.
- Keep pages thin. Heavy UI logic belongs in the `components/` directory.

### 2. Components (`components/`)

- Components are domain-driven. Do not cross-pollinate domain components unless necessary.
  - `chat/`: Chatbot and messaging windows.
  - `feed/`: Post creation, rendering, and feed layout.
  - `profile/`: User profile management, avatars, following logic.
  - `ui/`: Strictly reusable, stateless Shadcn/Tailwind base components.
  - `shared/`: Global components like Navbars.
- **Rule:** Append `"use client"` only at the top of components that require hooks (`useState`, `useEffect`), browser APIs, or interactivity.

### 3. State & Real-time (`providers/` & `hooks/`)

- WebSockets are initialized globally via `SocketProvider.tsx`.
- Components requiring real-time updates (like `chat-window.tsx` or `notification-item.tsx`) should consume the socket context contextually.

### 4. Data Fetching & Mutations (`actions/` & `services/`)

- **Server Actions (`actions/`):** Use these strictly for data mutations (POST, PUT, DELETE) from client forms or buttons.
- **Services (`services/`):** Use these for complex business logic, third-party API wrappers, or heavy database queries.
- **Rule:** Never execute raw database queries directly inside components. Always route them through an action or service.

## Coding Conventions

- **TypeScript:** Use strict typing. Define interfaces/types in the `types/` directory (e.g., `post.types.ts`) and import them. Avoid `any`.
- **Imports:** Group imports logically. Built-in React/Next imports first, followed by third-party packages, then internal aliased imports (e.g., `@/components/...`).
- **Styling:** Use Tailwind CSS utility classes. Merge classes dynamically using the `cn()` utility found in `lib/utils.ts`.
- **Icons:** Use SVG assets from the `public/` folder or an icon library compatible with our UI stack (like `lucide-react`).

## AI Assistant Instructions

1. **Think before writing:** Briefly plan the architecture of the component or function before generating code.
2. **Respect Server vs. Client boundaries:** Do not use React hooks in Server Components.
3. **Use existing UI:** Before creating a new base button or input, check `components/ui/` to see if a Shadcn component already exists.
4. **Error Handling:** Ensure all server actions and API calls are wrapped in standard `try/catch` blocks and return typed error states to the client.
