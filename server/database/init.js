import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../data/restaurant.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = sqlite3.verbose();
const db = new sqlite.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Initialize database with tables
const initDatabase = async () => {
  return new Promise((resolve, reject) => {
    // Enable foreign keys
    db.run("PRAGMA foreign_keys = ON", (err) => {
      if (err) {
        reject(err);
        return;
      }

      // Create admin table
      const createAdminTable = `
        CREATE TABLE IF NOT EXISTS admin (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          full_name TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Create feedback table
      const createFeedbackTable = `
        CREATE TABLE IF NOT EXISTS feedback (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          customer_name TEXT NOT NULL,
          phone TEXT NOT NULL,
          rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
          review_text TEXT NOT NULL,
          dish_favorite TEXT,
          visit_date TEXT,
          location TEXT DEFAULT 'Main Branch',
          status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Create tables
      db.run(createAdminTable, (err) => {
        if (err) {
          reject(err);
          return;
        }

        db.run(createFeedbackTable, (err) => {
          if (err) {
            reject(err);
            return;
          }

          // Insert default admin user
          const defaultAdminUsername = 'adwadev';
          const defaultAdminPassword = 'Nati@123';
          
          // Check if admin already exists
          db.get("SELECT id FROM admin WHERE username = ?", [defaultAdminUsername], (err, row) => {
            if (err) {
              reject(err);
              return;
            }

            if (!row) {
              // Hash password and insert admin
              bcrypt.hash(defaultAdminPassword, 10, (err, hashedPassword) => {
                if (err) {
                  reject(err);
                  return;
                }

                const insertAdmin = `
                  INSERT INTO admin (username, password, full_name) 
                  VALUES (?, ?, ?)
                `;
                
                db.run(insertAdmin, [defaultAdminUsername, hashedPassword, 'Restaurant Administrator'], (err) => {
                  if (err) {
                    reject(err);
                    return;
                  }
                  console.log('✅ Default admin user created');
                  console.log(`👤 Username: ${defaultAdminUsername}`);
                  console.log(`🔑 Password: ${defaultAdminPassword}`);
                  resolve();
                });
              });
            } else {
              console.log('✅ Admin user already exists');
              resolve();
            }
          });
        });
      });
    });
  });
};

// Get database instance
const getDatabase = () => db;

// Close database connection
const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('Database connection closed');
        resolve();
      }
    });
  });
};

export {
  initDatabase,
  getDatabase,
  closeDatabase
};