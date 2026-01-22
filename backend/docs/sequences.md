# Web Banking – Sequence Diagrams

---

## 1. User Registration + OTP Verification

Client -> Backend: POST /auth/register (email, password, phone)
Backend -> Backend: validate input
Backend -> Backend: generate OTP
Backend -> SMS/Email Provider: send OTP
Backend -> Client: 200 OK (OTP sent)

Client -> Backend: POST /auth/verify-otp (email, code)
Backend -> Backend: validate OTP
Backend -> Backend: create user
Backend -> Backend: generate JWT
Backend -> Client: 200 OK (JWT)

---

## 2. Login Flow

Client -> Backend: POST /auth/login (email, password)
Backend -> Backend: verify password
Backend -> Backend: generate JWT
Backend -> Client: 200 OK (JWT)

---

## 3. Protected Dashboard Access

Client -> Backend: GET /user/me (JWT)
Backend -> Backend: verify JWT
Backend -> Client: 200 OK (user data)

---

## 4. Money Transfer Flow

Client -> Backend: POST /transactions/transfer (JWT, toEmail, amount)
Backend -> Backend: verify JWT
Backend -> Backend: check balance
Backend -> Backend: debit sender
Backend -> Backend: credit receiver
Backend -> Backend: create transaction records
Backend -> WebSocket: notify receiver
Backend -> Client: 200 OK (success)

---

## 5. Logout Flow

Client -> Backend: POST /auth/logout
Backend -> Client: 200 OK
Client: delete JWT
