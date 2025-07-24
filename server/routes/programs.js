import express from 'express';
import { 
  createProgram, 
  getPrograms, 
  getProgram, 
  updateProgram, 
  deleteProgram 
} from '../controllers/programController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// router.use(authenticateToken);

router.post('/', authorizeRole('admin'), createProgram);
router.get('/', getPrograms);
router.get('/:id', getProgram);
router.put('/:id', authorizeRole('admin', 'tutor'), updateProgram);
router.delete('/:id', authorizeRole('admin'), deleteProgram);

export default router;
