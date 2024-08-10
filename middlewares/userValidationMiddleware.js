const { check, validationResult, body } = require('express-validator');
const { asyncHandler } = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const validateUserCreation = [
  check('firstName').notEmpty().withMessage('First name is required'),
  check('lastName').notEmpty().withMessage('Last name is required'),
  check('gender').notEmpty().withMessage('Gender is required'),
  check('email')
    .notEmpty().withMessage('Email is required')
    .bail()
    .isEmail().withMessage('Valid email is required'),
  check('password')
    .notEmpty().withMessage('Password is required')
    .bail()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('number')
    .notEmpty().withMessage('Number is required')
    .bail()
    .isNumeric().withMessage('Number must be numeric'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
        throw new ApiError(400, 'Please provide required fields', errors.array())
    }
    next();
  }),
];

const validatePasswordChange = [
  check('currentPassword').notEmpty().withMessage('Current password is required'),
  check('newPassword').notEmpty().withMessage('New password is required'),
  check('confirmPassword').notEmpty().withMessage('Confirm password is required'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
        throw new ApiError(400, 'Please provide required fields', errors.array())
    }
    next();
  }),
]

module.exports = {
  validateUserCreation,
  validatePasswordChange,
};
