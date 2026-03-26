<div align="center">

# 🔐 CipherSQLStudio

### Browser-Based Interactive SQL Learning Platform

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Vercel-000000?style=for-the-badge)](https://cipher-sql-studio-mu.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**A production-grade SQL learning platform where students write and execute real SQL queries against live databases, get AI-powered progressive hints, and track their progress — all in the browser.**

[🌐 Live App](https://cipher-sql-studio-mu.vercel.app) · [📖 Setup Guide](#️-local-setup) · [🐛 Report Bug](https://github.com/Vinay-Partap/CipherSQLStudio/issues)

</div>

---

## 📌 Overview

CipherSQLStudio is a **full-stack educational platform** built to make SQL learning practical and interactive. Unlike static tutorials, this platform lets you write actual SQL and see real results instantly.

- Execute SQL queries against **real isolated PostgreSQL databases** per session
- Get **3-tier progressive AI hints** from Google Gemini — nudges, concepts, then detailed guidance
- Track your **progress across assignments** with difficulty filtering and search
- Secure multi-user support with **JWT authentication**

> 💡 **Problem it solves:** Most SQL learning platforms use fake, simulated editors. CipherSQLStudio runs your queries against a real PostgreSQL database with schema isolation — every session is sandboxed and rolled back automatically.

---

## 🚀 Live Demo

👉 **[Try CipherSQLStudio Live](https://cipher-sql-studio-mu.vercel.app)**

Register an account, pick an assignment, write your SQL in the Monaco editor, and execute it against a live database. Stuck? Use the 3-tier hint system.

---

## ✨ Features

| Feature                    | Description                                                                       |
| -------------------------- | --------------------------------------------------------------------------------- |
| 🖊️ **Monaco Editor**        | VS Code-grade SQL editor with syntax highlighting and line numbers                |
| 🗄️ **Real Query Execution** | Queries run against actual PostgreSQL with isolated schemas per session           |
| 🔒 **Schema Isolation**     | Each session gets its own PostgreSQL schema — auto rolled back after execution    |
| 🤖 **3-Tier AI Hints**      | Gemini AI gives gentle nudge → concept hint → detailed guidance, never the answer |
| 🔐 **JWT Authentication**   | Secure login/register with bcrypt password hashing (12 rounds)                    |
| 📊 **Progress Tracking**    | Track solved assignments with completion percentage bar                           |
| 🔍 **Filter & Search**      | Filter by Easy/Medium/Hard/Solved/Unsolved, full-text search                      |
| 🌙 **Dark Mode**            | Full dark/light theme toggle with CSS custom properties                           |

---

## 🏗️ System Architecture

```
User Browser (React + Monaco Editor)
        │
        ▼
  Vercel (Frontend)
        │
        ▼
  Render (Express Backend)
        ├── MongoDB Atlas ──── Assignments, Users, Auth
        └── Neon PostgreSQL ── Isolated query execution
                │
                ├── CREATE SCHEMA workspace_<sessionId>
                ├── INSERT sample data
                ├── EXECUTE user query
                └── ROLLBACK (no persistent changes)
```

### Query Execution Flow
```
User writes SQL → clicks Run Query
        ↓
Backend validates query (blocks DROP, CREATE USER, etc.)
        ↓
PostgreSQL creates isolated schema for this session
        ↓
Query runs inside a transaction
        ↓
Transaction rolls back — zero data persistence
        ↓
Results returned to frontend
```

### AI Hint Flow
```
Hint 1/3 → Gentle nudge (no SQL keywords mentioned)
Hint 2/3 → Concept hint (which clause to use)
Hint 3/3 → Detailed approach (column names, no full query)
           Full solution is never revealed
```

---

## 🛠️ Tech Stack

| Layer          | Technology                           |
| -------------- | ------------------------------------ |
| Frontend       | React.js (Vite), Monaco Editor, SCSS |
| Backend        | Node.js, Express.js                  |
| SQL Database   | PostgreSQL via Neon (serverless)     |
| NoSQL Database | MongoDB Atlas                        |
| AI / LLM       | Google Gemini 1.5 Flash              |
| Authentication | JWT + bcryptjs                       |
| Deployment     | Vercel (frontend), Render (backend)  |

---

## 📁 Project Structure

```
CipherSQLStudio/
├── backend/
│   ├── config/
│   │   ├── database.js        # MongoDB connection
│   │   └── postgres.js        # PostgreSQL pool + schema isolation
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── models/
│   │   └── User.js            # User model
│   ├── routes/
│   │   ├── auth.js            # Login / Register
│   │   ├── assignments.js     # Fetch assignments
│   │   ├── execution.js       # Query execution
│   │   └── hints.js           # AI hint generation
│   ├── services/
│   │   ├── postgresService.js # Sandbox execution logic
│   │   └── llmService.js      # Gemini prompt engineering
│   ├── utils/
│   │   └── seedData.js        # Sample assignments seeder
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/        # AssignmentList, Editor, etc.
│       ├── context/           # AuthContext, ThemeContext
│       ├── pages/             # Home, Assignment, Login
│       ├── services/          # API calls
│       └── styles/            # SCSS variables, mixins
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Neon PostgreSQL account (free tier)
- Google Gemini API key — free at [ai.google.dev](https://ai.google.dev)

### 1. Clone the Repository
```bash
git clone https://github.com/Vinay-Partap/CipherSQLStudio.git
cd CipherSQLStudio
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Fill in your credentials in .env
npm install
npm run seed    # Load sample assignments into MongoDB
npm run dev     # Starts on http://localhost:5000
```

### Backend `.env`
```
PORT=5000
PG_HOST=your_neon_host
PG_PORT=5432
PG_DATABASE=neondb
PG_USER=neondb_owner
PG_PASSWORD=your_neon_password
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ciphersqlstudio
GEMINI_API_KEY=your_gemini_key
JWT_SECRET=your_jwt_secret
```

### 3. Frontend Setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev     # Starts on http://localhost:5174
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000
```

### 4. Verify
- Backend health: `http://localhost:5000/api/health`
- Frontend: `http://localhost:5174`

---

## 📝 Sample Assignments

| Title                          | Difficulty | SQL Concept     |
| ------------------------------ | ---------- | --------------- |
| Find High Salary Employees     | 🟢 Easy     | WHERE clause    |
| Department-wise Employee Count | 🟡 Medium   | GROUP BY        |
| Total Order Value per Customer | 🟡 Medium   | JOIN            |
| Highest Paid Employee          | 🔴 Hard     | Subqueries, MAX |

---

## 🔒 Security

- JWT tokens with 7-day expiry
- bcrypt password hashing with 12 rounds
- PostgreSQL schema isolation per session
- Query validation blocks `DROP DATABASE`, `CREATE USER`, system table access
- All secrets stored in environment variables — never committed to Git

---

## 🔮 Future Scope

- [ ] Admin panel to add/edit assignments without code changes
- [ ] Query explanation mode — AI explains what each part of the query does
- [ ] Leaderboard with points and badges
- [ ] SQL query formatter
- [ ] Time-based challenges
- [ ] Support for CTEs, Window Functions

---

## 👨‍💻 Author

**Vinay Partap**

[![GitHub](https://img.shields.io/badge/GitHub-Vinay--Partap-181717?style=flat&logo=github)](https://github.com/Vinay-Partap)

---

## 📄 License

MIT License — Built for educational purposes.

---

<div align="center">

<strong>⭐ If you found this project useful, please consider giving it a star!</strong>

</div>