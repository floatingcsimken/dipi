/**
 * @file metadata.ts
 * @description Express útvonal-definíció a metaadatok eléréséhez.
 */

import { Router } from 'express';
import { MetadataController } from '../controllers/metadata';
import { MetadataService } from '../services/metadata';
import { MetadataRepository } from '../repositories/metadata';
import { getDriver } from '../config/database';

export const metadataRouter = Router();
    
const metadataRepository = new MetadataRepository(getDriver());
const metadataService = new MetadataService(metadataRepository);
const metadataController = new MetadataController(metadataService);

metadataRouter.get('/', metadataController.getMetadata);