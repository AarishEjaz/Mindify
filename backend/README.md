# Psychometric Test Platform — Backend

Express + MongoDB (Mongoose) REST API for a **career / personality guidance**
assessment. It handles authentication, admin test/question management, the user
test-taking flow, secure server-side scoring, and result reports.

> This assessment is for guidance and self-reflection only. It is **not** a
> medical or clinical diagnosis.

---

## Tech stack

- Node.js + Express (CommonJS — `require`)
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) + bcrypt (`bcryptjs`) for auth
- `express-validator` for request validation
- `express-rate-limit` for rate limiting

## Folder structure

```
backend/
  config/db.js              # MongoDB connection
  models/                   # User, Test, Question, Attempt, Result
  controllers/              # one controller per resource
  routes/                   # one router per resource
  middlewares/              # auth, admin, error, rateLimiter, validate
  validators/               # express-validator rule sets
  utils/                    # REUSABLE helpers (see below)
  seed/seed.js              # inserts demo users + 1 test + 30 questions
  app.js                    # builds the Express app
  server.js                 # connects DB + starts the app
  .env
```

### Reusable helpers (written once, used everywhere)

These exist so the same logic is never copy-pasted:

| File | What it does |
|------|--------------|
| `utils/asyncHandler.js` | Wraps async routes in try/catch, forwards errors |
| `utils/ApiError.js` | Error class that carries an HTTP status code |
| `utils/apiResponse.js` | `sendSuccess()` — one consistent success shape |
| `utils/generateToken.js` | Signs a JWT for a user id |
| `utils/pagination.js` | `getPagination()` + `buildPageMeta()` for list endpoints |
| `utils/scoring.js` | All scoring math (reverse score, levels, trait scores, summary) |
| `utils/answerScoring.js` | Turns raw answers into **server-scored** answers (security) |
| `utils/constants.js` | The disclaimer text + the 5-point Likert options |

---

## Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure `.env`** (already created — adjust if needed)
   ```
   PORT=5001
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/psychometric
   JWT_SECRET=change_this_to_a_long_random_secret_string
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:3000
   ```
   > Port 5001 is used because macOS reserves 5000 for AirPlay.

3. **Seed the database** (demo users + test + 30 questions)
   ```bash
   npm run seed
   ```
   Creates:
   - Admin — `admin@example.com` / `admin123`
   - User — `user@example.com` / `user123`

4. **Run the server**
   ```bash
   npm run dev    # with auto-reload (nodemon)
   # or
   npm start
   ```
   API base URL: `http://localhost:5001/api`

---

## API reference

All protected routes need an `Authorization: Bearer <token>` header.
List endpoints accept `?page=` and `?limit=` query params.

| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| POST | `/api/auth/register` | Public | Register a user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | User | Current user |
| GET | `/api/tests` | User | List active tests (paginated) |
| GET | `/api/tests/:id` | User | Test details + questions |
| POST | `/api/attempts/start` | User | Start (or resume) an attempt |
| PATCH | `/api/attempts/:attemptId/answers` | User | Autosave answers |
| POST | `/api/attempts/:attemptId/submit` | User | Submit + calculate result |
| GET | `/api/results/:attemptId` | User | View own result |
| POST | `/api/admin/tests` | Admin | Create a test |
| GET | `/api/admin/tests` | Admin | List all tests |
| PATCH | `/api/admin/tests/:id` | Admin | Update a test |
| POST | `/api/admin/questions` | Admin | Create a question |
| GET | `/api/admin/questions` | Admin | List questions (`?testId=`) |
| PATCH | `/api/admin/questions/:id` | Admin | Update a question |
| GET | `/api/admin/reports` | Admin | View all results (paginated) |

### Response shape

```json
{ "success": true, "message": "Login successful", "data": { } }
```
On error:
```json
{ "success": false, "message": "Invalid email or password" }
```

---

## Postman-ready examples

> Replace `TOKEN`, `:id`, `:attemptId` with real values.

**Register**
```
POST http://localhost:5001/api/auth/register
Content-Type: application/json

{ "name": "Aarish", "email": "aarish@test.com", "password": "secret1" }
```

**Login**
```
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{ "email": "user@example.com", "password": "user123" }
```

**List tests**
```
GET http://localhost:5001/api/tests?page=1&limit=10
Authorization: Bearer TOKEN
```

**Start attempt**
```
POST http://localhost:5001/api/attempts/start
Authorization: Bearer TOKEN
Content-Type: application/json

{ "testId": "PUT_TEST_ID_HERE" }
```

**Autosave answers** (the frontend only sends the option text — never scores)
```
PATCH http://localhost:5001/api/attempts/:attemptId/answers
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "answers": [
    { "questionId": "Q_ID_1", "selectedOptionText": "Agree" },
    { "questionId": "Q_ID_2", "selectedOptionText": "Strongly Disagree" }
  ]
}
```

**Submit attempt**
```
POST http://localhost:5001/api/attempts/:attemptId/submit
Authorization: Bearer TOKEN
```

**View result**
```
GET http://localhost:5001/api/results/:attemptId
Authorization: Bearer TOKEN
```

**Admin — create a question**
```
POST http://localhost:5001/api/admin/questions
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "testId": "TEST_ID",
  "questionText": "I enjoy solving complex problems.",
  "trait": "Technical",
  "reverseScored": false,
  "options": [
    { "text": "Strongly Disagree", "score": 1 },
    { "text": "Disagree", "score": 2 },
    { "text": "Neutral", "score": 3 },
    { "text": "Agree", "score": 4 },
    { "text": "Strongly Agree", "score": 5 }
  ]
}
```

---

## Scoring logic (server-side only)

1. Each option has a raw score from 1 to 5.
2. Reverse-scored questions use `finalScore = 6 - rawScore`.
3. Final scores are grouped by trait → `percentage = round(total / (count*5) * 100)`.
4. Level: `>= 75% High`, `>= 50% Moderate`, else `Low`.

**The backend never trusts scores from the frontend.** The client only sends
which option text the user chose; the server looks the question up in the
database and calculates everything itself (`utils/answerScoring.js`).

## Security notes

- Passwords hashed with bcrypt before saving.
- JWT-protected routes; admin routes also require the `admin` role.
- Users can only read their own results.
- A completed attempt cannot be submitted again.
- All request bodies are validated.
- Secrets and DB URL come from environment variables.
- Centralized error handling + rate limiting on `/api`.
