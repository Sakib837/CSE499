import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Config
import { DEFAULTS } from './config/constants.js';
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CORS_ORIGIN || '*' },
  transports: ['websocket', 'polling'],
});

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: DEFAULTS.RATE_LIMIT_WINDOW,
  max: DEFAULTS.RATE_LIMIT_MAX,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later',
    });
  },
});

const authLimiter = rateLimit({
  windowMs: DEFAULTS.RATE_LIMIT_WINDOW,
  max: DEFAULTS.AUTH_RATE_LIMIT_MAX,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again later',
    });
  },
});

app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);

// Logging
app.use(morgan('combined'));

// Body Parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));
app.use(cookieParser());

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    message: 'Fuel Dispensing API is running',
  });
});

// Routes
app.use('/api/auth', authRoutes);

// Socket.io Setup
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join:admin_dashboard', () => {
    socket.join('admin_dashboard');
    console.log(`${socket.id} joined admin_dashboard`);
  });

  socket.on('join:user_dashboard', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`${socket.id} joined user_${userId}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error Handler (Last middleware)
app.use(errorHandler);

export { app, server, io };
