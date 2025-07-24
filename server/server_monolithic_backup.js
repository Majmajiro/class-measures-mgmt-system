import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/class-measures-hub')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  phone: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Student Schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 4,
    max: 16
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  programs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program'
  }],
  emergencyContact: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

// Enhanced Program Schema with Reading
const programSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['Coding', 'Chess', 'Robotics', 'French', 'Reading'], // Added Reading
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  ageGroup: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['English', 'French', 'Both'],
    default: 'English'
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  schedule: {
    day: {
      type: String,
      enum: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      default: 'Saturday'
    },
    startTime: String,
    endTime: String,
    location: String
  },
  capacity: {
    type: Number,
    default: 20
  },
  price: {
    type: Number,
    required: true
  },
  materials: [String],
  objectives: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }]
}, {
  timestamps: true
});

const Program = mongoose.model('Program', programSchema);

// Client Schema for Schools, Teachers, Students
const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['School', 'Private Teacher', 'Student'],
    required: true
  },
  contactInfo: {
    email: String,
    phone: String,
    address: String,
    county: String,
    country: { type: String, default: 'Kenya' }
  },
  schoolDetails: {
    schoolType: {
      type: String,
      enum: ['Primary', 'Secondary', 'International', 'Language School', 'Tuition Center']
    },
    studentPopulation: Number,
    curriculumType: {
      type: String,
      enum: ['8-4-4', 'CBC', 'IGCSE', 'A-Level', 'IB', 'French Curriculum']
    }
  },
  pricingTier: {
    type: String,
    enum: ['School Bulk', 'Teacher Discount', 'Student Retail'],
    default: function() {
      return this.type === 'School' ? 'School Bulk' : 
             this.type === 'Private Teacher' ? 'Teacher Discount' : 'Student Retail';
    }
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const Client = mongoose.model('Client', clientSchema);

// Enhanced Resource Schema
const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Book', 'Platform', 'Hardware', 'Digital'],
    required: true
  },
  
  // Language and Subject
  language: {
    type: String,
    enum: ['French', 'English', 'Swahili', 'Multi-language'],
    required: true
  },
  subject: {
    type: String,
    enum: ['French', 'English', 'Reading', 'Coding', 'Chess', 'Robotics', 'General'],
    required: true
  },
  
  // French Book Categories (Hachette, Didier, CLE)
  frenchBookCategory: {
    type: String,
    enum: [
      'Methode de Francais',
      'Cahier d\'activites', 
      'Exam Preparation',
      'Livre du Professeur',
      'Readers',
      'Practice Books',
      'U.B.s'
    ]
  },
  
  // Practice book subtypes
  practiceBookType: {
    type: String,
    enum: ['Orale', 'Comprehension', 'Conjugation', 'Grammar', 'Vocabulary', 'Writing']
  },
  
  // Publisher information
  publisher: {
    // French Publishers
    frenchPublisher: {
      type: String,
      enum: ['Hachette', 'Didier', 'CLE International']
    },
    // English Publishers  
    englishPublisher: {
      type: String,
      enum: ['Cambridge', 'Oxford', 'Pearson', 'Brilliant', 'Unique Books']
    },
    series: String,
    level: String,
    edition: String,
    year: Number
  },
  
  // Platform details
  platformDetails: {
    platformName: {
      type: String,
      enum: ['PurpleMash', 'Scholastic Learning Zone']
    },
    licenseType: {
      type: String,
      enum: ['Individual', 'Classroom', 'School', 'Annual']
    },
    accessDuration: String,
    maxUsers: Number
  },
  
  // Multi-tier pricing for different client types
  pricing: {
    schoolBulkPrice: Number,
    teacherDiscountPrice: Number,
    studentRetailPrice: Number,
    costPrice: Number,
    currency: { type: String, default: 'KSh' }
  },
  
  // Inventory management
  inventory: {
    totalStock: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    minimumStock: { type: Number, default: 5 }
  },
  
  // Supplier information
  supplier: {
    name: String,
    contact: String,
    email: String,
    leadTime: String,
    minimumOrder: Number
  },
  
  // Academic details
  academicInfo: {
    frenchLevel: {
      type: String,
      enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'DELF Prep', 'DALF Prep']
    },
    ageGroup: String,
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] }
  },
  
  programs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program'
  }],
  
  metadata: {
    isbn: String,
    barcode: String,
    pages: Number,
    format: { type: String, enum: ['Paperback', 'Hardcover', 'Digital', 'Audio'] }
  },
  
  isRequired: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const Resource = mongoose.model('Resource', resourceSchema);

// Middleware
app.use(cors({ 
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Auth middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Class Measures Hub API is running!',
    endpoints: {
      auth: '/api/auth',
      students: '/api/students',
      programs: '/api/programs',
      resources: '/api/resources',
      clients: '/api/clients'
    }
  });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Student routes (existing ones)
app.post('/api/students', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { name, age, parentId, emergencyContact } = req.body;

    if (parentId && parentId.trim() !== '') {
      const parent = await User.findById(parentId);
      if (!parent || parent.role !== 'parent') {
        return res.status(400).json({ message: 'Valid parent required' });
      }
    }

    const studentData = {
      name: name.trim(),
      age: parseInt(age),
      emergencyContact: emergencyContact ? emergencyContact.trim() : ''
    };

    if (parentId && parentId.trim() !== '') {
      studentData.parent = parentId;
    }

    const student = await Student.create(studentData);
    
    if (student.parent) {
      await student.populate('parent', 'name email');
    }
    
    res.status(201).json({ message: 'Student created successfully', student });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/students', authenticateToken, async (req, res) => {
  try {
    let filter = { isActive: true };
    
    if (req.user.role === 'parent') {
      filter.parent = req.user._id;
    }

    const students = await Student.find(filter)
      .populate('parent', 'name email phone')
      .populate('programs', 'name description')
      .sort({ createdAt: -1 });
    
    res.json({ students });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/students/parents', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const parents = await User.find({ 
      role: 'parent', 
      isActive: true 
    }).select('name email phone').sort({ name: 1 });
    
    res.json({ parents });
  } catch (error) {
    console.error('Get parents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/students/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Program routes (existing ones)
app.post('/api/programs', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { name, description, ageGroup, tutorId, schedule, capacity, price, materials, objectives } = req.body;
    
    const existingProgram = await Program.findOne({ name });
    if (existingProgram) {
      return res.status(400).json({ message: 'Program already exists' });
    }

    if (tutorId && tutorId.trim() !== '') {
      const tutor = await User.findById(tutorId);
      if (!tutor || tutor.role !== 'tutor') {
        return res.status(400).json({ message: 'Valid tutor required' });
      }
    }

    const programData = {
      name,
      description,
      ageGroup,
      schedule,
      capacity: parseInt(capacity),
      price: parseFloat(price),
      materials: materials || [],
      objectives: objectives || [],
      enrolledStudents: []
    };

    if (tutorId && tutorId.trim() !== '') {
      programData.tutor = tutorId;
    }

    const program = await Program.create(programData);
    
    if (program.tutor) {
      await program.populate('tutor', 'name email');
    }
    
    res.status(201).json({ message: 'Program created successfully', program });
  } catch (error) {
    console.error('Create program error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/programs', authenticateToken, async (req, res) => {
  try {
    const programs = await Program.find({ isActive: true })
      .populate('tutor', 'name email')
      .populate('enrolledStudents', 'name age')
      .sort({ name: 1 });
    
    res.json({ programs });
  } catch (error) {
    console.error('Get programs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/programs/tutors', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const tutors = await User.find({ 
      role: 'tutor', 
      isActive: true 
    }).select('name email phone').sort({ name: 1 });
    
    res.json({ tutors });
  } catch (error) {
    console.error('Get tutors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/programs/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    
    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// NEW: Resource Management Routes
app.get('/api/resources', authenticateToken, async (req, res) => {
  try {
    const { type, language, subject, publisher } = req.query;
    let filter = { isActive: true };
    
    if (type) filter.type = type;
    if (language) filter.language = language;
    if (subject) filter.subject = subject;
    if (publisher) {
      filter.$or = [
        { 'publisher.frenchPublisher': publisher },
        { 'publisher.englishPublisher': publisher }
      ];
    }

    const resources = await Resource.find(filter)
      .populate('programs', 'name')
      .sort({ name: 1 });
    
    res.json({ resources });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/resources', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const resourceData = req.body;
    console.log('Creating resource:', resourceData);

    const resource = await Resource.create(resourceData);
    
    if (resource.programs && resource.programs.length > 0) {
      await resource.populate('programs', 'name');
    }
    
    res.status(201).json({ message: 'Resource created successfully', resource });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// NEW: Client Management Routes
app.get('/api/clients', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { type } = req.query;
    let filter = { isActive: true };
    
    if (type) filter.type = type;

    const clients = await Client.find(filter).sort({ name: 1 });
    
    res.json({ clients });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/clients', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const clientData = req.body;
    console.log('Creating client:', clientData);

    const client = await Client.create(clientData);
    
    res.status(201).json({ message: 'Client created successfully', client });
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// ===== SESSION & ATTENDANCE MANAGEMENT SYSTEM =====

// Session Schema
const sessionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: false },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  students: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    enrollmentDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'inactive', 'completed', 'dropped'], default: 'active' }
  }],
  schedule: {
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number, required: true },
    dayOfWeek: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true }
  },
  location: { type: String, enum: ['Main Classroom', 'Computer Lab', 'Library', 'Online', 'Chess Room', 'Robotics Lab'], required: true },
  sessionType: { type: String, enum: ['Regular Class', 'Assessment', 'Workshop', 'Practice', 'Exam Prep', 'Review'], default: 'Regular Class' },
  status: { type: String, enum: ['scheduled', 'ongoing', 'completed', 'cancelled'], default: 'scheduled' },
  notes: String,
  objectives: [String],
  materials: [String],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  status: { type: String, enum: ['present', 'absent', 'late', 'excused'], required: true },
  checkInTime: Date,
  notes: String,
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participationScore: { type: Number, min: 0, max: 10, default: null }
}, { timestamps: true });

attendanceSchema.index({ session: 1, student: 1 }, { unique: true });
const Attendance = mongoose.model('Attendance', attendanceSchema);

// ===== SESSION ROUTES =====
app.get('/api/sessions', authenticateToken, async (req, res) => {
  try {
    const sessions = await Session.find({ isActive: true })
      .populate('program', 'name description')
      .populate('instructor', 'name email')
      .populate('students.student', 'name age')
      .sort({ 'schedule.date': 1, 'schedule.startTime': 1 });
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/sessions', authenticateToken, authorizeRole('admin', 'tutor'), async (req, res) => {
  try {
    const { title, programId, instructorId, students, schedule, location, sessionType, notes } = req.body;
    
    const startTime = new Date(`2000-01-01 ${schedule.startTime}`);
    const endTime = new Date(`2000-01-01 ${schedule.endTime}`);
    const duration = (endTime - startTime) / (1000 * 60);
    const sessionDate = new Date(schedule.date);
    const dayOfWeek = sessionDate.toLocaleDateString('en-US', { weekday: 'long' });

    const session = await Session.create({
      title, program: programId, instructor: instructorId, students: students || [],
      schedule: { ...schedule, duration, dayOfWeek }, location, sessionType, notes
    });
    
    await session.populate([
      { path: 'program', select: 'name description' },
      { path: 'instructor', select: 'name email' },
      { path: 'students.student', select: 'name age' }
    ]);
    
    res.status(201).json({ message: 'Session created successfully', session });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== ATTENDANCE ROUTES =====
app.get('/api/sessions/:id/attendance', authenticateToken, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate('students.student', 'name age');
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const attendance = await Attendance.find({ session: req.params.id })
      .populate('student', 'name age').populate('markedBy', 'name');

    const attendanceMap = {};
    attendance.forEach(record => { attendanceMap[record.student._id] = record; });

    const studentsWithAttendance = session.students.map(enrollment => ({
      student: { _id: enrollment.student._id, name: enrollment.student.name, age: enrollment.student.age },
      attendance: attendanceMap[enrollment.student._id] || null,
      enrollmentStatus: enrollment.status
    }));

    res.json({ 
      session: { _id: session._id, title: session.title, schedule: session.schedule, status: session.status }, 
      studentsWithAttendance 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/attendance', authenticateToken, authorizeRole('admin', 'tutor'), async (req, res) => {
  try {
    const { sessionId, attendanceData } = req.body;
    const attendanceRecords = [];
    
    for (const record of attendanceData) {
      const attendanceRecord = await Attendance.findOneAndUpdate(
        { session: sessionId, student: record.studentId },
        { 
          status: record.status, 
          notes: record.notes || '', 
          participationScore: record.participationScore || null,
          markedBy: req.user._id,
          checkInTime: record.status === 'present' ? new Date() : null
        },
        { upsert: true, new: true }
      );
      attendanceRecords.push(attendanceRecord);
    }

    const populatedRecords = await Attendance.find({ _id: { $in: attendanceRecords.map(r => r._id) } })
      .populate('student', 'name age').populate('markedBy', 'name');
    
    res.status(201).json({ message: 'Attendance marked successfully', attendance: populatedRecords });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update the app.listen to include Session & Attendance APIs
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🎓 Programs API available at /api/programs`);
  console.log(`📚 Resources API available at /api/resources`);
  console.log(`🏢 Clients API available at /api/clients`);
  console.log(`👨‍🎓 Students API available at /api/students`);
  console.log(`📅 Sessions API available at /api/sessions`);
  console.log(`✅ Attendance API available at /api/attendance`);
});
