// src/middlewares/validators.js
const { body, query, validationResult } = require('express-validator');

/**
 * Validation rules for creating a task
 * - title: required, string, 1-100 chars
 * - description: required, string, 1-500 chars
 */
const taskCreateRules = [
  body('title')
    .exists().withMessage('Title is required')
    .bail()
    .isString().withMessage('Title must be a string')
    .isLength({ min: 1, max: 100 }).withMessage('Title must be 1-100 characters'),
  body('description')
    .exists().withMessage('Description is required')
    .bail()
    .isString().withMessage('Description must be a string')
    .isLength({ min: 1, max: 500 }).withMessage('Description must be 1-500 characters')
];

/**
 * Validation rules for updating a task
 * - at least one of title or description must be present
 * - if present, must satisfy same length rules
 */
const taskUpdateRules = [
  body().custom(body => {
    if (body.title === undefined && body.description === undefined) {
      throw new Error('Provide title or description to update');
    }
    return true;
  }),
  body('title').optional().isString().isLength({ min: 1, max: 100 }).withMessage('Title must be 1-100 characters'),
  body('description').optional().isString().isLength({ min: 1, max: 500 }).withMessage('Description must be 1-500 characters')
];

/**
 * Validation rules for list endpoints (tasks/logs)
 */
const queryListRules = [
  query('page').optional().isInt({ min: 1 }).toInt().withMessage('page must be an integer >= 1'),
  query('limit').optional().isInt({ min: 1 }).toInt().withMessage('limit must be an integer >= 1'),
  query('q').optional().isString().withMessage('q must be a string'),
  query('sort').optional().isString().withMessage('sort must be a string')
];

/**
 * Common handler to send validation errors
 */
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', details: errors.array() });
  }
  next();
}

module.exports = {
  taskCreateRules,
  taskUpdateRules,
  queryListRules,
  handleValidation
};
