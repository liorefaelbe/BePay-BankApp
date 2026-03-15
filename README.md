# BePay - Full-Stack Banking Demo

BePay is a full-stack banking demo built to showcase a modern React frontend, a Node/Express API, authentication flows, real-time updates, and a MongoDB-backed data model.

## Stack

### Frontend
- React
- TypeScript
- Vite
- Material UI
- React Router
- Axios
- Socket.IO client

### Backend
- Node.js
- Express
- TypeScript
- Mongoose
- JWT authentication
- Socket.IO
- Nodemailer

### Infrastructure
- Docker Compose
- Nginx for the frontend container
- MongoDB

## Features

- Registration, login, OTP verification, and password reset
- Protected application routes
- Dashboard, profile, and transaction history
- Money transfer flow
- Real-time notifications and chat support
- Responsive UI for desktop and mobile

## Project Structure

```text
.
|-- backend/
|-- frontend/
|-- docker-compose.yml
`-- README.md
```

## Local Development

### Requirements

- Node.js 18+
- npm

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on `http://localhost:4000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Docker

### Start the full app

Run this from the project root:

```bash
docker compose up --build -d
```

### URLs

- Frontend: `http://localhost:8080`
- Backend health check: `http://localhost:4000/health`

### Stop the stack

```bash
docker compose down
```

### Remove containers and Docker Mongo data

```bash
docker compose down -v
```

## MongoDB Behavior

The backend reads `MONGO_URI` from `backend/.env`.

That means the database used by both local development and Docker depends on the value in that file:

- If `MONGO_URI` points to MongoDB Atlas, both `npm run dev` and `docker compose up` will use Atlas.
- If `MONGO_URI` points to `mongodb://mongo:27017/web-bank`, Docker will use the Mongo container from `docker-compose.yml`.

Important notes:

- Docker image rebuilds do not delete database data.
- Docker Mongo data is stored in the named volume `mongo-data`.
- `docker compose down -v` removes that Docker volume and clears the containerized Mongo data.

## Environment Variables

### Backend

The backend expects a `backend/.env` file for configuration such as:

- `MONGO_URI`
- `FRONTEND_BASE_URL`
- `APP_NAME`
- `OTP_TTL_MINUTES`
- `RESET_TTL_MINUTES`
- email-related settings

### Frontend

The frontend can run without a `.env` file in Docker because Nginx proxies `/api` and `/socket.io` to the backend container.

For local development, optional frontend variables can include:

- `VITE_API_BASE_URL`
- `VITE_SOCKET_URL`
- `VITE_SOCKET_PATH`

## Notes

- `node_modules` and build outputs should stay out of version control.
- The Docker frontend is served by Nginx.
- The Docker backend is built from TypeScript and runs the compiled `dist` output.
- The JWT secret is currently hardcoded in the backend and should be moved to environment variables before production use.
