# ShopEasy — E-Commerce Product App

A full-stack MERN app: React frontend, Express/Node backend, MongoDB database.
Built to satisfy all 5 requirements: search & filter product listing, shopping
cart, a protected admin panel, proper Mongoose models, and a deploy-ready setup
(Vercel + Render, no hardcoded localhost URLs).

Tested locally: backend boots and serves `/api/health` correctly, and the
frontend builds cleanly with `vite build`. You'll need your own MongoDB
instance (local or Atlas) to run it with real data.

```
ecommerce-app/
├── backend/     Express API + MongoDB (Mongoose) + JWT auth
└── frontend/    React (Vite) app — product grid, cart, admin panel
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — local (`mongodb://localhost:27017/ecommerce`) or an
  [Atlas](https://www.mongodb.com/cloud/atlas) connection string
- `JWT_SECRET` — any long random string
- `CLIENT_ORIGIN` — your frontend URL (`http://localhost:5173` for dev)

Seed an admin user + sample products:

```bash
npm run seed
```
This creates admin and 6 sample products.

Start the API:

```bash
npm run dev      # nodemon, auto-restarts
# or
npm start
```

API runs at `http://localhost:5000/api`. Check `http://localhost:5000/api/health`.

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Run it:

```bash
npm run dev
```

Open `http://localhost:5173`. Products load from your backend automatically.

## 3. Using the app

- **Storefront** (`/`): search by name, filter by category and price range —
  results update live as you type/select, no page reload.
- **Cart**: click "Cart" in the navbar. Add/remove items, adjust quantity,
  see the running total. Persists in `localStorage` across refreshes.
- **Admin login** (`/login`): log in with `admin`
- **Admin panel** (`/admin`, protected route): add, edit, delete products.
  Changes appear on the storefront immediately since it's the same database.

## 4. How the pieces connect

- Frontend calls the backend through `src/api/api.js`, using `VITE_API_URL`
  from the environment — never a hardcoded URL.
- The backend attaches a JWT to protected routes via `middleware/auth.js`.
  The frontend stores the token in `localStorage` and an axios interceptor
  attaches it to every request automatically.
- `POST/PUT/DELETE /api/products` require `protect` + `adminOnly` middleware,
  so only logged-in admins can modify the catalog. `GET` routes are public.
- CORS on the backend is restricted to `CLIENT_ORIGIN` from `.env`, so update
  that value when you deploy the frontend.

## 5. Deploying (React on Vercel, backend on Render)

**Backend → Render**
1. Push this repo to GitHub.
2. On [Render](https://render.com), create a new **Web Service**, point it at
   the `backend` folder (root directory: `backend`).
3. Build command: `npm install` · Start command: `npm start`.
4. Add environment variables in Render's dashboard: `MONGO_URI`, `JWT_SECRET`,
   `CLIENT_ORIGIN` (set this to your Vercel URL once you have it), `PORT`
   (Render sets this automatically, but the app reads `process.env.PORT`).
5. Use MongoDB Atlas for `MONGO_URI` in production (whitelist Render's IPs or
   allow access from anywhere for simplicity).
#### Render URL - https://ecommerceapp-kbv8.onrender.com

**Frontend → Vercel**
1. On [Vercel](https://vercel.com), import the repo, set root directory to
   `frontend`.
2. Framework preset: Vite. Build command: `npm run build`. Output: `dist`.
3. Add environment variable `VITE_API_URL` = your Render backend URL + `/api`
   (e.g. `https://your-app.onrender.com/api`).
4. Deploy. Go back to Render and set `CLIENT_ORIGIN` to your new Vercel URL,
   then redeploy the backend so CORS allows it.
#### Vercel URL - https://ecommerceapp-chi-seven.vercel.app

No `localhost` URLs are hardcoded anywhere — both ends read from environment
variables (`VITE_API_URL` on the frontend, `CLIENT_ORIGIN`/`MONGO_URI` on the
backend), so this works identically in dev and production.

## Notes

- Register a new user via
  `POST /api/auth/register` then manually flip their `role` to `"admin"` in
  MongoDB (registration always creates `customer` accounts by design, so
  nobody can self-promote to admin through the API).
- The Product schema stores exactly what's required: name, image URL,
  category, price, description, and stock count (`backend/models/Product.js`).
