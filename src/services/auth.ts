import { supabase } from '../lib/supabase'
import type { Profile } from '../lib/supabase'

export interface AuthUser {
  id: string
  email: string
  name: string
}

export interface SignUpData {
  email: string
  password: string
  fullName: string
  phoneNumber: string
}

export interface SignInData {
  email: string
  password: string
}

// Sign up new user
export const signUp = async (data: SignUpData) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
        phone_number: data.phoneNumber,
      }
    }
  })

  if (authError) throw authError

  // Create profile record
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: data.email,
        full_name: data.fullName,
        phone_number: data.phoneNumber,
      })

    if (profileError) throw profileError
  }

  return authData
}

// Sign in user
export const signIn = async (data: SignInData) => {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) throw error

  return authData
}

// Sign out user
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Get current user profile
export const getCurrentUserProfile = async (): Promise<Profile | null> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return profile
}

// Update user profile
export const updateProfile = async (updates: Partial<Profile>) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('No authenticated user')

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Social login
export const signInWithProvider = async (provider: 'google' | 'facebook' | 'github') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })

  if (error) throw error
  return data
}

// Resend email verification
export const resendEmailVerification = async (email: string) => {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email
  })

  if (error) throw error
}

// Reset password
export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })

  if (error) throw error
}
