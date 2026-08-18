/**
 * Validate business data from user input
 * @param {Object} data - User input data
 * @returns {Object} - { isValid: boolean, errors: array }
 */
function validateBusinessData(data) {
  const errors = [];

  // Validate business name
  if (!data.businessName || typeof data.businessName !== 'string') {
    errors.push('Business name is required and must be a string');
  } else if (data.businessName.trim().length < 2 || data.businessName.trim().length > 100) {
    errors.push('Business name must be between 2 and 100 characters');
  }

  // Validate business category
  const validCategories = [
    'Gym',
    'Restaurant',
    'Clothing',
    'Salon',
    'Electronics',
    'Freelancer',
    'Startup',
    'Shop',
    'Other'
  ];

  if (!data.businessCategory) {
    errors.push('Business category is required');
  } else if (!validCategories.includes(data.businessCategory)) {
    errors.push(`Business category must be one of: ${validCategories.join(', ')}`);
  }

  // Validate location
  if (!data.businessLocation || typeof data.businessLocation !== 'string') {
    errors.push('Business location is required and must be a string');
  } else if (data.businessLocation.trim().length < 2 || data.businessLocation.trim().length > 100) {
    errors.push('Business location must be between 2 and 100 characters');
  }

  // Validate daily budget
  const budget = parseFloat(data.dailyBudget);
  if (!data.dailyBudget || isNaN(budget)) {
    errors.push('Daily budget is required and must be a number');
  } else if (budget < 100 || budget > 1000000) {
    errors.push('Daily budget must be between ₹100 and ₹1,000,000');
  }

  // Validate goal
  const validGoals = [
    'Get Leads',
    'Increase Sales',
    'Website Visits',
    'Brand Awareness'
  ];

  if (!data.goal) {
    errors.push('Campaign goal is required');
  } else if (!validGoals.includes(data.goal)) {
    errors.push(`Campaign goal must be one of: ${validGoals.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize user input to prevent XSS
 * @param {string} input - User input
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

module.exports = {
  validateBusinessData,
  validateEmail,
  sanitizeInput
};
