import express from 'express';
import { 
  createStudent, 
  getStudents, 
  getStudent, 
  updateStudent, 
  deleteStudent,
  getParents
} from '../controllers/studentController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', authorizeRole('admin'), createStudent);
router.get('/', getStudents);
router.get('/parents', authorizeRole('admin'), getParents);
router.get('/:id', getStudent);
router.put('/:id', authorizeRole('admin', 'parent'), updateStudent);
router.delete('/:id', authorizeRole('admin'), deleteStudent);

export default router;
