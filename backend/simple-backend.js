const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Allow all origins for CORS
app.use(cors({
  origin: '*',
  credentials: false
}));

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running!' });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@regalytics.com' && password === 'admin123') {
    res.json({
      success: true,
      token: 'working-token-123',
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
});

