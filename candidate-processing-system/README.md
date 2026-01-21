# Candidate Processing System

A production-ready Mono-repo project implementing a "Polling Publisher" system.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, React Query, React Hook Form, Zod.
- **Backend**: Node.js, Express, TypeScript, Zod, node-cron.
- **Database**: PostgreSQL, Prisma ORM.

## Project Structure
- `/client`: Frontend application.
- `/server`: Backend API and Worker.

## Prerequisites
- Node.js installed.
- PostgreSQL database (e.g., Neon, Local).

## Setup Instructions

### 1. Database Configuration
1.  Navigate to the `server` directory.
2.  Open or create the `.env` file.
3.  Set your `DATABASE_URL`:
    ```env
    DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
    ```
    *Note: If using Neon, ensure accessing the pooled connection string.*

### 2. Backend Setup
```bash
cd server
npm install
npx prisma generate
npm run dev
```
The server runs on `http://localhost:4000`.

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
The client runs on `http://localhost:5173`.

## Features
- **Ingestion**: Submit candidate details via the frontend form. Validate and save to DB (Status: PENDING).
- **Worker**: Runs every 2 hours (or configured interval) to fetch PENDING/FAILED records and push them to the external API.
- **Dashboard**: View successfully processed candidates.

## Troubleshooting
- **Prisma Errors**: If you encounter `Invalid invocation` or version mismatch errors, run `npx prisma generate` in the `server` folder.
- **Tailwind**: Ensure you are using the correct PostCSS configuration provided in the repo.
