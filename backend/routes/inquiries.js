import express from 'express';
import { query } from '../config/database.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Create inquiry
router.post('/', async (req, res) => {
  try {
    const { property_id, name, email, phone, message, inquiry_type } = req.body;

    const [result] = await query(
      `INSERT INTO inquiries (property_id, name, email, phone, message, inquiry_type) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [property_id, name, email, phone, message, inquiry_type || 'general']
    );

    res.status(201).json({
      message: 'Inquiry submitted successfully',
      inquiryId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user inquiries
router.get('/user/list', verifyToken, async (req, res) => {
  try {
    const [inquiries] = await query(
      `SELECT i.*, p.title, p.price FROM inquiries i 
       JOIN properties p ON i.property_id = p.id 
       WHERE i.user_id = ? 
       ORDER BY i.created_at DESC`,
      [req.userId]
    );
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get inquiry by ID
router.get('/:id', async (req, res) => {
  try {
    const [inquiries] = await query(
      `SELECT i.*, p.title, p.price FROM inquiries i 
       JOIN properties p ON i.property_id = p.id 
       WHERE i.id = ?`,
      [req.params.id]
    );

    if (inquiries.length === 0) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json(inquiries[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
