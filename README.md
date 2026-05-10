# TaskPilot Frontend

React-based UI for TaskPilot — a fullstack project management system built as a final bootcamp assignment. Talks to the TaskPilot backend over REST and provides authentication, dashboard, projects, tasks (with a Kanban board and drag-and-drop), comments, activity logs, and a users directory.

## Tech Stack

- **React 18** with **Vite** (fast dev server + build)
- **Tailwind CSS v3** (utility-first styling)
- **React Router v6** (routing with protected/public route wrappers)
- **Axios** (HTTP client with request/response interceptors)
- **Context API** (`AuthContext` for global auth state)
- **@dnd-kit/core** + **@dnd-kit/sortable** + **@dnd-kit/utilities** (Kanban drag-and-drop)

## Features

- Login, register, logout with JWT token stored in `localStorage`
- Auth state restored on app load via `GET /api/auth/me`
- Protected routes via `ProtectedRoute` wrapper; public-only via `PublicRoute`
- Axios request interceptor attaches `Authorization: Bearer <token>` automatically
- Axios response interceptor clears the token and redirects to `/login` on 401
- Dashboard with stat cards, recent activity, upcoming tasks (admin/member-aware)
- Projects UI — list, detail, create, edit, delete with confirmation
- Tasks UI — list as a 4-column Kanban board (TODO, IN_PROGRESS, REVIEW, DONE)
- Drag-and-drop status update with optimistic UI and 403 handling
- Task detail page with quick status buttons and inline comments
- Comments — add, edit own, delete own (admin can delete any)
- Activity Logs page (admin only) with date range filter and per-page selector
- Users page with search, role badge, pagination
- Search, filter, sort, and pagination wired to backend query params on every list page
- Loading, error, and empty states everywhere; 401 redirects, 403 friendly message
- Mobile-responsive layout — sidebar collapses into a horizontal nav strip on mobile

## Folder Structure

```text
taskpilot-frontend/
├── src/
│   ├── api/                axiosClient + per-resource API modules
│   ├── components/
│   │   ├── cards/          ProjectCard, TaskCard, StatCard
│   │   ├── comments/       CommentForm, CommentItem, CommentList
│   │   ├── common/         LoadingSpinner, ErrorMessage, EmptyState, Button, Badge, Pagination, ConfirmDialog
│   │   ├── dashboard/      RecentActivityList, UpcomingTaskList
│   │   ├── forms/          ProjectForm, TaskForm
│   │   ├── layout/         DashboardLayout, Sidebar, Navbar
│   │   └── tasks/          KanbanColumn (with draggable cards)
│   ├── context/            AuthContext (AuthProvider)
│   ├── hooks/              useAuth
│   ├── pages/              Login, Register, Dashboard, Projects, Tasks, Users, ActivityLogs, NotFound
│   ├── routes/             AppRoutes, ProtectedRoute, PublicRoute
│   └── utils/              formatDate
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── .env.example            Safe template for env vars
├── .gitignore              Ignores .env, node_modules, dist
└── package.json
```

## Environment Variables

Copy `.env.example` to `.env` and adjust if your backend runs on a different host or port. **Never commit `.env`.**

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

The Vite dev server reads this at build/start time and exposes it via `import.meta.env.VITE_API_BASE_URL`.

## Run Locally

Make sure the [TaskPilot Backend](https://github.com/azizizaidi/taskpilot-backend) is running first.

```bash
npm install
npm run dev          # starts Vite dev server on http://localhost:5173
```

Other scripts:

```bash
npm run build        # production build to dist/
npm run preview      # serve the production build locally
```

## Routes

| Path                       | Page                | Access                          |
|----------------------------|---------------------|---------------------------------|
| `/login`                   | LoginPage           | Public only                     |
| `/register`                | RegisterPage        | Public only                     |
| `/dashboard`               | DashboardPage       | Authenticated                   |
| `/projects`                | ProjectsPage        | Authenticated                   |
| `/projects/new`            | ProjectFormPage     | Authenticated (admin enforced)  |
| `/projects/:id`            | ProjectDetailPage   | Authenticated                   |
| `/projects/:id/edit`       | ProjectFormPage     | Authenticated (admin enforced)  |
| `/tasks`                   | TasksPage (Kanban)  | Authenticated                   |
| `/tasks/new`               | TaskFormPage        | Authenticated (admin enforced)  |
| `/tasks/:id`               | TaskDetailPage      | Authenticated                   |
| `/tasks/:id/edit`          | TaskFormPage        | Authenticated (admin enforced)  |
| `/users`                   | UsersPage           | Authenticated (link admin-only) |
| `/activity-logs`           | ActivityLogsPage    | Admin only                      |
| `*`                        | NotFoundPage        | —                               |

## Backend API Connection

The frontend expects the backend to be reachable at the URL in `VITE_API_BASE_URL`. By default that is `http://localhost:5000/api`.

All protected requests automatically send `Authorization: Bearer <token>`. The Axios response interceptor clears the token and redirects to `/login` on `401` (excluding `/auth/` routes so login errors stay on the form). `403` responses are handled per-page with a friendly inline message — no redirect.

Numeric form values (e.g., `projectId`, `assignedToId`) are converted to numbers before being sent to the backend.

## Demo Accounts

Use the seeded backend accounts to log in:

| Role   | Email                   | Password      |
|--------|-------------------------|---------------|
| Admin  | admin@taskpilot.com     | password123   |
| Member | member@taskpilot.com    | password123   |

## Screenshots

_Add screenshots here once the app is running:_

- `docs/screenshots/login.png`
- `docs/screenshots/dashboard.png`
- `docs/screenshots/kanban.png`
- `docs/screenshots/task-detail.png`
- `docs/screenshots/activity-logs.png`

## Project Links

- **Frontend Repository:** TODO - add GitHub frontend repository URL
- **Backend Repository:** TODO - add GitHub backend repository URL
- **Deployed App:** Not deployed / Local demo only

## Notes

- `.env` is local-only and is excluded from git via `.gitignore`. Use `.env.example` as the safe template.
- `node_modules/` and `dist/` are also excluded from git.
- This frontend assumes the TaskPilot backend is running and seeded. See the backend README for setup.
