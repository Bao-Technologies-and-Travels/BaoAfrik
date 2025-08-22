# BaoAfrik - African Marketplace

BaoAfrik is a marketplace connecting the African diaspora with authentic African products. The platform focuses on cultural identity and allows direct communication between buyers and sellers.

## What We're Building

A mobile-first P2P marketplace where:
- African diaspora can find authentic goods from home
- Sellers can list products with cultural context and origin stories
- Direct buyer-seller communication (no payment processing in MVP)
- Cultural identity is celebrated through visual design and product storytelling

## Current Implementation Status

### Authentication System (Complete)
The user authentication flow is fully implemented:

**Sign Up Process**
- Form with name, email, phone, password fields
- Real-time validation and error handling
- Social login options (Google, Facebook, GitHub)
- Triggers email verification automatically

**Email Verification**
- 6-digit code sent to user's email
- Interactive code input with auto-focus
- Resend functionality with 60-second cooldown
- Redirects to sign-in after successful verification

**Sign In**
- Email/password form with "remember me" option
- Social login integration
- Success messages from verification flow
- Responsive design with BaoAfrik branding

### Product Detail Page (Complete)
Built a comprehensive product detail page featuring:

**Image Gallery**
- Main product image display
- Vertical thumbnail navigation (4 images total)
- Click to switch between product views
- Uses authentic African product images

**Product Information**
- Product name, price, location
- Seller profile with Cameroonian name and avatar
- Verified seller badge
- Product description

**Interactive Features**
- Like/wishlist buttons with state management
- Unique product IDs for each item
- Carousel navigation for browsing related products
- Two product sections: "Other seller products" and "Recommended articles"

**Product Showcase**
Eight authentic African products displayed:
- African textiles (colorful fabrics)
- Fresh tomatoes
- Dried shrimp
- Ndolè leaves
- Handwoven basket
- Wooden combs
- White beans
- Cassava flour

### Design & Branding
- Custom BaoAfrik logos integrated
- Orange/yellow color scheme reflecting African warmth
- Mobile-first responsive design
- Consistent typography (Poppins, Inter fonts)
- 30+ authentic product images in assets folder

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** for form management
- **Axios** for API calls
- **React Query** for state management

### Design System
- **Mobile-first** responsive design
- **PWA** capabilities
- **Custom color palette** with African-inspired themes
- **Inter & Poppins** fonts for modern typography
- **Authentic BaoAfrik branding** with custom logo integration

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
├── components/layout/
│   ├── Header.tsx
│   └── Footer.tsx
├── pages/
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── EmailVerification.tsx
│   ├── Home.tsx
│   ├── ProductDetail.tsx
│   └── [other pages]
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

2. Start development:
   ```bash
   npm start
   ```

Opens at `http://localhost:3000`

### Available Scripts
- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests

## What's Next

### Immediate Priorities
- Product listing creation form
- Home page with featured products
- User profile management
- Search and filtering functionality

### Future Features
- Direct messaging between users
- Rating and review system
- Payment integration
- Multi-language support (French)

## Technical Details

### Architecture
- React 18 with TypeScript for type safety
- Tailwind CSS for consistent styling
- React Router for client-side routing
- Context API for authentication state
- Local state management for UI interactions

### Key Implementation Notes
- Mobile-first responsive design approach
- Component-based architecture with reusable UI elements
- Form validation using React Hook Form patterns
- Image assets organized in logos folder with clear naming
- Authentication flow uses React Context for state persistence

## Development Approach

### Code Organization
- Pages in `/src/pages/` for main routes
- Shared components in `/src/components/`
- Authentication logic in `/src/contexts/AuthContext.tsx`
- Type definitions in `/src/types/`
- Assets organized by category in `/src/assets/`

### Styling Strategy
- Tailwind utility classes for consistent spacing and colors
- Custom color palette: orange (#f37a0a), green (#22c55e), red (#ef4444)
- Responsive breakpoints for mobile, tablet, desktop
- Typography using Inter and Poppins fonts

### Current Limitations
- No backend integration yet (using mock data)
- Authentication state not persisted across sessions
- Image uploads not implemented
- Search functionality placeholder only

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




