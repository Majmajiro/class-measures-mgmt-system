import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['Coding', 'Chess', 'Robotics', 'French', 'Reading'],
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
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  schedule: {
    day: {
      type: String,
      enum: ['Saturday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      default: 'Saturday'
    },
    startTime: String, // e.g., "09:00"
    endTime: String,   // e.g., "12:30"
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
  materials: [String], // List of required materials
  objectives: [String], // Learning objectives
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

// Virtual to get current enrollment count
programSchema.virtual('currentEnrollment').get(function() {
  return this.enrolledStudents ? this.enrolledStudents.length : 0;
});

// Virtual to check if program is full
programSchema.virtual('isFull').get(function() {
  return this.currentEnrollment >= this.capacity;
});

programSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Program', programSchema);
