const express = require('express');
const router = express.Router();

/**
 * Health Check Routes
 */

// GET: Basic health check
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// GET: Detailed system health
router.get('/detailed', (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      api: 'operational',
      geminiAI: process.env.GEMINI_API_KEY ? 'configured' : 'not-configured',
      cors: 'operational',
      database: 'ready'
    },
    memory: process.memoryUsage(),
    dependencies: {
      express: true,
      corsEnabled: true,
      helmetEnabled: true
    }
  };

  res.status(200).json(healthCheck);
});

module.exports = router;
