# Frontend - Real Time Bidding System

React + TypeScript + Vite application for the bidding system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URLs

## Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build

```bash
npm run build
```

## Project Structure

Create your folder structure as needed:
- `src/components/` - Reusable UI components
- `src/pages/` - Page components
- `src/hooks/` - Custom React hooks
- `src/services/` - API service functions
- `src/store/` - Zustand stores
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions

## Available Libraries

- **Routing**: react-router-dom
- **State Management**: zustand
- **Data Fetching**: @tanstack/react-query
- **HTTP Client**: axios
- **Real-time**: @microsoft/signalr
- **UI Components**: @headlessui/react
- **Icons**: lucide-react
- **Animations**: framer-motion
- **Forms**: react-hook-form + zod
- **Date Handling**: date-fns
- **Notifications**: react-hot-toast
- **Testing**: vitest + @testing-library/react
