# Candidate Processing System

A production-ready Mono-repo project implementing a "Polling Publisher" system.

## Live Demo
- **Frontend (Vercel)**: [https://task-seven-gamma-80.vercel.app/](https://task-seven-gamma-80.vercel.app/)
- **Backend (Render)**: Hosted on Render
- **Database (Neon)**: Hosted on Neon (PostgreSQL)

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, React Query, React Hook Form, Zod.
- **Backend**: Node.js, Express, TypeScript, Zod, node-cron.
- **Database**: PostgreSQL, Prisma ORM.
- **Deployment**: Vercel (Client), Render (Server), Neon (Database).

## Project Structure
- `/client`: Frontend application.
- `/server`: Backend API and Worker.

## Prerequisites
- Node.js installed.
- PostgreSQL database (Local or Cloud like Neon).

## Setup Instructions

### 1. Database Configuration
1.  Navigate to the `server` directory.
2.  Open or create the `.env` file.
3.  Set your `DATABASE_URL`:
    ```env
    DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
    ```

### 2. Backend Setup
1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Generate Prisma Client:
    ```bash
    npx prisma generate
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```
    The server runs on `http://localhost:4000`.

### 3. Frontend Setup
1.  Navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `client` directory and add the backend API URL:
    ```env
    VITE_BACKEND_API="http://localhost:4000/api"
    ```
4.  Start the client:
    ```bash
    npm run dev
    ```
    The client runs on `http://localhost:5173`.

## Features
- **Ingestion**: Submit candidate details via the frontend form. Validate and save to DB (Status: PENDING).
- **Worker**: Runs every 2 hours (or configured interval) to fetch PENDING/FAILED records and push them to the external API.
- **Dashboard**: View successfully processed candidates.

## Deployment Guide

### Database (Neon)
1.  Create a project on Neon.tech.
2.  Get the connection string (Pooled version recommended for serverless/Edge contexts).

### Backend (Render)
1.  Connect your repository to Render.
2.  Select "Web Service".
3.  Set Root Directory to `server`.
4.  Build Command: `npm install && npx prisma generate && npm run build`.
5.  Start Command: `npm start`.
6.  Add Environment Variables: `DATABASE_URL`, `PORT`.

### Frontend (Vercel)
1.  Import the repository to Vercel.
2.  Set Root Directory to `client`.
3.  Add Environment Variable: `VITE_BACKEND_API` (set to your Render Backend URL).
4.  Deploy.
