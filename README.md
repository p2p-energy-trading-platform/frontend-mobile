# GridX Mobile

GridX Mobile is the cross-platform mobile application for the GridX peer-to-peer energy trading platform. It enables users to monitor the grid, manage trading activities, receive real-time notifications, and interact with the GridX ecosystem from iOS and Android devices.

---

# Tech Stack

- Expo
- React Native
- Expo Router
- TypeScript
- NativeWind
- Tailwind CSS
- Zustand
- TanStack Query
- React Navigation
- Zod
- ESLint
- Prettier
- Husky
- Commitlint

---

# Requirements

- Node.js 22+
- npm 10+
- Expo CLI
- Android Studio (Android)
- Xcode (macOS only, for iOS)

---

# Getting Started

Install dependencies.

```bash
npm install
```

Create the environment file.

```bash
cp .env.example .env
```

Update the environment variables.

```env
EXPO_PUBLIC_APP_NAME=GridX
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

Start the development server.

```bash
npm run start
```

Run on Android.

```bash
npm run android
```

Run on iOS.

```bash
npm run ios
```


---

# Available Scripts

Lint the project.

```bash
npm run lint
```

Format the project.

```bash
npm run format
```

Check formatting.

```bash
npm run format:check
```

Type check.

```bash
npm run typecheck
```

---

# Environment Variables

Environment variables are validated using **Zod** during application startup.

Example:

```env
EXPO_PUBLIC_APP_NAME=GridX
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

Only variables prefixed with `EXPO_PUBLIC_` are exposed to the mobile application.

---

# Project Structure

```text
src/
├── config/
├── features/
├── lib/
├── providers/
├── shared/
├── store/
└── types/
```

## config

Application configuration.

- Environment variables
- Application configuration

## features

Feature-based modules.

Example:

```
dashboard/
settings/
markets/
orders/
```

## lib

Initialized third-party libraries.

Examples:

- Axios
- TanStack Query
- Storage

## providers

Application providers.

- Query Provider
- Future providers

## shared

Reusable code shared across the application.

- UI Components
- Design System
- Hooks
- Navigation
- Utilities
- Shared Types

## store

Global client state managed with Zustand.

## types

Application-wide shared TypeScript types.

---

# Design System

The application includes a centralized design system.

Current foundation:

- Design Tokens
- Light Theme
- Dark Theme
- Theme Hook
- Shared UI Components

The complete Figma design system will be integrated incrementally as development progresses.

---

