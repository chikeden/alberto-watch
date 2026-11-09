# Alberto Watch Company

A React and Express watch-house site with a MongoDB catalog, cookie authentication, Cloudinary uploads, and an admin desk.

## Instant local demo

Run `npm install`, then `npm run demo`. Open `http://localhost:5173`. The terminal prints a temporary admin account. The demo starts an in-memory MongoDB, seeds nine watches, and stores uploaded images locally. Its data resets when stopped.

## Local setup

1. Install Node.js 20 or newer and start MongoDB. With Docker, run `docker compose up -d` in this directory.
2. Copy `backend/.env.example` to `backend/.env`. Set `JWT_SECRET` to a long random value, and set MongoDB and Cloudinary credentials. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` before seeding.
3. Run `npm install` from this directory.
4. Run `npm run seed -w backend` to create nine products and the admin account.
5. Run `npm run dev`. Open `http://localhost:5173`. The API listens on port 4000.

The watches use original code-built SVG artwork. Cloudinary photos uploaded through the admin desk replace the artwork in product cards. No third-party product photos are bundled.

## API

The Vite dev server proxies `/api` to Express. The production frontend must set `VITE_API_URL` to the deployed API URL, and the backend must set `FRONTEND_ORIGIN` to the exact frontend origin.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | API and database status |
| POST | `/api/auth/register` | Create customer account |
| POST | `/api/auth/login` | Sign in; sets httpOnly cookie |
| POST | `/api/auth/logout` | Clear session |
| GET | `/api/auth/me` | Current user |
| GET | `/api/products?category=&q=&page=` | List watches |
| GET | `/api/products/:slug` | Watch detail |
| POST | `/api/products` | Admin create, multipart `product` JSON and up to four `images` |
| PUT | `/api/products/:id` | Admin edit, same multipart format |
| DELETE | `/api/products/:id` | Admin delete and remove Cloudinary images |
| GET, POST | `/api/visitors` | Read or count a visit |
| POST | `/api/contact` | Save an atelier message |
| POST | `/api/newsletter` | Save a subscriber email |
| GET | `/api/admin/stats` | Admin counts for products, visitors, messages, subscribers |
| GET | `/api/admin/messages` | Recent contact messages for the admin desk |

Errors use `{ "error": { "code": "...", "message": "..." } }`.

## Verification

Run `npm run build` for the frontend and `npm test` for API integration tests. The tests use an in-memory MongoDB and cover catalog filters, authentication, roles, visitor counting, forms, admin CRUD, and local demo uploads. The Postman collection is in `docs/Alberto.postman_collection.json`. Cloudinary integration and cross-browser checks still require configured services and browser access.

Contact messages and newsletter addresses are stored in MongoDB. Email notifications and mailing campaigns require an external service. Stockist map markers identify city centres; exact private viewing addresses are shared when booked.

## Deployment

Deploy `frontend/dist` to a static host and run the Express API on a Node host with MongoDB Atlas and Cloudinary configured. Use HTTPS, an exact `FRONTEND_ORIGIN`, and `NODE_ENV=production`. For cookie authentication, place frontend and API on subdomains of the same site or configure the cookie policy for your chosen hosts. Set `VITE_API_URL` to the API origin plus `/api` before building the frontend.
