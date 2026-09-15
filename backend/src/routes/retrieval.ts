import { Router } from 'express';
import { RetrievalController } from '../controllers/retrieval';

const router = Router();
const controller = new RetrievalController();

router.post('/graph/retrieval', controller.queryMitigations);

export default router;