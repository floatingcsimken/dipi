import { Router } from 'express';
import { RetrievalController } from '../controllers/retrieval';
import { getDriver } from '../config/database';
import { RetrievalRepository } from '../repositories/retrieval';
import { CoverageScoreService } from '../services/coverageScore';
import { RetrievalService } from '../services/retrieval';


const router = Router();
const driver = getDriver();
const repository = new RetrievalRepository(driver);
const scoreService = new CoverageScoreService();
const service = new RetrievalService(repository, scoreService);
const controller = new RetrievalController(service);

router.post('/graph/retrieval', controller.queryMitigations);

export default router;