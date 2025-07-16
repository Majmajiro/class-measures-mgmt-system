import express from 'express';
import { 
  markAttendance, 
  getAttendance, 
  getAttendanceReport 
} from '../controllers/attendanceController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/mark', authorizeRole('admin', 'tutor'), markAttendance);
router.get('/', getAttendance);
router.get('/report', getAttendanceReport);

export default router;
