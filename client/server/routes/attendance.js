import express from 'express';
import { 
  markAttendance, 
  getAttendance, 
  getAttendanceReport,
  getSessionAttendanceSummary 
} from '../controllers/attendanceController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// MARK attendance - Only admin and tutors can mark attendance
router.post('/', authenticateToken, authorizeRole('admin', 'tutor'), markAttendance);

// GET all attendance records with filtering
router.get('/', authenticateToken, getAttendance);

// GET attendance reports with analytics  
router.get('/reports', authenticateToken, getAttendanceReport);

// GET attendance summary for a specific session
router.get('/session/:sessionId', authenticateToken, getSessionAttendanceSummary);

// GET attendance by student (uses query parameter)
router.get('/student/:id', authenticateToken, (req, res) => {
  // Forward to main getAttendance with studentId in query
  req.query.studentId = req.params.id;
  getAttendance(req, res);
});

export default router;