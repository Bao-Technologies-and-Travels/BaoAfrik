"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.updateProfile = exports.getCurrentUser = exports.resendVerificationCode = exports.verifyEmail = exports.refreshToken = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const errorMiddleware_1 = require("../middleware/errorMiddleware");
const errorMiddleware_2 = require("../middleware/errorMiddleware");
const jwtUtils_1 = require("../utils/jwtUtils");
const emailService_1 = require("../utils/emailService");
const logger_1 = __importDefault(require("../config/logger"));
const prisma = new client_1.PrismaClient();
exports.register = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { email, password, confirmPassword, phoneNumber } = req.body;
    if (password !== confirmPassword) {
        throw (0, errorMiddleware_2.createValidationError)('Passwords do not match');
    }
    const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
    });
    if (existingUser) {
        throw (0, errorMiddleware_2.createConflictError)('User with this email already exists');
    }
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
    const passwordHash = await bcryptjs_1.default.hash(password, saltRounds);
    const verificationCode = (0, jwtUtils_1.generateVerificationCode)();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const user = await prisma.user.create({
        data: {
            email: email.toLowerCase(),
            phoneNumber,
            passwordHash,
            emailVerificationCode: verificationCode,
            emailVerificationExpires: verificationExpires,
            provider: 'local',
        },
        select: {
            id: true,
            email: true,
            phoneNumber: true,
            emailVerified: true,
            createdAt: true,
        }
    });
    try {
        await (0, emailService_1.sendVerificationEmail)(user.email, verificationCode);
    }
    catch (error) {
        logger_1.default.error('Failed to send verification email:', error);
    }
    logger_1.default.info('User registered successfully', {
        userId: user.id,
        email: user.email
    });
    const response = {
        success: true,
        message: 'Registration successful. Please check your email for verification code.',
        data: {
            message: 'Registration successful. Please check your email for verification code.',
            userId: user.id
        }
    };
    res.status(201).json(response);
});
exports.login = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { email, password, rememberMe = false } = req.body;
    console.log('BACKEND: Login attempt for:', email);
    const user = await prisma.user.findUnique({
        where: {
            email: email.toLowerCase(),
            isActive: true
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            passwordHash: true,
            profileImage: true,
            emailVerified: true,
            isVerifiedSeller: true,
            provider: true,
            lastLoginAt: true,
        }
    });
    console.log('BACKEND: User found:', user);
    console.log('BACKEND: firstName value:', user?.firstName);
    console.log('BACKEND: lastName value:', user?.lastName);
    if (!user || !user.passwordHash) {
        throw (0, errorMiddleware_2.createUnauthorizedError)('Invalid email or password');
    }
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        throw (0, errorMiddleware_2.createUnauthorizedError)('Invalid password');
    }
    if (!user.emailVerified) {
        throw (0, errorMiddleware_2.createUnauthorizedError)('Please verify your email before logging in');
    }
    const { accessToken, refreshToken } = (0, jwtUtils_1.generateTokenPair)(user.id, user.email);
    const refreshTokenExpiresIn = rememberMe ? 30 : 7;
    const expiresAt = new Date(Date.now() + refreshTokenExpiresIn * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt,
        }
    });
    await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
    });
    const publicUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        phoneNumber: user.phoneNumber || undefined,
        profileImage: user.profileImage || undefined,
        emailVerified: user.emailVerified,
        isVerifiedSeller: user.isVerifiedSeller,
        provider: user.provider || undefined,
        lastLoginAt: user.lastLoginAt || undefined,
    };
    logger_1.default.info('User logged in successfully', {
        userId: user.id,
        email: user.email,
        rememberMe
    });
    const responseData = {
        accessToken,
        refreshToken,
        user: publicUser
    };
    const response = {
        success: true,
        message: 'Login successful',
        data: responseData
    };
    res.json(response);
});
exports.logout = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const authHeader = req.headers.authorization;
    const refreshToken = req.body.refreshToken;
    if (refreshToken) {
        await prisma.refreshToken.deleteMany({
            where: { token: refreshToken }
        });
    }
    if (req.user) {
        logger_1.default.info('User logged out', { userId: req.user.id });
    }
    const response = {
        success: true,
        message: 'Logged out successfully'
    };
    res.json(response);
});
exports.refreshToken = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw (0, errorMiddleware_2.createUnauthorizedError)('Refresh token is required');
    }
    const decoded = (0, jwtUtils_1.verifyRefreshToken)(refreshToken);
    const storedToken = await prisma.refreshToken.findUnique({
        where: {
            token: refreshToken,
            expiresAt: { gt: new Date() }
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    isActive: true,
                    emailVerified: true,
                }
            }
        }
    });
    if (!storedToken || !storedToken.user.isActive || !storedToken.user.emailVerified) {
        throw (0, errorMiddleware_2.createUnauthorizedError)('Invalid or expired refresh token');
    }
    const { accessToken: newAccessToken } = (0, jwtUtils_1.generateTokenPair)(storedToken.user.id, storedToken.user.email);
    logger_1.default.info('Token refreshed successfully', {
        userId: storedToken.user.id
    });
    const response = {
        success: true,
        data: {
            accessToken: newAccessToken,
            expiresIn: 15 * 60
        }
    };
    res.json(response);
});
exports.verifyEmail = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { email, verificationCode } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email: email.toLowerCase(),
            emailVerificationCode: verificationCode,
            emailVerificationExpires: { gt: new Date() }
        }
    });
    if (!user) {
        throw (0, errorMiddleware_2.createUnauthorizedError)('Invalid or expired verification code');
    }
    await prisma.user.update({
        where: { id: user.id },
        data: {
            emailVerified: true,
            emailVerificationCode: null,
            emailVerificationExpires: null,
        }
    });
    logger_1.default.info('Email verified successfully', {
        userId: user.id,
        email: user.email
    });
    const response = {
        success: true,
        message: 'Email verified successfully'
    };
    res.json(response);
});
exports.resendVerificationCode = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email: email.toLowerCase(),
            emailVerified: false
        }
    });
    if (!user) {
        throw (0, errorMiddleware_2.createValidationError)('User not found or already verified');
    }
    const verificationCode = (0, jwtUtils_1.generateVerificationCode)();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await prisma.user.update({
        where: { id: user.id },
        data: {
            emailVerificationCode: verificationCode,
            emailVerificationExpires: verificationExpires,
        }
    });
    try {
        await (0, emailService_1.sendVerificationEmail)(user.email, verificationCode);
    }
    catch (error) {
        logger_1.default.error('Failed to resend verification email:', error);
        throw new Error('Failed to send verification email');
    }
    logger_1.default.info('Verification code resent', {
        userId: user.id,
        email: user.email
    });
    const response = {
        success: true,
        message: 'Verification code sent successfully'
    };
    res.json(response);
});
exports.getCurrentUser = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw (0, errorMiddleware_2.createUnauthorizedError)('User not authenticated');
    }
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            profileImage: true,
            emailVerified: true,
            isVerifiedSeller: true,
            provider: true,
            lastLoginAt: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    if (!user) {
        throw (0, errorMiddleware_2.createValidationError)('User not found');
    }
    const response = {
        success: true,
        data: user
    };
    res.json(response);
});
exports.updateProfile = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw (0, errorMiddleware_2.createUnauthorizedError)('User not authenticated');
    }
    const { firstName, lastName, phoneNumber, profileImage } = req.body;
    const name = firstName && lastName ? `${firstName} ${lastName}`.trim() : undefined;
    const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: {
            ...(name && { name }),
            ...(phoneNumber && { phoneNumber }),
            ...(profileImage && { profileImage }),
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            profileImage: true,
            emailVerified: true,
            isVerifiedSeller: true,
            provider: true,
            lastLoginAt: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    logger_1.default.info('Profile updated successfully', {
        userId: req.user.id
    });
    const response = {
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
    };
    res.json(response);
});
exports.forgotPassword = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
    });
    if (user) {
        const resetToken = (0, jwtUtils_1.generateSecureToken)();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken: resetToken,
                passwordResetExpires: expiresAt,
            }
        });
        try {
            await (0, emailService_1.sendPasswordResetEmail)(user.email, resetToken);
        }
        catch (error) {
            logger_1.default.error('Failed to send password reset email:', error);
        }
    }
    const response = {
        success: true,
        message: 'If an account exists for that email, a password reset link has been sent.'
    };
    res.json(response);
});
exports.resetPassword = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
        throw (0, errorMiddleware_2.createValidationError)('New passwords do not match');
    }
    const user = await prisma.user.findFirst({
        where: {
            passwordResetToken: token,
            passwordResetExpires: { gt: new Date() },
            isActive: true,
        },
        select: { id: true }
    });
    if (!user) {
        throw (0, errorMiddleware_2.createUnauthorizedError)('Invalid or expired password reset token');
    }
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
    const newPasswordHash = await bcryptjs_1.default.hash(newPassword, saltRounds);
    await prisma.user.update({
        where: { id: user.id },
        data: {
            passwordHash: newPasswordHash,
            passwordResetToken: null,
            passwordResetExpires: null,
        }
    });
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    logger_1.default.info('Password reset successfully', { userId: user.id });
    const response = {
        success: true,
        message: 'Password has been reset successfully. You can now log in.'
    };
    res.json(response);
});
exports.changePassword = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw (0, errorMiddleware_2.createUnauthorizedError)('User not authenticated');
    }
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
        throw (0, errorMiddleware_2.createValidationError)('New passwords do not match');
    }
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { passwordHash: true }
    });
    if (!user || !user.passwordHash) {
        throw (0, errorMiddleware_2.createValidationError)('User not found');
    }
    const isCurrentPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
        throw (0, errorMiddleware_2.createUnauthorizedError)('Current password is incorrect');
    }
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
    const newPasswordHash = await bcryptjs_1.default.hash(newPassword, saltRounds);
    await prisma.user.update({
        where: { id: req.user.id },
        data: { passwordHash: newPasswordHash }
    });
    await prisma.refreshToken.deleteMany({
        where: { userId: req.user.id }
    });
    logger_1.default.info('Password changed successfully', {
        userId: req.user.id
    });
    const response = {
        success: true,
        message: 'Password changed successfully'
    };
    res.json(response);
});
exports.default = {
    register: exports.register,
    login: exports.login,
    logout: exports.logout,
    refreshToken: exports.refreshToken,
    verifyEmail: exports.verifyEmail,
    resendVerificationCode: exports.resendVerificationCode,
    getCurrentUser: exports.getCurrentUser,
    updateProfile: exports.updateProfile,
    forgotPassword: exports.forgotPassword,
    resetPassword: exports.resetPassword,
    changePassword: exports.changePassword,
};
//# sourceMappingURL=authController.js.map