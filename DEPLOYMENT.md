# Deployment Guide

This project is split into a **React frontend** (Vercel) and a **Node/Express API** (Render) with **PostgreSQL**.

## Pre-flight checklist

- [ ] PostgreSQL database created and schema applied
- [ ] Sample products seeded (`npm run seed` in `backend/`)
- [ ] Backend env vars set (`JWT_SECRET`, `DATABASE_URL`, `CORS_ORIGIN`)
- [ ] Frontend env var set (`VITE_API_URL` pointing to `https://your-api.onrender.com/api`)
- [ ] `CORS_ORIGIN` includes your live frontend URL (no trailing slash)

## 1. Database setup (one time)

From the `backend` folder with `.env` configured:

```bash
npm install
npm run db:init
npm run seed
```

Or with `psql`:

```bash
psql "$DATABASE_URL" -f database/schema.sql
```

## 2. Deploy backend (Render)

1. Push this repo to GitHub.
2. On [Render](https://render.com), create a **Blueprint** from the repo (uses `render.yaml`), or manually:
   - **Root directory:** `backend`
   - **Build command:** `npm install`
   - **Start command:** `npm start`
3. Set environment variables:

| Variable | Example |
|----------|---------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | From Render PostgreSQL (auto if using blueprint) |
| `DB_SSL` | `true` |
| `JWT_SECRET` | Long random string (32+ chars) |
| `CORS_ORIGIN` | `https://your-app.vercel.app` |

4. After deploy, open `https://YOUR-API.onrender.com/api/health` — should return `{"status":"OK"}`.

## 3. Deploy frontend (Vercel)

1. Import the repo on [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Framework preset: **Vite** (build: `npm run build`, output: `dist`).
4. Add environment variable:

| Variable | Value |
|----------|--------|
| `VITE_API_URL` | `https://YOUR-API.onrender.com/api` |

5. Redeploy after changing env vars (Vite bakes them in at build time).

`vercel.json` already configures SPA routing for React Router.

## 4. Verify production

1. Home page loads products.
2. Sign up / log in works.
3. Add to cart, checkout (requires login).
4. Order history and wishlist work when logged in.

## Common issues

| Problem | Fix |
|---------|-----|
| CORS errors | Set `CORS_ORIGIN` to exact frontend URL |
| API calls go to localhost | Set `VITE_API_URL` on Vercel and redeploy |
| `relation "users" does not exist` | Run `npm run db:init` on the production DB |
| Server exits on start | Set a strong `JWT_SECRET` in production |
| Empty product list | Run `npm run seed` against production DB |
