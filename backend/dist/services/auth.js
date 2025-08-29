"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const supabase_1 = require("../config/supabase");
const logger_1 = require("../utils/logger");
exports.authService = {
    // Sign up a new user
    async signUp({ email, password, fullName, phone, userMetadata = {} }) {
        try {
            // Create user in Supabase Auth
            const { data: authData, error: signUpError } = await supabase_1.supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        phone,
                        ...userMetadata,
                    },
                    emailRedirectTo: `${process.env.SITE_URL}/auth/callback`,
                },
            });
            if (signUpError)
                throw signUpError;
            // If email confirmation is enabled, the user will need to verify their email
            if (!authData.user) {
                return {
                    success: true,
                    message: 'Confirmation email sent. Please check your email to verify your account.',
                    requiresConfirmation: true,
                };
            }
            // Return user data
            return {
                success: true,
                user: {
                    id: authData.user.id,
                    email: authData.user.email,
                    fullName,
                    phone,
                    emailVerified: authData.user.email_confirmed_at !== null,
                },
            };
        }
        catch (error) {
            logger_1.logger.error('Sign up error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create account',
            };
        }
    },
    // Sign in with email and password
    async signIn({ email, password }) {
        try {
            const { data, error } = await supabase_1.supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error)
                throw error;
            // Get additional user data from profiles table
            const { data: profile, error: profileError } = await supabase_1.supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();
            if (profileError)
                throw profileError;
            return {
                success: true,
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    fullName: profile?.full_name || '',
                    phone: profile?.phone || '',
                    avatarUrl: profile?.avatar_url || null,
                    emailVerified: data.user.email_confirmed_at !== null,
                },
                session: data.session,
            };
        }
        catch (error) {
            logger_1.logger.error('Sign in error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Invalid email or password',
            };
        }
    },
    // Sign out the current user
    async signOut() {
        try {
            const { error } = await supabase_1.supabase.auth.signOut();
            if (error)
                throw error;
            return { success: true };
        }
        catch (error) {
            logger_1.logger.error('Sign out error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to sign out',
            };
        }
    },
    // Get the current user session
    async getSession() {
        try {
            const { data: { session }, error } = await supabase_1.supabase.auth.getSession();
            if (error || !session) {
                return { success: false, user: null };
            }
            // Get user profile
            const { data: profile, error: profileError } = await supabase_1.supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
            if (profileError)
                throw profileError;
            return {
                success: true,
                user: {
                    id: session.user.id,
                    email: session.user.email || '',
                    fullName: profile?.full_name || '',
                    phone: profile?.phone || '',
                    avatarUrl: profile?.avatar_url || null,
                    emailVerified: session.user.email_confirmed_at !== null,
                    role: profile?.role || 'buyer',
                },
                session,
            };
        }
        catch (error) {
            logger_1.logger.error('Get session error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get session',
                user: null,
            };
        }
    },
    // Send password reset email
    async resetPassword(email) {
        try {
            const { error } = await supabase_1.supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${process.env.SITE_URL}/auth/reset-password`,
            });
            if (error)
                throw error;
            return {
                success: true,
                message: 'Password reset email sent. Please check your email.',
            };
        }
        catch (error) {
            logger_1.logger.error('Reset password error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to send reset email',
            };
        }
    },
    // Update user password
    async updatePassword(newPassword) {
        try {
            const { error } = await supabase_1.supabase.auth.updateUser({
                password: newPassword,
            });
            if (error)
                throw error;
            return {
                success: true,
                message: 'Password updated successfully',
            };
        }
        catch (error) {
            logger_1.logger.error('Update password error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update password',
            };
        }
    },
    // Sign in with OAuth provider
    async signInWithOAuth(provider) {
        try {
            const { data, error } = await supabase_1.supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${process.env.SITE_URL}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });
            if (error)
                throw error;
            return {
                success: true,
                url: data.url,
            };
        }
        catch (error) {
            logger_1.logger.error(`Sign in with ${provider} error:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : `Failed to sign in with ${provider}`,
            };
        }
    },
    // Handle OAuth callback
    async handleOAuthCallback() {
        try {
            const { data, error } = await supabase_1.supabase.auth.getSession();
            if (error || !data.session) {
                throw new Error('Invalid session');
            }
            return {
                success: true,
                session: data.session,
            };
        }
        catch (error) {
            logger_1.logger.error('OAuth callback error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Authentication failed',
            };
        }
    },
    // Update user profile
    async updateProfile(userId, updates) {
        try {
            const { data, error } = await supabase_1.supabase
                .from('profiles')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();
            if (error)
                throw error;
            return {
                success: true,
                profile: data,
            };
        }
        catch (error) {
            logger_1.logger.error('Update profile error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update profile',
            };
        }
    },
};
exports.default = exports.authService;
