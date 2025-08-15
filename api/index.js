// Vercel serverless function entry point
const { initializeApp } = require('../dist/index.js');

let appInstance = null;

module.exports = async (req, res) => {
  try {
    // Initialize app only once
    if (!appInstance) {
      const result = await initializeApp();
      appInstance = result.app;
    }
    
    // Handle the request with Express app
    appInstance(req, res);
  } catch (error) {
    console.error('Vercel function error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};