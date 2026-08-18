/**
 * Global Error Handler Middleware
 * Catches all errors and formats them consistently
 */
function errorHandler(err, req, res, next) {
  // Log error details
  console.error('❌ Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = [];

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    details = err.details || [];
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Not Found';
  } else if (err.message.includes('ECONNREFUSED')) {
    statusCode = 503;
    message = 'Service Unavailable';
  } else if (err.message.includes('API Error') || err.message.includes('Gemini')) {
    statusCode = 502;
    message = 'AI Service Error - Please try again later';
  }

  // Ensure statusCode is valid
  if (statusCode < 100 || statusCode > 599) {
    statusCode = 500;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    error: {
      type: err.name,
      details: details.length > 0 ? details : undefined
    },
    timestamp: new Date().toISOString(),
    path: req.path,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = errorHandler;
