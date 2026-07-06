# Kitchenese 🌶️

Translate any tech, programming, or CS concept into a food analogy — a home-cooking
recipe or a restaurant menu experience, styled to a cuisine of your choice.

- **Frontend:** React (Vite), custom CSS with CSS variables (no framework)
- **Backend:** FastAPI, calls Groq's OpenAI-compatible chat completions API
  (`llama-3.3-70b-versatile`)

## Project structure

```
Kitchenese/
  backend/     FastAPI app (app/main.py), requirements.txt, .env.example
  frontend/    Vite React app (src/), package.json, .env.example
```

## Local development

### 1. Backend

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt

cp .env.example .env
# then edit .env and set GROQ_API_KEY=<your key from https://console.groq.com/keys>

uvicorn app.main:app --reload --port 8000
```

The backend fails fast at startup with a clear error if `GROQ_API_KEY` is missing.
It serves on `http://localhost:8000`. Health check: `GET /api/health`.

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
# .env defaults VITE_API_URL to http://localhost:8000, which matches the backend above

npm run dev
```

Open `http://localhost:5173`.

### Notes

- The backend's `ALLOWED_ORIGINS` (in `backend/.env`) must include the frontend's
  origin (`http://localhost:5173` for local dev) or the browser will block requests
  via CORS.
- Per-IP rate limiting is set to 12 requests/minute to protect the shared Groq free
  tier quota. Adjust the `@limiter.limit("12/minute")` decorator in
  `backend/app/main.py` if needed.

## Deployment (free tier)

This app splits cleanly into a static frontend and a small API backend — a good fit
for Vercel/Netlify (frontend) + Render/Railway (backend), all of which have usable
free tiers.

### Backend — Render (free web service)

1. Push this repo to GitHub.
2. In Render, create a **New Web Service**, pointing at the repo with root
   directory `backend`.
3. Build command: `pip install -r requirements.txt`
   Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Under **Environment**, add:
   - `GROQ_API_KEY` = your Groq key (**this is the only place your key should ever
     be set** — never put it in frontend code or a `VITE_*` variable)
   - `ALLOWED_ORIGINS` = your deployed frontend URL, e.g.
     `https://kitchenese.vercel.app` (comma-separate multiple origins if needed)
5. Deploy. Note the resulting URL, e.g. `https://kitchenese-api.onrender.com`.

(Railway works the same way: new service from the repo, root directory `backend`,
same build/start commands, same two environment variables set in the Railway
dashboard's **Variables** tab.)

Free-tier services on Render/Railway typically spin down when idle and take a few
seconds to wake on the first request — the frontend's loading state will just show
a bit longer on a cold start.

### Frontend — Vercel or Netlify

1. Import the repo, set the project root to `frontend`.
2. Build command: `npm run build`. Output directory: `dist`.
3. Set an environment variable:
   - `VITE_API_URL` = your deployed backend URL from above, e.g.
     `https://kitchenese-api.onrender.com` (no trailing slash)
4. Deploy. Vercel/Netlify will give you a URL like `https://kitchenese.vercel.app`.
5. Go back to your Render/Railway backend and make sure `ALLOWED_ORIGINS` matches
   this exact URL, then redeploy the backend if you changed it.

### Where `GROQ_API_KEY` goes

**Only ever in the backend's environment** (Render/Railway environment variables
locally, `.env` which is gitignored). It must never be set as a frontend/`VITE_*`
variable or committed to the repo — the frontend only ever talks to your own
backend, never to Groq directly.

## API

`POST /api/analogy`

```json
{ "concept": "recursion", "cuisine": "Indian", "mode": "cook" }
```

`mode` is `"cook"` or `"eat_out"`. `cuisine` must be one of the values in
`backend/app/schemas.py`'s `CUISINES` list (or `"Surprise me"`).

Returns a JSON analogy card, or `{"error": "..."}` with a 4xx/5xx/502 status on
invalid input, rate limiting, or a model/upstream failure.
