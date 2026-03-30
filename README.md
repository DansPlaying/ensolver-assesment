# Notes Application

**Live Demo:** https://urbina-frontend.netlify.app

A full-stack notes application with tagging, filtering, and user authentication. Built with NestJS (backend) and Next.js (frontend).

## Features

### Core Features
- User authentication with 30-day sessions
- Create, edit, and delete notes
- Archive and unarchive notes
- View active notes list
- View archived notes list

### Extended Features
- Add/remove categories (tags) to notes
- Filter notes by category
- Manage categories (create/delete)
- Dark mode support
- User-specific notes and categories

## Default Credentials

| Field | Value |
|-------|-------|
| Email | admin@example.com |
| Password | admin123 |

A default admin user is automatically created when the backend starts for the first time.

## Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Runtime | Node.js | 20.x |
| Package Manager | npm | 10.x |
| Backend | NestJS | 11.x |
| Backend ORM | TypeORM | 0.3.x |
| Database | SQLite | 3.x |
| Frontend | Next.js | 14.x |
| Frontend | React | 18.x |
| Authentication | NextAuth.js | 5.x |
| Styling | Tailwind CSS | 4.x |

## Requirements

- **Node.js**: v20.x or higher
- **npm**: v10.x or higher

## Quick Start

### Option 1: Using the startup script (recommended)

```bash
# Make the script executable (first time only)
chmod +x start.sh

# Run the application
./start.sh
```

This will:
1. Install all dependencies
2. Start the backend server on http://localhost:3000
3. Start the frontend server on http://localhost:3001

### Option 2: Manual startup

#### Backend

```bash
cd backend
npm install
npm run start:dev
```

The backend API will be available at http://localhost:3000

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend application will be available at http://localhost:3001

## Environment Variables

### Backend (.env)

```
JWT_SECRET=your-secret-key-here
```

### Frontend (.env.local)

```
AUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/login | Login with email/password |
| GET | /auth/me | Get current user profile |

### Notes (requires authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /notes | List active notes (supports ?categoryId=X filter) |
| GET | /notes/archived | List archived notes |
| GET | /notes/:id | Get a single note |
| POST | /notes | Create a new note |
| PATCH | /notes/:id | Update a note |
| DELETE | /notes/:id | Delete a note |
| PATCH | /notes/:id/archive | Archive a note |
| PATCH | /notes/:id/unarchive | Unarchive a note |
| POST | /notes/:id/categories/:categoryId | Add category to note |
| DELETE | /notes/:id/categories/:categoryId | Remove category from note |

### Categories (requires authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /categories | List all categories |
| GET | /categories/:id | Get a single category |
| POST | /categories | Create a new category |
| DELETE | /categories/:id | Delete a category |

## Project Structure

```
/
├── backend/                 # NestJS REST API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── entities/       # TypeORM entities
│   │   ├── notes/          # Notes module (controller, service, DTOs)
│   │   ├── categories/     # Categories module (controller, service, DTOs)
│   │   ├── app.module.ts   # Main application module
│   │   └── main.ts         # Application entry point
│   └── package.json
│
├── frontend/               # Next.js SPA
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # API client, auth config
│   │   ├── providers/     # React context providers
│   │   └── types/         # TypeScript type definitions
│   └── package.json
│
├── start.sh               # Startup script
└── README.md              # This file
```

## Database

The application uses SQLite for data persistence. The database file (`notes.db`) is automatically created in the `backend/` directory when the application starts for the first time.

No additional database setup is required.

## Authentication

- Sessions are valid for 30 days
- JWT tokens are used for API authentication
- Each user has their own isolated notes and categories

## Development

### Backend

```bash
cd backend
npm run start:dev    # Development mode with hot-reload
npm run build        # Build for production
npm run start:prod   # Run production build
```

### Frontend

```bash
cd frontend
npm run dev          # Development mode with hot-reload
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Run ESLint
```
