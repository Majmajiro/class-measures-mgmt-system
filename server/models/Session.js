import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  notes: String,
  files: [String]
}, {
  timestamps: true
});

export default mongoose.model('Session', sessionSchema);
