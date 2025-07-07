import express from 'express';
import bcrypt from 'bcryptjs';
import { getDatabase } from '../database/init.js';
import { generateToken, authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Admin login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    return res.status(400).json({
      error: 'Username and password are required'
    });
  }

  const db = getDatabase();

  // Find admin by username
  db.get(
    "SELECT id, username, password, full_name FROM admin WHERE username = ?",
    [username],
    (err, admin) => {
      if (err) {
        console.error('Database error during login:', err);
        return res.status(500).json({
          error: 'Database error during login'
        });
      }

      if (!admin) {
        return res.status(401).json({
          error: 'Invalid credentials'
        });
      }

      // Verify password
      bcrypt.compare(password, admin.password, (err, isMatch) => {
        if (err) {
          console.error('Password comparison error:', err);
          return res.status(500).json({
            error: 'Authentication error'
          });
        }

        if (!isMatch) {
          return res.status(401).json({
            error: 'Invalid credentials'
          });
        }

        // Generate JWT token
        const token = generateToken(admin.id, admin.username);

        res.json({
          message: 'Login successful',
          token,
          admin: {
            id: admin.id,
            username: admin.username,
            fullName: admin.full_name
          }
        });
      });
    }
  );
});

// Verify token and get admin info
router.get('/verify', authenticateAdmin, (req, res) => {
  res.json({
    message: 'Token is valid',
    admin: {
      id: req.adminData.id,
      username: req.adminData.username,
      fullName: req.adminData.full_name
    }
  });
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({
    message: 'Logged out successfully'
  });
});

export default router;