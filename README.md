# BePay – Full-Stack Banking Demo

A modern full-stack web application that simulates a digital banking system.
Designed to demonstrate clean frontend architecture, authentication flows, and responsive UI patterns in a real-world fintech-style project.

## Features
- User authentication with login, registration, and OTP verification.
- Protected application area with profile, dashboard, and transactions.
- Money transfer flow with confirmation dialog.
- Dark / Light mode with a custom BePay theme.
- Responsive layout for desktop and mobile devices.
- Realtime chat widget using WebSockets.
- Route guarding and session handling.

## Technologies Used

### Frontend
- React + TypeScript
- Vite
- Material UI (MUI)
- React Router
- Axios

### Backend
- Node.js
- Express
- TypeScript
- JWT Authentication
- REST API
- Socket.IO (Realtime communication)


Dependency folders (`node_modules`) and build outputs are intentionally excluded from version control.

## Application Flow
1. User registers or logs in.
2. Backend issues an authentication token.
3. Protected routes become accessible.
4. User can view profile information and balance.
5. Money transfers require confirmation before submission.
6. Realtime events are handled through WebSockets.

## Running Locally

### Requirements
- Node.js (v18+)
- npm

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Frontend runs on:
http://localhost:5173
### Backend runs on:
http://localhost:4000

### Deployment:
Frontend: Netlify
Backend: Render

* Environment variables are used in production to configure API endpoints.
Example:
VITE_API_BASE=https://your-backend.onrender.com/api

### Purpose
This project was built as:
* A portfolio and interview project.
* A demonstration of real-world frontend structure.
* Practice for authentication flows and protected routes.
* A simulation of a fintech-style web application.
