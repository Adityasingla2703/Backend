/**
 * Application Constants
 */

// Business Categories
const BUSINESS_CATEGORIES = [
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

// Campaign Goals
const CAMPAIGN_GOALS = [
  'Get Leads',
  'Increase Sales',
  'Website Visits',
  'Brand Awareness'
];

// Meta Ads Objectives (mapped from goals)
const META_ADS_OBJECTIVES = {
  'Get Leads': 'Leads',
  'Increase Sales': 'Sales',
  'Website Visits': 'Website Visits',
  'Brand Awareness': 'Brand Awareness'
};

// Budget Constraints
const BUDGET_CONSTRAINTS = {
  MIN_DAILY_BUDGET: 100,
  MAX_DAILY_BUDGET: 1000000,
  MIN_CAMPAIGN_DURATION: 3,
  MAX_CAMPAIGN_DURATION: 90
};

// Default Campaign Parameters
const DEFAULT_CAMPAIGN_PARAMS = {
  TESTING_PERIOD_DAYS: 7,
  AGE_RANGE_MIN: 18,
  AGE_RANGE_MAX: 65,
  DEFAULT_RADIUS_KM: 10,
  CAMPAIGN_SCORE_WEIGHT: {
    targeting: 0.25,
    budget: 0.25,
    messaging: 0.25,
    creative: 0.25
  }
};

// Interest Mappings by Category
const CATEGORY_INTERESTS = {
  'Gym': ['Fitness', 'Health', 'Weight Loss', 'Sports', 'Wellness', 'Bodybuilding'],
  'Restaurant': ['Food', 'Dining', 'Cooking', 'Local Restaurants', 'Cuisine', 'Restaurants'],
  'Clothing': ['Fashion', 'Shopping', 'Style', 'Trends', 'Designer Brands', 'Clothing'],
  'Salon': ['Beauty', 'Hair Care', 'Cosmetics', 'Wellness', 'Personal Grooming', 'Salons'],
  'Electronics': ['Technology', 'Gadgets', 'Electronics', 'Gaming', 'Innovation', 'Tech'],
  'Freelancer': ['Entrepreneurship', 'Business', 'Professional Services', 'Technology', 'Freelancing'],
  'Startup': ['Entrepreneurship', 'Business', 'Innovation', 'Technology', 'Startups', 'Business Development'],
  'Shop': ['Shopping', 'Local Business', 'E-commerce', 'Retail', 'Online Shopping']
};

// API Response Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// Error Messages
const ERROR_MESSAGES = {
  INVALID_INPUT: 'Invalid input provided',
  MISSING_REQUIRED_FIELD: 'Missing required field',
  UNAUTHORIZED: 'Unauthorized access',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Internal server error',
  AI_SERVICE_ERROR: 'AI service temporarily unavailable',
  DATABASE_ERROR: 'Database operation failed'
};

// Success Messages
const SUCCESS_MESSAGES = {
  CAMPAIGN_GENERATED: 'Campaign generated successfully',
  CAMPAIGN_SAVED: 'Campaign saved successfully',
  CAMPAIGN_DELETED: 'Campaign deleted successfully',
  EXPLANATION_GENERATED: 'Explanation generated successfully'
};

// Feature Flags
const FEATURES = {
  ENABLE_PDF_EXPORT: true,
  ENABLE_AI_CHAT: false,
  ENABLE_COMPETITOR_ANALYSIS: false,
  ENABLE_DATABASE_SAVE: true,
  ENABLE_EMAIL_NOTIFICATIONS: false
};

module.exports = {
  BUSINESS_CATEGORIES,
  CAMPAIGN_GOALS,
  META_ADS_OBJECTIVES,
  BUDGET_CONSTRAINTS,
  DEFAULT_CAMPAIGN_PARAMS,
  CATEGORY_INTERESTS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FEATURES
};
