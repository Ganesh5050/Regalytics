import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// PostgreSQL connection for Render deployment
// Falls back to SQLite if DATABASE_URL is not set (for Railway/local dev)
const isPostgres = !!process.env.DATABASE_URL;

let pool: Pool | null = null;

if (isPostgres) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false
  });

  console.log('📊 Using PostgreSQL database (Render)');
} else {
  console.log('📊 Using SQLite database (Railway/Local)');
}

export async function initPostgresDatabase(): Promise<void> {
  if (!pool) {
    console.log('Skipping PostgreSQL init - using SQLite');
    return;
  }

  const client = await pool.connect();
  
  try {
    console.log('🔧 Initializing PostgreSQL database...');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        "firstName" VARCHAR(255) NOT NULL,
        "lastName" VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Clients table
    await client.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        "clientId" INTEGER NOT NULL REFERENCES clients(id),
        amount DECIMAL(10,2) NOT NULL,
        type VARCHAR(50) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Reports table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        data TEXT NOT NULL,
        "userId" INTEGER NOT NULL REFERENCES users(id),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Audit logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        resource VARCHAR(100) NOT NULL,
        "resourceId" INTEGER,
        details TEXT,
        "ipAddress" VARCHAR(50),
        "userAgent" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Alerts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        priority VARCHAR(50) DEFAULT 'medium',
        category VARCHAR(50) DEFAULT 'compliance',
        "assignedTo" VARCHAR(255),
        "dueDate" TIMESTAMP,
        "clientId" INTEGER REFERENCES clients(id),
        "transactionId" VARCHAR(255),
        notes TEXT,
        status VARCHAR(50) DEFAULT 'active',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Workflow executions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS workflow_executions (
        id VARCHAR(255) PRIMARY KEY,
        "workflowId" VARCHAR(255) NOT NULL,
        "workflowName" VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'running',
        "startedAt" TIMESTAMP NOT NULL,
        "finishedAt" TIMESTAMP,
        progress INTEGER DEFAULT 0,
        "currentStep" VARCHAR(255),
        error TEXT,
        "userId" INTEGER REFERENCES users(id),
        data TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tables created successfully');

    // Insert default users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const compliancePassword = await bcrypt.hash('compliance123', 10);
    const analystPassword = await bcrypt.hash('analyst123', 10);

    // Check if admin exists
    const adminExists = await client.query('SELECT id FROM users WHERE email = $1', ['admin@regalytics.com']);
    
    if (adminExists.rows.length === 0) {
      await client.query(
        `INSERT INTO users (email, password, "firstName", "lastName", role)
         VALUES ($1, $2, $3, $4, $5)`,
        ['admin@regalytics.com', adminPassword, 'Admin', 'User', 'admin']
      );

      await client.query(
        `INSERT INTO users (email, password, "firstName", "lastName", role)
         VALUES ($1, $2, $3, $4, $5)`,
        ['compliance@regalytics.com', compliancePassword, 'Compliance', 'Officer', 'compliance_officer']
      );

      await client.query(
        `INSERT INTO users (email, password, "firstName", "lastName", role)
         VALUES ($1, $2, $3, $4, $5)`,
        ['analyst@regalytics.com', analystPassword, 'Data', 'Analyst', 'analyst']
      );

      console.log('✅ Default users created');
    } else {
      console.log('ℹ️  Default users already exist');
    }

    // Insert sample data if tables are empty
    const clientCount = await client.query('SELECT COUNT(*) FROM clients');
    
    if (parseInt(clientCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO clients (name, email, phone, company, status)
        VALUES 
          ('John Doe', 'john@example.com', '+1234567890', 'Acme Corp', 'active'),
          ('Jane Smith', 'jane@example.com', '+1234567891', 'Tech Solutions', 'active'),
          ('Bob Johnson', 'bob@example.com', '+1234567892', 'Global Inc', 'inactive'),
          ('Alice Brown', 'alice@example.com', '+1234567893', 'Startup Co', 'active'),
          ('Charlie Wilson', 'charlie@example.com', '+1234567894', 'Enterprise Ltd', 'active')
      `);

      console.log('✅ Sample clients created');
    }

    console.log('🎉 PostgreSQL database initialized successfully!');

  } catch (error) {
    console.error('❌ Error initializing PostgreSQL database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Query helpers for PostgreSQL
export async function runPostgresQuery(sql: string, params: any[] = []): Promise<any> {
  if (!pool) throw new Error('PostgreSQL pool not initialized');
  
  const result = await pool.query(sql, params);
  return { 
    id: result.rows[0]?.id,
    changes: result.rowCount 
  };
}

export async function getPostgresQuery(sql: string, params: any[] = []): Promise<any> {
  if (!pool) throw new Error('PostgreSQL pool not initialized');
  
  const result = await pool.query(sql, params);
  return result.rows[0];
}

export async function allPostgresQuery(sql: string, params: any[] = []): Promise<any[]> {
  if (!pool) throw new Error('PostgreSQL pool not initialized');
  
  const result = await pool.query(sql, params);
  return result.rows;
}

export { pool, isPostgres };

