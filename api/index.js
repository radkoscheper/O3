// Vercel Serverless Function for Ontdek Polen API
const { Pool } = require('pg');

// Initialize database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Simple AI batch processing status endpoint
async function getAIBatchStatus() {
  try {
    const client = await pool.connect();
    
    // Get destinations and guides count
    const destResult = await client.query('SELECT COUNT(*) as total FROM "Bestemmingen" WHERE image IS NOT NULL');
    const cloudinaryDestResult = await client.query('SELECT COUNT(*) as cloudinary FROM "Bestemmingen" WHERE image LIKE \'%cloudinary.com%\'');
    const processedDestResult = await client.query('SELECT COUNT(*) as processed FROM "Bestemmingen" WHERE "aiProcessed" = true OR "aiImage" IS NOT NULL');
    
    const guideResult = await client.query('SELECT COUNT(*) as total FROM "Gidsen" WHERE image IS NOT NULL');
    const cloudinaryGuideResult = await client.query('SELECT COUNT(*) as cloudinary FROM "Gidsen" WHERE image LIKE \'%cloudinary.com%\'');
    const processedGuideResult = await client.query('SELECT COUNT(*) as processed FROM "Gidsen" WHERE "aiProcessed" = true OR "aiImage" IS NOT NULL');
    
    client.release();
    
    const destTotal = parseInt(destResult.rows[0].total);
    const destCloudinary = parseInt(cloudinaryDestResult.rows[0].cloudinary);
    const destProcessed = parseInt(processedDestResult.rows[0].processed);
    
    const guideTotal = parseInt(guideResult.rows[0].total);
    const guideCloudinary = parseInt(cloudinaryGuideResult.rows[0].cloudinary);
    const guideProcessed = parseInt(processedGuideResult.rows[0].processed);
    
    return {
      total: destTotal + guideTotal,
      cloudinary: destCloudinary + guideCloudinary,
      processed: destProcessed + guideProcessed,
      pending: (destTotal + guideTotal) - (destProcessed + guideProcessed),
      destinations: {
        total: destTotal,
        processed: destProcessed
      },
      guides: {
        total: guideTotal,
        processed: guideProcessed
      }
    };
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

// Main handler function
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { url, method } = req;
    
    // Extract the API path (remove /api prefix)
    const apiPath = url.replace('/api', '') || '/';
    
    console.log('API Request:', { method, url, apiPath });
    
    // Route handling
    if (apiPath === '/ai/batch-processing/status' && method === 'GET') {
      const status = await getAIBatchStatus();
      return res.status(200).json(status);
    }
    
    if (apiPath === '/destinations/homepage' && method === 'GET') {
      const client = await pool.connect();
      const result = await client.query(`
        SELECT * FROM "Bestemmingen" 
        WHERE "published" = true AND "is_deleted" = false AND "show_on_homepage" = true
        ORDER BY "ranking" ASC
      `);
      client.release();
      return res.status(200).json(result.rows);
    }
    
    if (apiPath === '/seo-data' && method === 'GET') {
      const seoData = {
        siteName: "Ontdek Polen",
        defaultImage: "https://res.cloudinary.com/df3i1avwb/image/upload/v1753801848/ontdek-polen/destinations/krakow.jpg",
        defaultDescription: "Jouw gids voor het ontdekken van de mooiste plekken in Polen. Bezoek historische steden, nationale parken en verborgen parels van Midden-Europa."
      };
      return res.status(200).json(seoData);
    }
    
    if (apiPath === '/site-settings' && method === 'GET') {
      const settings = {
        id: 1,
        siteName: "Ontdek Polen",
        siteDescription: "Jouw gids voor het ontdekken van de mooiste plekken in Polen.",
        showDestinations: true,
        showMotivation: true,
        showHighlights: true,
        showGuides: true
      };
      return res.status(200).json(settings);
    }
    
    if (apiPath.startsWith('/destinations/') && method === 'GET') {
      const slug = apiPath.replace('/destinations/', '');
      const client = await pool.connect();
      const result = await client.query(`
        SELECT * FROM "Bestemmingen" 
        WHERE "slug" = $1 AND "published" = true AND "is_deleted" = false
        LIMIT 1
      `, [slug]);
      client.release();
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Destination not found" });
      }
      
      return res.status(200).json(result.rows[0]);
    }
    
    // Default fallback
    return res.status(404).json({ 
      message: "API endpoint not found", 
      path: apiPath, 
      method: method 
    });
    }
    
    if (apiPath === '/ai/batch-processing/start' && method === 'POST') {
      // Simulate batch processing start
      return res.status(200).json({
        message: 'AI batch processing started',
        timestamp: new Date().toISOString(),
        status: 'initiated'
      });
    }
    
    if (apiPath === '/auth/status' && method === 'GET') {
      return res.status(200).json({
        isAuthenticated: false,
        message: 'Authentication service available'
      });
    }
    
    // Default fallback
    return res.status(404).json({
      error: 'API endpoint not found',
      path: apiPath,
      method: method,
      available: [
        '/ai/batch-processing/status',
        '/ai/batch-processing/start', 
        '/auth/status'
      ]
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};