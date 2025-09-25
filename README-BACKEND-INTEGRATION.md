# BaoAfrik Backend Integration Guide

## 📋 Overview
This document outlines the backend integration requirements for the BaoAfrik marketplace frontend. All necessary API services, types, and utilities have been prepared for seamless backend integration.

## 🏗️ Backend-Ready Architecture

### API Services Layer
- **`/src/services/api.ts`** - Core HTTP client with authentication
- **`/src/services/authService.ts`** - Authentication endpoints
- **`/src/services/passwordResetService.ts`** - Password reset flow
- **`/src/services/marketplaceService.ts`** - Marketplace features
- **`/src/services/index.ts`** - Service exports

### Utilities & Configuration
- **`/src/utils/apiConfig.ts`** - API configuration and endpoints
- **`/src/utils/errorHandler.ts`** - Error handling utilities
- **`/src/utils/tokenManager.ts`** - JWT token management
- **`/src/hooks/useApi.ts`** - React hooks for API calls

## 🔌 Required Backend Endpoints

### Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
PUT  /api/auth/profile
POST /api/auth/profile/image
PUT  /api/auth/preferences
PUT  /api/auth/change-password
POST /api/auth/verify-email
POST /api/auth/resend-verification
POST /api/auth/social-login
```

### Password Reset Endpoints
```
POST /api/auth/forgot-password
POST /api/auth/verify-reset-code
POST /api/auth/reset-password
POST /api/auth/resend-reset-code
```

### Marketplace Endpoints
```
GET  /api/products
POST /api/products
GET  /api/products/:id
PUT  /api/products/:id
DELETE /api/products/:id
POST /api/products/search
GET  /api/products/my-products
GET  /api/products/user/:userId

GET  /api/categories
GET  /api/locations

GET  /api/messages/conversations
GET  /api/messages/conversations/:id
POST /api/messages/send
PUT  /api/messages/:id/read
PUT  /api/messages/conversations/:id/read

GET  /api/bookmarks
POST /api/bookmarks
DELETE /api/bookmarks/:productId

POST /api/requests
GET  /api/requests
GET  /api/requests/:id
PUT  /api/requests/:id
DELETE /api/requests/:id

GET  /api/notifications
PUT  /api/notifications/:id/read
PUT  /api/notifications/read-all
```

## 🔧 Environment Variables Required

Create a `.env` file with:
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_WS_URL=ws://localhost:8000/ws
```

## 📱 Pages Ready for Backend Integration

### Authentication Flow
- **Login** (`/src/pages/auth/Login.tsx`)
- **Register** (`/src/pages/auth/Register.tsx`)
- **EmailVerification** (`/src/pages/auth/EmailVerification.tsx`)
- **ProfileSetup** (`/src/pages/auth/ProfileSetup.tsx`)
- **UserPreferences** (`/src/pages/auth/UserPreferences.tsx`)

### Password Reset Flow
- **ForgotPassword** (`/src/pages/auth/ForgotPassword.tsx`)
- **ResetPasswordSent** (`/src/pages/auth/ResetPasswordSent.tsx`)
- **ResetPassword** (`/src/pages/auth/ResetPassword.tsx`)
- **PasswordResetSuccess** (`/src/pages/auth/PasswordResetSuccess.tsx`)

### Marketplace Pages
- **Home** (`/src/pages/Home.tsx`)
- **Listings** (`/src/pages/Listings.tsx`)
- **CreateListing** (`/src/pages/CreateListing.tsx`)
- **ProductDetail** (`/src/pages/ProductDetail.tsx`)
- **Profile** (`/src/pages/Profile.tsx`)
- **Messages** (`/src/pages/Messages.tsx`)

## 🔄 Integration Steps

### 1. Update Environment Variables
```bash
# Add to .env file
REACT_APP_API_URL=https://your-backend-url.com/api
```

### 2. Replace Mock Data Calls
All pages currently use localStorage for demo purposes. Replace with API calls:

```typescript
// Before (mock)
const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

// After (API)
import { authService } from '../services';
const response = await authService.login({ email, password });
```

### 3. Update AuthContext
The AuthContext (`/src/contexts/AuthContext.tsx`) needs to be updated to use real API calls instead of localStorage.

### 4. Error Handling
All error handling is already implemented using the ErrorHandler utility. Backend errors will be automatically formatted for user display.

### 5. File Uploads
File upload functionality is ready for profile images and product images using FormData.

## 🚀 Features Ready for Backend

### ✅ Completed & Backend-Ready
- User registration and login
- Email verification flow
- Password reset flow (4 pages)
- Profile setup and management
- Custom loading spinners across all forms
- Mobile-responsive design
- Error handling and validation
- File upload preparation
- JWT token management
- API service layer

### 🔄 Requires Backend Implementation
- Real-time messaging
- Product search and filtering
- Image upload and storage
- Email sending service
- Push notifications
- Payment processing (future)

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
