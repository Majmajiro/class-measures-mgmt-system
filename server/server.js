import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import programRoutes from './routes/programs.js';
import sessionRoutes from './routes/sessions.js';
import attendanceRoutes from './routes/attendance.js';

// ES modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/class-measures-hub')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors({ 
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (for file uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes - Using your modular controllers
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/attendance', attendanceRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Class Measures Hub API is running!',
    status: 'healthy',
    version: '2.0.0',
    database: 'MongoDB (Mongoose)',
    architecture: 'Modular with Controllers',
    endpoints: {
      auth: '/api/auth (login, register, profile)',
      students: '/api/students (CRUD + parents)',
      programs: '/api/programs (CRUD)',
      sessions: '/api/sessions (CRUD)',
      attendance: '/api/attendance (marking + reports)'
    }
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    server: 'running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format'
    });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate entry',
      field: Object.keys(err.keyValue)[0]
    });
  }
  
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    availableRoutes: [
      'GET /',
      'GET /api/status',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/students',
      'GET /api/programs',
      'GET /api/sessions',
      'GET /api/attendance'
    ]
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📡 SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('📦 Database connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n📡 SIGINT received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('📦 Database connection closed');
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API available at http://localhost:${PORT}`);
  console.log(`📱 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`📊 Database: MongoDB (Mongoose)`);
  console.log(`🏗️  Architecture: Modular Controllers`);
  console.log(`
🎯 Available Endpoints:
  ├── 🔐 /api/auth (Authentication)
  ├── 👨‍🎓 /api/students (Student Management) 
  ├── 📚 /api/programs (Program Management)
  ├── 📅 /api/sessions (Session Management)
  └── ✅ /api/attendance (Attendance Tracking)
  `);
});

