import express from 'express';
import { query } from '../config/database.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Admin middleware - checks role column
async function verifyAdmin(req, res, next) {
  try {
    const [users] = await query('SELECT id, role FROM users WHERE id = ?', [req.userId]);
    if (users.length === 0 || users[0].role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(403).json({ message: 'Unauthorized' });
  }
}

// ─── PROPERTIES ───────────────────────────────────────────────

router.post('/properties', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const {
      title, description, property_type, bhk, price, location, city, state,
      postal_code, latitude, longitude, area_sqft, build_year, agent_id,
      virtual_tour_url, status, featured
    } = req.body;

    const [result] = await query(
      `INSERT INTO properties 
       (title, description, property_type, bhk, price, location, city, state, postal_code,
        latitude, longitude, area_sqft, build_year, agent_id, virtual_tour_url, status, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, property_type, bhk || null, price, location, city, state || null,
       postal_code || null, latitude || null, longitude || null, area_sqft || null,
       build_year || null, agent_id || null, virtual_tour_url || null,
       status || 'available', featured ? 1 : 0]
    );

    // Add images if provided
    if (req.body.images && Array.isArray(req.body.images)) {
      for (let i = 0; i < req.body.images.length; i++) {
        await query(
          'INSERT INTO property_images (property_id, image_url, display_order) VALUES (?, ?, ?)',
          [result.insertId, req.body.images[i], i + 1]
        );
      }
    }

    // Add amenities if provided
    if (req.body.amenity_ids && Array.isArray(req.body.amenity_ids)) {
      for (const amenityId of req.body.amenity_ids) {
        await query(
          'INSERT IGNORE INTO property_amenities (property_id, amenity_id) VALUES (?, ?)',
          [result.insertId, amenityId]
        );
      }
    }

    res.status(201).json({ message: 'Property created successfully', propertyId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/properties/:propertyId/images', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { images } = req.body;
    for (let i = 0; i < images.length; i++) {
      await query(
        'INSERT INTO property_images (property_id, image_url, display_order) VALUES (?, ?, ?)',
        [req.params.propertyId, images[i], i + 1]
      );
    }
    res.json({ message: 'Images added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/properties/:propertyId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const {
      title, description, property_type, bhk, price, location, city, state,
      postal_code, area_sqft, build_year, virtual_tour_url, status, featured
    } = req.body;

    // Track price history
    const [existing] = await query('SELECT price FROM properties WHERE id = ?', [req.params.propertyId]);
    if (existing.length > 0 && existing[0].price !== parseInt(price)) {
      await query(
        'INSERT INTO property_price_history (property_id, old_price, new_price) VALUES (?, ?, ?)',
        [req.params.propertyId, existing[0].price, price]
      );
    }

    await query(
      `UPDATE properties SET title=?, description=?, property_type=?, bhk=?, price=?,
       location=?, city=?, state=?, postal_code=?, area_sqft=?, build_year=?,
       virtual_tour_url=?, status=?, featured=? WHERE id=?`,
      [title, description, property_type, bhk || null, price, location, city,
       state || null, postal_code || null, area_sqft || null, build_year || null,
       virtual_tour_url || null, status, featured ? 1 : 0, req.params.propertyId]
    );

    res.json({ message: 'Property updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/properties/:propertyId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await query('DELETE FROM properties WHERE id = ?', [req.params.propertyId]);
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── INQUIRIES ────────────────────────────────────────────────

router.get('/inquiries', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [inquiries] = await query(
      `SELECT i.*, p.title as property_title FROM inquiries i
       LEFT JOIN properties p ON i.property_id = p.id
       ORDER BY i.created_at DESC`
    );
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/inquiries/:inquiryId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await query(
      'UPDATE inquiries SET status = ?, responded_at = NOW() WHERE id = ?',
      [status, req.params.inquiryId]
    );
    res.json({ message: 'Inquiry updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── VISITS ───────────────────────────────────────────────────

router.get('/visits', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [visits] = await query(
      `SELECT v.*, p.title FROM scheduled_visits v
       LEFT JOIN properties p ON v.property_id = p.id
       ORDER BY v.visit_date DESC, v.visit_time DESC`
    );
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/visits/:visitId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await query('UPDATE scheduled_visits SET status = ? WHERE id = ?', [status, req.params.visitId]);
    res.json({ message: 'Visit updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── AGENTS ───────────────────────────────────────────────────

router.get('/agents', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [agents] = await query(
      `SELECT a.*, u.name, u.email, u.phone FROM agents a
       JOIN users u ON a.user_id = u.id
       ORDER BY a.id DESC`
    );
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/agents', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, email, phone, password, specialization, experience_years, bio, whatsapp } = req.body;
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash(password || 'agent123', 10);

    const [userResult] = await query(
      'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, hashedPassword, 'agent']
    );

    const [agentResult] = await query(
      'INSERT INTO agents (user_id, specialization, experience_years, bio, whatsapp) VALUES (?, ?, ?, ?, ?)',
      [userResult.insertId, specialization || null, experience_years || null, bio || null, whatsapp || null]
    );

    res.status(201).json({ message: 'Agent created successfully', agentId: agentResult.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Email already exists' });
    res.status(500).json({ message: error.message });
  }
});

router.delete('/agents/:agentId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [agents] = await query('SELECT user_id FROM agents WHERE id = ?', [req.params.agentId]);
    if (agents.length > 0) {
      await query('DELETE FROM users WHERE id = ?', [agents[0].user_id]);
    }
    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── STATS ────────────────────────────────────────────────────

router.get('/stats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [stats] = await query(`
      SELECT
        (SELECT COUNT(*) FROM properties) as total_properties,
        (SELECT COUNT(*) FROM properties WHERE status = 'available') as available_properties,
        (SELECT COUNT(*) FROM properties WHERE status = 'sold') as sold_properties,
        (SELECT COUNT(*) FROM inquiries) as total_inquiries,
        (SELECT COUNT(*) FROM inquiries WHERE status = 'new') as new_inquiries,
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM scheduled_visits) as total_visits,
        (SELECT COUNT(*) FROM scheduled_visits WHERE status = 'scheduled') as pending_visits,
        (SELECT COALESCE(SUM(price), 0) FROM properties WHERE status = 'sold') as total_sales_value
    `);
    res.json(stats[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── AMENITIES ────────────────────────────────────────────────

router.get('/amenities', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [amenities] = await query('SELECT * FROM amenities ORDER BY category, name');
    res.json(amenities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
