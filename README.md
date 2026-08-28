# Jannat Elegance Frontend

Next.js storefront and admin interface for Jannat Elegance.

## Local setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

The application proxies `/api/*` requests to `BACKEND_URL` (default: `http://localhost:4000`).

## Deployment

Set `BACKEND_URL` to the public HTTPS URL of the Express backend. Add the deployed frontend URL to the backend `FRONTEND_ORIGIN` setting and Google OAuth authorized JavaScript origins.
