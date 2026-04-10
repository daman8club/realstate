import express from 'express';
import { query } from '../config/database.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Schedule property visit
router.post('/schedule', async (req, res) => {
  try {
    const { property_id, visitor_name, visitor_email, visitor_phone, visit_date, visit_time, notes } = req.body;

    if (!property_id || !visitor_name || !visitor_email || !visit_date || !visit_time) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const [result] = await query(
      `INSERT INTO scheduled_visits (property_id, visitor_name, visitor_email, visitor_phone, visit_date, visit_time, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [property_id, visitor_name, visitor_email, visitor_phone, visit_date, visit_time, notes || null]
    );

    res.status(201).json({
      message: 'Visit scheduled successfully',
      visitId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user visits
router.get('/user/list', verifyToken, async (req, res) => {
  try {
    const [visits] = await query(
      `SELECT v.*, p.title, p.location FROM scheduled_visits v 
       JOIN properties p ON v.property_id = p.id 
       WHERE v.user_id = ? 
       ORDER BY v.visit_date DESC`,
      [req.userId]
    );
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available time slots for a property
router.get('/property/:propertyId/slots', async (req, res) => {
  try {
    const { date } = req.query;
    
    // Get booked times
    const [bookedTimes] = await query(
      'SELECT visit_time FROM scheduled_visits WHERE property_id = ? AND visit_date = ? AND status != "cancelled"',
      [req.params.propertyId, date]
    );

    const allSlots = Array.from({ length: 9 }, (_, i) => ({
      time: `${9 + i}:00`,
      available: !bookedTimes.some(b => b.visit_time === `${9 + i}:00:00`)
    }));

    res.json(allSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel visit
router.put('/:visitId/cancel', verifyToken, async (req, res) => {
  try {
    await query(
      'UPDATE scheduled_visits SET status = "cancelled" WHERE id = ? AND user_id = ?',
      [req.params.visitId, req.userId]
    );
    res.json({ message: 'Visit cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
