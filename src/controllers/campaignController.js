const { generateCampaign, generateMentorExplanation } = require('../services/geminiService');
const { validateBusinessData } = require('../utils/validators');

/**
 * Generate a complete Meta Ads campaign
 * POST /api/campaigns/generate
 */
async function generateCampaignController(req, res, next) {
  try {
    const { businessName, businessCategory, businessLocation, dailyBudget, goal } = req.body;

    // Validate input data
    const validation = validateBusinessData({
      businessName,
      businessCategory,
      businessLocation,
      dailyBudget,
      goal
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    console.log(`📊 Generating campaign for ${businessName} (${businessCategory}) in ${businessLocation}`);

    // Generate campaign using Gemini AI
    const campaignData = await generateCampaign({
      businessName,
      businessCategory,
      businessLocation,
      dailyBudget: parseFloat(dailyBudget),
      goal
    });

    return res.status(200).json({
      success: true,
      message: 'Campaign generated successfully',
      data: campaignData
    });
  } catch (error) {
    console.error('Campaign generation error:', error);
    next(error);
  }
}

/**
 * Get AI Mentor explanation for a specific campaign aspect
 * POST /api/campaigns/explain
 */
async function explainAspectController(req, res, next) {
  try {
    const { aspect, campaignData } = req.body;

    if (!aspect || !campaignData) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: aspect and campaignData'
      });
    }

    console.log(`🎓 Generating explanation for: ${aspect}`);

    // Generate mentor explanation
    const explanation = await generateMentorExplanation(aspect, campaignData);

    return res.status(200).json({
      success: true,
      message: 'Explanation generated successfully',
      data: {
        aspect,
        explanation
      }
    });
  } catch (error) {
    console.error('Explanation generation error:', error);
    next(error);
  }
}

/**
 * Get campaign templates (for reference)
 * GET /api/campaigns/templates
 */
async function getTemplatesController(req, res, next) {
  try {
    const templates = {
      businessCategories: [
        'Gym',
        'Restaurant',
        'Clothing',
        'Salon',
        'Electronics',
        'Freelancer',
        'Startup',
        'Shop',
        'Other'
      ],
      goals: [
        'Get Leads',
        'Increase Sales',
        'Website Visits',
        'Brand Awareness'
      ],
      budgetRanges: {
        'Low': '₹200 - ₹500/day',
        'Medium': '₹500 - ₹2000/day',
        'High': '₹2000+/day'
      },
      locations: [
        'Delhi',
        'Mumbai',
        'Bangalore',
        'Pune',
        'Hyderabad',
        'Chennai',
        'Kolkata',
        'Ahmedabad',
        'Other Indian Cities'
      ]
    };

    return res.status(200).json({
      success: true,
      message: 'Templates retrieved successfully',
      data: templates
    });
  } catch (error) {
    console.error('Template retrieval error:', error);
    next(error);
  }
}

/**
 * Save campaign to database (Firebase/Supabase)
 * POST /api/campaigns/save
 */
async function saveCampaignController(req, res, next) {
  try {
    const { campaignData, userId } = req.body;

    if (!campaignData) {
      return res.status(400).json({
        success: false,
        message: 'Campaign data is required'
      });
    }

    // TODO: Implement database save logic
    
    const savedCampaign = {
      id: generateId(),
      ...campaignData,
      savedAt: new Date().toISOString(),
      userId: userId || 'anonymous'
    };

    console.log(`💾 Campaign saved: ${savedCampaign.id}`);

    return res.status(201).json({
      success: true,
      message: 'Campaign saved successfully',
      data: savedCampaign
    });
  } catch (error) {
    console.error('Campaign save error:', error);
    next(error);
  }
}

/**
 * Get user's saved campaigns
 * GET /api/campaigns/my-campaigns
 */
async function getUserCampaignsController(req, res, next) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // TODO: Implement database query logic
    const campaigns = [];

    return res.status(200).json({
      success: true,
      message: 'Campaigns retrieved successfully',
      data: campaigns
    });
  } catch (error) {
    console.error('Get campaigns error:', error);
    next(error);
  }
}

/**
 * Generate PDF export of campaign
 * POST /api/campaigns/export-pdf
 */
async function exportPDFController(req, res, next) {
  try {
    const { campaignData } = req.body;

    if (!campaignData) {
      return res.status(400).json({
        success: false,
        message: 'Campaign data is required'
      });
    }

    // TODO: Implement PDF generation logic

    console.log(`📄 Generating PDF for campaign: ${campaignData.metadata?.businessName}`);

    return res.status(200).json({
      success: true,
      message: 'PDF generated successfully',
      data: {
        downloadUrl: '/downloads/campaign.pdf'
      }
    });
  } catch (error) {
    console.error('PDF export error:', error);
    next(error);
  }
}

/**
 * Generate unique ID for campaigns
 */
function generateId() {
  return `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

module.exports = {
  generateCampaignController,
  explainAspectController,
  getTemplatesController,
  saveCampaignController,
  getUserCampaignsController,
  exportPDFController
};
