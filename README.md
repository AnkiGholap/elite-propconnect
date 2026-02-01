# Elite PropConnect

A full-stack real estate property listing platform built with Next.js and Express.js.

## Features

- **Property Listings** — Browse, search, and filter properties by location, type, and budget
- **Property Details** — Gallery slider, amenities, floor plans, highlights
- **Lead Capture** — Brochure download and schedule visit forms
- **Admin Panel** — Dashboard with stats, property/lead/user/category management
- **Authentication** — User registration and login with bcrypt password hashing

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Backend | Express.js, Node.js |
| Database | MongoDB, Mongoose |

## Project Structure

```
elite-propconnect/
├── backend/
│   ├── config/          # Database connection
│   ├── models/          # Mongoose schemas (User, Property, Lead, Category)
│   ├── routes/          # API routes (auth, properties, leads, admin, categories)
│   ├── seed-properties.js
│   ├── app.js
│   └── server.js
├── frontend/
│   └── app/
│       ├── page.tsx             # Login/Register
│       ├── home/page.tsx        # Property listings
│       ├── property/[slug]/     # Property detail
│       └── admin/               # Admin panel
│           ├── page.tsx          # Dashboard
│           ├── properties/       # Property management
│           ├── leads/            # Lead management
│           ├── categories/       # Category master
│           └── users/            # User management
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
node seed-properties.js
node server.js
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and backend on `http://localhost:5000`.

### Default Admin Login

- Username: `admin`
- Password: `admin123`

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `FRONTEND_URL` | Frontend URL for CORS (production) |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (default: http://localhost:5000/api) |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/properties` | List properties (with filters) |
| GET | `/api/properties/:slug` | Get property by slug |
| POST | `/api/properties` | Create property |
| PUT | `/api/properties/:slug` | Update property |
| DELETE | `/api/properties/:slug` | Delete property |
| POST | `/api/leads` | Submit lead |
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create category |
| GET | `/api/admin/stats` | Dashboard stats |
| GET | `/api/admin/leads` | List leads |
| GET | `/api/admin/users` | List users |

## Deployment

This project can be deployed for free using:

- **Vercel** — Frontend (set root directory to `frontend`)
- **Render** — Backend (set root directory to `backend`)
- **MongoDB Atlas** — Database (M0 free tier)
