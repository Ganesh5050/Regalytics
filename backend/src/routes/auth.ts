import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getQuery, runQuery } from '../database/init';

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await getQuery('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // Log audit trail
    await runQuery(
      'INSERT INTO audit_logs (userId, action, resource, details, ipAddress, userAgent) VALUES (?, ?, ?, ?, ?, ?)',
      [
        user.id,
        'LOGIN',
        'AUTH',
        'User logged in successfully',
        req.ip,
        req.get('User-Agent')
      ]
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await getQuery('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await runQuery(
      'INSERT INTO users (email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName, 'user']
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result.id, 
        email: email, 
        role: 'user' 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // Log audit trail
    await runQuery(
      'INSERT INTO audit_logs (userId, action, resource, details, ipAddress, userAgent) VALUES (?, ?, ?, ?, ?, ?)',
      [
        result.id,
        'REGISTER',
        'AUTH',
        'New user registered',
        req.ip,
        req.get('User-Agent')
      ]
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: result.id,
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify token endpoint
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    // Get user details
    const user = await getQuery('SELECT id, email, firstName, lastName, role, isActive FROM users WHERE id = ?', [decoded.userId]);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      
      // Log audit trail
      await runQuery(
        'INSERT INTO audit_logs (userId, action, resource, details, ipAddress, userAgent) VALUES (?, ?, ?, ?, ?, ?)',
        [
          decoded.userId,
          'LOGOUT',
          'AUTH',
          'User logged out',
          req.ip,
          req.get('User-Agent')
        ]
      );
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
