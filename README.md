# Todo App with CI/CD

A full-stack todo application built with React, Express.js, and SQLite, featuring authentication, real-time updates, and comprehensive testing.

## Prerequisites

- Node.js version 20.0 or higher
- Docker (for containerized deployment)
- Docker Compose (for local development with containers)

## Project Structure

This is a monorepo containing three workspaces:

```
├── backend/           # Express.js API server with SQLite
├── frontend/          # React SPA with Redux Toolkit
├── e2e/              # End-to-end tests with Playwright
├── docker-compose.yml # Multi-service setup
└── README.md
```

## Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/KosolapovR/Todo-App-with-CI-CD.git
   cd todo-app-monorepo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the application**

   ```bash
   # Option 1: Using Docker Compose (recommended)
   docker-compose up --build

   # Option 2: Local development
   npm run dev
   ```

4. **Run tests**

   ```bash
   # Run all tests
   npm test

   # Run end-to-end tests only
   npm run test:e2e

   # Run CI tests
   npm run test:ci
   ```

## Development

### Backend (Express.js + TypeScript)

```bash
cd backend
npm run dev    # Start development server with hot reload
npm run build  # Build for production
npm run start  # Start production server
npm test       # Run tests
```

**Tech Stack:**

- Express.js with TypeScript
- SQLite with better-sqlite3
- JWT authentication
- Winston logging
- Jest for testing

### Frontend (React + TypeScript)

```bash
cd frontend
npm start      # Start development server
npm run build  # Build for production
npm test       # Run tests
```

**Tech Stack:**

- React 18 with TypeScript
- Redux Toolkit for state management
- Webpack for bundling
- Jest + Testing Library for testing
- MSW for API mocking

### End-to-End Testing (Playwright)

```bash
cd e2e
npm run test          # Run E2E tests
npm run test:headed   # Run tests with browser UI
npm run test:dev      # Run tests against local dev server
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=3001
JWT_SECRET=your-secret-key
DATABASE_URL=./data/app.db
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Todo Endpoints

- `GET /api/todos` - Get all todos for authenticated user
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

## Code Quality

### Linting and Formatting

```bash
# Lint all workspaces
npm run lint

# Format all code
npm run format
```

## Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build -d

# View logs
docker-compose logs -f
```

### CI/CD Pipeline

The project includes GitHub Actions workflows for:

- Automated testing on push/PR
- Docker image building and pushing
- Deployment to production
