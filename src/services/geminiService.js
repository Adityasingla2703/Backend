const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

/**
 * Generate complete Meta Ads campaign using Gemini AI
 * @param {Object} businessData - Business information from user
 * @returns {Promise<Object>} - Complete campaign data with explanations
 */
async function generateCampaign(businessData) {
  try {
    const {
      businessName,
      businessCategory,
      businessLocation,
      dailyBudget,
      goal
    } = businessData;

    // Construct the prompt for Gemini AI
    const prompt = constructCampaignPrompt({
      businessName,
      businessCategory,
      businessLocation,
      dailyBudget,
      goal
    });

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse and validate the response
    const campaignData = parseCampaignResponse(text, {
      businessName,
      businessCategory,
      businessLocation,
      dailyBudget,
      goal
    });

    return campaignData;
  } catch (error) {
    console.error('Error generating campaign:', error);
    throw new Error(`Failed to generate campaign: ${error.message}`);
  }
}

/**
 * Construct detailed prompt for Gemini AI
 * @param {Object} businessData - User's business information
 * @returns {string} - Formatted prompt for AI
 */
function constructCampaignPrompt(businessData) {
  const { businessName, businessCategory, businessLocation, dailyBudget, goal } = businessData;

  return `You are an expert Meta Ads (Facebook & Instagram) campaign strategist with 10+ years of experience helping small businesses.

A small business owner has provided the following information:
- Business Name: ${businessName}
- Business Category: ${businessCategory}
- Location: ${businessLocation}
- Daily Budget: ₹${dailyBudget}
- Campaign Goal: ${goal}

Based on this information, generate a COMPLETE Meta Ads campaign strategy in VALID JSON format (no markdown, no extra text, only JSON).

IMPORTANT: Return ONLY valid JSON, starting with { and ending with }. No explanations before or after.

{
  "campaignStrategy": {
    "campaignObjective": {
      "objective": "[one of: Leads, Sales, Website Visits, Brand Awareness]",
      "explanation": "[2-3 sentences explaining why this objective is best for the business]"
    },
    "targetAudience": {
      "ageRange": {
        "min": [number],
        "max": [number],
        "explanation": "[Why this age group is ideal for ${businessCategory}]"
      },
      "gender": "[All/Male/Female]",
      "location": "${businessLocation}",
      "radius": "[10 km / 25 km / 50 km based on business type]",
      "interests": ["[Interest 1]", "[Interest 2]", "[Interest 3]", "[Interest 4]"],
      "interestExplanation": "[Why these interests match the campaign goal]"
    },
    "budgetPlanning": {
      "dailyBudget": ₹${dailyBudget},
      "testingPeriod": "[5-7 days]",
      "expectedSpend": ₹[${dailyBudget} * duration],
      "budgetBreakdown": "[Percentage allocation explanation]",
      "budgetExplanation": "[Why this duration and spend is optimal]"
    },
    "adCopy": {
      "headline": "[Compelling, action-oriented headline for ${businessCategory}]",
      "primaryText": "[2-3 lines of body copy that addresses pain points and highlights benefits]",
      "callToAction": "[One of: Sign Up, Learn More, Shop Now, Book Now, Contact Us, Get Offer]",
      "copyExplanation": "[Why this messaging works for the goal: ${goal}]"
    },
    "creativeStrategy": {
      "imageRecommendations": ["[Type of image 1 - be specific]", "[Type of image 2]"],
      "videoIdea": "[5-10 second video concept that tells a story]",
      "videoExplanation": "[Why video performs better than static for ${businessCategory}]",
      "colorTheme": "[Primary and secondary colors that appeal to target audience]"
    },
    "performanceMetrics": {
      "estimatedCTR": "[Expected click-through rate as percentage]",
      "estimatedCPC": "[Estimated cost per click based on category and location]",
      "estimatedConversions": "[Estimated number of conversions in testing period]",
      "metricsExplanation": "[How to measure success for goal: ${goal}]"
    },
    "campaignScore": {
      "score": "[0-100 based on strategy quality]",
      "scoreBreakdown": {
        "targetingQuality": "[0-25]",
        "budgetOptimization": "[0-25]",
        "messageRelevance": "[0-25]",
        "creativeApproach": "[0-25]"
      },
      "suggestions": ["[Actionable improvement 1]", "[Actionable improvement 2]", "[Actionable improvement 3]"]
    },
    "nextSteps": [
      "[Step 1: specific action with explanation]",
      "[Step 2: specific action with explanation]",
      "[Step 3: specific action with explanation]"
    ]
  }
}

Generate a realistic, practical campaign strategy that a beginner business owner can actually implement in Meta Ads Manager.`;
}

/**
 * Parse and validate Gemini's response
 * @param {string} responseText - Raw response from Gemini
 * @param {Object} businessData - Original business data for fallback
 * @returns {Object} - Parsed campaign data
 */
function parseCampaignResponse(responseText, businessData) {
  try {
    let jsonData;
    
    try {
      jsonData = JSON.parse(responseText);
    } catch (e) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    }

    if (!jsonData.campaignStrategy) {
      throw new Error('Missing campaignStrategy in response');
    }

    jsonData.metadata = {
      generatedAt: new Date().toISOString(),
      businessName: businessData.businessName,
      businessCategory: businessData.businessCategory,
      location: businessData.businessLocation,
      dailyBudget: businessData.dailyBudget,
      goal: businessData.goal
    };

    return jsonData;
  } catch (error) {
    console.error('Error parsing campaign response:', error);
    return getDefaultCampaignFallback(businessData);
  }
}

/**
 * Provide fallback campaign data if AI parsing fails
 * @param {Object} businessData - Business information
 * @returns {Object} - Default campaign structure
 */
function getDefaultCampaignFallback(businessData) {
  const { businessName, businessCategory, businessLocation, dailyBudget, goal } = businessData;

  return {
    campaignStrategy: {
      campaignObjective: {
        objective: goal === 'Get Leads' ? 'Leads' : goal === 'Increase Sales' ? 'Sales' : 'Website Visits',
        explanation: `Based on your goal of "${goal}", this campaign objective is optimized to reach and convert your target audience in ${businessLocation}.`
      },
      targetAudience: {
        ageRange: { min: 18, max: 55, explanation: 'Broad age range ensures maximum reach for your business' },
        gender: 'All',
        location: businessLocation,
        radius: '10 km',
        interests: getCategoryInterests(businessCategory),
        interestExplanation: `People interested in ${businessCategory} are your primary audience for this campaign.`
      },
      budgetPlanning: {
        dailyBudget: dailyBudget,
        testingPeriod: '7 days',
        expectedSpend: dailyBudget * 7,
        budgetBreakdown: `Starting with ₹${dailyBudget}/day for 7 days to test and optimize performance.`,
        budgetExplanation: `This budget allows sufficient data collection to optimize your campaign for better results.`
      },
      adCopy: {
        headline: `Discover the Best ${businessCategory} in ${businessLocation}`,
        primaryText: `Experience excellence with ${businessName}. Limited offer - Act now!`,
        callToAction: goal === 'Get Leads' ? 'Sign Up' : 'Shop Now',
        copyExplanation: `Clear value proposition matched to your campaign goal.`
      },
      creativeStrategy: {
        imageRecommendations: ['High-quality product/service image', 'Happy customer or team photo'],
        videoIdea: 'Short 5-second video showcasing your best offering',
        videoExplanation: 'Video content generates higher engagement on Meta platforms.',
        colorTheme: 'Bright, professional colors that match your brand'
      },
      performanceMetrics: {
        estimatedCTR: '2-4%',
        estimatedCPC: `₹5-₹15 depending on ${businessCategory}`,
        estimatedConversions: `5-15 conversions in testing period`,
        metricsExplanation: `Track these metrics to understand campaign performance.`
      },
      campaignScore: {
        score: 72,
        scoreBreakdown: {
          targetingQuality: 18,
          budgetOptimization: 18,
          messageRelevance: 18,
          creativeApproach: 18
        },
        suggestions: [
          'Add customer testimonials to increase trust',
          'Use video content for better engagement',
          'Test different audience segments'
        ]
      },
      nextSteps: [
        `Step 1: Create an ad account in Meta Business Suite if you haven't already.`,
        `Step 2: Upload high-quality images or videos of your ${businessCategory} offering.`,
        `Step 3: Set up conversion tracking to measure campaign success.`
      ]
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      businessName,
      businessCategory,
      location: businessLocation,
      dailyBudget,
      goal,
      isDefault: true
    }
  };
}

/**
 * Get relevant interests based on business category
 * @param {string} category - Business category
 * @returns {Array} - Array of interests
 */
function getCategoryInterests(category) {
  const interestMap = {
    'Gym': ['Fitness', 'Health', 'Weight Loss', 'Sports', 'Wellness'],
    'Restaurant': ['Food', 'Dining', 'Cooking', 'Local Restaurants', 'Cuisine'],
    'Clothing': ['Fashion', 'Shopping', 'Style', 'Trends', 'Designer Brands'],
    'Salon': ['Beauty', 'Hair Care', 'Cosmetics', 'Wellness', 'Personal Grooming'],
    'Electronics': ['Technology', 'Gadgets', 'Electronics', 'Gaming', 'Innovation'],
    'Freelancer': ['Entrepreneurship', 'Business', 'Professional Services', 'Technology'],
    'Startup': ['Entrepreneurship', 'Business', 'Innovation', 'Technology', 'Startups'],
    'Shop': ['Shopping', 'Local Business', 'E-commerce', 'Retail']
  };

  return interestMap[category] || ['Small Business', 'Local Services', 'Community'];
}

/**
 * Generate AI Mentor explanation for a specific aspect
 * @param {string} aspect - The aspect to explain (e.g., 'objective', 'budget')
 * @param {Object} campaignData - The campaign data
 * @returns {Promise<string>} - Detailed explanation
 */
async function generateMentorExplanation(aspect, campaignData) {
  try {
    const prompt = `As a Meta Ads expert mentor, explain briefly (2-3 sentences) why we chose "${aspect}" for this campaign:
    Business: ${campaignData.metadata.businessName}
    Category: ${campaignData.metadata.businessCategory}
    Goal: ${campaignData.metadata.goal}
    
    Current value: ${JSON.stringify(campaignData.campaignStrategy[aspect], null, 2)}
    
    Explain like you're teaching a beginner.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating mentor explanation:', error);
    return 'Expert explanation temporarily unavailable. Please refer to the campaign description.';
  }
}

module.exports = {
  generateCampaign,
  generateMentorExplanation
};
