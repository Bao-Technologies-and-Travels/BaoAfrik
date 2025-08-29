"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseAdmin = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const logger_1 = require("../utils/logger");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables first
dotenv_1.default.config();
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
        logger_1.logger.error(`Missing required environment variable: ${envVar}`);
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}
// Initialize Supabase clients
exports.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'baoafrik-auth-token',
        flowType: 'pkce',
    },
});
// Admin client for server-side operations
exports.supabaseAdmin = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
// Test the database connection
const testConnection = async () => {
    try {
        const { data, error } = await exports.supabase
            .rpc('test_connection')
            .limit(1);
        if (error) {
            logger_1.logger.error('Supabase connection test failed:', error);
        }
        else {
            logger_1.logger.info('Successfully connected to Supabase');
        }
    }
    catch (error) {
        logger_1.logger.error('Error testing Supabase connection:', error);
    }
};
// Run the connection test
testConnection().catch(console.error);
