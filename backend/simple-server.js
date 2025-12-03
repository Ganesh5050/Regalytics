import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Backend is running!'
  });
});

// Simple login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@regalytics.com' && password === 'admin123') {
    res.json({
      success: true,
      token: 'test-token-123',
      user: {
        id: 1,
        email: 'admin@regalytics.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`🌐 API available at http://localhost:${PORT}/api`);
});
