# RecruiterHub - Recruiting Platform

## Overview

RecruiterHub is a comprehensive full-stack recruiting platform built with React, Express.js, and PostgreSQL. The application provides a modern web interface for managing job positions and candidates, with secure authentication powered by Replit's OpenID Connect system.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: In-memory storage for simple deployment
- **Authentication**: Passport.js with OpenID Connect (Replit Auth)
- **Session Management**: Express sessions with memory store
- **API Design**: RESTful API with JSON responses

## Key Components

### Storage Layer
- **Implementation**: In-memory storage using JavaScript Maps
- **Data**: Users, Positions, Candidates stored in memory
- **Relationships**: Candidates linked to positions via foreign keys
- **Persistence**: Data resets on server restart (ideal for development/demos)

### Authentication System
- **Provider**: Replit OpenID Connect authentication
- **Session Storage**: Memory-based session store
- **Middleware**: Authentication guards on protected routes
- **User Management**: Automatic user creation/update on login

### API Endpoints
- **Auth Routes**: `/api/auth/user`, `/api/login`, `/api/logout`
- **Dashboard**: `/api/dashboard/stats` for overview metrics
- **Positions**: Full CRUD operations at `/api/positions`
- **Candidates**: Full CRUD operations at `/api/candidates`

### Frontend Pages
- **Landing Page**: Unauthenticated welcome screen
- **Dashboard**: Overview with key metrics and statistics
- **Positions**: Management interface for job positions
- **Candidates**: Management interface for job candidates
- **Forms**: Modal-based create/edit forms for positions and candidates

## Data Flow

1. **Authentication Flow**: User authenticates via Replit OIDC → Session created → User data stored/updated
2. **Data Fetching**: React Query manages server state → API calls with credentials → Database queries via Drizzle ORM
3. **Form Submission**: React Hook Form validation → API mutation → Database update → Cache invalidation
4. **Real-time Updates**: Optimistic updates with React Query for immediate UI feedback

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit OpenID Connect service
- **UI Components**: Radix UI primitives
- **Validation**: Zod for runtime type checking
- **Styling**: Tailwind CSS framework

### Development Tools
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast bundling for production builds
- **Vite**: Development server with hot module replacement
- **Drizzle Kit**: Database migration and introspection tools

## Deployment Strategy

### Development Environment
- **Server**: Express.js with Vite middleware for hot reloading
- **Database**: Neon PostgreSQL connection via environment variables
- **Authentication**: Replit development environment integration

### Production Build
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Static Assets**: Served directly by Express in production mode
- **Environment**: Production configuration via NODE_ENV variable

### Configuration Requirements
- `SESSION_SECRET`: Secure session encryption key
- `REPLIT_DOMAINS`: Allowed domains for OIDC
- `ISSUER_URL`: OpenID Connect issuer endpoint

Note: Database configuration is no longer required as the app now uses in-memory storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 05, 2025. Switched from PostgreSQL to in-memory storage for simple deployment on Render free tier
- July 04, 2025. Initial setup