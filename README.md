# 🚀 Candidate Processing System

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Stack](https://img.shields.io/badge/Stack-PERN-lightgrey)

A robust, production-ready Mono-repo application designed to manage candidate applications efficiently. It features a **"Polling Publisher"** architecture that ensures reliable data synchronization with external systems using automated background workers.

---

## 🌐 Live Demo

| Service | Link | Status |
| :--- | :--- | :--- |
| **Frontend** | [View on Vercel](https://task-seven-gamma-80.vercel.app/) | ![Live](https://img.shields.io/badge/Online-brightgreen) |


> **⚠️ Note on Free Tier Hosting:** The backend is hosted on Render's free tier, which sleeps after inactivity. The **first request may take ~50 seconds** to wake up the server. Subsequent requests will be instant.

---

## ✨ Key Features

* **⚡ Modern Dashboard:** A clean, responsive React UI for submitting and tracking applications.
* **🛡️ Robust Validation:** End-to-end type safety using **Zod** and **TypeScript**.
* **🔄 Automated Workers:** A custom cron job (Polling Publisher) runs every 2 hours to process pending candidates reliably.
* **💾 Database Sync:** Seamless integration with **PostgreSQL** via **Prisma ORM**.
* **🚀 Scalable Architecture:** Layered backend design (Controllers, Services, Repositories) ensures maintainability.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **State Management:** React Query
* **Forms:** React Hook Form + Zod

### **Backend**
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL (Hosted on Neon)
* **ORM:** Prisma
* **Scheduler:** node-cron

### **DevOps**
* **Hosting:** Vercel (Client), Render (Server)
* **CI/CD:** Automated deployments via Git hooks

---

## 📂 Project Architecture

The project is structured as a **Mono-repo** containing both the React Client and Node.js Server.

```bash
candidate-processing-system/
├── client/                 # React Frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── components/     # UI Components (Forms, Dashboard)
│   │   ├── lib/            # API configurations
│   │   └── App.tsx         # Routing & Layouts
│
├── server/                 # Node.js Backend (Express + TypeScript)
│   ├── src/
│   │   ├── config/         # DB Connection & Env Config
│   │   ├── controllers/    # Request handling logic
│   │   ├── routes/         # API Routes Definitions
│   │   ├── schemas/        # Zod Validation Schemas
│   │   ├── services/       # Business logic & Cron Workers
│   │   ├── prisma/         # Database Schema & Migrations
│   │   └── server.ts       # App Entry Point
```

---

## 🚀 Getting Started Locally

Follow these steps to run the project locally.

### Prerequisites
- Node.js (v18+)
- PostgreSQL database URL (Local or Cloud like Neon/Supabase)

### 1️⃣ Backend Setup
Navigate to the server folder:
```bash
cd server
```
Install dependencies:
```bash
npm install
```
Create a `.env` file and add your database connection string:
```env
DATABASE_URL="postgresql://user:yourpassword@host:port/database?sslmode=require"
PORT=4000
```
Generate Prisma Client & Push Schema:
```bash
npx prisma generate
npx prisma db push
```
Start the server:
```bash
npm run dev
```
The server will start at `http://localhost:4000`

### 2️⃣ Frontend Setup
Open a new terminal and navigate to the client folder:
```bash
cd ../client
```
Install dependencies:
```bash
npm install
```
Create a `.env` file:
```env
VITE_BACKEND_API="http://localhost:4000/api"
```
Start the frontend:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/candidates` | Create a new candidate application |
| GET | `/api/candidates` | Fetch all candidates (with filters) |
| GET | `/health` | Health check route |

---

## 🔧 Deployment Configuration

### Backend (Render)
- **Root Directory:** `server`
- **Build Command:** `npm install && npx prisma generate && npx prisma db push`
- **Start Command:** `npm start`
- **Environment Variables:** `DATABASE_URL`, `PORT`

### Frontend (Vercel)
- **Root Directory:** `client`
- **Framework Preset:** Vite
- **Environment Variables:** `VITE_BACKEND_API` (Your Render URL)
- **Routing:** Includes `vercel.json` to handle client-side routing (fixes 404 on refresh).

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See LICENSE for more information.
