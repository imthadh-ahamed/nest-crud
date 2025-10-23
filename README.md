# User Management System

A full-stack CRUD application for user management built with Next.js, NestJS, and Supabase.

## � How to Run

### Prerequisites
- Node.js (v18 or higher)
- Supabase account

### 1. Database Setup

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project

### 2. Backend Setup

```bash
cd server
npm install
```

Configure `server/.env` with your Supabase credentials:
```env
PORT=8080
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
DB_HOST=db.your-project.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_database_password
DB_DATABASE=postgres
```

Start the backend:
```bash
npm run start:dev
```

Backend will run on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📝 Environment Variables

**Backend** (`server/.env`):
- Get credentials from Supabase Dashboard > Project Settings > Database & API

**Frontend** (`client/.env.local`):
- Already configured to `http://localhost:8080`

---

That's it! Open `http://localhost:3000` to use the application.