# BaoAfrik Backend Development Documentation

## Project Overview

BaoAfrik is an African marketplace platform that connects users to authentic African products and cultural experiences. This document provides comprehensive technical specifications for backend developers to build a compatible API that matches the current React TypeScript frontend.

## Tech Stack Requirements

### Frontend Stack (Current)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom African-inspired color palette
- **Routing**: React Router v6
- **State Management**: React Context API
- **Build Tool**: Create React App
- **PWA**: Progressive Web App capabilities

### Recommended Backend Stack
- **Runtime**: Node.js (v18+) or Python (Django/FastAPI)
- **Database**: PostgreSQL or MongoDB
- **Authentication**: JWT tokens + OAuth2 (Google, Facebook, GitHub)
- **File Storage**: AWS S3 or Cloudinary for images
- **Email Service**: SendGrid, AWS SES, or similar
- **Deployment**: Docker containers recommended

## Authentication System

### User Registration Flow

#### 1. Standard Registration (`POST /api/auth/register`)

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "phoneNumber": "string (required)",
  "password": "string (required, min 8 chars, letters + numbers)",
  "confirmPassword": "string (required, must match password)"
}
```

**Frontend Validation Rules:**
- Name: Required, non-empty string
- Email: Required, valid email format
- Phone: Required, non-empty string
- Password: Minimum 8 characters, must contain both letters and numbers
- Confirm Password: Must match password field

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "userId": "string",
    "email": "string",
    "requiresEmailVerification": true
  }
}
```

**Error Response (400/409):**
```json
{
  "success": false,
  "message": "string",
  "errors": {
    "email": "An account with this email already exists",
    "password": "Password must be at least 8 characters long",
    "general": "Server error occurred. Please try again later."
  }
}
```

#### 2. Email Verification (`POST /api/auth/verify-email`)

**Request Body:**
```json
{
  "email": "string",
  "verificationCode": "string (6-digit code)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "userId": "string",
    "accessToken": "string",
    "refreshToken": "string",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phoneNumber": "string",
      "profileImage": "string|null",
      "emailVerified": true,
      "createdAt": "ISO string"
    }
  }
}
```

#### 3. Social Authentication

**Google OAuth (`POST /api/auth/google`)**
**Facebook OAuth (`POST /api/auth/facebook`)**
**GitHub OAuth (`POST /api/auth/github`)**

**Request Body:**
```json
{
  "accessToken": "string (from OAuth provider)",
  "provider": "google|facebook|github"
}
```

**Success Response (200/201):**
```json
{
  "success": true,
  "isNewUser": false,
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "profileImage": "string",
      "provider": "google|facebook|github",
      "emailVerified": true,
      "createdAt": "ISO string"
    }
  }
}
```

### User Login Flow

#### 1. Standard Login (`POST /api/auth/login`)

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)",
  "rememberMe": "boolean (optional, default: false)"
}
```

**Frontend Validation:**
- Email: Required, valid format
- Password: Required, minimum 8 characters with letters and numbers

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phoneNumber": "string",
      "profileImage": "string|null",
      "emailVerified": "boolean",
      "lastLoginAt": "ISO string"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "errors": {
    "general": "Invalid email or password. Please check your credentials and try again."
  }
}
```

#### 2. Remember Me Functionality

When `rememberMe: true` is sent:
- Issue longer-lived refresh token (30 days instead of 7 days)
- Frontend stores email in localStorage with 30-day expiration
- Auto-populate email field on subsequent login attempts

### Authentication Context

The frontend uses React Context for authentication state management:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  provider?: string;
}

interface AuthContextType {
  user: User | null;
  isVisitor: boolean;
  login: (user: User) => void;
  logout: () => void;
  setVisitorMode: (isVisitor: boolean) => void;
  updateUserProfile: (profileData: Partial<User>) => void;
}
```

### Visitor Mode

The frontend supports visitor access without authentication:
- Users can browse products without signing up
- No API authentication required for public endpoints
- Visitor state managed in frontend context

## API Endpoints Structure

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/facebook` - Facebook OAuth
- `POST /api/auth/github` - GitHub OAuth

### Product Endpoints
- `GET /api/products` - List products with filters
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (authenticated sellers)
- `PUT /api/products/:id` - Update product (authenticated sellers)
- `DELETE /api/products/:id` - Delete product (authenticated sellers)

### User Profile Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/profile/image` - Upload profile image

### Marketplace Features
- `POST /api/products/:id/like` - Like/unlike product
- `POST /api/products/:id/save` - Save/unsave product
- `GET /api/users/liked` - Get user's liked products
- `GET /api/users/saved` - Get user's saved products
- `POST /api/contact/seller` - Contact seller

## Product Data Structure

### Product Model
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "currency": "string (default: USD)",
  "category": "string",
  "subcategory": "string",
  "location": "string",
  "country": "string",
  "images": ["string[]"],
  "seller": {
    "id": "string",
    "name": "string",
    "avatar": "string",
    "verified": "boolean",
    "rating": "number",
    "totalSales": "number"
  },
  "specifications": {
    "origin": "string",
    "processingMethod": "string",
    "shelfLife": "string",
    "storage": "string",
    "packageWeight": "string",
    "organic": "boolean"
  },
  "availability": "boolean",
  "stock": "number",
  "tags": ["string[]"],
  "createdAt": "ISO string",
  "updatedAt": "ISO string",
  "publishedAt": "ISO string"
}
```

### Categories
The frontend expects these main categories:
- **Food & Spices**: Traditional African spices, ingredients, and food products
- **Fashion & Textiles**: Traditional clothing, fabrics, accessories
- **Beauty & Wellness**: Natural beauty products, traditional remedies
- **Arts & Crafts**: Handmade items, traditional artwork
- **Home & Decor**: Traditional home decoration items

## Frontend Component Integration

### Header Component
The Header component expects these props:
```typescript
interface HeaderProps {
  showSearchBar?: boolean;
  isProductDetailPage?: boolean;
}
```

### Product Detail Page
The ProductDetail page expects a product object with:
- Basic product information (name, price, description, location)
- Image gallery with multiple images
- Seller profile with verification status
- Additional product specifications
- Related products from same seller
- Recommended articles/products

### Search and Filtering
The frontend implements:
- Text search across product names and descriptions
- Category filtering
- Location/country filtering
- Price range filtering
- Seller verification filtering

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "string",
  "errors": {
    "field": "string",
    "general": "string"
  },
  "code": "string (optional error code)"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate email, etc.)
- `422` - Unprocessable Entity
- `500` - Internal Server Error

## Security Requirements

### Password Security
- Minimum 8 characters
- Must contain letters and numbers
- Hash using bcrypt or similar
- Implement rate limiting on login attempts

### JWT Token Management
- Access tokens: Short-lived (15-30 minutes)
- Refresh tokens: Longer-lived (7-30 days based on remember me)
- Include user ID and basic info in token payload
- Implement token blacklisting for logout

### API Security
- CORS configuration for frontend domain
- Rate limiting on all endpoints
- Input validation and sanitization
- SQL injection prevention
- XSS protection headers

## File Upload Requirements

### Profile Images
- Maximum size: 5MB
- Supported formats: JPEG, PNG, WebP
- Automatic resizing to 300x300px
- Generate multiple sizes (thumbnail, medium, large)

### Product Images
- Maximum size: 10MB per image
- Maximum 10 images per product
- Supported formats: JPEG, PNG, WebP
- Automatic optimization and multiple sizes

## Email Templates

### Verification Email
- Subject: "Verify your BaoAfrik account"
- Include 6-digit verification code
- Code expires in 10 minutes
- Resend functionality available

### Password Reset
- Subject: "Reset your BaoAfrik password"
- Include secure reset link
- Link expires in 1 hour
- One-time use only

## Database Schema Considerations

### Users Table
```sql
users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(50),
  password_hash VARCHAR(255),
  profile_image VARCHAR(500),
  email_verified BOOLEAN DEFAULT FALSE,
  provider VARCHAR(50), -- 'local', 'google', 'facebook', 'github'
  provider_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);
```

### Products Table
```sql
products (
  id UUID PRIMARY KEY,
  seller_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  location VARCHAR(255),
  country VARCHAR(100),
  images JSONB, -- Array of image URLs
  specifications JSONB,
  availability BOOLEAN DEFAULT TRUE,
  stock INTEGER DEFAULT 0,
  tags JSONB, -- Array of tags
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);
```

### User Interactions Tables
```sql
product_likes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

product_saves (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
```

## Testing Requirements

### Authentication Testing
- Test all registration validation rules
- Test email verification flow
- Test social login integration
- Test password reset functionality
- Test token refresh mechanism

### API Testing
- Unit tests for all endpoints
- Integration tests for user flows
- Load testing for high traffic scenarios
- Security testing for common vulnerabilities

## Deployment Considerations

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE_TIME=30m
JWT_REFRESH_EXPIRE_TIME=7d

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Email
EMAIL_SERVICE_API_KEY=...
EMAIL_FROM_ADDRESS=noreply@baoafrik.com

# File Storage
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
AWS_REGION=...

# Frontend
FRONTEND_URL=https://baoafrik.com
CORS_ORIGINS=https://baoafrik.com,http://localhost:3000
```

### Docker Configuration
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## API Response Examples

### Product List Response
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod-123",
        "name": "Premium Cameroon Pepper",
        "description": "Authentic Cameroon pepper...",
        "price": 15.99,
        "currency": "USD",
        "category": "Food & Spices",
        "location": "London | United Kingdom",
        "country": "Cameroon",
        "images": [
          "https://example.com/image1.jpg",
          "https://example.com/image2.jpg"
        ],
        "seller": {
          "id": "seller-456",
          "name": "Ngozi Mbeki",
          "avatar": "https://example.com/avatar.jpg",
          "verified": true,
          "rating": 4.8
        },
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    },
    "filters": {
      "categories": ["Food & Spices", "Fashion & Textiles"],
      "countries": ["Cameroon", "Nigeria", "Ghana"],
      "priceRange": {
        "min": 5.99,
        "max": 299.99
      }
    }
  }
}
```

This documentation provides a comprehensive foundation for backend development that will seamlessly integrate with the existing BaoAfrik frontend. The backend should implement all specified endpoints with proper authentication, validation, and error handling to ensure a smooth user experience.
