# HEALTH AI Co-Creation & Innovation Platform

> **SENG 384 – Software Project III | Spring 2026**

A secure, GDPR-compliant web platform that enables structured partner discovery between healthcare professionals and engineers. Engineers and healthcare professionals can post announcements, find collaborators, and initiate meetings — without exposing sensitive IP or patient data.

---

## Team

| Member | Branch | Responsibility |
|--------|--------|----------------|
| Doğukan Ogan | `dogukan` | Frontend — React + Vite |
| Oğuz Arda Orhan | `oguz` | Backend — Node.js + Express + PostgreSQL |


---

## Project Structure

```
healtAIProject/
│
├── frontend/                  ← Doğukan's zone
│   ├── src/
│   │   ├── pages/             # Auth, Dashboard, Posts, Meetings, Admin, Profile
│   │   │   ├── auth/          # Login, Register
│   │   │   ├── dashboard/     # Dashboard (post feed)
│   │   │   ├── posts/         # Post list, detail, create, edit
│   │   │   ├── meetings/      # Meeting request flow
│   │   │   ├── admin/         # Admin panel (users, posts, logs)
│   │   │   └── profile/       # Profile & GDPR settings
│   │   ├── components/        # Reusable UI (Navbar, PostCard, FilterBar…)
│   │   ├── services/          # mockApi.js → real API in V2
│   │   ├── context/           # AuthContext (logged-in user state)
│   │   └── router/            # PrivateRoute, route definitions
│   └── package.json
│
├── backend/                   ← Oğuz's zone
│   ├── src/
│   │   ├── routes/            # auth, posts, meetings, admin, logs
│   │   ├── controllers/       # Business logic per route
│   │   ├── middleware/        # JWT auth, RBAC, rate limiter
│   │   ├── models/            # User, Post, MeetingRequest, ActivityLog
│   │   └── config/            # DB connection, env config
│   └── package.json
│
└── docs/                      ← Shared
    ├── SRS_V1.md              # Software Requirements Specification
    └── SDD_V1.md              # Software Design Document (V2)
```

---

## Roadmap

### ✅ V1 — April 9, 2026 · Frontend + SRS
- [x] Base setup: routing, AuthContext, mock API service, Navbar, global CSS
- [x] Auth pages: Login, Register (.edu validation, role selection, email verify step)
- [x] Dashboard + Post List + Search & Filter
- [x] Post Create / Edit / Detail + Meeting Request flow
- [x] Admin Panel + Profile & GDPR page
- [x] SRS_V1 document

### V2 — April 30, 2026 · Full Stack Integration + SDD
- [ ] Express API endpoints live
- [ ] PostgreSQL database connected
- [ ] Frontend switches from mock API to real API
- [ ] SDD_V1 document

### V3 — May 7, 2026 · Final Submission
- [ ] All features complete and tested
- [ ] User Guide written
- [ ] Demo video recorded (max 5 min)

---

## Running the Project

### Frontend (Doğukan)
```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

### Backend (Oğuz)
```bash
cd backend
npm install
npm start
# http://localhost:3000
```

---

## Key Features

| Feature | Description |
|---------|-------------|
| Registration & Auth | `.edu` email only · Role selection (Engineer / Healthcare / Admin) · Email verification |
| Post Management | Create, edit, draft/publish lifecycle · Auto-expiry · Post states: Draft → Active → Meeting Scheduled → Partner Found → Expired |
| Search & Filtering | Filter by domain, expertise, city, country, project stage, status |
| Meeting Request | Interest → NDA acceptance → time slot proposal → confirm/decline |
| Admin Dashboard | User management · Post moderation · Activity logs with CSV export |
| GDPR Compliance | Account deletion · Data export · No patient data stored |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router v7 |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Auth | JWT, bcrypt |
| Styling | Custom CSS (component-scoped) |
