import { supabase } from '../lib/supabase'
import type { Listing, Category, Country } from '../lib/supabase'

export interface CreateListingData {
  title: string
  description: string
  price: number
  currency?: string
  category_id: string
  origin_country_id: string
  seller_location_country: string
  seller_location_region?: string
  seller_location_city?: string
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor'
  quantity?: number
  is_urgent?: boolean
  urgency_reason?: string
  tags?: string[]
}

export interface SearchFilters {
  search_query?: string
  category_filter?: string
  country_filter?: string
  min_price?: number
  max_price?: number
  is_urgent_filter?: boolean
  limit_count?: number
  offset_count?: number
}

// Create new listing
export const createListing = async (data: CreateListingData) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('No authenticated user')

  const { data: listing, error } = await supabase
    .from('listings')
    .insert({
      ...data,
      seller_id: user.id,
    })
    .select()
    .single()

  if (error) throw error
  return listing
}

// Get all active listings
export const getListings = async (filters: SearchFilters = {}) => {
  let query = supabase
    .from('listings')
    .select(`
      *,
      profiles:seller_id (
        full_name,
        rating,
        is_verified
      ),
      categories (
        name,
        slug
      ),
      countries (
        name,
        code,
        flag_url
      ),
      listing_images (
        image_url,
        is_primary
      )
    `)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())

  // Apply filters
  if (filters.search_query) {
    query = query.or(`title.ilike.%${filters.search_query}%,description.ilike.%${filters.search_query}%`)
  }

  if (filters.category_filter) {
    query = query.eq('categories.slug', filters.category_filter)
  }

  if (filters.country_filter) {
    query = query.eq('countries.code', filters.country_filter)
  }

  if (filters.min_price !== undefined) {
    query = query.gte('price', filters.min_price)
  }

  if (filters.max_price !== undefined) {
    query = query.lte('price', filters.max_price)
  }

  if (filters.is_urgent_filter !== undefined) {
    query = query.eq('is_urgent', filters.is_urgent_filter)
  }

  // Order by boosted listings first, then by creation date
  query = query.order('is_boosted', { ascending: false })
  query = query.order('created_at', { ascending: false })

  // Apply pagination
  if (filters.limit_count) {
    query = query.limit(filters.limit_count)
  }

  if (filters.offset_count) {
    query = query.range(filters.offset_count, (filters.offset_count + (filters.limit_count || 20)) - 1)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

// Get user's listings
export const getUserListings = async (userId?: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const targetUserId = userId || user?.id
  if (!targetUserId) throw new Error('No user ID provided')

  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      categories (
        name,
        slug
      ),
      countries (
        name,
        code,
        flag_url
      ),
      listing_images (
        image_url,
        is_primary
      )
    `)
    .eq('seller_id', targetUserId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Get single listing by ID
export const getListing = async (id: string) => {
  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      profiles:seller_id (
        full_name,
        rating,
        is_verified,
        avatar_url,
        total_listings,
        total_sales
      ),
      categories (
        name,
        slug
      ),
      countries (
        name,
        code,
        flag_url
      ),
      listing_images (
        image_url,
        alt_text,
        sort_order,
        is_primary
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error

  // Increment view count
  await supabase
    .from('listings')
    .update({ views_count: (data.views_count || 0) + 1 })
    .eq('id', id)

  return data
}

// Update listing
export const updateListing = async (id: string, updates: Partial<CreateListingData>) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('No authenticated user')

  const { data, error } = await supabase
    .from('listings')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('seller_id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Delete listing
export const deleteListing = async (id: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('No authenticated user')

  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id)
    .eq('seller_id', user.id)

  if (error) throw error
}

// Get all categories
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (error) throw error
  return data
}

// Get all countries
export const getCountries = async () => {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) throw error
  return data
}

// Add to favorites
export const addToFavorites = async (listingId: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('No authenticated user')

  const { error } = await supabase
    .from('favorites')
    .insert({
      user_id: user.id,
      listing_id: listingId
    })

  if (error) throw error

  // Update favorites count
  await supabase.rpc('increment_favorites_count', { listing_id: listingId })
}

// Remove from favorites
export const removeFromFavorites = async (listingId: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('No authenticated user')

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('listing_id', listingId)

  if (error) throw error

  // Update favorites count
  await supabase.rpc('decrement_favorites_count', { listing_id: listingId })
}

// Get user's favorites
export const getUserFavorites = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('No authenticated user')

  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      listings (
        *,
        profiles:seller_id (
          full_name,
          rating,
          is_verified
        ),
        categories (
          name,
          slug
        ),
        listing_images (
          image_url,
          is_primary
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
