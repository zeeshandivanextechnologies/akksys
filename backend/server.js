import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import qrRoutes from './routes/qr.routes.js';
import campaignRoutes from './routes/campaign.routes.js';
import videoRoutes from './routes/video.routes.js';
import ctaRoutes from './routes/cta.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import landingRoutes from './routes/landing.routes.js';
import landingContentRoutes from './routes/landingContent.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

import path from 'path';

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/campaign', campaignRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/cta', ctaRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/landing', landingRoutes);
app.use('/api/landing-content', landingContentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/user', userRoutes);

app.use(errorHandler);

const start = async () => {
  try {
    await db.query('SELECT NOW()');
    console.log('PostgreSQL connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
