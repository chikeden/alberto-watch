# Build and verification record

## Phase 0 — Foundation

React/Vite, Express, router, design tokens, motion tokens, UI primitives, environment examples. `npm run build` passes. `GET /api/health` returned 200 with a connected local demo database. Files: `frontend/`, `backend/server.js`, `backend/.env.example`.

## Phase 1 — Backend and auth

MongoDB models, bcrypt password hashes, JWT cookie sessions, customer and admin boundaries, catalog routes, visitor counter, contact and newsletter storage, seed data, Postman collection. `npm test` exercises the routes against an in-memory MongoDB. Files: `backend/`, `docs/Alberto.postman_collection.json`.

## Phase 2 — Shell and home

Responsive header, footer, live watch SVG, trust row, manifesto, collections, featured watches, and FAQ. Files: `frontend/src/components/`, `frontend/src/pages/Home.jsx`, `frontend/src/styles/`.

## Phase 3 — Products and images

Filters, debounced search, modal, Cloudinary upload path, responsive image URLs, blurred placeholder URL, image removal, and local demo upload fallback. The integration test confirms local upload, serving, removal, and product CRUD. Files: `frontend/src/pages/Products.jsx`, `frontend/src/services/images.js`, `backend/server.js`.

## Phase 4 — Account and admin

Register, login, logout, protected admin page, product editor, image management, statistics, and saved contact messages. The API test checks customer denial and admin access. Files: `frontend/src/pages/Auth.jsx`, `frontend/src/pages/Admin.jsx`, `frontend/src/context/AuthContext.jsx`.

## Phase 5 — Other pages

About, Technology, Gallery, city-centre stockist map, and Contact. The store locations are private; map pins identify cities and the page says so. Files: `frontend/src/pages/`.

## Phase 6 — Motion

First-session preloader, pinned hero, sweeping mechanical second hand, page transitions, navbar response, manifesto word reveal, collection wipe, product layout transitions and modal, gallery lightbox, ticker, date-wheel count, and reduced-motion styles. Files: `frontend/src/components/Experience.jsx`, `frontend/src/components/Watch.jsx`, `frontend/src/styles/site.css`.

## Phase 7 — Verification and deployment

`npm run build` and `npm test` pass. `npm run demo` served the frontend with HTTP 200, `/api/health` reported a connected database, and `/api/products` returned nine records. The browser preview permission gate declined access, so visual, keyboard, responsive viewport, and Lighthouse checks could not be verified. No external deployment was attempted without a hosting destination and MongoDB/Cloudinary credentials. Files: `README.md`, `docs/demo-script.md`, `compose.yaml`.

## Slop audit

Copy scan found no banned marketing phrases or filler. Brass is an accent, product art is original, static images have dimensions, and the main interactions have reduced-motion paths. The full 10/10 audit is not claimed because visual QA and Lighthouse measurements were unavailable. The art SVG uses its own material colours, and several CSS sizes are local to components.
