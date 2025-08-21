# BaoAfrik Supabase Backend Architecture

## Overview
This document outlines the complete Supabase backend architecture for BaoAfrik, a mobile-first P2P marketplace for authentic African products.

## Database Schema

### 1. Authentication Tables (Supabase Auth)
Supabase Auth handles user authentication with the built-in `auth.users` table.

### 2. Core Tables

#### `profiles` Table
```sql
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
  verification_badge_type TEXT CHECK (verification_badge_type IN ('none', 'trusted_seller', 'premium')),
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
```

#### `categories` Table
```sql
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
```

#### `countries` Table
```sql
CREATE TABLE countries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL, -- ISO 3166-1 alpha-2
  flag_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `listings` Table
```sql
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
  tags TEXT[], -- Array of tags for better discovery
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'sold', 'expired', 'removed')),
  views_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  is_boosted BOOLEAN DEFAULT FALSE,
  boost_expires_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '90 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `listing_images` Table
```sql
CREATE TABLE listing_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `conversations` Table
```sql
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
```

#### `messages` Table
```sql
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'offer', 'system')),
  offer_amount DECIMAL(10,2), -- For offer messages
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `reviews` Table
```sql
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) NOT NULL,
  reviewed_user_id UUID REFERENCES profiles(id) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  review_type TEXT CHECK (review_type IN ('buyer_to_seller', 'seller_to_buyer')) NOT NULL,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(listing_id, reviewer_id, reviewed_user_id)
);
```

#### `favorites` Table
```sql
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);
```

#### `reports` Table
```sql
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) NOT NULL,
  reported_user_id UUID REFERENCES profiles(id),
  reported_listing_id UUID REFERENCES listings(id),
  report_type TEXT CHECK (report_type IN ('spam', 'inappropriate_content', 'fake_product', 'harassment', 'other')) NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `listing_fees` Table
```sql
CREATE TABLE listing_fees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  fee_type TEXT CHECK (fee_type IN ('listing_fee', 'boost_fee')) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'GBP',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_intent_id TEXT, -- Stripe payment intent ID
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `user_subscriptions` Table
```sql
CREATE TABLE user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  subscription_type TEXT CHECK (subscription_type IN ('free', 'basic', 'premium')) DEFAULT 'free',
  free_period_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '3 months'),
  subscription_starts_at TIMESTAMP WITH TIME ZONE,
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Row Level Security (RLS) Policies

### Profiles Table Policies
```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view all profiles (for public listings)
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Listings Table Policies
```sql
-- Enable RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Anyone can view active listings
CREATE POLICY "Active listings are viewable by everyone" ON listings
  FOR SELECT USING (status = 'active');

-- Users can view their own listings (any status)
CREATE POLICY "Users can view own listings" ON listings
  FOR SELECT USING (auth.uid() = seller_id);

-- Users can insert their own listings
CREATE POLICY "Users can insert own listings" ON listings
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- Users can update their own listings
CREATE POLICY "Users can update own listings" ON listings
  FOR UPDATE USING (auth.uid() = seller_id);

-- Users can delete their own listings
CREATE POLICY "Users can delete own listings" ON listings
  FOR DELETE USING (auth.uid() = seller_id);
```

### Messages Table Policies
```sql
-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages in conversations they're part of
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (conversations.buyer_id = auth.uid() OR conversations.seller_id = auth.uid())
    )
  );

-- Users can insert messages in conversations they're part of
CREATE POLICY "Users can insert own messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = conversation_id 
      AND (conversations.buyer_id = auth.uid() OR conversations.seller_id = auth.uid())
    )
  );
```

## Database Functions

### Update Profile Rating Function
```sql
CREATE OR REPLACE FUNCTION update_profile_rating(profile_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM reviews 
      WHERE reviewed_user_id = profile_id
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE reviewed_user_id = profile_id
    )
  WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql;
```

### Check Free Period Function
```sql
CREATE OR REPLACE FUNCTION is_in_free_period(user_id UUID)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_subscriptions 
    WHERE user_subscriptions.user_id = is_in_free_period.user_id 
    AND free_period_ends_at > NOW()
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql;
```

## Database Triggers

### Update Timestamps Trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Update Profile Stats Trigger
```sql
CREATE OR REPLACE FUNCTION update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total_listings count
  IF TG_TABLE_NAME = 'listings' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE profiles SET total_listings = total_listings + 1 
      WHERE id = NEW.seller_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE profiles SET total_listings = total_listings - 1 
      WHERE id = OLD.seller_id;
    END IF;
  END IF;
  
  -- Update rating when review is added
  IF TG_TABLE_NAME = 'reviews' THEN
    IF TG_OP = 'INSERT' THEN
      PERFORM update_profile_rating(NEW.reviewed_user_id);
    ELSIF TG_OP = 'DELETE' THEN
      PERFORM update_profile_rating(OLD.reviewed_user_id);
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profile_stats_on_listing AFTER INSERT OR DELETE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_profile_stats();

CREATE TRIGGER update_profile_stats_on_review AFTER INSERT OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_profile_stats();
```

## Storage Buckets

### Product Images Bucket
```sql
-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- RLS policy for product images
CREATE POLICY "Anyone can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Users can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Profile Avatars Bucket
```sql
-- Create storage bucket for profile avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- RLS policies for avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## API Endpoints (Supabase Auto-Generated)

All CRUD operations are automatically available through Supabase's auto-generated REST API:

- `GET /rest/v1/listings` - Get listings with filters
- `POST /rest/v1/listings` - Create new listing
- `PATCH /rest/v1/listings?id=eq.{id}` - Update listing
- `DELETE /rest/v1/listings?id=eq.{id}` - Delete listing

### Custom API Functions

#### Search Listings Function
```sql
CREATE OR REPLACE FUNCTION search_listings(
  search_query TEXT DEFAULT '',
  category_filter TEXT DEFAULT '',
  country_filter TEXT DEFAULT '',
  min_price DECIMAL DEFAULT 0,
  max_price DECIMAL DEFAULT 999999,
  is_urgent_filter BOOLEAN DEFAULT NULL,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  price DECIMAL,
  currency TEXT,
  seller_name TEXT,
  seller_rating DECIMAL,
  primary_image_url TEXT,
  location TEXT,
  is_urgent BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.title,
    l.description,
    l.price,
    l.currency,
    p.full_name as seller_name,
    p.rating as seller_rating,
    li.image_url as primary_image_url,
    CONCAT(l.seller_location_city, ', ', l.seller_location_country) as location,
    l.is_urgent,
    l.created_at
  FROM listings l
  JOIN profiles p ON l.seller_id = p.id
  LEFT JOIN listing_images li ON l.id = li.listing_id AND li.is_primary = true
  LEFT JOIN categories c ON l.category_id = c.id
  LEFT JOIN countries co ON l.origin_country_id = co.id
  WHERE 
    l.status = 'active'
    AND l.expires_at > NOW()
    AND (search_query = '' OR l.title ILIKE '%' || search_query || '%' OR l.description ILIKE '%' || search_query || '%')
    AND (category_filter = '' OR c.slug = category_filter)
    AND (country_filter = '' OR co.code = country_filter)
    AND l.price >= min_price
    AND l.price <= max_price
    AND (is_urgent_filter IS NULL OR l.is_urgent = is_urgent_filter)
  ORDER BY 
    l.is_boosted DESC,
    l.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;
```

## Real-time Subscriptions

### Message Notifications
```javascript
// Subscribe to new messages in user's conversations
const { data, error } = supabase
  .from('messages')
  .on('INSERT', payload => {
    // Handle new message
    console.log('New message:', payload.new);
  })
  .subscribe();
```

### Listing Updates
```javascript
// Subscribe to listing status changes
const { data, error } = supabase
  .from('listings')
  .on('UPDATE', payload => {
    // Handle listing updates
    console.log('Listing updated:', payload.new);
  })
  .subscribe();
```

## Authentication Setup

### Email Templates
Configure custom email templates in Supabase Auth settings:
- Welcome email
- Email verification
- Password reset
- Magic link login

### Social Providers
Enable and configure:
- Google OAuth
- Facebook OAuth  
- GitHub OAuth

### JWT Settings
Configure JWT expiry and refresh token settings for optimal security.

## Environment Variables

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Deployment Considerations

1. **Database Backups**: Enable automated backups
2. **Performance**: Add indexes on frequently queried columns
3. **Monitoring**: Set up logging and monitoring
4. **Security**: Regular security audits and updates
5. **Scaling**: Monitor usage and upgrade plan as needed

This architecture provides a solid foundation for BaoAfrik's backend using Supabase's powerful features while maintaining security, scalability, and performance.
