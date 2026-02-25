# CipherSQLStudio

CipherSQLStudio is a full-stack SQL practice platform where learners solve assignments in a browser-based editor, run queries safely in an isolated PostgreSQL workspace, and request AI-generated hints (without full solutions).

## What this project does

- Serves SQL assignments from MongoDB.
- Lets users write and run queries in Monaco Editor (Ctrl/Cmd + Enter supported).
- Executes each query inside an isolated PostgreSQL schema per session.
- Resets execution state using transactions (`ROLLBACK`) to avoid persistent destructive changes.
- Provides concise tutoring-style hints using Google Gemini.

## Tech Stack

- **Frontend:** React 19, Vite, SCSS, Monaco Editor
- **Backend:** Node.js, Express
- **Databases:** PostgreSQL (execution sandbox), MongoDB (assignment content)
- **AI:** Google Gemini (`gemini-1.5-flash`)

## Repository Structure

```text
CipherSQLStudio/
├─ backend/   # Express API, Mongo + Postgres integration, seeding, hint generation
└─ frontend/  # React app, assignment UI, SQL editor, results + hints panels
```

## Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 14+
- MongoDB 6+
- Gemini API key from Google AI Studio

## Quick Start

### 1 Clone and install dependencies

```bash
git clone <your-repo-url>
cd CipherSQLStudio

cd backend
npm install

cd ../frontend
npm install
```

### 2 Configure environment variables

#### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and set values:

```dotenv
PORT=5000
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=ciphersqlstudio
PG_USER=your_username
PG_PASSWORD=your_password
MONGODB_URI=mongodb://localhost:27017/ciphersqlstudio
MONGODB_DB_NAME=ciphersqlstudio
GEMINI_API_KEY=your_gemini_api_key
```

#### Frontend (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

### 3 Create PostgreSQL database

Run once in `psql`:

```sql
CREATE DATABASE ciphersqlstudio;
```

### 4 Seed sample assignments

```bash
cd backend
npm run seed
```

This seeds 4 starter assignments (Easy → Hard) into MongoDB.

### 5 Start development servers

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Open: `http://localhost:5173`

## Available Scripts

### Backend (`backend/package.json`)

- `npm run dev` — start API with nodemon
- `npm start` — start API with Node
- `npm run seed` — seed assignment documents into MongoDB

### Frontend (`frontend/package.json`)

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

## API Overview

Base URL: `http://localhost:5000/api`

### Health

- `GET /health` → `{ status: "OK" }`

### Assignments

- `GET /assignments` — list all assignments
- `GET /assignments/:id` — fetch one assignment by Mongo ObjectId

### Query Execution

- `POST /execute`
- Body:

```json
{
  "assignmentId": "<mongo-id>",
  "query": "SELECT * FROM employees;",
  "sessionId": "<uuid>"
}
```

- Success response:

```json
{
  "success": true,
  "columns": ["id", "name"],
  "rows": [{ "id": 1, "name": "Alice" }],
  "rowCount": 1
}
```

- Error response:

```json
{
  "success": false,
  "error": "<message>"
}
```

### AI Hints

- `POST /hints`
- Body:

```json
{
  "assignmentId": "<mongo-id>",
  "query": "SELECT ...",
  "errorMessage": "optional error text"
}
```

- Response:

```json
{
  "hint": "Guiding hint text"
}
```

## Security & Sandbox Behavior

- Queries run in a per-session schema (`workspace_<sessionId>`).
- Assignment tables are recreated before each execution.
- Execution is wrapped in a transaction and always rolled back.
- A keyword-based validator blocks dangerous/system-level operations (for example, critical `DROP`, `ALTER USER`, and `PG_`-targeted commands).

> Note: The validator is intentionally simple. For production hardening, use stronger SQL parsing + allow-listing.

## Learning Flow

1. User opens home page and selects an assignment.
2. Frontend loads assignment details and sample tables.
3. User writes SQL in Monaco Editor.
4. Backend creates isolated Postgres schema, loads sample data, validates SQL, runs query, and returns rows/errors.
5. User can request a hint based on current query/error context.

## Troubleshooting

- **`Failed to load assignments` in UI**
  - Ensure backend is running on port `5000`.
  - Check `frontend/.env` has correct `VITE_API_URL`.

- **Backend exits on startup**
  - Verify `MONGODB_URI` and Postgres credentials in `backend/.env`.

- **`Assignment not found`**
  - Run `npm run seed` in `backend` again.

- **Hint endpoint returns fallback hint**
  - Check `GEMINI_API_KEY` validity and quota.

## License

Add your preferred license (MIT/Apache-2.0/etc.) in this repository.