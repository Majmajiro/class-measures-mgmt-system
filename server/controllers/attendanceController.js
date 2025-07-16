import Attendance from '../models/Attendance.js';

export const markAttendance = async (req, res) => {
  try {
    const { sessionId, attendanceData } = req.body;
    
    // attendanceData should be array of { student: id, present: boolean, notes: string }
    const attendanceRecords = await Promise.all(
      attendanceData.map(async ({ student, present, notes }) => {
        return await Attendance.findOneAndUpdate(
          { session: sessionId, student },
          { present, notes },
          { new: true, upsert: true }
        ).populate('student', 'name age');
      })
    );

    res.json({ message: 'Attendance marked successfully', attendance: attendanceRecords });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const { sessionId, studentId } = req.query;
    const filter = {};
    
    if (sessionId) filter.session = sessionId;
    if (studentId) filter.student = studentId;

    const attendance = await Attendance.find(filter)
      .populate('session', 'date')
      .populate('student', 'name age')
      .sort({ createdAt: -1 });

    res.json({ attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAttendanceReport = async (req, res) => {
  try {
    const { studentId, startDate, endDate } = req.query;
    
    const matchFilter = {};
    if (studentId) matchFilter.student = studentId;
    
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    
    const pipeline = [
      { $match: matchFilter },
      { 
        $lookup: {
          from: 'sessions',
          localField: 'session',
          foreignField: '_id',
          as: 'sessionData'
        }
      },
      { $unwind: '$sessionData' },
      ...(Object.keys(dateFilter).length > 0 ? [{ $match: { 'sessionData.date': dateFilter } }] : []),
      {
        $group: {
          _id: '$student',
          totalSessions: { $sum: 1 },
          attendedSessions: { $sum: { $cond: ['$present', 1, 0] } },
          attendancePercentage: { 
            $multiply: [
              { $divide: [{ $sum: { $cond: ['$present', 1, 0] } }, { $sum: 1 }] },
              100
            ]
          }
        }
      },
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: '_id',
          as: 'studentData'
        }
      },
      { $unwind: '$studentData' }
    ];

    const report = await Attendance.aggregate(pipeline);
    
    res.json({ report });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
