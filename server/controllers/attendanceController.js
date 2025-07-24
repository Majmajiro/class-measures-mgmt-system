import Attendance from '../models/Attendance.js';

export const markAttendance = async (req, res) => {
  try {
    const { sessionId, attendanceData } = req.body;
    
    // Validate input
    if (!sessionId || !attendanceData || !Array.isArray(attendanceData)) {
      return res.status(400).json({ 
        message: 'sessionId and attendanceData array are required' 
      });
    }
    
    // attendanceData should be array of { student: id, present: boolean, notes: string }
    const attendanceRecords = await Promise.all(
      attendanceData.map(async ({ student, present, notes }) => {
        if (!student) {
          throw new Error('Student ID is required for each attendance record');
        }
        
        return await Attendance.findOneAndUpdate(
          { session: sessionId, student },
          { 
            present: Boolean(present), 
            notes: notes || '',
            updatedAt: new Date()
          },
          { new: true, upsert: true }
        ).populate('student', 'name age');
      })
    );

    res.json({ 
      message: 'Attendance marked successfully', 
      attendance: attendanceRecords,
      count: attendanceRecords.length
    });
  } catch (error) {
    console.error('❌ Mark attendance error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const { sessionId, studentId, date, limit = 50 } = req.query;
    const filter = {};
    
    if (sessionId) filter.session = sessionId;
    if (studentId) filter.student = studentId;

    let query = Attendance.find(filter)
      .populate('session', 'date program')
      .populate('student', 'name age')
      .sort({ createdAt: -1 });
    
    // Add date filtering if provided
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      query = query.populate({
        path: 'session',
        match: { date: { $gte: startDate, $lt: endDate } },
        select: 'date program'
      });
    }
    
    // Limit results
    query = query.limit(parseInt(limit));

    const attendance = await query;
    
    // Filter out records where session didn't match date filter
    const filteredAttendance = attendance.filter(record => record.session);

    res.json({ 
      attendance: filteredAttendance,
      count: filteredAttendance.length,
      total: await Attendance.countDocuments(filter)
    });
  } catch (error) {
    console.error('❌ Get attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAttendanceReport = async (req, res) => {
  try {
    const { studentId, startDate, endDate, programId } = req.query;
    
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
      
      // Date filtering
      ...(Object.keys(dateFilter).length > 0 ? [
        { $match: { 'sessionData.date': dateFilter } }
      ] : []),
      
      // Program filtering
      ...(programId ? [
        { $match: { 'sessionData.program': programId } }
      ] : []),
      
      {
        $group: {
          _id: '$student',
          totalSessions: { $sum: 1 },
          attendedSessions: { $sum: { $cond: ['$present', 1, 0] } },
          absentSessions: { $sum: { $cond: [{ $not: '$present' }, 1, 0] } },
          attendancePercentage: {
            $multiply: [
              { $divide: [
                { $sum: { $cond: ['$present', 1, 0] } }, 
                { $sum: 1 }
              ] },
              100
            ]
          },
          lastAttendance: { $max: '$createdAt' }
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
      { $unwind: '$studentData' },
      
      // Format output
      {
        $project: {
          _id: 0,
          studentId: '$_id',
          studentName: '$studentData.name',
          studentAge: '$studentData.age',
          totalSessions: 1,
          attendedSessions: 1,
          absentSessions: 1,
          attendancePercentage: { $round: ['$attendancePercentage', 1] },
          lastAttendance: 1
        }
      },
      
      { $sort: { attendancePercentage: -1 } }
    ];

    const report = await Attendance.aggregate(pipeline);
    
    // Calculate overall statistics
    const overallStats = {
      totalStudents: report.length,
      averageAttendance: report.length > 0 
        ? Math.round(report.reduce((sum, student) => sum + student.attendancePercentage, 0) / report.length * 10) / 10
        : 0,
      totalSessions: report.length > 0 ? report[0].totalSessions : 0,
      dateRange: {
        start: startDate || 'All time',
        end: endDate || 'Present'
      }
    };

    res.json({ 
      report,
      statistics: overallStats,
      message: 'Attendance report generated successfully'
    });
  } catch (error) {
    console.error('❌ Attendance report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get attendance summary for a specific session
export const getSessionAttendanceSummary = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const attendance = await Attendance.find({ session: sessionId })
      .populate('student', 'name age')
      .sort({ 'student.name': 1 });

    const summary = {
      sessionId,
      totalStudents: attendance.length,
      present: attendance.filter(record => record.present).length,
      absent: attendance.filter(record => !record.present).length,
      attendanceRate: attendance.length > 0 
        ? Math.round((attendance.filter(record => record.present).length / attendance.length) * 100)
        : 0,
      students: attendance.map(record => ({
        id: record.student._id,
        name: record.student.name,
        age: record.student.age,
        present: record.present,
        notes: record.notes,
        markedAt: record.updatedAt
      }))
    };

    res.json({ 
      summary,
      message: 'Session attendance summary retrieved successfully'
    });
  } catch (error) {
    console.error('❌ Session attendance summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};