# Fresh X — JS-only build (Firebase Hosting)

The same **Fresh X** fresh-vegetable vending-cabinet prototype UI as the main
app, rebuilt with **no Python / no server** so it can be deployed to
**Firebase Hosting** as a static site.

The mocked flow (login → verify → open) and the admin open-events log all run
**client-side** (`src/service.js`):

- Session state → `sessionStorage`
- Open-events log → `localStorage` (visible to the admin dashboard in the same browser)
- QR code → generated in the browser with the `qrcode` package

It's the same React + Vite + framer-motion dark UI; only the data layer changed
(the Flask API calls were replaced with an in-browser service exposing the same
methods).

## Stack

| Layer | Technology |
|---|---|
| UI | React 18 + Vite, `framer-motion` (dark theme, animated background) |
| "Backend" | Pure client-side JS (`src/service.js`), no server |
| QR | `qrcode` (browser) |
| Hosting | Firebase Hosting (static) |

## Develop

```bash
npm install
npm run dev        # http://localhost:5174
```

## Build

```bash
npm run build      # outputs static site to ./dist
npm run preview    # preview the production build locally
```

## Deploy to Firebase Hosting

1. Install the CLI once: `npm install -g firebase-tools`
2. `firebase login`
3. Set your project id in `.firebaserc` (replace `your-firebase-project-id`),
   or run `firebase use --add`.
4. Deploy:

   ```bash
   npm run deploy      # runs vite build, then firebase deploy --only hosting
   ```

`firebase.json` is configured for a single-page app: `public: dist` with a
catch-all rewrite to `/index.html` so client-side routes (`/login`, `/admin`, …)
work on refresh.

## Config

| Var | Default | Purpose |
|---|---|---|
| `VITE_CABINET_URL` | the site's own origin (`window.location.origin`) | URL encoded in the admin QR code. Set at build time, e.g. `VITE_CABINET_URL=https://your-app.web.app npm run build`. |

## Notes / scope

Same Phase 1 mocks as the main app: login accepts any non-empty
username/password; admin is username `admin` + any password; there is no real
auth, payment, or hardware. Because state is per-browser (session/local
storage), the admin log shows opens made in that same browser. To share state
across devices later, swap `src/service.js` for Firestore or Cloud Functions.
