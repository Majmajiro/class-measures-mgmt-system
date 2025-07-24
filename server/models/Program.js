import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['Coding', 'Chess', 'Robotics', 'French', 'English', 'Digital Literacy'],
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['STEM', 'Languages', 'Strategic Thinking', 'Digital Skills'],
    required: true
  },
  ageGroup: {
    min: {
      type: Number,
      required: true,
      min: 4,
      max: 18
    },
    max: {
      type: Number,
      required: true,
      min: 4,
      max: 18
    }
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  schedule: {
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    startTime: {
      type: String,
      required: true
    }, // e.g., "09:00"
    endTime: {
      type: String,
      required: true
    }, // e.g., "12:30"
    location: {
      type: String,
      default: 'Main Campus'
    }
  },
  capacity: {
    type: Number,
    default: 20,
    min: 1,
    max: 50
  },
  pricing: {
    monthly: {
      type: Number,
      required: true
    },
    termly: {
      type: Number
    },
    dropIn: {
      type: Number
    }
  },
  // Learning objectives and outcomes
  objectives: [{
    type: String,
    required: true
  }],
  skills: [{
    type: String
  }],
  // Prerequisites
  prerequisites: {
    type: String,
    default: 'None'
  },
  // Required materials and resources
  materials: [{
    name: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      default: true
    },
    description: String
  }],
  // Associated platforms (PurpleMash, EducationCity, etc.)
  platforms: [{
    name: {
      type: String,
      enum: ['PurpleMash', 'EducationCity', 'Rising Stars', 'Scholastic Learning Zone', 'Code.org', 'Scratch']
    },
    accessLevel: {
      type: String,
      enum: ['Basic', 'Premium', 'Full Access'],
      default: 'Basic'
    }
  }],
  // Program status and enrollment
  isActive: {
    type: Boolean,
    default: true
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  maxEnrollment: {
    type: Number,
    default: 20
  },
  // Assessment and progress tracking
  assessmentMethods: [{
    type: String,
    enum: ['Project-based', 'Portfolio', 'Practical Assessment', 'Peer Review', 'Self Assessment']
  }],
  progressLevels: [{
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    description: String,
    requirements: [String]
  }],
  // Program metrics
  successRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  averageCompletion: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual to get current enrollment count
programSchema.virtual('currentEnrollment').get(function() {
  return this.enrolledStudents ? this.enrolledStudents.length : 0;
});

// Virtual to check if program is full
programSchema.virtual('isFull').get(function() {
  return this.currentEnrollment >= this.maxEnrollment;
});

// Virtual to get enrollment percentage
programSchema.virtual('enrollmentPercentage').get(function() {
  if (!this.maxEnrollment) return 0;
  return Math.round((this.currentEnrollment / this.maxEnrollment) * 100);
});

// Virtual to get age range string
programSchema.virtual('ageRangeString').get(function() {
  return `${this.ageGroup.min}-${this.ageGroup.max} years`;
});

// Virtual to get schedule string
programSchema.virtual('scheduleString').get(function() {
  const days = this.schedule.days.join(', ');
  return `${days} ${this.schedule.startTime}-${this.schedule.endTime}`;
});

// Indexes for better query performance
programSchema.index({ name: 1 });
programSchema.index({ category: 1 });
programSchema.index({ 'tutor': 1 });
programSchema.index({ isActive: 1 });

programSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Program', programSchema);