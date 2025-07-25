// Session Schema (Updated)
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
    duration: { type: Number, required: false },
    dayOfWeek: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: false }
  },
  location: { type: String, required: false },
  sessionType: { type: String, enum: ['regular', 'assessment', 'makeup', 'review', 'Regular Class', 'Assessment', 'Workshop', 'Practice', 'Exam Prep', 'Review'], default: 'regular' },
  status: { type: String, enum: ['scheduled', 'ongoing', 'completed', 'cancelled'], default: 'scheduled' },
  notes: String,
  objectives: [String],
  materials: [String],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
