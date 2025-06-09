# 🏠 HomeFinder API

A real estate listing platform backend that supports user and agent roles, property listings by agents, and the ability for users to browse, save, delete and filter properties. Includes secure authentication, authorization, email verification, and token refreshing features.

---

## 📌 Features

- 👤 Role-based authentication (`agent` / `user`)
- 🏘️ Agents can post property listings
- 🔍 Users can browse, save, delete and filter properties
- 🔐 JWT-based authentication and refresh tokens
- 📧 Email verification with OTP
- ✅ Protected routes with role and token checks

---

## 🛠️ Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT (Authentication)
- Bcrypt (Password hashing)
- Nodemailer (Email + token + OTP)
- Postman (API Testing)

---

## 📁 Schemas

### 1. `User` Schema
- `email`
- `password`
- `firstName`, `lastName`
- `state`
- `role`: `"user"` or `"agent"`
- `verified`: `true/false`

### 2. `Property` Schema
- `title`
- `image`
- `description`
- `price`
- `location`
- `propertyType`
- `listedBy`: agent `_id`

### 3. `SavedProperty` Schema
- `user`: user `_id`
- `property`: property `_id`

### 4. `OTPVerification` Schema (optional)
- `email`
- `otp`
- `expiresAt`

---

## 🚀 Endpoints

### ✅ **Auth**
- `POST /auth/register` – Register as user or agent
- `POST /auth/login` – Login and receive `accessToken` + `refreshToken` (refresh token is stored in HTTP-only cookie)
- `POST /auth/forget-password` – Send token to the user email
- `POST /auth/reset-password` – Validate the token send to the user email and use it to reset password
- `POST /auth/send-email` – Send OTP to user email
- `POST /auth/verify-email` – Verify email with OTP
- `GET /auth/validate-token` – Validate current JWT access token
- `POST /auth/refresh-token` – Get a new access token using the refresh token in the cookie

### 🔑 **Authorization (Protected)**
- Send JWT `accessToken` as a header:  
  `Authorization: Bearer <accessToken>`
- Agents only:
  - `POST /properties` – Add a property (requires role = agent)
- All authenticated users:
  - Can save/unsave properties
  - Can view saved listings

### 🏠 **Properties**
- `POST /properties` – Create new property **(Agent only)**
- `GET /properties` – Get all properties (with optional filters: `location`, `minPrice`, `maxPrice`)
- `GET /properties/:id` – Get single property by ID

### 💾 **Saved Properties**
- `POST /saved` – Save/unsave a property
- `GET /saved` – View all saved properties by the logged-in user

---


**Author:** Adeneey_Dev  

