# CEAGAP — Community Environmental Awareness & Green Action Program

React (Vite) front end + Java (Spring Boot) back end + PostgreSQL database.

```
ceagap-react/
├── frontend/   React 18 + Vite app (all pages, English/Telugu)
├── backend/    Spring Boot 3 / Java 21 REST API (JWT login, JPA, PostgreSQL or H2)
├── Dockerfile  builds both and runs one container
└── render.yaml one-click deploy on Render (web service + PostgreSQL)
```

## What changed from the old Node/MongoDB version
| Before | Now |
|---|---|
| 20 static HTML pages | React pages with React Router (`frontend/src/pages`) |
| Node + Express | Java 21 + Spring Boot (`backend/src/main/java/org/ceagap`) |
| MongoDB | PostgreSQL (production) / H2 file database (local, zero setup) |
| Quiz bank in a JS file | Quiz bank (4 × 50 questions) stored **in the database**; every attempt draws **5 new random questions** (options shuffled too, and questions from your previous attempt are skipped) |

## Run locally

Requirements: **Java 21**, **Maven 3.9+**, **Node 20+**.

**1. Backend** (terminal 1)
```bash
cd backend
# Windows PowerShell:  $env:ADMIN1_USERNAME="bharath"; $env:ADMIN1_PASSWORD="choose-a-password"
export ADMIN1_USERNAME=bharath ADMIN1_PASSWORD=choose-a-password
mvn spring-boot:run
```
Starts on http://localhost:8080 using a local H2 database in `backend/data/` (no database install needed).
On first start it creates the tables and loads the 200 quiz questions.

**2. Frontend** (terminal 2)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173 (calls to `/api` are proxied to the backend).

### Single-jar build (what production runs)
```bash
cd frontend && npm install && npm run build      # writes the site into backend/src/main/resources/static
cd ../backend && mvn clean package
java -jar target/ceagap.jar                      # website + API on http://localhost:8080
```

## Configuration (environment variables)
See `.env.example`. Key ones: `DATABASE_URL`, `JWT_SECRET`, `ADMIN1_USERNAME/PASSWORD/NAME/EMAIL` … `ADMIN4_*`.
Without `DATABASE_URL` the app uses the local H2 file database.

## API overview
Public: `GET /api/health, /api/stats, /api/activities, /api/activities/recent, /api/pledges, /api/quizzes/types`, `POST /api/messages`
Login: `POST /api/auth/register | login | admin-login`, `GET /api/auth/me`
Citizen (JWT): `GET /api/quizzes/{type}` (5 random questions), `POST /api/quizzes/{type}/submit`, `GET /api/quizzes/results/mine`,
`POST /api/actions`, `GET /api/actions/mine`, `POST|GET /api/pledges[/mine]`, `POST /api/issues`, `GET /api/issues/mine`, `POST /api/feedback`
Admin (JWT, role admin): `/api/admin/overview | issues | actions | feedback | quizzes | users | pledges | messages`, `PATCH /api/admin/issues/{id}`, photo endpoints.

Deployment steps are in **DEPLOYMENT.md**.
