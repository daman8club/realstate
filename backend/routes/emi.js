import express from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Calculate EMI
router.post('/calculate', async (req, res) => {
  try {
    const { principal, rate, tenure, property_id } = req.body;

    if (!principal || !rate || !tenure) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const monthlyRate = rate / 12 / 100;
    const numberOfPayments = tenure * 12;
    
    const monthlyEMI = Math.round(
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    );

    const totalAmount = monthlyEMI * numberOfPayments;
    const totalInterest = totalAmount - principal;

    // Save calculation if user is logged in
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        await query(
          `INSERT INTO emi_calculations (user_id, property_id, principal_amount, rate_of_interest, tenure_years, monthly_emi, total_amount, total_interest) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [decoded.id, property_id || null, principal, rate, tenure, monthlyEMI, totalAmount, totalInterest]
        );
      } catch (e) {
        // Continue even if save fails
      }
    }

    res.json({
      monthlyEMI,
      totalAmount,
      totalInterest,
      tenure,
      rateOfInterest: rate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's EMI calculations
router.get('/history', verifyToken, async (req, res) => {
  try {
    const [calculations] = await query(
      `SELECT e.*, p.title, p.price FROM emi_calculations e 
       LEFT JOIN properties p ON e.property_id = p.id 
       WHERE e.user_id = ? 
       ORDER BY e.created_at DESC 
       LIMIT 20`,
      [req.userId]
    );
    res.json(calculations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
