"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.requireRole = exports.authenticateToken = void 0;
const supabase_1 = require("../config/supabase");
const logger_1 = require("../utils/logger");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Access token required',
            });
        }
        // Verify the JWT token with Supabase
        const { data: { user }, error } = await supabase_1.supabase.auth.getUser(token);
        if (error || !user) {
            logger_1.logger.warn('Invalid token attempt:', { error: error?.message });
            return res.status(403).json({
                success: false,
                error: 'Invalid or expired token',
            });
        }
        // Get user profile from database
        const { data: profile, error: profileError } = await supabase_1.supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
        if (profileError) {
            logger_1.logger.error('Error fetching user profile:', profileError);
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch user profile',
            });
        }
        // Attach user info to request
        req.user = {
            id: user.id,
            email: user.email || '',
            role: profile?.role || 'buyer',
        };
        next();
    }
    catch (error) {
        logger_1.logger.error('Authentication middleware error:', error);
        return res.status(500).json({
            success: false,
            error: 'Authentication failed',
        });
    }
};
exports.authenticateToken = authenticateToken;
const requireRole = (roles) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required',
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Insufficient permissions',
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return next(); // Continue without authentication
        }
        const { data: { user }, error } = await supabase_1.supabase.auth.getUser(token);
        if (!error && user) {
            const { data: profile } = await supabase_1.supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();
            req.user = {
                id: user.id,
                email: user.email || '',
                role: profile?.role || 'buyer',
            };
        }
        next();
    }
    catch (error) {
        logger_1.logger.error('Optional auth middleware error:', error);
        next(); // Continue without authentication on error
    }
};
exports.optionalAuth = optionalAuth;
