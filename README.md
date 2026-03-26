# HRMS-Basic

A full-stack Human Resource Management System (HRMS) built with React, TypeScript, Express, and SQLite. Designed for small-to-medium organizations under the **Lumina** brand.

🔗 **Live Demo:** [venkateshTechmates.github.io/HRMS-Basic](https://venkateshTechmates.github.io/HRMS-Basic/)

> **Note:** The live demo is a static frontend build. API calls to the backend will not function on GitHub Pages. Run locally for full functionality.

---

## Features

### Employee Self-Service
- **Dashboard** — Personal stats, announcements, and quick actions
- **Attendance** — Clock in/out, view attendance history
- **Leaves** — Apply for leave, track leave balance and history
- **Payroll** — View payslips and salary breakdown
- **Performance** — Set goals, view performance reviews
- **Learning & Development** — Browse and enroll in courses
- **Expenses** — Submit and track expense claims
- **Helpdesk** — Raise and track IT/HR support tickets
- **Grievances** — Submit and monitor grievance cases
- **Profile** — Manage personal info, documents, and skills
- **Org Chart** — Visual company hierarchy
- **Policies** — Access company policy documents
- **Onboarding** — New hire task checklist

### Admin Panel
- **Employee Management** — Add, edit, and manage all employees
- **Recruitment** — Track job openings and applications
- **Analytics** — Charts and reports across HR metrics
- **DEI Dashboard** — Diversity, equity & inclusion metrics
- **Succession Planning** — Identify and track high-potential employees
- **Offboarding** — Manage employee exits
- **Notifications** — Broadcast announcements

---

## Tech Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Frontend   | React 19, TypeScript, Vite, Tailwind CSS v4         |
| Backend    | Node.js, Express, TypeScript (tsx)                  |
| Database   | SQLite via `better-sqlite3`                         |
| Auth       | JWT (`jsonwebtoken`), bcrypt (`bcryptjs`)           |
| Charts     | Recharts                                            |
| Animation  | Motion (Framer Motion)                              |
| AI         | Google Gemini (`@google/genai`)                     |
| Forms      | React Hook Form + Zod                               |
| Routing    | React Router v7                                     |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/venkateshTechmates/HRMS-Basic.git
cd HRMS-Basic
npm install
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
GEMINI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:3000
```

### Running Locally

```bash
npm run dev
```

The app starts on `http://localhost:3000` (Express backend + Vite frontend).

### Build

```bash
npm run build
```

---

## Demo Credentials

### Administrator Access
| Field    | Value              |
|----------|--------------------|
| Email    | admin@lumina.com   |
| Password | admin123           |

### Employee Access
| Email              | Password    |
|--------------------|-------------|
| jane@lumina.com    | password123 |
| bob@lumina.com     | password123 |
| alice@lumina.com   | password123 |

---

## Project Structure

```
HRMS-Basic/
├── src/
│   ├── App.tsx          # All UI components and routes
│   ├── main.tsx         # React entry point
│   ├── index.css        # Global styles
│   └── lib/
│       └── api.ts       # API client helper
├── server.ts            # Express API server
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript config
├── index.html           # HTML entry point
└── package.json
```

---

## Scripts

| Command         | Description                        |
|-----------------|------------------------------------|
| `npm run dev`   | Start dev server (Express + Vite)  |
| `npm run build` | Production build                   |
| `npm run lint`  | TypeScript type check              |
| `npm run clean` | Remove dist folder                 |

---

## License

MIT