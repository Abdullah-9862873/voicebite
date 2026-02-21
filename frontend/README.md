# VoiceBite Frontend

React + Vite client for the VoiceBite ordering assistant. The UI talks to the hosted backend via HTTPS so it can be deployed as a static site on Vercel.

## Local Setup

```bash
npm install
cp .env.example .env.local # adjust if needed
npm run dev
```

`VITE_API_BASE_URL` must point to the VoiceBite backend (defaults to the production API). Vite automatically injects the variable at build time, so the same build can target any backend by overriding the env at deploy time.

## Vercel Deployment

1. Push this frontend to a Git repository and import it into Vercel.
2. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
3. Add the environment variable `VITE_API_BASE_URL` (e.g. `https://devpost-hackathon-voicebite-backend.vercel.app/api`).
4. Trigger a deployment; the generated static bundle makes API calls directly to the hosted backend.

## API Targets

- Menu CRUD: `GET/POST/DELETE ${VITE_API_BASE_URL}/menu`
- Voice AI: `POST ${VITE_API_BASE_URL}/ai/process-command`

Adjust the backend URL only when you need to point to a different environment.
