/**
 * @file metadata.ts
 * @description HTTP kérések és válaszok kezelése a metaadat végpontokhoz.
 */

import type { Request, Response, NextFunction } from 'express';
import type { MetadataService } from '../services/metadata';

export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  getMetadata = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const metadata = await this.metadataService.getAllMetadata();
      res.status(200).json(metadata);
    } catch (error) {
      next(error);
    }
  };
}