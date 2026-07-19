# Fresh X — Automated Fresh Vegetable Vending Cabinet (Phase 1 Prototype)

Proof-of-concept for an automated cabinet that dispenses fresh salad vegetables
behind a single shared door (4 compartments, same product). Users authenticate
through a mobile web app before the (stubbed) door unlocks.

**Phase 1 is fully mocked**: authentication, identity verification, registration
and mechanical door control are all stubs. The goal is to validate the
end-to-end flow (web UI → Flask backend → door-open trigger) before building
real security, payment and hardware.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, `framer-motion` animations (mobile-first) |
| Backend | Flask (Python), in-memory state (no persistence) |
| Door control | Stubbed GPIO trigger (`backend/door_control.py`), drops onto a Raspberry Pi later |
| Host | Raspberry Pi (self-hosted); any Linux host works for development |

## Project layout

```
backend/    Flask API + door-control stub + QR generator
frontend/   React (Vite) mobile-first web app + admin dashboard
```

## Run in development

Two dev servers. The Vite dev server proxies `/api` to Flask, so the browser
sees a single origin (sessions/cookies just work).

1. Backend (Flask, port 5000):

   ```bash
   python3 -m pip install --break-system-packages -r backend/requirements.txt
   python3 backend/app.py
   ```

2. Frontend (Vite, port 5173):

   ```bash
   npm install --prefix frontend
   npm run dev --prefix frontend
   ```

3. Open http://localhost:5173/ on a phone-sized browser window.

## Run in production / on the Pi

Build the frontend once; Flask then serves it at `/`:

```bash
npm run build --prefix frontend
python3 backend/app.py   # serves API + built app on port 5000
```

## User flow (all mocked)

1. Sign in — any non-empty username/password is accepted.
2. Verify identity — single "Confirm identity" button.
3. Open Cabinet — calls the stubbed door-open trigger; logs the event.
4. Success screen — "Cabinet unlocked, please take your item."

Flow order is enforced server-side via the session even though auth is mocked
(you can't skip straight to open-cabinet).

## Admin dashboard

- Open the **Admin dashboard** link (or go to `/admin`).
- Sign in with username `admin` and **any** password.
- Shows cabinet status, total opens, last-opened time, a scannable QR code, and
  the live open-events log. Includes a manual **Trigger open** button.

## Configuration (env vars)

| Var | Default | Purpose |
|---|---|---|
| `CABINET_URL` | `http://192.168.1.50:5000` | URL encoded in the QR code (set to the Pi's fixed IP) |
| `PORT` | `5000` | Flask port |
| `SECRET_KEY` | `fresh-x-dev-secret` | Flask session secret |
| `ADMIN_USERNAME` | `admin` | Admin username |

## Out of scope in Phase 1

Real auth/OTP, account persistence, payments, real door/lock hardware,
door-close/pickup sensors, security hardening, multi-language, and
per-compartment control. See the requirement sheet for the full list.
