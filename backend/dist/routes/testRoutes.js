"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emailService_1 = require("../utils/emailService");
const logger_1 = __importDefault(require("../config/logger"));
const router = (0, express_1.Router)();
router.get('/email-connection', async (req, res) => {
    try {
        const isConnected = await (0, emailService_1.testEmailConnection)();
        res.json({
            success: isConnected,
            message: isConnected
                ? 'Email service connection successful'
                : 'Email service connection failed'
        });
    }
    catch (error) {
        logger_1.default.error('Email connection test error:', error);
        res.status(500).json({
            success: false,
            message: 'Email connection test failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.post('/send-email', async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email || !name) {
            return res.status(400).json({
                success: false,
                message: 'Email and name are required'
            });
        }
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const emailSent = await (0, emailService_1.sendVerificationEmail)(email, verificationCode);
        if (emailSent) {
            return res.json({
                success: true,
                message: 'Test verification email sent successfully',
                verificationCode: verificationCode
            });
        }
        else {
            return res.status(500).json({
                success: false,
                message: 'Failed to send test email'
            });
        }
    }
    catch (error) {
        logger_1.default.error('Send test email error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send test email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.post('/get-verification-code', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: {
                id: true,
                email: true,
                emailVerificationCode: true,
                emailVerificationExpires: true,
                emailVerified: true
            }
        });
        await prisma.$disconnect();
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        return res.json({
            success: true,
            message: 'Verification code retrieved (Development only)',
            data: {
                email: user.email,
                verificationCode: user.emailVerificationCode,
                expiresAt: user.emailVerificationExpires,
                isVerified: user.emailVerified
            }
        });
    }
    catch (error) {
        logger_1.default.error('Get verification code error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get verification code',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.post('/send-test-email', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }
        const emailService = await Promise.resolve().then(() => __importStar(require('../utils/emailService')));
        await emailService.default.sendEmail({
            to: email,
            subject: 'BaoAfrik Email Service Test',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #F9A825;">🎉 Email Service Test Successful!</h2>
          <p>Hello from BaoAfrik!</p>
          <p>This is a test email to confirm that your email service is working correctly.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">✅ Email Configuration Status:</h3>
            <ul style="color: #666;">
              <li>SMTP Connection: Active</li>
              <li>Gmail App Password: Working</li>
              <li>Email Delivery: Successful</li>
            </ul>
          </div>
          <p style="color: #666;">
            Sent at: ${new Date().toLocaleString()}<br>
            From: BaoAfrik Team
          </p>
        </div>
      `
        });
        logger_1.default.info(`Test email sent successfully to ${email}`);
        return res.json({
            success: true,
            message: `Test email sent successfully to ${email}`,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        logger_1.default.error('Send test email error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send test email',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=testRoutes.js.map