# 🏠 HomeFinder API

A real estate listing platform backend that supports user and agent roles, property listings by agents, and the ability for users to browse, save, delete and filter properties. Includes secure authentication, authorization, email verification, OTP and token refreshing features.

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
- RENDER (Deployment)

---

## DOCUMENTATION

### MY DOCUMENTATION URL LINK

https://documenter.getpostman.com/view/44584262/2sB2x3pEB9

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

### 4. `OTPVerification` Schema

- `email`
- `otp`
- `expiresAt`

---

## 🚀 Endpoints

### ✅ **Auth**

- `POST /sign-up` – Register as user or agent
- `POST /login` – Login and receive `accessToken` + `refreshToken` (refresh token is stored in HTTP-only cookie)
- `GET /refreshToken` – Get a new access token using the refresh token stored in cookie
- `POST /forget-password` – Send token to the user email
- `PATCH /reset-password` – Validate the token send to the user email and use it to reset password
- `POST /send-otp` – Send OTP to user email
- `POST /verify-otp` – Verify email with OTP
- `GET /validate-token` – Validate current JWT access token

### 🔑 **Authorization (Protected)**

- Send JWT `accessToken` as a header:  
  `Authorization: Bearer <accessToken>`
- Agents only:
  - `POST /property-listing` – Add a property (requires role = agent)
- All authenticated users:
  - Can save/unsave properties
  - Can view saved listings
  - Can filter property based on their location, minPrice and maxPrice

### 🏠 **Properties**

- `POST /property-listing` – Create new property **(Agent only)**
- `GET /view-all-properties` – Get all properties (with optional filters: `location`, `minPrice`, `maxPrice`)
- `GET /view-property/:id` – Get single property by ID

### 💾 **Saved Properties**

- `POST /save-property/:id` – Save/unsave a property
- `DELETE /unsave-property/:id` – Unsave a property
- `GET /view-all-saved-property` – View all saved properties

---

**Author:** Adeneey_Dev
**Email:** Oyewolesaheed638@gmail.com
