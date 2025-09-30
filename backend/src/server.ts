import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

// Import routes
import authRoutes from './routes/auth';
import clientRoutes from './routes/clients';
import transactionRoutes from './routes/transactions';
import reportRoutes from './routes/reports';
import auditRoutes from './routes/audit';
import alertRoutes from './routes/alerts';
import realtimeRoutes from './routes/realtime';
import workflowExecutionRoutes from './routes/workflow-executions';

// Import database
import { initDatabase } from './database/init';

// Import real-time service
import { RealTimeDataService } from './services/RealTimeDataService';
import { WorkflowExecutionService } from './services/WorkflowExecutionService';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: true, // Allow all origins for development
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io available to routes
app.use((req: any, res, next) => {
  req.io = io;
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/realtime', realtimeRoutes);
app.use('/api/workflow-executions', workflowExecutionRoutes);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
  
  // Join user to their personal room for notifications
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler - removed problematic wildcard route

// Initialize database and start server
async function startServer() {
  try {
    await initDatabase();
    console.log('Database initialized successfully');
    
    // Start real-time data service
    const realTimeService = RealTimeDataService.getInstance();
    realTimeService.startRealTimeUpdates();
    
    // Start workflow execution monitoring
    const workflowExecutionService = WorkflowExecutionService.getInstance();
    workflowExecutionService.startMonitoring();
    
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 WebSocket server running on port ${PORT}`);
      console.log(`🌐 API available at http://localhost:${PORT}/api`);
      console.log(`🔄 Real-time updates enabled`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export { io };
