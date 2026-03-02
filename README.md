# Workflow Automation Engine — Frontend

The React frontend for the Workflow Automation Engine. Provides a dashboard to manage workflows, view execution logs, and interact with the AI-powered workflow execution system. Communicates exclusively with the Node.js backend REST API.

---

## Architecture

```
project_4-ui/
├── src/
│   ├── main.tsx                  # React entry point
│   ├── App.tsx                   # Router setup (React Router v7)
│   ├── pages/
│   │   ├── Login/                # Login page
│   │   ├── Register/             # Registration page
│   │   ├── Dashboard/            # Main dashboard (stats, recent logs)
│   │   └── WorkflowsPage.tsx     # Workflow list, create, execute
│   ├── components/
│   │   ├── AddWorkflowForm.tsx   # Form to create standard or AI workflows
│   │   ├── WorkflowCard.tsx      # Individual workflow display + actions
│   │   ├── RecentLogs.tsx        # Last N execution log entries
│   │   ├── ViewWorkflowLogs.tsx  # Full log history for a workflow
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   ├── Topbar.tsx            # Header bar
│   │   ├── ProtectedRoute.tsx    # Auth guard — redirects to login if no token
│   │   ├── authForm.tsx          # Shared login/register form shell
│   │   ├── Input.tsx             # Reusable input component
│   │   └── SingleSelect.tsx      # Reusable select dropdown
│   ├── hooks/
│   │   └── useAuth.ts            # Auth state hook (token storage, user context)
│   └── services/
│       └── api.ts                # Axios instance + all API call functions
├── tailwind.config.js
├── vite.config.ts
└── dockerfile                    # Nginx-based production image
```

### Data Flow

```
User action (button / form)
        |
        v
Page / Component
        |
        v
services/api.ts  (Axios — points to http://localhost:3000)
        |
        | HTTP REST
        v
Node.js Backend (project_4)
        |
        |-- PostgreSQL (workflow data, logs)
        |-- BullMQ / Redis (async jobs)
        `-- ai-agent :8000 (AI workflow execution)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript |
| Routing | React Router v7 |
| Styling | Tailwind CSS v3 |
| HTTP Client | Axios |
| UI Primitives | Headless UI v2 |
| Icons | Lucide React |
| Build Tool | Vite 6 |
| Containerisation | Docker (Nginx) |

---

## Pages

| Route | Page | Description |
|---|---|---|
| `/login` | Login | JWT login form |
| `/register` | Register | New account form |
| `/dashboard` | Dashboard | Overview stats and recent logs |
| `/workflows` | WorkflowsPage | Full workflow list, create, execute, delete |

All routes except `/login` and `/register` are wrapped in `ProtectedRoute`, which checks for a valid JWT in local storage.

---

## Running Locally

### Development

```bash
cd project_4-ui
npm install
npm run dev
```

Vite dev server starts at http://localhost:5173. Ensure the backend is running on port 3000.

### With Docker Compose

The frontend is included in the root `docker-compose.yml` as the `frontend` service. It is built and served via Nginx on port 80.

```bash
# From repo root
docker-compose up --build frontend
```

---

## Environment / API Base URL

The backend URL is configured in `src/services/api.ts`. By default it points to `http://localhost:3000`. Update this value if the backend runs on a different host or port (e.g. in a staging or production environment).

---

## Optimisation Roadmap

The UI started as a minimal interface for the basic CRUD API. Below are the planned improvements aligned with the backend phases.

### Phase 1 — Completed (Initial Version)
- Login and Register pages with JWT storage
- Workflow list page (create, delete)
- Basic execution log view

### Phase 2 — Completed
- Dashboard with recent logs
- Protected routing with `ProtectedRoute`
- `AddWorkflowForm` supporting both static and AI workflow modes
- `WorkflowCard` with per-workflow actions

### Phase 3 — Completed
- TypeScript migration
- Tailwind CSS design system
- Headless UI components for accessible dropdowns and modals
- Axios service layer (`services/api.ts`) replacing ad-hoc fetch calls

### Phase 4 — Planned
- **Feed management UI**: page to create and manage FeedSources; UI to link/unlink feeds to workflows
- **Scheduling UI**: form controls to set cron/interval schedules on workflows with a human-readable preview
- **Notification centre**: bell icon in the Topbar showing unread notifications from the backend `/api/notifications` endpoint
- **Workflow execution history**: timeline view of all runs for a workflow with status badges and expandable log entries
- **Error boundaries**: catch and display component-level errors gracefully instead of blank screens

### Phase 5 — Planned
- **Streaming AI output**: use `EventSource` (SSE) to stream LangChain agent reasoning steps into the UI in real time during AI workflow execution
- **Workflow builder (drag-and-drop)**: visual node-based editor for constructing multi-step workflows without writing JSON actions manually
- **Dark mode**: Tailwind `dark:` variant support toggled via a user preference stored in local storage
- **Optimistic UI updates**: update workflow list and logs immediately on user action, then reconcile with the server response
- **Testing**: Vitest + React Testing Library unit tests for all components; Playwright end-to-end tests for auth and workflow creation flows
