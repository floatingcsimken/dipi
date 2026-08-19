/**
 * @file app.ts
 * @description Express alkalmazás konfiguráció, middleware-ek és útvonalak regisztrációja.
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Driver } from 'neo4j-driver';
import { createAnalysisRouter } from './routes/analysis';

export function createApp(driver: Driver): Application {
  const app = express();

  // Globális middleware-ek
  app.use(cors());
  app.use(express.json());

  // API Route-ok
  app.use('/api/analysis', createAnalysisRouter(driver));

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

  return app;
}