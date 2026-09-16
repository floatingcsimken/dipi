import { Router } from 'express';
import type { Driver } from 'neo4j-driver';
import { AgentController } from '../controllers/agent';
import { AgentService } from '../services/agent';
import { RetrievalService } from '../services/retrieval';
import { RetrievalRepository } from '../repositories/retrieval';
import { MetadataRepository } from '../repositories/metadata';
import { CoverageScoreService } from '../services/coverageScore';

export function createAgentRouter(driver: Driver): Router {
  const router = Router();

  // Példányosítás az adatbázis-driverrel
  const metadataRepo = new MetadataRepository(driver);
  const retrievalRepo = new RetrievalRepository(driver);
  const coverageScoreService = new CoverageScoreService();
  
  const retrievalService = new RetrievalService(retrievalRepo, coverageScoreService);
  const agentService = new AgentService(retrievalService, metadataRepo);
  const agentController = new AgentController(agentService);

  router.post('/investigate', agentController.investigate);

  return router;
}