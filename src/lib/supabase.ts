import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  email: string
  full_name: string
  phone_number?: string
  avatar_url?: string
  bio?: string
  location_country?: string
  location_region?: string
  location_city?: string
  is_verified: boolean
  verification_badge_type: 'none' | 'trusted_seller' | 'premium'
  total_listings: number
  total_sales: number
  rating: number
  total_reviews: number
  joined_at: string
  last_active: string
  is_active: boolean
  preferred_language: 'en' | 'fr'
  created_at: string
  updated_at: string
}

export interface Listing {
  id: string
  seller_id: string
  title: string
  description: string
  price: number
  currency: string
  category_id: string
  origin_country_id: string
  seller_location_country: string
  seller_location_region?: string
  seller_location_city?: string
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor'
  quantity: number
  is_urgent: boolean
  urgency_reason?: string
  tags: string[]
  status: 'draft' | 'active' | 'sold' | 'expired' | 'removed'
  views_count: number
  favorites_count: number
  is_boosted: boolean
  boost_expires_at?: string
  expires_at: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon_url?: string
  parent_id?: string
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Country {
  id: string
  name: string
  code: string
  flag_url?: string
  is_active: boolean
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'image' | 'offer' | 'system'
  offer_amount?: number
  is_read: boolean
  created_at: string
}

export interface Conversation {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  status: 'active' | 'archived' | 'blocked'
  last_message_at: string
  created_at: string
}
