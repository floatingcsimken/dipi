/**
 * @file metadata.ts
 * @description HTTP kérések és válaszok kezelése a metaadat végpontokhoz.
 */

import type { Request, Response, NextFunction } from 'express';
import { MetadataService } from '../services/metadata';
import { MetadataRepository } from '../repositories/metadata';
import { getDriver } from '../config/database';


export class MetadataController {
  constructor(private service: MetadataService) {} // <-- Kívülről kapja meg!

  public getMetadata = async (_req: Request, res: Response): Promise<void> => {
    try {
      const metadata = await this.service.getMetadata();
      res.status(200).json(metadata);
    } catch (error) {
      console.error('Hiba a metaadatok lekérdezésekor:', error);
      res.status(500).json({ error: 'Failed to retrieve metadata' });
    }
  };
}