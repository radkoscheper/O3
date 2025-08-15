// Flat API route voor AI batch status - 100% Vercel compatible
const { Pool } = require('pg');

let pool;
if (!pool) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await pool.connect();
    
    const result = await client.query(`
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN header_image LIKE 'https://res.cloudinary.com%' THEN 1 END) as cloudinary
      FROM bestemmingen 
      WHERE is_deleted = false OR is_deleted IS NULL
    `);
    
    client.release();
    
    const row = result.rows[0];
    return res.status(200).json({
      total: parseInt(row.total) || 0,
      cloudinary: parseInt(row.cloudinary) || 0,
      status: 'ready',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return res.status(500).json({
      error: 'Database error',
      message: error.message
    });
  }
};