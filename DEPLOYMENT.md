# Deploying CEAGAP

The whole project ships as **one Docker container** (Java serves the API *and* the React website) plus a **PostgreSQL** database.
The easiest free path is **Render + its free PostgreSQL**. Alternatives are listed at the bottom.

## Option A — Render (recommended, ~10 minutes)

1. **Put the project on GitHub.** Copy the `ceagap-react` folder contents into your repository (for example replace the old Node files in `bharathtanigadapa1/CGEAP`), then:
   ```bash
   git add . && git commit -m "React + Spring Boot version" && git push
   ```
   (`render.yaml` and `Dockerfile` must be at the repository root. If you keep the project inside a sub-folder, set Render's *Root Directory* to that folder.)
2. Go to https://render.com → sign in with GitHub → **New → Blueprint** → choose the repository → **Apply**.
   Render reads `render.yaml`, creates the PostgreSQL database `ceagap-db` and the web service `ceagap`, and wires `DATABASE_URL` and `JWT_SECRET` automatically.
3. When asked, enter the four admin passwords (`ADMIN1_PASSWORD` … `ADMIN4_PASSWORD`). Choose strong ones; they are not stored in Git.
4. Wait for the first build (5–8 minutes: it builds React, then Java). When the service shows **Live**, open the URL Render gives you (`https://ceagap-xxxx.onrender.com`).
5. Check `https://<your-url>/api/health` → `{"ok":true,"service":"CEAGAP"}`.
6. Log in via **Admin Login** with e.g. `bharath` and the password you set. Register a normal user to test the quiz.

Notes
* Free Render web services sleep after ~15 min of inactivity (first request takes ~30–60 s). Free Render PostgreSQL databases expire after 30 days — upgrade the database plan, or use Neon (below), for long-term use.
* Tables and the 200 quiz questions are created automatically on first start. Nothing to import.
* To change an admin password later, edit it in Render → Environment **and** delete that user row (or update it) in the database, because accounts are only created when missing.

## Option B — Render web service + Neon/Supabase database (database never expires)
1. Create a free PostgreSQL database at https://neon.tech (or Supabase). Copy the connection string (`postgres://user:pass@host/db`).
2. Render → New → **Web Service** → your repo → Runtime **Docker**.
3. Environment variables: `DATABASE_URL` (the string above), `JWT_SECRET` (long random text), `ADMIN1_USERNAME/PASSWORD` … `ADMIN4_*`.
4. Health check path: `/api/health`. Deploy.

## Option C — Railway / Fly.io / any Docker host / a VPS
```bash
docker build -t ceagap .
docker run -p 8080:8080 \
  -e DATABASE_URL="postgres://USER:PASS@HOST:5432/DB" \
  -e JWT_SECRET="long-random-text" \
  -e ADMIN1_USERNAME=bharath -e ADMIN1_PASSWORD="..." \
  ceagap
```
Open http://localhost:8080. On Railway: New Project → Deploy from GitHub → add the PostgreSQL plugin → set the same variables (`DATABASE_URL` = the plugin's connection URL).

## Option D — without Docker
On any server with Java 21 and Node 20: build as in README ("Single-jar build"), then run
`java -jar backend/target/ceagap.jar` with the environment variables above (and `PORT` if needed). Put Nginx/Caddy in front for HTTPS.

## Awareness videos
The home page video slider plays `frontend/public/videos/water-conservation.mp4`, `plastic-reduction.mp4`, `waste-segregation.mp4`, `tree-plantation.mp4`.
Add the files before building (they were not in the repository). Keep them small (a few MB) for free hosting.

## Checklist before going live
- [ ] Strong, unique `JWT_SECRET` and admin passwords set as environment variables
- [ ] `DATABASE_URL` points to PostgreSQL (not the local H2 file)
- [ ] `/api/health` is OK, admin login works, a test quiz shows 5 questions and a different set on "Play Again"
- [ ] Videos added (optional)
