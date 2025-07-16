import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  present: {
    type: Boolean,
    required: true
  },
  notes: String
}, {
  timestamps: true
});

export default mongoose.model('Attendance', attendanceSchema);
