import { Router } from 'express';
import { addCandidate, getAllCandidates } from '../controllers/candidateController';

const router = Router();

router.post('/', addCandidate);
router.get('/', getAllCandidates);

export default router;
