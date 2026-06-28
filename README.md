# Psychometric Test Platform (MERN + Next.js)

A career / personality **guidance** assessment platform. Users take a
trait-based test; the backend scores it securely and returns a report with
charts. Admins manage tests, traits, and questions.

> This assessment is for guidance and self-reflection only. It is **not** a
> medical or clinical diagnosis.

## Project structure

```
backend/   Express + MongoDB REST API (CommonJS)   -> see backend/README.md
client/    Next.js 16 + TypeScript + Tailwind UI
```

The stack is **M**ongoDB, **E**xpress, **Next.js** (React 19), **N**ode.js.
(The frontend is Next.js instead of plain React; everything else matches the
requirements document.)

## Quick start

You need **Node.js** and a running **MongoDB** (local or Atlas).

### 1. Backend

```bash
cd backend
npm install
npm run seed      # creates demo users + 1 test + 30 questions
npm run dev       # runs on http://localhost:5001
```

Demo logins (from the seed):

| Role  | Email               | Password   |
|-------|---------------------|------------|
| Admin | admin@example.com   | admin123   |
| User  | user@example.com    | user123    |

Full API docs + Postman examples: [`backend/README.md`](backend/README.md).

### 2. Frontend

```bash
cd client
npm install
npm run dev       # runs on http://localhost:3000
```

Open http://localhost:3000 and log in with one of the demo accounts.

### Environment files

- `backend/.env` — `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, etc.
- `client/.env.local` — `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5001/api`).

> Port note: the backend uses **5001** because macOS reserves 5000 for AirPlay.

## How it works (high level)

1. User registers / logs in → gets a JWT (stored in the browser).
2. User opens a test, reads the instructions + disclaimer, and starts an attempt.
3. As they answer, the frontend **autosaves** answers (it only sends which
   option was picked — never scores).
4. On submit, the **backend recalculates every score from the database**
   (handling reverse-scored questions), builds the trait report, and saves it.
5. The result page shows a radar + bar chart, per-trait levels, and a summary.
6. Admins can create tests/traits/questions and view all reports.

## Key requirements covered

- JWT auth + bcrypt, role-based access (user / admin).
- Server-side scoring (frontend scores are never trusted).
- Reverse scoring (`finalScore = 6 - rawScore`), Low / Moderate / High levels.
- Pagination, rate limiting, central error handling, request validation.
- Users see only their own results; completed attempts cannot be resubmitted.
- Non-diagnostic disclaimer on the instructions and result pages.
- Reusable backend helpers (scoring, pagination, responses, async handler).
- Reusable frontend pieces (shared axios instance, auth context, components).
```
