import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// Get neighborhood insights
router.get('/:latitude/:longitude', async (req, res) => {
  try {
    const { latitude, longitude } = req.params;

    const [insights] = await query(
      `SELECT * FROM neighborhood_insights 
       WHERE ABS(latitude - ?) < 0.05 AND ABS(longitude - ?) < 0.05 
       LIMIT 1`,
      [latitude, longitude]
    );

    if (insights.length > 0) {
      return res.json(insights[0]);
    }

    // Return default insights if not found
    res.json({
      schools_rating: 8.0,
      hospitals_rating: 8.5,
      metro_rating: 7.5,
      shopping_rating: 8.2,
      restaurants_rating: 7.8,
      safety_rating: 8.0,
      description: 'Neighborhood data not available'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search nearby amenities
router.get('/amenities/nearby', async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;

    res.json({
      schools: [
        { name: 'Example School 1', rating: 9.2, distance: 1.2 },
        { name: 'Example School 2', rating: 8.8, distance: 2.5 }
      ],
      hospitals: [
        { name: 'Apollo Hospital', rating: 8.5, distance: 1.8 },
        { name: 'Fortis Hospital', rating: 8.2, distance: 3.2 }
      ],
      metro_stations: [
        { name: 'Metro Station 1', distance: 1.5 }
      ],
      restaurants: [
        { name: 'Restaurant 1', cuisine: 'Indian', rating: 7.8, distance: 0.8 }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
