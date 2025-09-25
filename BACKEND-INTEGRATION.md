# BaoAfrik Backend Integration Guide

## 🚀 System Overview

The BaoAfrik frontend is fully prepared for backend integration with:
- Complete API service layer
- JWT authentication system
- Real-time notification capabilities
- File upload support
- Comprehensive error handling
- Mobile-optimized responsive design

## 📋 Database Models

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_image_url TEXT,
    gender VARCHAR(10),
    birth_date DATE,
    location VARCHAR(255),
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    location VARCHAR(255) NOT NULL,
    origin_country VARCHAR(100),
    condition VARCHAR(50) DEFAULT 'new',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bookmarks Table
```sql
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);
```

## 🔌 API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/verify-email
- POST /api/auth/forgot-password
- POST /api/auth/reset-password
- POST /api/auth/refresh-token
- POST /api/auth/logout

### Products
- GET /api/products (with search, filter, pagination)
- GET /api/products/:id
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id
- POST /api/products/:id/images

### Bookmarks
- GET /api/bookmarks
- POST /api/bookmarks
- DELETE /api/bookmarks/:productId

### Notifications
- GET /api/notifications
- PUT /api/notifications/:id/read
- DELETE /api/notifications/:id

## 🔧 Environment Configuration

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_WS_URL=ws://localhost:8000/ws
```

### Backend Environment
```env
DATABASE_URL=postgresql://username:password@localhost:5432/baoafrik
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
AWS_BUCKET_NAME=baoafrik-uploads
```

## 🚀 Key Features Ready for Integration

### 1. Authentication System
- Complete user registration and login flow
- Email verification with 6-digit codes
- Password reset functionality
- JWT token management with refresh tokens
- Social login integration points

### 2. Product Management
- Product CRUD operations
- Image upload and management
- Search and filtering capabilities
- Category and country-based filtering
- Mobile-optimized product cards

### 3. Bookmark System
- Real-time bookmarking with notifications
- Success and error state handling
- Auto-dismiss notifications after 5 seconds
- Mobile-optimized popup sizing

### 4. User Interface
- Mobile-first responsive design
- Professional flag icons for language selection
- Consistent product card layouts
- Real-time notification system
- Touch-optimized interactions

### 5. Search & Filtering
- Advanced search with multiple criteria
- Country-based product filtering
- Category navigation with visual indicators
- Mobile-optimized filter controls

## 📱 Mobile Optimization

The system is fully optimized for mobile devices with:
- Transparent search backgrounds on mobile
- Rectangular filter buttons with light gray backgrounds
- Optimized product card sizing
- Touch-friendly interactions
- Responsive layouts across all screen sizes

## 🔄 Integration Checklist

### Phase 1: Authentication
- [ ] User registration endpoint
- [ ] Email verification system
- [ ] Login/logout functionality
- [ ] Password reset flow
- [ ] JWT token management

### Phase 2: Product Management
- [ ] Product CRUD operations
- [ ] Image upload and management
- [ ] Search and filtering
- [ ] Category management

### Phase 3: Advanced Features
- [ ] Bookmark system
- [ ] Real-time notifications
- [ ] Messaging system
- [ ] Seller profiles

The frontend is fully prepared and ready for immediate backend integration!
