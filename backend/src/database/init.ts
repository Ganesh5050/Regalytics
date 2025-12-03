import sqlite3 from 'sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_PATH = process.env.DB_PATH || './database.sqlite';

export const db = new sqlite3.Database(DB_PATH);

export async function initDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          firstName TEXT NOT NULL,
          lastName TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          isActive BOOLEAN DEFAULT 1,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Clients table
      db.run(`
        CREATE TABLE IF NOT EXISTS clients (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          company TEXT,
          status TEXT DEFAULT 'active',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Transactions table
      db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          clientId INTEGER NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          type TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'pending',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (clientId) REFERENCES clients (id)
        )
      `);

      // Reports table
      db.run(`
        CREATE TABLE IF NOT EXISTS reports (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          type TEXT NOT NULL,
          data TEXT NOT NULL,
          userId INTEGER NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users (id)
        )
      `);

      // Audit logs table
      db.run(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          action TEXT NOT NULL,
          resource TEXT NOT NULL,
          resourceId INTEGER,
          details TEXT,
          ipAddress TEXT,
          userAgent TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users (id)
        )
      `);

      // Alerts table
      db.run(`
        CREATE TABLE IF NOT EXISTS alerts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          priority TEXT DEFAULT 'medium',
          category TEXT DEFAULT 'compliance',
          assignedTo TEXT,
          dueDate DATETIME,
          clientId INTEGER,
          transactionId TEXT,
          notes TEXT,
          status TEXT DEFAULT 'active',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (clientId) REFERENCES clients (id)
        )
      `);

      // Workflow executions table
      db.run(`
        CREATE TABLE IF NOT EXISTS workflow_executions (
          id TEXT PRIMARY KEY,
          workflowId TEXT NOT NULL,
          workflowName TEXT NOT NULL,
          status TEXT DEFAULT 'running',
          startedAt DATETIME NOT NULL,
          finishedAt DATETIME,
          progress INTEGER DEFAULT 0,
          currentStep TEXT,
          error TEXT,
          userId INTEGER,
          data TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users (id)
        )
      `);

      // Insert default users
      const adminPassword = bcrypt.hashSync('admin123', 10);
      const compliancePassword = bcrypt.hashSync('compliance123', 10);
      const analystPassword = bcrypt.hashSync('analyst123', 10);
      
      db.run(`
        INSERT OR IGNORE INTO users (email, password, firstName, lastName, role)
        VALUES ('admin@regalytics.com', ?, 'Admin', 'User', 'admin')
      `, [adminPassword]);
      
      db.run(`
        INSERT OR IGNORE INTO users (email, password, firstName, lastName, role)
        VALUES ('compliance@regalytics.com', ?, 'Compliance', 'Officer', 'compliance_officer')
      `, [compliancePassword]);
      
      db.run(`
        INSERT OR IGNORE INTO users (email, password, firstName, lastName, role)
        VALUES ('analyst@regalytics.com', ?, 'Data', 'Analyst', 'analyst')
      `, [analystPassword]);

      // Insert sample clients
      db.run(`
        INSERT OR IGNORE INTO clients (name, email, phone, company, status)
        VALUES 
          ('John Doe', 'john@example.com', '+1234567890', 'Acme Corp', 'active'),
          ('Jane Smith', 'jane@example.com', '+1234567891', 'Tech Solutions', 'active'),
          ('Bob Johnson', 'bob@example.com', '+1234567892', 'Global Inc', 'inactive'),
          ('Alice Brown', 'alice@example.com', '+1234567893', 'Startup Co', 'active'),
          ('Charlie Wilson', 'charlie@example.com', '+1234567894', 'Enterprise Ltd', 'active')
      `);

      // Insert sample transactions
      db.run(`
        INSERT OR IGNORE INTO transactions (clientId, amount, type, description, status)
        VALUES 
          (1, 1500.00, 'payment', 'Monthly subscription payment', 'completed'),
          (2, 2500.00, 'payment', 'Quarterly service fee', 'completed'),
          (3, 800.00, 'refund', 'Service cancellation refund', 'completed'),
          (4, 1200.00, 'payment', 'Annual license renewal', 'pending'),
          (5, 3000.00, 'payment', 'Custom development project', 'completed')
      `);

      // Insert sample alerts
      db.run(`
        INSERT OR IGNORE INTO alerts (title, description, priority, category, status)
        VALUES 
          ('New Client Registration', 'John Doe has registered as a new client', 'low', 'compliance', 'active'),
          ('Payment Received', 'Payment of $1500 received from Acme Corp', 'medium', 'financial', 'active'),
          ('System Maintenance', 'Scheduled maintenance will occur tonight at 2 AM', 'high', 'system', 'active'),
          ('Security Alert', 'Unusual login activity detected', 'critical', 'security', 'active')
      `);

      console.log('Database tables created successfully');
      resolve();
    });
  });
}

// Helper function to run queries with promises
export function runQuery(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}

// Helper function to get single row
export function getQuery(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Helper function to get all rows
export function allQuery(sql: string, params: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
