import Session from '../models/Session.js';
import Attendance from '../models/Attendance.js';

export const createSession = async (req, res) => {
  try {
    const { program, date, students, notes } = req.body;
    
    const session = await Session.create({
      program,
      date,
      tutor: req.user._id,
      students,
      notes
    });

    await session.populate([
      { path: 'program', select: 'name description' },
      { path: 'tutor', select: 'name email' },
      { path: 'students', select: 'name age' }
    ]);

    res.status(201).json({ message: 'Session created successfully', session });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSessions = async (req, res) => {
  try {
    const { program, tutor, date } = req.query;
    const filter = {};
    
    if (program) filter.program = program;
    if (tutor) filter.tutor = tutor;
    if (date) filter.date = { $gte: new Date(date) };

    const sessions = await Session.find(filter)
      .populate('program', 'name description')
      .populate('tutor', 'name email')
      .populate('students', 'name age')
      .sort({ date: -1 });

    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('program', 'name description')
      .populate('tutor', 'name email')
      .populate('students', 'name age');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Get attendance for this session
    const attendance = await Attendance.find({ session: session._id })
      .populate('student', 'name age');

    res.json({ session, attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSession = async (req, res) => {
  try {
    const { notes, files } = req.body;
    
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { notes, files },
      { new: true, runValidators: true }
    ).populate('program', 'name description');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ message: 'Session updated successfully', session });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
