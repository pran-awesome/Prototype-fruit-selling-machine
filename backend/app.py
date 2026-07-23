"""Fresh X - Automated Fresh Vegetable Vending Cabinet (Phase 1 prototype).

Flask backend that:
  * serves the built React web app (in production / on the Pi),
  * exposes the mocked user flow API (login -> verify -> open cabinet),
  * enforces flow order via the server session (even though auth is mocked),
  * exposes a simple admin API (open-event log, cabinet status, manual open),
  * generates a QR code pointing at the cabinet URL (fixed IP, configurable).

Everything is in-memory (no persistence) per the Phase 1 requirements.
"""

from __future__ import annotations

import io
import logging
import os
from datetime import datetime, timezone

import qrcode
from flask import (
    Flask,
    jsonify,
    request,
    send_file,
    send_from_directory,
    session,
)
from flask_cors import CORS

import door_control

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("fresh_x.app")

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
# Where the physical QR sticker should point. On the Pi this is its fixed IP.
CABINET_URL = os.environ.get("CABINET_URL", "http://192.168.1.50:5000")
# Admin "password" is ignored on purpose (Phase 1: any password works for the
# fixed admin username). Kept here only to document intent.
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")

# Built frontend location (created by `npm run build` in ../frontend).
FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

app = Flask(__name__, static_folder=None)
app.secret_key = os.environ.get("SECRET_KEY", "fresh-x-dev-secret")
# Allow the Vite dev server (different origin) to talk to the API with cookies.
CORS(app, supports_credentials=True, origins="*")

# ---------------------------------------------------------------------------
# In-memory state (no persistence in Phase 1)
# ---------------------------------------------------------------------------
open_events: list[dict] = []


def _now_iso() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")


def _record_open_event(user: str, source: str, result: dict, item: str | None = None) -> dict:
    event = {
        "id": len(open_events) + 1,
        "timestamp": _now_iso(),
        "user": user,
        "source": source,  # "user" or "admin"
        "item": item,
        "mode": result.get("mode", "stub"),
        "detail": result.get("detail", ""),
    }
    open_events.append(event)
    logger.info("Cabinet opened: %s", event)
    return event


# ---------------------------------------------------------------------------
# User-facing mock flow API
# ---------------------------------------------------------------------------
@app.post("/api/login")
def login():
    """Mock login: any non-empty username/password is accepted."""
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = (data.get("password") or "").strip()
    if not username or not password:
        return jsonify({"ok": False, "error": "Enter a username and password."}), 400

    session.clear()
    session["logged_in"] = True
    session["username"] = username
    session["verified"] = False
    return jsonify({"ok": True, "username": username})


@app.post("/api/register")
def register():
    """Mock register: pretends to create an account, persists nothing."""
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    if not username:
        return jsonify({"ok": False, "error": "Enter a username."}), 400
    return jsonify({"ok": True, "message": f"Welcome, {username}! (demo account, nothing stored)"})


@app.post("/api/verify")
def verify():
    """Mock identity verification. Requires an active login first."""
    if not session.get("logged_in"):
        return jsonify({"ok": False, "error": "Please log in first."}), 403
    session["verified"] = True
    return jsonify({"ok": True})


@app.post("/api/open-cabinet")
def open_cabinet():
    """Trigger the stubbed door-open function. Requires login + verify."""
    if not session.get("logged_in"):
        return jsonify({"ok": False, "error": "Please log in first."}), 403
    if not session.get("verified"):
        return jsonify({"ok": False, "error": "Please verify your identity first."}), 403

    data = request.get_json(silent=True) or {}
    item = (data.get("item") or "").strip() or None

    result = door_control.open_door()
    user = session.get("username", "unknown")
    _record_open_event(user=user, source="user", result=result, item=item)
    message = (
        f"Cabinet unlocked. Please take your {item}." if item
        else "Cabinet unlocked. Please take your item."
    )
    return jsonify({"ok": True, "message": message, "detail": result["detail"]})


@app.get("/api/me")
def me():
    """Return current session state so the SPA can guard routes."""
    return jsonify(
        {
            "logged_in": bool(session.get("logged_in")),
            "username": session.get("username"),
            "verified": bool(session.get("verified")),
            "is_admin": bool(session.get("is_admin")),
        }
    )


@app.post("/api/logout")
def logout():
    session.clear()
    return jsonify({"ok": True})


# ---------------------------------------------------------------------------
# Admin API
# ---------------------------------------------------------------------------
@app.post("/api/admin/login")
def admin_login():
    """Admin login: username must be `admin`; any password is accepted."""
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    if username != ADMIN_USERNAME:
        return jsonify({"ok": False, "error": "Invalid admin username."}), 403
    session["is_admin"] = True
    return jsonify({"ok": True})


def _require_admin():
    return bool(session.get("is_admin"))


@app.get("/api/admin/events")
def admin_events():
    if not _require_admin():
        return jsonify({"ok": False, "error": "Admin only."}), 403
    return jsonify({"ok": True, "events": list(reversed(open_events))})


@app.get("/api/admin/status")
def admin_status():
    if not _require_admin():
        return jsonify({"ok": False, "error": "Admin only."}), 403
    last = open_events[-1] if open_events else None
    return jsonify(
        {
            "ok": True,
            "state": "active" if last else "idle",
            "total_opens": len(open_events),
            "last_opened": last["timestamp"] if last else None,
            "cabinet_url": CABINET_URL,
            "gpio_available": door_control.GPIO_AVAILABLE,
        }
    )


@app.post("/api/admin/open")
def admin_open():
    """Manual trigger for testing from the admin panel."""
    if not _require_admin():
        return jsonify({"ok": False, "error": "Admin only."}), 403
    result = door_control.open_door()
    event = _record_open_event(user="admin", source="admin", result=result)
    return jsonify({"ok": True, "event": event})


# ---------------------------------------------------------------------------
# QR code
# ---------------------------------------------------------------------------
@app.get("/api/qr.png")
def qr_png():
    """Return a PNG QR code that encodes the cabinet URL (fixed IP)."""
    img = qrcode.make(CABINET_URL)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return send_file(buf, mimetype="image/png")


# ---------------------------------------------------------------------------
# Serve the built React app (production / on the Pi). In dev, Vite serves it.
# ---------------------------------------------------------------------------
@app.get("/", defaults={"path": ""})
@app.get("/<path:path>")
def serve_spa(path: str):
    if path.startswith("api/"):
        return jsonify({"ok": False, "error": "Not found"}), 404
    full = os.path.join(FRONTEND_DIST, path)
    if path and os.path.exists(full):
        return send_from_directory(FRONTEND_DIST, path)
    index = os.path.join(FRONTEND_DIST, "index.html")
    if os.path.exists(index):
        return send_from_directory(FRONTEND_DIST, "index.html")
    return (
        "<h1>Fresh X backend is running</h1>"
        "<p>The React frontend has not been built yet. In development, open the "
        "Vite dev server (default http://localhost:5173). For production run "
        "<code>npm run build</code> in <code>frontend/</code>.</p>",
        200,
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=True)
