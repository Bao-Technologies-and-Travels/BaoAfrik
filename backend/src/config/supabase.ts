import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Validate environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET',
  'SITE_URL'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    logger.error(`Missing required environment variable: ${envVar}`);
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Initialize Supabase clients
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'baoafrik-auth-token',
      flowType: 'pkce',
    },
  }
);

// Admin client for server-side operations
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Test the database connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .rpc('test_connection')
      .limit(1);

    if (error) {
      logger.error('Supabase connection test failed:', error);
    } else {
      logger.info('Successfully connected to Supabase');
    }
  } catch (error) {
    logger.error('Error testing Supabase connection:', error);
  }
};

// Run the connection test
testConnection().catch(console.error);
