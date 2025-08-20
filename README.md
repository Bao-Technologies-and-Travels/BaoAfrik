# BaoAfrik - Authentic African Marketplace

## Project Overview

BaoAfrik is a mobile-first peer-to-peer (P2P) marketplace designed to connect the African diaspora and culturally curious buyers with authentic African products. Our platform emphasizes cultural identity, product origin storytelling, and emergency/discount-driven sales.

### Vision
- Connect African diaspora with authentic goods from across Africa
- Enable direct seller-buyer communication without payment/logistics handling (MVP)
- Celebrate African culture through product origin stories and visual identity

### Core Features (MVP)
- **User Authentication**: Signup, login, password reset, profile management
- **Product Listings**: Create, edit, delete listings with images, categories, and urgency tags
- **Discovery & Search**: Browse feed, search filters, location-aware recommendations
- **Direct Messaging**: In-app chat between buyers and sellers
- **Trust & Safety**: Ratings, reviews, trusted seller badges, reporting system
- **Monetization**: Free listings (3 months) → £1 per listing + boosted listings
- **Localization**: English and French language support
- **Cultural Identity**: Country flags, product origin display, seller location

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

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── ui/
│   ├── forms/
│   └── features/
├── pages/
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── Home.tsx
│   ├── Profile.tsx
│   ├── Listings.tsx
│   ├── CreateListing.tsx
│   └── Messages.tsx
├── hooks/
├── services/
├── utils/
├── types/
└── contexts/
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BaoAfrik
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Tailwind CSS**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   ```

4. **Start development server**
   ```bash
   npm start
   ```

The application will open at `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Design Guidelines

### Color Palette
- **Primary**: Orange tones (#f37a0a) - Representing African sunset/warmth
- **Secondary**: Green tones (#22c55e) - Representing African nature/growth
- **Accent**: Red tones (#ef4444) - For urgency and important actions

### Components
- Mobile-first responsive design
- Consistent spacing using Tailwind's scale
- Accessible color contrasts
- Clear visual hierarchy

##  Feature Requirements

### Phase 1 (MVP)
- [x] Project setup with React + Tailwind
- [ ] User authentication system
- [ ] Product listing management
- [ ] Search and discovery features
- [ ] In-app messaging
- [ ] Trust and safety features
- [ ] Basic monetization (listing fees)
- [ ] Multi-language support (EN/FR)

### Phase 2 (Future)
- [ ] Hero banner ads
- [ ] Promoted seller accounts
- [ ] Sponsored search placement
- [ ] Buyer urgent requests
- [ ] Payment integration
- [ ] Logistics integration
- [ ] AI-based recommendations
- [ ] Additional languages (Swahili, Hausa, Arabic)

## Target Users

1. **Diaspora Buyers**: Africans abroad seeking authentic goods
2. **Local Sellers**: Africans selling products (urgent cash needs, side hustle)
3. **Cultural Enthusiasts**: Non-Africans interested in African culture

##  Revenue Model

- **Free Period**: All listings free for first 3 months
- **Listing Fees**: £1 per listing after free period (first listing always free for new users)
- **Boosted Listings**: Paid promotion for top placement
- **Seller Subscriptions**: Monthly packages with higher limits and discounted boosts

##  Security & Performance

- JWT authentication
- Data encryption
- Rate limiting
- Load time <3s on mobile
- 99% availability target
- Scalable to 100k+ concurrent users

##  Internationalization

- English (default)
- French
- Country flags and maps for product origin
- Seller location hierarchy (country → region → city)

##  Contributing

This is the frontend repository for BaoAfrik. Please follow the established coding standards and component patterns when contributing.




