/**
 * Helper Functions Utility
 */

/**
 * Format currency for Indian Rupees
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
}

/**
 * Calculate expected reach based on budget and category
 * @param {number} dailyBudget - Daily budget in rupees
 * @param {string} category - Business category
 * @param {number} days - Number of days
 * @returns {Object} - Reach estimates
 */
function estimateReach(dailyBudget, category, days = 7) {
  const cpmByCategory = {
    'Gym': 15,
    'Restaurant': 20,
    'Clothing': 12,
    'Salon': 18,
    'Electronics': 25,
    'Freelancer': 10,
    'Startup': 8,
    'Shop': 14
  };

  const cpm = cpmByCategory[category] || 15;
  const totalBudget = dailyBudget * days;
  const estimatedImpressions = (totalBudget / cpm) * 1000;

  return {
    totalBudget,
    estimatedImpressions: Math.round(estimatedImpressions),
    estimatedClicks: Math.round(estimatedImpressions * 0.03),
    estimatedConversions: Math.round(estimatedImpressions * 0.001)
  };
}

/**
 * Get recommended age range for category
 * @param {string} category - Business category
 * @returns {Object} - Age range with min and max
 */
function getRecommendedAgeRange(category) {
  const ageRanges = {
    'Gym': { min: 18, max: 45 },
    'Restaurant': { min: 18, max: 65 },
    'Clothing': { min: 16, max: 35 },
    'Salon': { min: 18, max: 55 },
    'Electronics': { min: 18, max: 50 },
    'Freelancer': { min: 25, max: 55 },
    'Startup': { min: 20, max: 50 },
    'Shop': { min: 18, max: 65 }
  };

  return ageRanges[category] || { min: 18, max: 65 };
}

/**
 * Get recommended CTA based on goal
 * @param {string} goal - Campaign goal
 * @returns {string} - Recommended CTA
 */
function getRecommendedCTA(goal) {
  const ctaMap = {
    'Get Leads': 'Sign Up',
    'Increase Sales': 'Shop Now',
    'Website Visits': 'Learn More',
    'Brand Awareness': 'Learn More'
  };

  return ctaMap[goal] || 'Learn More';
}

/**
 * Calculate campaign score based on various factors
 * @param {Object} campaignData - Campaign data
 * @returns {number} - Score out of 100
 */
function calculateCampaignScore(campaignData) {
  let score = 0;

  if (campaignData.targetAudience) {
    score += 10;
    score += 8;
    score += 7;
  }

  if (campaignData.budgetPlanning) {
    const budget = campaignData.budgetPlanning.dailyBudget;
    if (budget >= 200 && budget <= 5000) {
      score += 15;
    } else {
      score += 10;
    }
    score += 10;
  }

  if (campaignData.adCopy) {
    score += 10;
    score += 8;
    score += 7;
  }

  if (campaignData.creativeStrategy) {
    score += 12;
    score += 13;
  }

  return Math.min(score, 100);
}

/**
 * Generate improvement suggestions based on score
 * @param {number} score - Campaign score
 * @returns {Array} - Array of suggestions
 */
function generateSuggestions(score) {
  const suggestions = [];

  if (score < 75) {
    suggestions.push('Increase your daily budget to reach more potential customers');
  }
  if (score < 80) {
    suggestions.push('Add video content for better engagement rates');
  }
  if (score < 85) {
    suggestions.push('Refine your audience targeting for better results');
  }
  if (score < 90) {
    suggestions.push('Enhance ad copy with customer testimonials');
  }

  return suggestions;
}

/**
 * Validate business data format
 * @param {Object} data - Business data to validate
 * @returns {boolean} - Is valid
 */
function isValidBusinessData(data) {
  return (
    data.businessName &&
    data.businessCategory &&
    data.businessLocation &&
    data.dailyBudget &&
    data.goal
  );
}

/**
 * Format date to readable string
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date
 */
function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

/**
 * Get business emoji based on category
 * @param {string} category - Business category
 * @returns {string} - Emoji representation
 */
function getCategoryEmoji(category) {
  const emojiMap = {
    'Gym': '💪',
    'Restaurant': '🍔',
    'Clothing': '👕',
    'Salon': '💇',
    'Electronics': '📱',
    'Freelancer': '👨‍💻',
    'Startup': '🚀',
    'Shop': '🛍️'
  };

  return emojiMap[category] || '🏪';
}

module.exports = {
  formatCurrency,
  estimateReach,
  getRecommendedAgeRange,
  getRecommendedCTA,
  calculateCampaignScore,
  generateSuggestions,
  isValidBusinessData,
  formatDate,
  getCategoryEmoji
};
