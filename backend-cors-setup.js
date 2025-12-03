// Add this to your backend's main server file (server.js or app.js)

const cors = require('cors');

// CORS configuration for both Railway and Render deployments
const corsOptions = {
  origin: [
    // Vercel frontend domains
    'https://regalytics-g56td5nij-ganesh5050s-projects.vercel.app',
    'https://regalytics.vercel.app', // Your custom domain if you have one
    
    // Local development
    'http://localhost:5173',
    'http://localhost:3000',
    
    // Render frontend (if you deploy frontend there too)
    'https://regalytics.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// For Express apps that need preflight handling
app.options('*', cors(corsOptions));

// For Socket.IO (if you're using it)
const io = require('socket.io')(server, {
  cors: {
    origin: corsOptions.origin,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

module.exports = { corsOptions };
