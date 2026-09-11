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
import staticQrRoutes from './routes/staticQr.routes.js';
import redirectPresetsRoutes from './routes/redirectPresets.routes.js';
import searchRoutes from './routes/search.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://akksys-frontend.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.onrender.com')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);
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
app.use('/api/search', searchRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/static-qr', staticQrRoutes);
app.use('/api/redirect-presets', redirectPresetsRoutes);

app.use(errorHandler);

import { runMigrations } from './migrations/run.js';
import { seed } from './seeds/seed.js';

const start = () => {
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    try {
      await db.query('SELECT NOW()');
      console.log('PostgreSQL connected successfully');

      // Auto-run DB migrations & seed on server start
      await runMigrations(false);
      await seed(false);
    } catch (err) {
      console.error('Database connection error:', err.message);
      console.error('Tip: Make sure DATABASE_URL in Render is set to External Database URL or full hostname with .render.com');
    }
  });
};

start();
