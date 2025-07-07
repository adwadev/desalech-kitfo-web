import express from 'express';
import bcrypt from 'bcryptjs';
import { getDatabase } from '../database/init.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication
router.use(authenticateAdmin);

// Get all feedback for admin dashboard
router.get('/feedback', (req, res) => {
  const db = getDatabase();
  const status = req.query.status; // pending, approved, rejected, or all
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  let query = `
    SELECT 
      id, customer_name, phone, rating, review_text, 
      dish_favorite, visit_date, location, status, 
      created_at, updated_at
    FROM feedback
  `;
  
  let queryParams = [];
  
  if (status && status !== 'all') {
    query += ` WHERE status = ?`;
    queryParams.push(status);
  }
  
  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  queryParams.push(limit, offset);

  db.all(query, queryParams, (err, feedback) => {
    if (err) {
      console.error('Error fetching admin feedback:', err);
      return res.status(500).json({
        error: 'Failed to fetch feedback'
      });
    }

    // Get total count
    let countQuery = "SELECT COUNT(*) as total FROM feedback";
    let countParams = [];
    
    if (status && status !== 'all') {
      countQuery += " WHERE status = ?";
      countParams.push(status);
    }

    db.get(countQuery, countParams, (err, countResult) => {
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
    });
  });
});

// Update feedback status (approve/reject)
router.put('/feedback/:id/status', (req, res) => {
  const feedbackId = req.params.id;
  const { status } = req.body;

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({
      error: 'Invalid status. Must be approved, rejected, or pending'
    });
  }

  const db = getDatabase();

  db.run(
    "UPDATE feedback SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [status, feedbackId],
    function(err) {
      if (err) {
        console.error('Error updating feedback status:', err);
        return res.status(500).json({
          error: 'Failed to update feedback status'
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          error: 'Feedback not found'
        });
      }

      res.json({
        message: `Feedback ${status} successfully`,
        feedbackId: parseInt(feedbackId),
        status
      });
    }
  );
});

// Delete feedback
router.delete('/feedback/:id', (req, res) => {
  const feedbackId = req.params.id;
  const db = getDatabase();

  db.run(
    "DELETE FROM feedback WHERE id = ?",
    [feedbackId],
    function(err) {
      if (err) {
        console.error('Error deleting feedback:', err);
        return res.status(500).json({
          error: 'Failed to delete feedback'
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          error: 'Feedback not found'
        });
      }

      res.json({
        message: 'Feedback deleted successfully',
        feedbackId: parseInt(feedbackId)
      });
    }
  );
});

// Get admin dashboard statistics
router.get('/stats', (req, res) => {
  const db = getDatabase();

  const statsQuery = `
    SELECT 
      COUNT(*) as total_feedback,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
      COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
      COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count,
      AVG(CASE WHEN status = 'approved' THEN rating END) as avg_rating,
      COUNT(CASE WHEN DATE(created_at) = DATE('now') THEN 1 END) as today_count
    FROM feedback
  `;

  db.get(statsQuery, (err, stats) => {
    if (err) {
      console.error('Error fetching admin stats:', err);
      return res.status(500).json({
        error: 'Failed to fetch statistics'
      });
    }

    res.json({
      totalFeedback: stats.total_feedback,
      pendingCount: stats.pending_count,
      approvedCount: stats.approved_count,
      rejectedCount: stats.rejected_count,
      averageRating: parseFloat(stats.avg_rating || 0).toFixed(1),
      todayCount: stats.today_count
    });
  });
});

// Get admin account details
router.get('/profile', (req, res) => {
  res.json({
    admin: {
      id: req.adminData.id,
      username: req.adminData.username,
      fullName: req.adminData.full_name
    }
  });
});

// Update admin account details
router.put('/profile', (req, res) => {
  const { username, fullName, currentPassword, newPassword } = req.body;
  const adminId = req.adminData.id;
  const db = getDatabase();

  // Validation
  if (!username || !fullName) {
    return res.status(400).json({
      error: 'Username and full name are required'
    });
  }

  // If changing password, validate current password
  if (newPassword) {
    if (!currentPassword) {
      return res.status(400).json({
        error: 'Current password is required to set a new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'New password must be at least 6 characters long'
      });
    }
  }

  // Get current admin data for password verification
  db.get(
    "SELECT password FROM admin WHERE id = ?",
    [adminId],
    (err, admin) => {
      if (err) {
        console.error('Error fetching admin for update:', err);
        return res.status(500).json({
          error: 'Database error'
        });
      }

      if (!admin) {
        return res.status(404).json({
          error: 'Admin not found'
        });
      }

      const updateProfile = (hashedPassword = null) => {
        let updateQuery, updateParams;

        if (hashedPassword) {
          updateQuery = `
            UPDATE admin 
            SET username = ?, full_name = ?, password = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
          `;
          updateParams = [username.trim(), fullName.trim(), hashedPassword, adminId];
        } else {
          updateQuery = `
            UPDATE admin 
            SET username = ?, full_name = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
          `;
          updateParams = [username.trim(), fullName.trim(), adminId];
        }

        db.run(updateQuery, updateParams, function(err) {
          if (err) {
            if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
              return res.status(400).json({
                error: 'Username already exists'
              });
            }
            console.error('Error updating admin profile:', err);
            return res.status(500).json({
              error: 'Failed to update profile'
            });
          }

          res.json({
            message: 'Profile updated successfully',
            admin: {
              id: adminId,
              username: username.trim(),
              fullName: fullName.trim()
            }
          });
        });
      };

      // If password change is requested
      if (newPassword) {
        bcrypt.compare(currentPassword, admin.password, (err, isMatch) => {
          if (err) {
            console.error('Password comparison error:', err);
            return res.status(500).json({
              error: 'Authentication error'
            });
          }

          if (!isMatch) {
            return res.status(400).json({
              error: 'Current password is incorrect'
            });
          }

          // Hash new password
          bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
            if (err) {
              console.error('Password hashing error:', err);
              return res.status(500).json({
                error: 'Failed to update password'
              });
            }

            updateProfile(hashedPassword);
          });
        });
      } else {
        updateProfile();
      }
    }
  );
});

export default router;