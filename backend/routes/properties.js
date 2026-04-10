import express from 'express';
import { query } from '../config/database.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get all properties with filters
router.get('/', async (req, res) => {
  try {
    const { city, type, minPrice, maxPrice, bhk, search, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    let sql = 'SELECT * FROM properties WHERE status = "available"';
    const params = [];

    if (city) {
      sql += ' AND city = ?';
      params.push(city);
    }
    if (type) {
      sql += ' AND property_type = ?';
      params.push(type);
    }
    if (minPrice) {
      sql += ' AND price >= ?';
      params.push(minPrice);
    }
    if (maxPrice) {
      sql += ' AND price <= ?';
      params.push(maxPrice);
    }
    if (bhk) {
      sql += ' AND bhk = ?';
      params.push(bhk);
    }
    if (search) {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const [countResult] = await query(`SELECT COUNT(*) as total FROM (${sql}) as counted`, params);
    const total = countResult[0].total;

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [properties] = await query(sql, params);

    // Get images and amenities for each property
    for (let prop of properties) {
      const [images] = await query(
        'SELECT image_url FROM property_images WHERE property_id = ? ORDER BY display_order',
        [prop.id]
      );
      prop.images = images.map(img => img.image_url);

      const [amenities] = await query(
        `SELECT a.* FROM amenities a 
         JOIN property_amenities pa ON a.id = pa.amenity_id 
         WHERE pa.property_id = ?`,
        [prop.id]
      );
      prop.amenities = amenities;
    }

    res.json({
      data: properties,
      pagination: { total, page: parseInt(page), limit: parseInt(limit) }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const [properties] = await query('SELECT * FROM properties WHERE id = ?', [req.params.id]);
    
    if (properties.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const property = properties[0];

    // Get images
    const [images] = await query(
      'SELECT image_url FROM property_images WHERE property_id = ?',
      [property.id]
    );
    property.images = images.map(img => img.image_url);

    // Get amenities
    const [amenities] = await query(
      `SELECT a.* FROM amenities a 
       JOIN property_amenities pa ON a.id = pa.amenity_id 
       WHERE pa.property_id = ?`,
      [property.id]
    );
    property.amenities = amenities;

    // Get agent info
    if (property.agent_id) {
      const [agents] = await query(
        `SELECT a.*, u.name, u.email, u.phone FROM agents a 
         JOIN users u ON a.user_id = u.id 
         WHERE a.id = ?`,
        [property.agent_id]
      );
      property.agent = agents[0] || null;
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured properties
router.get('/featured', async (req, res) => {
  try {
    const [properties] = await query(
      'SELECT * FROM properties WHERE featured = TRUE AND status = "available" LIMIT 6'
    );

    for (let prop of properties) {
      const [images] = await query(
        'SELECT image_url FROM property_images WHERE property_id = ? LIMIT 1',
        [prop.id]
      );
      prop.images = images.map(img => img.image_url);
    }

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search properties by location
router.get('/search/location', async (req, res) => {
  try {
    const { location } = req.query;
    const [properties] = await query(
      'SELECT id, title, city, location FROM properties WHERE location LIKE ? OR city LIKE ? LIMIT 10',
      [`%${location}%`, `%${location}%`]
    );
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
