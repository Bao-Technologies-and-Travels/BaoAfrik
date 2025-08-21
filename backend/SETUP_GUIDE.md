# BaoAfrik Supabase Setup Guide

## ✅ Completed Setup

1. **Supabase Client Configuration** - Created `src/lib/supabase.ts`
2. **Authentication Services** - Created `src/services/auth.ts`
3. **Listings Services** - Created `src/services/listings.ts`
4. **Updated AuthContext** - Integrated with Supabase Auth
5. **Updated Auth Pages** - Login and Register now use Supabase

## 🔧 Required Steps to Complete Setup

### 1. Install Supabase Package
```bash
npm install @supabase/supabase-js
```

### 2. Create Environment File
Create a `.env` file in the project root with your Supabase credentials:
```env
# Copy from .env.example and add your Supabase URL
REACT_APP_SUPABASE_URL=https://cpawllmragsirhdutyc.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Set Up Database Schema
Run these SQL commands in your Supabase SQL Editor:

#### Create Tables
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  avatar_url TEXT,
  bio TEXT,
  location_country TEXT,
  location_region TEXT,
  location_city TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_badge_type TEXT DEFAULT 'none' CHECK (verification_badge_type IN ('none', 'trusted_seller', 'premium')),
  total_listings INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'fr')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_url TEXT,
  parent_id UUID REFERENCES categories(id),
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create countries table
CREATE TABLE countries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  flag_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create listings table
CREATE TABLE listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'GBP',
  category_id UUID REFERENCES categories(id) NOT NULL,
  origin_country_id UUID REFERENCES countries(id) NOT NULL,
  seller_location_country TEXT NOT NULL,
  seller_location_region TEXT,
  seller_location_city TEXT,
  condition TEXT CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor')),
  quantity INTEGER DEFAULT 1,
  is_urgent BOOLEAN DEFAULT FALSE,
  urgency_reason TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'sold', 'expired', 'removed')),
  views_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  is_boosted BOOLEAN DEFAULT FALSE,
  boost_expires_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '90 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create listing_images table
CREATE TABLE listing_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversations table
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) NOT NULL,
  buyer_id UUID REFERENCES profiles(id) NOT NULL,
  seller_id UUID REFERENCES profiles(id) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'blocked')),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(listing_id, buyer_id, seller_id)
);

-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'offer', 'system')),
  offer_amount DECIMAL(10,2),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Create user_subscriptions table
CREATE TABLE user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  subscription_type TEXT DEFAULT 'free' CHECK (subscription_type IN ('free', 'basic', 'premium')),
  free_period_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '3 months'),
  subscription_starts_at TIMESTAMP WITH TIME ZONE,
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Enable Row Level Security
```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Listings policies
CREATE POLICY "Active listings are viewable by everyone" ON listings FOR SELECT USING (status = 'active');
CREATE POLICY "Users can view own listings" ON listings FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Users can insert own listings" ON listings FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can update own listings" ON listings FOR UPDATE USING (auth.uid() = seller_id);

-- Messages policies
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (conversations.buyer_id = auth.uid() OR conversations.seller_id = auth.uid())
  )
);
```

#### Create Storage Buckets
```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies
CREATE POLICY "Anyone can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Users can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
```

### 4. Configure Authentication
In your Supabase Dashboard:

1. **Go to Authentication > Settings**
2. **Enable Email Confirmations**
3. **Configure Social Providers** (Google, Facebook, GitHub)
4. **Set Site URL**: `http://localhost:3000`
5. **Set Redirect URLs**: `http://localhost:3000/auth/callback`

### 5. Seed Initial Data
```sql
-- Insert categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Food & Spices', 'food-spices', 'Authentic African foods and spices', 1),
('Fashion & Textiles', 'fashion-textiles', 'Traditional and modern African fashion', 2),
('Beauty & Wellness', 'beauty-wellness', 'African beauty products and wellness items', 3),
('Home & Decor', 'home-decor', 'African home decorations and crafts', 4),
('Books & Media', 'books-media', 'African literature and cultural media', 5);

-- Insert countries
INSERT INTO countries (name, code, flag_url) VALUES
('Nigeria', 'NG', 'https://flagcdn.com/ng.svg'),
('Ghana', 'GH', 'https://flagcdn.com/gh.svg'),
('Kenya', 'KE', 'https://flagcdn.com/ke.svg'),
('South Africa', 'ZA', 'https://flagcdn.com/za.svg'),
('Cameroon', 'CM', 'https://flagcdn.com/cm.svg'),
('Senegal', 'SN', 'https://flagcdn.com/sn.svg'),
('Ethiopia', 'ET', 'https://flagcdn.com/et.svg'),
('Morocco', 'MA', 'https://flagcdn.com/ma.svg');
```

## 🚀 Testing the Setup

1. **Start the development server**:
   ```bash
   npm start
   ```

2. **Test Registration**:
   - Go to `/register`
   - Create a new account
   - Check your email for verification

3. **Test Login**:
   - Go to `/login`
   - Sign in with your credentials

4. **Check Supabase Dashboard**:
   - Verify user appears in Authentication > Users
   - Check that profile was created in Database > profiles table

## 🔧 Next Steps for Backend Development

1. **Implement Listing Management**
2. **Add Image Upload functionality**
3. **Create Messaging System**
4. **Add Search and Filtering**
5. **Implement Payment Integration**
6. **Set up Real-time subscriptions**

## 📝 Important Notes

- The `.env` file is gitignored for security
- Always use the anon key in frontend code
- Service role key should only be used server-side
- Test all authentication flows before production
- Set up proper email templates in Supabase Auth settings

Your Supabase backend is now ready for BaoAfrik! 🎉
