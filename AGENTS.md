# AGENTS.md

## Cursor Cloud specific instructions

### What this project is

"Fresh X" — a Phase 1 prototype of an automated fresh-vegetable vending cabinet.
It has two parts:

- `backend/` — Flask API (mock login/verify/open-cabinet flow, admin API, QR
  generator, stubbed door control). All state is **in-memory, no persistence**.
- `frontend/` — React 18 + Vite mobile-first web app + admin dashboard.

See `README.md` for the full flow, endpoints, env vars, and run commands.

### Services and how to run them (dev)

Two dev servers must run together:

- Backend (Flask) on port 5000: `.venv/bin/python backend/app.py`
- Frontend (Vite) on port 5173: `npm run dev --prefix frontend`

Open http://localhost:5173/ (mobile-first; use a narrow/portrait window).

### Non-obvious gotchas

- The Vite dev server **proxies `/api` to Flask** (`frontend/vite.config.js`).
  Always hit the app via the Vite origin (`:5173`) in dev so session cookies are
  same-origin. Hitting `:5000` directly serves the API but not the dev frontend.
- Python deps live in a repo-local venv at `/workspace/.venv` (the base image
  lacked `python3-venv`; it is installed during environment setup). Run the
  backend with `.venv/bin/python`, not the system `python3`.
- This VM is **not a Raspberry Pi**, so `RPi.GPIO` is absent. `door_control.py`
  auto-detects this and falls back to a logging stub — this is expected. The
  real-hardware code path is guarded and only runs on a Pi.
- Admin login: username **must** be `admin`; any password is accepted. Regular
  user login accepts any non-empty username/password. Both are intentional Phase
  1 mocks — do not "fix" them as security bugs.
- No database/persistence: the open-events log and any state reset on backend
  restart. This is by design for Phase 1.
- QR code target is `CABINET_URL` (defaults to a placeholder fixed IP). Set it to
  the Pi's real IP when deploying.

### Production / on the Pi

Flask serves the built SPA from `frontend/dist` at `/`. Build with
`npm run build --prefix frontend`, then run `backend/app.py` alone.

### Available base tooling on the Cloud VM

Node.js v22 (`npm`), Python 3.12 (`pip`/`venv`), Go 1.22, Java 21, git. Docker
CLI is present but its daemon is not running by default.
