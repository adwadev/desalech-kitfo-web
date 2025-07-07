import jwt from 'jsonwebtoken';
import { getDatabase } from '../database/init.js';

const JWT_SECRET = process.env.JWT_SECRET || (
  process.env.NODE_ENV === 'production' 
    ? (() => { throw new Error('JWT_SECRET environment variable is required in production') })()
    : 'desalegn_kitfo_secret_2024'
);

// Generate JWT token
const generateToken = (adminId, username) => {
  return jwt.sign(
    { 
      adminId, 
      username,
      type: 'admin' 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ 
      error: 'Access denied. No token provided.' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ 
      error: 'Invalid token.' 
    });
  }
};

// Verify admin exists in database
const verifyAdmin = (req, res, next) => {
  const db = getDatabase();
  const adminId = req.admin.adminId;

  db.get(
    "SELECT id, username, full_name FROM admin WHERE id = ?",
    [adminId],
    (err, admin) => {
      if (err) {
        return res.status(500).json({ 
          error: 'Database error during admin verification' 
        });
      }

      if (!admin) {
        return res.status(403).json({ 
          error: 'Admin not found' 
        });
      }

      req.adminData = admin;
      next();
    }
  );
};

// Combined auth middleware
const authenticateAdmin = [verifyToken, verifyAdmin];

export {
  generateToken,
  verifyToken,
  verifyAdmin,
  authenticateAdmin,
  JWT_SECRET
};