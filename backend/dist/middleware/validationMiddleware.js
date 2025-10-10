"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUUIDParam = exports.validateChangePassword = exports.validateUpdateProfile = exports.validateProductQuery = exports.validateUpdateProduct = exports.validateCreateProduct = exports.validateRefreshToken = exports.validateResetPassword = exports.validateForgotPassword = exports.validateResendVerification = exports.validateEmailVerification = exports.validateLogin = exports.validateRegister = exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const errorUtils_1 = require("../utils/errorUtils");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = {};
        errors.array().forEach(error => {
            if (error.type === 'field') {
                errorMessages[error.path] = error.msg;
            }
        });
        const validationError = new errorUtils_1.CustomError('Validation failed.Please check your input and try again.', 400);
        validationError.errors = errorMessages;
        next(validationError);
        return;
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
exports.validateRegister = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('Email address is required')
        .isEmail()
        .withMessage('Please provide a valid email address in the format name@domain.com')
        .normalizeEmail(),
    (0, express_validator_1.body)('phoneNumber')
        .optional()
        .trim()
        .isMobilePhone('any')
        .withMessage('Please provide a valid phone number'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
    (0, express_validator_1.body)('confirmPassword')
        .notEmpty()
        .withMessage('Please confirm your password')
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match. Please enter the same password in both fields.');
        }
        return true;
    }),
    exports.handleValidationErrors,
];
exports.validateLogin = [
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address  in the format name@domain.com')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required'),
    (0, express_validator_1.body)('rememberMe')
        .optional()
        .isBoolean()
        .withMessage('Remember me must be a boolean'),
    exports.handleValidationErrors,
];
exports.validateEmailVerification = [
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address  in the format name@domain.com')
        .normalizeEmail(),
    (0, express_validator_1.body)('verificationCode')
        .isLength({ min: 6, max: 6 })
        .withMessage('Verification code must be 6 digits')
        .isNumeric()
        .withMessage('Verification code must contain only numbers'),
    exports.handleValidationErrors,
];
exports.validateResendVerification = [
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    exports.handleValidationErrors,
];
exports.validateForgotPassword = [
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    exports.handleValidationErrors,
];
exports.validateResetPassword = [
    (0, express_validator_1.body)('token')
        .notEmpty()
        .withMessage('Reset token is required'),
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long')
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
        .withMessage('New password must contain both letters and numbers'),
    (0, express_validator_1.body)('confirmPassword')
        .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    exports.handleValidationErrors,
];
exports.validateRefreshToken = [
    (0, express_validator_1.body)('refreshToken')
        .notEmpty()
        .withMessage('Refresh token is required'),
    exports.handleValidationErrors,
];
exports.validateCreateProduct = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Product name must be between 3 and 200 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Description must not exceed 2000 characters'),
    (0, express_validator_1.body)('price')
        .isFloat({ min: 0.01 })
        .withMessage('Price must be a positive number'),
    (0, express_validator_1.body)('currency')
        .optional()
        .isIn(['USD', 'EUR', 'GBP', 'CAD', 'AUD'])
        .withMessage('Invalid currency code'),
    (0, express_validator_1.body)('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required')
        .isIn(['Food & Spices', 'Fashion & Textiles', 'Beauty & Wellness', 'Home & Decor', 'Books & Media'])
        .withMessage('Invalid category'),
    (0, express_validator_1.body)('subcategory')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Subcategory must not exceed 100 characters'),
    (0, express_validator_1.body)('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
        .isLength({ max: 255 })
        .withMessage('Location must not exceed 255 characters'),
    (0, express_validator_1.body)('country')
        .trim()
        .notEmpty()
        .withMessage('Country is required')
        .isLength({ max: 100 })
        .withMessage('Country must not exceed 100 characters'),
    (0, express_validator_1.body)('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
    (0, express_validator_1.body)('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),
    (0, express_validator_1.body)('tags.*')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Each tag must be between 1 and 50 characters'),
    exports.handleValidationErrors,
];
exports.validateUpdateProduct = [
    (0, express_validator_1.param)('id')
        .isUUID()
        .withMessage('Invalid product ID'),
    (0, express_validator_1.body)('name')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Product name must be between 3 and 200 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Description must not exceed 2000 characters'),
    (0, express_validator_1.body)('price')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('Price must be a positive number'),
    (0, express_validator_1.body)('category')
        .optional()
        .trim()
        .isIn(['Food & Spices', 'Fashion & Textiles', 'Beauty & Wellness', 'Home & Decor', 'Books & Media'])
        .withMessage('Invalid category'),
    (0, express_validator_1.body)('location')
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage('Location must not exceed 255 characters'),
    (0, express_validator_1.body)('country')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Country must not exceed 100 characters'),
    (0, express_validator_1.body)('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
    exports.handleValidationErrors,
];
exports.validateProductQuery = [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('category')
        .optional()
        .trim()
        .isIn(['Food & Spices', 'Fashion & Textiles', 'Beauty & Wellness', 'Home & Decor', 'Books & Media'])
        .withMessage('Invalid category'),
    (0, express_validator_1.query)('country')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Country must not exceed 100 characters'),
    (0, express_validator_1.query)('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be a non-negative number'),
    (0, express_validator_1.query)('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be a non-negative number'),
    (0, express_validator_1.query)('search')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search query must be between 1 and 100 characters'),
    (0, express_validator_1.query)('sortBy')
        .optional()
        .isIn(['createdAt', 'price', 'name', 'likeCount', 'viewCount'])
        .withMessage('Invalid sort field'),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc'),
    exports.handleValidationErrors,
];
exports.validateUpdateProfile = [
    (0, express_validator_1.body)('firstName')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('First name must be between 1 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('First name can only contain letters and spaces'),
    (0, express_validator_1.body)('lastName')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Last name must be between 1 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Last name can only contain letters and spaces'),
    (0, express_validator_1.body)('phoneNumber')
        .optional()
        .trim()
        .isMobilePhone('any')
        .withMessage('Please provide a valid phone number'),
    (0, express_validator_1.body)('profileImage')
        .optional()
        .custom((value) => {
        if (typeof value !== 'string')
            return false;
        const isDataUrl = value.startsWith('data:image/');
        const isHttpUrl = /^https?:\/\//i.test(value);
        return isDataUrl || isHttpUrl;
    })
        .withMessage('Profile image must be an http(s) URL or a data URL'),
    exports.handleValidationErrors,
];
exports.validateChangePassword = [
    (0, express_validator_1.body)('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long')
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
        .withMessage('New password must contain both letters and numbers'),
    (0, express_validator_1.body)('confirmPassword')
        .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Password confirmation does not match new password');
        }
        return true;
    }),
    exports.handleValidationErrors,
];
const validateUUIDParam = (paramName = 'id') => [
    (0, express_validator_1.param)(paramName)
        .isUUID()
        .withMessage(`Invalid ${paramName}`),
    exports.handleValidationErrors,
];
exports.validateUUIDParam = validateUUIDParam;
//# sourceMappingURL=validationMiddleware.js.map