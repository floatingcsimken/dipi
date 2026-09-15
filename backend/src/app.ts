/**
 * @file app.ts
 * @description Express alkalmazás konfiguráció, middleware-ek és útvonalak regisztrációja.
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { metadataRouter } from './routes/metadata';
import { getDriver } from './config/database';
import retrievalRoutes from './routes/retrieval';

export function createApp(): Application {
  const app = express();
  const driver = getDriver();

  // Globális middleware-ek
  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Globális hibakezelő middleware (Centralized Error Handling)
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('💥 [Server Error]:', err);
    res.status(500).json({ 
      error: 'Belső szerverhiba történt', 
      details: err.message 
    });
  });


  app.use('/api/metadata', metadataRouter);

  app.use('/api', retrievalRoutes);


  return app;
}