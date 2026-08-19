import { Router } from 'express';
import { Driver } from 'neo4j-driver';
import { AnalysisRepository } from '../repositories/analysis';
import { AnalysisService } from '../services/analysis';
import { AnalysisController } from '../controllers/analysis';

export function createAnalysisRouter(driver: Driver): Router {
  const router = Router();
  
  const repository = new AnalysisRepository(driver);
  const service = new AnalysisService(repository);
  const controller = new AnalysisController(service);

  router.post('/analyze', controller.analyze);

  return router;
}