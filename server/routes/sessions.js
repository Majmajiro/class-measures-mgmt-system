import express from 'express';
import { 
  createSession, 
  getSessions, 
  getSession, 
  updateSession 
} from '../controllers/sessionController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', authorizeRole('admin', 'tutor'), createSession);
router.get('/', getSessions);
router.get('/:id', getSession);
router.put('/:id', authorizeRole('admin', 'tutor'), updateSession);

export default router;
