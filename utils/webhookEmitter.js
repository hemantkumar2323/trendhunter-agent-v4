=== utils/errorHandling.js ===
```javascript
const { logger } = require('./logger');  // Import the Winston logger

const handleError = (err, req, res, next) => {
  // Log the error with detailed information
  logger.error({
    message: "Unhandled error",
    error: err,
    stack: err.stack,
    request: {
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      headers: req.headers
    }
  });

  // Customize the error response based on the error type
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.message === 'Rate limit exceeded') {
    statusCode = 429;
    message = 'Rate limit exceeded. Please try again later.';
  }

  res.status(statusCode).json({
    success: false,
    error: message
  });
};

module.exports = { handleError };
