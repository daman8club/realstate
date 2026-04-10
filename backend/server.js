import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.js';
import propertyRoutes from './routes/properties.js';
import inquiryRoutes from './routes/inquiries.js';
import visitRoutes from './routes/visits.js';
import emiRoutes from './routes/emi.js';
import adminRoutes from './routes/admin.js';
import neighborhoodRoutes from './routes/neighborhood.js';

dotenv.config();

const app = express();

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate Limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);

// Root API info
app.get('/api', (req, res) => {
  res.json({
    status: 'OK',
    name: 'Shine Native Real Estate API',
    version: '1.0.0',
    endpoints: {
      health:       'GET  /api/health',
      auth:         'POST /api/auth/login | /api/auth/register',
      properties:   'GET  /api/properties',
      inquiries:    'POST /api/inquiries',
      visits:       'POST /api/visits/schedule',
      emi:          'POST /api/emi/calculate',
      neighborhood: 'GET  /api/neighborhood/:lat/:lng',
      admin:        'GET  /api/admin/stats',
    }
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Shine Native API is running', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth',         authRoutes);
app.use('/api/properties',   propertyRoutes);
app.use('/api/inquiries',    inquiryRoutes);
app.use('/api/visits',       visitRoutes);
app.use('/api/emi',          emiRoutes);
app.use('/api/admin',        adminRoutes);
app.use('/api/neighborhood', neighborhoodRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Only listen locally — Vercel handles this in production
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📋 API Docs: http://localhost:${PORT}/api`);
  });
}

export default app;
