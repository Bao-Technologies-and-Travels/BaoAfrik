# BaoAfrik Backend API

A comprehensive Node.js backend for the BaoAfrik marketplace platform, built with Express.js and Supabase.

## 🚀 Features

- **Authentication**: JWT-based authentication with OAuth2 providers (Google, Facebook, GitHub)
- **Database**: PostgreSQL with Supabase, including Row Level Security (RLS)
- **File Storage**: Supabase Storage for product images and user avatars
- **API Routes**: RESTful API for products, categories, and user management
- **Logging**: Comprehensive logging with Winston
- **Security**: Helmet, CORS, rate limiting, and input validation
- **TypeScript**: Full TypeScript support for type safety

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
5. Update the `.env` file with your Supabase credentials and other configurations.

## Development

To start the development server:

```bash
npm run dev
```

The server will be available at `http://localhost:3000` by default.

## Building for Production

To build the application:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Testing

To run tests:

```bash
npm test
```

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic and database operations
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── tests/          # Test files
│   └── index.ts        # Application entry point
├── .env.example       # Example environment variables
├── package.json       # Project dependencies and scripts
└── tsconfig.json      # TypeScript configuration
```

## Environment Variables

- `PORT` - Port to run the server on (default: 3000)
- `NODE_ENV` - Environment (development, production, test)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for admin operations)
- `JWT_SECRET` - Secret key for JWT token signing
- `CORS_ORIGIN` - Allowed CORS origins (comma-separated)

## API Documentation

API documentation is available at `/api-docs` when running in development mode.

## License

[MIT](LICENSE)
