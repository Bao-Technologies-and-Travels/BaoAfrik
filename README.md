# BaoAfrik - African Marketplace

BaoAfrik is a marketplace connecting the African diaspora with authentic African products. The platform focuses on cultural identity and allows direct communication between buyers and sellers.

## What We're Building

A mobile-first P2P marketplace where:
- African diaspora can find authentic goods from home
- Sellers can list products with cultural context and origin stories
- Direct buyer-seller communication (no payment processing in MVP)
- Cultural identity is celebrated through visual design and product storytelling

## 🚀 Current Implementation Status

### 🔐 Complete Authentication System
The user authentication flow is fully implemented with backend-ready API integration:

**Sign Up Process**
- Form with name, email, phone, password fields
- Real-time validation and error handling
- Social login options (Google, Facebook, GitHub)
- Triggers email verification automatically
- Custom orange loading spinner

**Email Verification**
- 6-digit code sent to user's email
- Interactive code input with auto-focus
- Resend functionality with 60-second cooldown
- Custom loading states and error handling
- Redirects to profile setup after verification

**Sign In**
- Email/password form with "remember me" option
- Social login integration
- Success messages from verification flow
- Responsive design with BaoAfrik branding
- Custom loading spinner

**Profile Setup & Preferences**
- Complete user profile creation with image upload
- Location, bio, and contact information
- User preferences for notifications and privacy
- Mobile-responsive design with custom spinners

### 🔑 Password Reset Flow (Complete)
Complete 4-page password reset system:

**Forgot Password**
- Email input with validation against registered users
- Error handling with sign-up prompts for unregistered emails
- Custom loading spinner and mobile-optimized design

**Reset Code Verification**
- 6-digit verification code input with auto-focus
- Masked email display for privacy
- Resend code functionality with countdown timer
- Custom loading states

**New Password Setup**
- Password and confirm password inputs with show/hide toggles
- Real-time validation (minimum 8 characters, letters and numbers)
- Custom loading spinner on form submission

**Success Confirmation**
- Success page with green checkmark icon
- "Back to sign in" navigation button
- Mobile-optimized footer handling

### 📱 Product Detail Page (Complete)
Built a comprehensive product detail page featuring:

**Mobile-First Design**
- Full-screen image gallery (320px height) with overlay controls
- Hidden navbar and search bar on mobile devices
- Back arrow button (top-left) navigating to home page
- Three action buttons (top-right): Share, Save/Bookmark, More options
- Swipeable image carousel with navigation arrows and dots indicator

**Desktop Layout**
- Traditional desktop layout with vertical thumbnails and main image
- Search bar and breadcrumb navigation visible
- Side-by-side product info layout
- All existing functionality preserved

**Product Information**
- Product name, price, location
- Seller profile with Cameroonian name and avatar
- Verified seller badge
- Product description
- Contact seller button with chat icon

**Interactive Features**
- Like/wishlist buttons with state management
- Unique product IDs for each item
- Carousel navigation for browsing related products
- Two product sections: "Other seller products" and "Recommended articles"

**Product Showcase**
Eight authentic African products displayed:
- African textiles (colorful fabrics)
- Fresh tomatoes, dried shrimp, Ndolè leaves
- Handwoven basket, wooden combs
- White beans, cassava flour

### 🎨 Design & UI Components
- **Custom LoadingSpinner** component with orange theming and multiple sizes
- **Mobile-responsive design** with proper touch interactions
- **Custom BaoAfrik logos** integrated throughout
- **Orange/yellow color scheme** reflecting African warmth
- **Consistent typography** (Poppins, Inter fonts)
- **30+ authentic product images** in assets folder
- **Footer visibility control** (hidden on mobile for auth pages)

### 🔌 Backend Integration (Complete)
**API Service Layer:**
- **Complete HTTP client** with authentication and error handling (`api.ts`)
- **Authentication service** with 11 endpoints (`authService.ts`)
- **Password reset service** with 4 endpoints (`passwordResetService.ts`)
- **Marketplace service** with 20+ endpoints (`marketplaceService.ts`)
- **Error handling utilities** with user-friendly messages (`errorHandler.ts`)
- **JWT token management** with auto-refresh (`tokenManager.ts`)
- **React hooks** for API calls with loading states (`useApi.ts`)

**Backend-Ready Features:**
- All authentication flows ready for API integration
- File upload support for profile and product images
- Real-time messaging preparation (WebSocket ready)
- Comprehensive error handling for all API scenarios
- Environment variable configuration for easy deployment

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Custom API service layer** for backend integration
- **JWT authentication** with token management
- **File upload capabilities** with FormData support

### Backend Integration
- **35+ API endpoints** specified and ready
- **RESTful API architecture** with proper HTTP methods
- **JWT token-based authentication** with refresh tokens
- **WebSocket support** for real-time messaging
- **Environment-based configuration** for different deployments

### Design System
- **Mobile-first** responsive design
- **PWA** capabilities
- **Custom color palette** with African-inspired themes
- **Inter & Poppins** fonts for modern typography
- **Authentic BaoAfrik branding** with custom logo integration
- **Custom loading spinners** with brand colors

## Project Structure

```
src/
├── assets/images/logos/
│   ├── ba-brand-icon-colored.png
│   ├── ba-Primary-brand-logo-colored.png
│   ├── avatar.png
│   ├── 0.png, 1.png, 2.png, 3.png
│   ├── Fashion.png, culture.png, decor.png
│   └── Frame 29 (1-17).png
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── ui/
│       └── LoadingSpinner.tsx
├── pages/
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── EmailVerification.tsx
│   │   ├── EmailVerificationSuccess.tsx
│   │   ├── ProfileSetup.tsx
│   │   ├── UserPreferences.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── ResetPasswordSent.tsx
│   │   ├── ResetPassword.tsx
│   │   └── PasswordResetSuccess.tsx
│   ├── Home.tsx
│   ├── ProductDetail.tsx
│   ├── Listings.tsx
│   ├── CreateListing.tsx
│   ├── Profile.tsx
│   └── Messages.tsx
├── services/
│   ├── api.ts
│   ├── authService.ts
│   ├── passwordResetService.ts
│   ├── marketplaceService.ts
│   └── index.ts
├── hooks/
│   └── useApi.ts
├── utils/
│   ├── apiConfig.ts
│   ├── errorHandler.ts
│   └── tokenManager.ts
├── contexts/
│   └── AuthContext.tsx
└── types/
    └── images.d.ts
```

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. Clone and install:
   ```bash
   git clone <repository-url>
   cd BaoAfrik
   npm install
   ```

2. Create environment file:
   ```bash
   # Create .env file with:
   REACT_APP_API_URL=http://localhost:8000/api
   REACT_APP_WS_URL=ws://localhost:8000/ws
   ```

3. Start development:
   ```bash
   npm start
   ```

Opens at `http://localhost:3000`

### Available Scripts
- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests

## 🎯 Backend Integration Status

### ✅ Ready for Backend
- **All authentication flows** (login, register, email verification, profile setup)
- **Complete password reset flow** (4 pages)
- **API service layer** with 35+ endpoints specified
- **Error handling** with user-friendly messages
- **JWT token management** with auto-refresh
- **File upload support** for images
- **Mobile-responsive design** across all pages

### 📋 Backend Requirements
See `README-BACKEND-INTEGRATION.md` for complete integration guide including:
- Database models needed
- API endpoint specifications
- Environment variable setup
- Third-party service requirements

## Technical Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for consistent styling
- **React Router** for client-side routing
- **Custom API service layer** for backend communication
- **JWT authentication** with automatic token refresh
- **Component-based architecture** with reusable UI elements

### Backend-Ready Features
- **Authentication system** ready for real API integration
- **File upload capabilities** using FormData
- **Real-time messaging preparation** with WebSocket support
- **Comprehensive error handling** for all API scenarios
- **Environment-based configuration** for different deployments

### Code Organization
- **Pages** in `/src/pages/` organized by feature
- **API services** in `/src/services/` for backend communication
- **Reusable components** in `/src/components/`
- **Custom hooks** in `/src/hooks/` for API calls
- **Utilities** in `/src/utils/` for configuration and error handling
- **Type definitions** in `/src/types/`

### Styling Strategy
- **Mobile-first responsive design** with Tailwind CSS
- **Custom color palette**: orange (#f37a0a), green (#22c55e), red (#ef4444)
- **Custom loading spinners** with brand colors
- **Consistent typography** using Inter and Poppins fonts
- **Touch-friendly interactions** for mobile devices

### Production-Ready Features
- **TypeScript strict mode** for type safety
- **Custom loading states** across all forms
- **Comprehensive error handling** with user feedback
- **Mobile-optimized UI** with proper touch interactions
- **SEO-friendly routing** with React Router
- **PWA capabilities** for mobile app-like experience

## Contributing

Standard React/TypeScript development practices:

1. Fork the repository
2. Create feature branch
3. Follow existing code patterns
4. Test on mobile and desktop
5. Submit pull request

### Code Style
- TypeScript strict mode enabled
- Functional components with hooks
- Consistent naming conventions
- Clear component props interfaces




