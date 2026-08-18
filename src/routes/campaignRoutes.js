const express = require('express');
const router = express.Router();
const {
  generateCampaignController,
  explainAspectController,
  getTemplatesController,
  saveCampaignController,
  getUserCampaignsController,
  exportPDFController
} = require('../controllers/campaignController');

/**
 * Campaign Routes
 */

// GET: Retrieve available templates and options
router.get('/templates', getTemplatesController);

// POST: Generate a new campaign
router.post('/generate', generateCampaignController);

// POST: Generate AI explanation for a campaign aspect
router.post('/explain', explainAspectController);

// POST: Save campaign to database
router.post('/save', saveCampaignController);

// GET: Get user's saved campaigns
router.get('/my-campaigns', getUserCampaignsController);

// POST: Export campaign as PDF
router.post('/export-pdf', exportPDFController);

module.exports = router;
