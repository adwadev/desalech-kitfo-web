import express from 'express';
import { getDatabase } from '../database/init.js';

const router = express.Router();

// Submit new feedback (public endpoint)
router.post('/', (req, res) => {
  const {
    customer_name,
    phone,
    rating,
    review_text,
    dish_favorite,
    visit_date,
    location
  } = req.body;

  // Validation
  if (!customer_name || !phone || !rating || !review_text) {
    return res.status(400).json({
      error: 'Customer name, phone, rating, and review text are required'
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      error: 'Rating must be between 1 and 5'
    });
  }

  // Phone validation (basic)
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      error: 'Please provide a valid phone number'
    });
  }

  const db = getDatabase();

  const insertFeedback = `
    INSERT INTO feedback (
      customer_name, phone, rating, review_text, 
      dish_favorite, visit_date, location
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    insertFeedback,
    [
      customer_name.trim(),
      phone.trim(),
      parseInt(rating),
      review_text.trim(),
      dish_favorite?.trim() || null,
      visit_date || null,
      location?.trim() || 'Main Branch'
    ],
    function(err) {
      if (err) {
        console.error('Error inserting feedback:', err);
        return res.status(500).json({
          error: 'Failed to submit feedback'
        });
      }

      res.status(201).json({
        message: 'Thank you for your feedback! It will be reviewed before being published.',
        feedbackId: this.lastID
      });
    }
  );
});

// Get approved feedback for public display
router.get('/public', (req, res) => {
  const db = getDatabase();
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  const query = `
    SELECT 
      id, customer_name, rating, review_text, 
      dish_favorite, visit_date, location, created_at
    FROM feedback 
    WHERE status = 'approved'
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;

  db.all(query, [limit, offset], (err, feedback) => {
    if (err) {
      console.error('Error fetching public feedback:', err);
      return res.status(500).json({
        error: 'Failed to fetch feedback'
      });
    }

    // Get total count for pagination
    db.get(
      "SELECT COUNT(*) as total FROM feedback WHERE status = 'approved'",
      (err, countResult) => {
        if (err) {
          console.error('Error counting feedback:', err);
          return res.status(500).json({
            error: 'Failed to fetch feedback count'
          });
        }

        res.json({
          feedback,
          pagination: {
            total: countResult.total,
            limit,
            offset,
            hasMore: (offset + limit) < countResult.total
          }
        });
      }
    );
  });
});

// Get feedback statistics for public display
router.get('/stats', (req, res) => {
  const db = getDatabase();

  const statsQuery = `
    SELECT 
      COUNT(*) as total_reviews,
      AVG(rating) as average_rating,
      COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
      COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
      COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
      COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
      COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
    FROM feedback 
    WHERE status = 'approved'
  `;

  db.get(statsQuery, (err, stats) => {
    if (err) {
      console.error('Error fetching feedback stats:', err);
      return res.status(500).json({
        error: 'Failed to fetch feedback statistics'
      });
    }

    res.json({
      totalReviews: stats.total_reviews,
      averageRating: parseFloat(stats.average_rating || 0).toFixed(1),
      ratingBreakdown: {
        5: stats.five_star,
        4: stats.four_star,
        3: stats.three_star,
        2: stats.two_star,
        1: stats.one_star
      }
    });
  });
});

export default router;