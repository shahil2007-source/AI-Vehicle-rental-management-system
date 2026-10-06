# 🌐 Production Cloud Deployment Guide

This document provides step-by-step instructions for deploying the **AI Vehicle Rental Management System** across modern cloud hosting platforms and containerized environments.

---

## 📋 Table of Contents
1. [Prerequisites & Environment Variables](#-prerequisites--environment-variables)
2. [Option 1: Docker & Docker Compose (Recommended for Containers)](#-option-1-docker--docker-compose)
3. [Option 2: Cloud Deployment on Render (Full Stack Blueprint)](#-option-2-cloud-deployment-on-render)
4. [Option 3: Hybrid Deployment (Render Backend + Vercel Frontend)](#-option-3-hybrid-deployment-render-backend--vercel-frontend)
5. [Option 4: Netlify / Railway Deployment](#-option-4-netlify--railway-deployment)
6. [Verification & Health Checks](#-verification--health-checks)

---

## 🔑 Prerequisites & Environment Variables

Make sure the following environment variables are configured in your production environment:

| Variable | Description | Example / Default |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API Key for AI Agent | `AIzaSy...` (Leaves fallback RAG active if blank) |
| `MONGODB_URI` | MongoDB Atlas Connection String | `mongodb+srv://user:pass@cluster.mongodb.net/vrm_db` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `super-secret-vrm-ai-jwt-key-2026` |
| `PORT` | Dynamic port set by hosting provider | `8000` (Backend local) |

---

## 🐳 Option 1: Docker & Docker Compose

Deploy the entire stack (FastAPI Backend + Nginx/React Frontend + MongoDB) in isolated containers using Docker.

### 1. Quick Launch with `deploy.sh`
```bash
./deploy.sh docker
```

### 2. Manual Docker Compose Execution
```bash
docker-compose up --build -d
```

- **Frontend Application**: `http://localhost:80`
- **Backend REST API Docs**: `http://localhost:8000/docs`
- **MongoDB Connection**: `mongodb://localhost:27017`

---

## ☁️ Option 2: Cloud Deployment on Render

This project includes a pre-configured `render.yaml` infrastructure-as-code Blueprint.

### Steps to Deploy on Render:
1. Push your codebase to a **GitHub / GitLab** repository.
2. Sign in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** -> **Blueprints**.
4. Connect your GitHub repository.
5. Render will automatically detect `render.yaml` and provision:
   - `vrm-ai-backend` (FastAPI Web Service)
   - `vrm-ai-frontend` (React Static Web Site with SPA Rewrite Rules)
6. Set the `GEMINI_API_KEY` and `MONGODB_URI` environment variables in the Render service settings.
7. Click **Deploy Blueprint**.

---

## ⚡ Option 3: Hybrid Deployment (Render Backend + Vercel Frontend)

### Backend on Render:
1. Create a **Web Service** on Render pointing to `backend/`.
2. Set Build Command: `pip install -r requirements.txt`
3. Set Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Copy your backend live URL (e.g. `https://vrm-ai-backend.onrender.com`).

### Frontend on Vercel:
1. Install Vercel CLI or connect via [Vercel Dashboard](https://vercel.com).
2. Set Framework Preset: **Vite**.
3. Root Directory: `frontend`
4. Set Environment Variable:
   - `VITE_API_URL` = `https://vrm-ai-backend.onrender.com/api`
5. Deploy! Vercel will use the included `frontend/vercel.json` for SPA routing and API forwarding.

---

## 🚀 Option 4: Netlify / Railway Deployment

### Frontend on Netlify:
- Build command: `npm run build`
- Publish directory: `dist`
- Netlify will automatically apply SPA redirect rules from `frontend/netlify.toml`.

### Backend on Railway / Heroku:
- Procfile included at `backend/Procfile`:
  ```procfile
  web: uvicorn main:app --host 0.0.0.0 --port $PORT
  ```

---

## 🧪 Verification & Health Checks

Once deployed, verify your deployment:

1. **Backend Health Check**: `GET /` returns status `"online"`.
2. **Interactive API Documentation**: `GET /docs` (Swagger UI).
3. **Frontend AI Agent Execution**: Submit a journey request in **AI Vehicle Finder** and verify recommendation generation.
4. **Admin Dashboard**: Login with `admin@vrm.com` / `admin123` to view live analytics and management panels.
