# BaoAfrik Backend Integration Guide

## 📋 Overview
This document describes the current status of the BaoAfrik Backend API, how to run it locally, required environment variables, implemented endpoints, and testing/troubleshooting notes. Authentication and password reset flows are implemented and wired to the frontend. Email delivery uses SMTP (Gmail) through Nodemailer. Swagger docs and a Postman collection are provided.

## 🚦 Status Snapshot
- **API server**: `backend/src/server.ts` on port `3001` (configurable via `PORT`).
- **Docs**: Swagger UI at `http://localhost:3001/api-docs`. Health at `http://localhost:3001/health`.
- **DB**: PostgreSQL via Prisma. Configure `DATABASE_URL`.
- **Auth**: JWT access/refresh, email verification, profile update, change password.
- **Password reset**: Request + Reset flows live. Email uses SMTP (Gmail).
- **Email test routes**: Available under `/api/test`.

## 🔌 Implemented API Endpoints

### Authentication Endpoints
```
POST /api/auth/register           # registration with email verification code generated
POST /api/auth/login              # returns accessToken, refreshToken, user
POST /api/auth/logout             # clears provided refresh token
POST /api/auth/refresh            # issue new access token from refresh token
GET  /api/auth/me                 # requires Bearer access token
PUT  /api/auth/profile            # body: { firstName?, lastName?, phoneNumber?, profileImage? }
PUT  /api/auth/change-password    # requires Bearer; body: { currentPassword, newPassword, confirmPassword }
POST /api/auth/verify-email       # body: { email, verificationCode }
POST /api/auth/resend-verification# body: { email }
```

### Password Reset Endpoints
```
POST /api/auth/forgot-password    # body: { email } (always 200 to avoid enumeration)
POST /api/auth/reset-password     # body: { token, newPassword, confirmPassword }
```

### Test & Diagnostics Endpoints
```
GET  /api/test/email-connection   # verify SMTP connectivity
POST /api/test/send-email         # send verification-style test email
POST /api/test/get-verification-code  # dev-only helper: returns current code for an email
POST /api/test/send-test-email    # generic HTML test email
```

### Health & Docs
```
GET  /health
GET  /api-docs
```

<!-- Note: Marketplace endpoints are planned; not implemented in this build. See Roadmap below. -->

## 🔧 Environment Variables (Backend)

Copy `backend/.env.example` to `backend/.env` and set these:
```env
# Server
NODE_ENV=development
PORT=3001

# Database (PostgreSQL)
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/postgres?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_EXPIRE_TIME="30m"
JWT_REFRESH_EXPIRE_TIME="7d"

# Bcrypt
# The code reads BCRYPT_SALT_ROUNDS (default: 12)
BCRYPT_SALT_ROUNDS=12

# Email (SMTP via Gmail App Password)
EMAIL_SERVICE="smtp"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
EMAIL_FROM_ADDRESS="your_gmail_or_workspace_address"
EMAIL_PASSWORD="your_gmail_app_password"
EMAIL_FROM_NAME="BaoAfrik Team"

# Frontend URL used inside email templates
FRONTEND_URL="http://localhost:3000"

# CORS
CORS_ORIGINS="http://localhost:3000,https://baoafrik.com"

# Logging
LOG_LEVEL="info"
LOG_FILE_PATH="logs/app.log"
```

## ▶️ Quick Start (Backend)
- **Install**: `cd backend && npm install`
- **Prisma**: `npm run db:generate` then `npm run db:migrate`
- **Run (dev)**: `npm run dev`
- **Verify**:
  - Health: `GET http://localhost:3001/health`
  - Docs: `http://localhost:3001/api-docs`
  - Auth routes base: `http://localhost:3001/api/auth`

## 🧪 Postman Collection & Environment
- Import collection: `backend/BaoAfrik-API.postman_collection.json`
- Import environment: `backend/BaoAfrik-Environment.postman_environment.json`
- Ensure `baseUrl` is `http://localhost:3001`.
- Login request stores `accessToken` and `refreshToken` into the environment for subsequent calls.

## ✉️ Email Configuration
- Use a Gmail account with 2FA enabled and generate a Gmail App Password.
- Set `EMAIL_FROM_ADDRESS` to the exact account that owns the app password (or a permitted alias).
- Use `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_SECURE=false`.
- Set `FRONTEND_URL` (used in email templates for links).
- Test with:
  - `GET  /api/test/email-connection`
  - `POST /api/test/send-email`  body: `{ "email": "you@example.com", "name": "You" }`
  - `POST /api/test/send-test-email` body: `{ "email": "you@example.com" }`

## ⚠️ Troubleshooting
- **Email fails (login or password reset)**
  - Check server logs for `SMTP connection verification failed` on startup.
  - Confirm `EMAIL_FROM_ADDRESS` matches the Gmail account for the App Password.
  - Ensure `FRONTEND_URL` is set so reset links are valid.
- **Bcrypt rounds env mismatch**
  - Code reads `BCRYPT_SALT_ROUNDS`. If `.env.example` shows `BCRYPT_ROUNDS`, prefer setting `BCRYPT_SALT_ROUNDS`.
- **429 Too many requests**
  - Rate limits: Auth limiter (5/15min), General limiter (100/15min). See `backend/src/routes/authRoutes.ts`.
- **CORS issues**
  - Update `CORS_ORIGINS` to include your frontend origin.

## 📈 Rate Limiting & CORS
- Global `/api/*` limiter configured in `backend/src/server.ts`.
- Per-route limiters in `backend/src/routes/authRoutes.ts`.
- CORS origins read from `CORS_ORIGINS`.

## 🗺️ Roadmap / Not Yet Implemented
- Social login endpoints.
- Profile image upload endpoint.
- Preferences endpoint.
- Marketplace domain (planned endpoints):
  - Products: list/create/read/update/delete, search, my-products, by-user
  - Categories, Locations
  - Messages: conversations, send, mark read
  - Bookmarks: list/add/remove
  - Requests: CRUD
  - Notifications: list, read, read-all

## 📝 Changelog (2025-09-29)
- Added forgot/reset password endpoints and wired to frontend.
- Implemented email service with SMTP (Nodemailer) and test routes.
- `PUT /api/auth/profile` now accepts `firstName` + `lastName` and supports `profileImage` as HTTP URL or data URL.
- Postman collection updated for auth and reset flows; environment stores tokens.

## 📂 Key Backend Files
- **Server**: `backend/src/server.ts`
- **Auth routes**: `backend/src/routes/authRoutes.ts`
- **Test routes**: `backend/src/routes/testRoutes.ts`
- **Email service**: `backend/src/utils/emailService.ts`
- **Controllers**: `backend/src/controllers/authController.ts`
- **Env template**: `backend/.env.example`
- **Postman**: `backend/BaoAfrik-API.postman_collection.json`, `backend/BaoAfrik-Environment.postman_environment.json`

## 📋 Backend Requirements Summary

### Database Models Needed
- Users (with profile data)
- Products/Listings
- Categories
- Locations
- Messages/Conversations
- Notifications
- Password Reset Tokens
- Email Verification Tokens

### Third-Party Services
- Email service (SendGrid, AWS SES, etc.)
- File storage (AWS S3, Cloudinary, etc.)
- Social login (Google, Facebook, GitHub)
- Real-time messaging (Socket.io, WebSockets)

## 🎯 Next Steps for Backend Integration

1. Set up backend API with required endpoints
2. Update frontend environment variables
3. Replace localStorage calls with API calls
4. Test authentication flow end-to-end
5. Test password reset flow end-to-end
6. Implement file upload endpoints
7. Add real-time messaging
8. Deploy and test in production

All frontend code is production-ready and follows React/TypeScript best practices with proper error handling, loading states, and mobile-responsive design.
