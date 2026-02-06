import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { CustomError } from '@/utils/errorUtils';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

// Handle validation results
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages: { [key: string]: string } = {};

    errors.array().forEach(error => {
      if (error.type === 'field') {
        errorMessages[error.path] = error.msg;
      }
    });

    const validationError = new CustomError('Validation failed. Please check your input and try again.', 400);
    (validationError as any).errors = errorMessages;
    next(validationError);
    return;
  }

  next();
  // if (errors.isEmpty()) {
  //   return next();
  // }

  // return res.status(400).json({
  //   success: false,
  //   message: 'Validation failed. Please check your input and try again.',
  //   errors: errors.array()
  // });

};

// Auth validation rules
export const validateRegister = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address in the format name@domain.com')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Please confirm your password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match. Please enter the same password in both fields.');
      }
      return true;
    }),

  handleValidationErrors,
];

export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address  in the format name@domain.com')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  body('rememberMe')
    .optional()
    .isBoolean()
    .withMessage('Remember me must be a boolean'),

  handleValidationErrors,
];

export const validateEmailVerification = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address  in the format name@domain.com')
    .normalizeEmail(),

  body('verificationCode')
    .isLength({ min: 6, max: 6 })
    .withMessage('Verification code must be 6 digits')
    .isNumeric()
    .withMessage('Verification code must contain only numbers'),

  handleValidationErrors,
];

export const validateResendVerification = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  handleValidationErrors,
];

export const validateForgotPassword = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  handleValidationErrors,
];

export const validateResetPassword = [
  body('resetToken')
    .notEmpty()
    .withMessage('Reset token is required'),

  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('New password must contain both letters and numbers'),

  body('confirmPassword')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('Passwords do not match'),
  body().custom((value, { req }) => {
    if (!value.resetToken && !value.token) {
      throw new Error('Reset token is required');
    }
    return true;
  }),

  handleValidationErrors,
];

export const validateVerifyResetCode = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('code')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('Reset code must be a 6-digit number'),
  handleValidationErrors
];

export const validateRefreshToken = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),

  handleValidationErrors,
];

// Product validation rules
export const validateCreateProduct = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Product name must be between 3 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),

  body('price')
    .optional()
    .isFloat({ min: 0.01 })
    .if(() => {
      return true;
    })
    .withMessage('Price must be a positive number'),

  body('currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'CAD', 'AUD'])
    .withMessage('Invalid currency code'),

  body('category')
    .optional()
    .trim()
    .isIn([
      'beauty', 'books', 'fashion', 'food', 'home',
      'Beauty & Wellness', 'Books & Media', 'Fashion & Textiles', 'Food & Spices', 'Home & Decor'
    ])
    .withMessage('Invalid category'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Location must not exceed 255 characters'),

  body('origin')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters'),

  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),

  body('status')
    .optional()
    .isIn(['DRAFT', 'PUBLISHED', 'SOLD'])
    .withMessage('Invalid status'),

  handleValidationErrors,
];

export const validateUpdateProduct = [
  body('title')
    .trim()
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage('Product name must be between 3 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),

  body('price')
    .optional()
    .if(() => true)
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number'),

  body('currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'CAD', 'AUD'])
    .withMessage('Invalid currency code'),

  body('category')
    .optional()
    .trim()
    .isIn([
      'beauty', 'books', 'fashion', 'food', 'home',
      'Beauty & Wellness', 'Books & Media', 'Fashion & Textiles', 'Food & Spices', 'Home & Decor'
    ])
    .withMessage('Invalid category'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Location must not exceed 255 characters'),

  body('origin')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters'),

  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),

  body('status')
    .optional()
    .isIn(['DRAFT', 'PUBLISHED', 'SOLD'])
    .withMessage('Invalid status'),

  handleValidationErrors,
];

// Query validation rules
export const validateProductQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('category')
    .optional()
    .trim()
    .isIn(['Food & Spices', 'Fashion & Textiles', 'Beauty & Wellness', 'Home & Decor', 'Books & Media'])
    .withMessage('Invalid category'),

  query('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters'),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a non-negative number'),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a non-negative number'),

  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),

  query('sortBy')
    .optional()
    .isIn(['createdAt', 'price', 'name', 'likeCount', 'viewCount'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),

  handleValidationErrors,
];

// User profile validation
export const validateUpdateProfile = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  handleValidationErrors,
];

export const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('New password must contain both letters and numbers'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),

  handleValidationErrors,
];

export const validateFileUpload = [
  body('fileName')
    .notEmpty()
    .withMessage('File name is required'),

  body('fileType')
    .notEmpty()
    .withMessage('File type is required'),

  body('userId')
    .notEmpty()
    .withMessage('User ID is required'),

  handleValidationErrors,
];

export const validateDeleteUser = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email is required')
]

// UUID parameter validation
export const validateUUIDParam = (paramName: string = 'id') => [
  param(paramName)
    .isUUID()
    .withMessage(`Invalid ${paramName}`),

  handleValidationErrors,
];

export const createRequestValidation = [
  body('productName').trim().notEmpty().withMessage('Product name is required'),
  body('description').optional().trim(),
  body('origin').trim().notEmpty().withMessage('Origin is required'),
  body('sellerLocation').trim().notEmpty().withMessage('Seller location is required'),
  body('minPrice').optional().isFloat({ min: 0 }).withMessage('Minimum price must be a positive number'),
  body('maxPrice').optional().isFloat({ min: 0 }).withMessage('Maximum price must be a positive number'),
  body('currency').optional().isString().isLength({ min: 3, max: 3 }).withMessage('Currency must be a 3-letter code'),
  body('category').optional().trim(),
  body('quantity').optional().trim(),
  body('quantityUnit').optional().trim(),
  body('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  body('images').optional().isArray().withMessage('Images must be an array')
];
export const updateRequestValidation = [
  param('id').isUUID().withMessage('Invalid request ID'),
  body('status').optional().isIn(['PENDING', 'FULFILLED', 'REJECTED', 'ONGOING']).withMessage('Invalid status'),
  body('productName').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
  body('description').optional().trim(),
  body('origin').optional().trim().notEmpty().withMessage('Origin cannot be empty'),
  body('sellerLocation').optional().trim().notEmpty().withMessage('Seller location cannot be empty'),
  body('minPrice').optional().isFloat({ min: 0 }).withMessage('Minimum price must be a positive number'),
  body('maxPrice').optional().isFloat({ min: 0 }).withMessage('Maximum price must be a positive number'),
  body('currency').optional().isString().isLength({ min: 3, max: 3 }).withMessage('Currency must be a 3-letter code'),
  body('category').optional().trim(),
  body('quantity').optional().trim(),
  body('quantityUnit').optional().trim(),
  body('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  body('images').optional().isArray().withMessage('Images must be an array')
];
export const requestIdValidation = [
  param('id').isUUID().withMessage('Invalid request ID')
];
export const getRequestsValidation = [
  query('status').optional().isIn(['PENDING', 'FULFILLED', 'REJECTED', 'ONGOING']).withMessage('Invalid status'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];