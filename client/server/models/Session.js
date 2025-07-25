import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  // Basic session information
  title: {
    type: String,
    required: true,
    trim: true
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  duration: {
    planned: {
      type: Number, // minutes
      required: true
    },
    actual: {
      type: Number // minutes
    }
  },
  // Session timing
  startTime: {
    planned: {
      type: String,
      required: true // "09:00"
    },
    actual: String
  },
  endTime: {
    planned: {
      type: String,
      required: true // "10:30"
    },
    actual: String
  },
  // Staff and location
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assistants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  location: {
    type: String,
    required: true,
    default: 'Main Campus'
  },
  room: String,
  // Session content and structure
  topic: {
    type: String,
    required: true
  },
  objectives: [{
    description: {
      type: String,
      required: true
    },
    achieved: {
      type: Boolean,
      default: false
    }
  }],
  agenda: [{
    activity: {
      type: String,
      required: true
    },
    timeAllocation: Number, // minutes
    completed: {
      type: Boolean,
      default: false
    },
    notes: String
  }],
  // Resources used
  resources: [{
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource'
    },
    quantity: {
      type: Number,
      default: 1
    },
    condition: {
      before: {
        type: String,
        enum: ['Excellent', 'Good', 'Fair', 'Poor'],
        default: 'Good'
      },
      after: {
        type: String,
        enum: ['Excellent', 'Good', 'Fair', 'Poor']
      }
    }
  }],
  // Student attendance and participation
  attendance: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late', 'Left Early'],
      default: 'Present'
    },
    arrivalTime: String,
    departureTime: String,
    participation: {
      level: {
        type: String,
        enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Not Assessed'],
        default: 'Not Assessed'
      },
      notes: String
    },
    behaviour: {
      rating: {
        type: String,
        enum: ['Excellent', 'Good', 'Needs Improvement', 'Concerning'],
        default: 'Good'
      },
      notes: String
    },
    // Individual student progress
    skillsAssessed: [{
      skill: String,
      level: {
        type: String,
        enum: ['Mastered', 'Developing', 'Emerging', 'Not Yet'],
        default: 'Developing'
      },
      notes: String
    }],
    homework: {
      assigned: String,
      completed: {
        type: Boolean,
        default: false
      },
      quality: {
        type: String,
        enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Not Submitted'],
        default: 'Not Submitted'
      }
    }
  }],
  // Session outcomes and assessment
  outcomes: {
    overallSuccess: {
      type: String,
      enum: ['Excellent', 'Good', 'Fair', 'Poor'],
      default: 'Good'
    },
    studentsEngaged: {
      type: Number,
      min: 0,
      max: 100 // percentage
    },
    objectivesAchieved: {
      type: Number,
      min: 0,
      max: 100 // percentage
    },
    paceRating: {
      type: String,
      enum: ['Too Fast', 'Just Right', 'Too Slow'],
      default: 'Just Right'
    }
  },
  // Feedback and reflection
  tutorReflection: {
    whatWorkedWell: String,
    whatChallenged: String,
    nextSessionFocus: String,
    resourcesNeeded: String,
    parentCommunication: String
  },
  studentFeedback: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    enjoymentLevel: {
      type: Number,
      min: 1,
      max: 5
    },
    difficultyLevel: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String
  }],
  // Administrative
  sessionType: {
    type: String,
    enum: ['Regular', 'Assessment', 'Review', 'Catch-up', 'Special Event', 'Parent Meeting'],
    default: 'Regular'
  },
  status: {
    type: String,
    enum: ['Planned', 'In Progress', 'Completed', 'Cancelled', 'Rescheduled'],
    default: 'Planned'
  },
  cancellationReason: String,
  makeupSession: {
    required: {
      type: Boolean,
      default: false
    },
    scheduled: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session'
    }
  },
  // Technology and platforms used
  platformsUsed: [{
    platform: {
      type: String,
      enum: ['PurpleMash', 'EducationCity', 'Rising Stars', 'Scholastic Learning Zone', 'Scratch', 'Code.org', 'Other']
    },
    timeUsed: Number, // minutes
    effectivenessRating: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  // Parent communication
  parentUpdates: [{
    method: {
      type: String,
      enum: ['WhatsApp', 'Email', 'Phone Call', 'In Person', 'App Notification']
    },
    message: String,
    sentAt: {
      type: Date,
      default: Date.now
    },
    response: String,
    responseAt: Date
  }],
  // Files and attachments
  attachments: [{
    name: String,
    type: {
      type: String,
      enum: ['Photo', 'Video', 'Document', 'Worksheet', 'Assessment']
    },
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual to get total planned duration
sessionSchema.virtual('plannedDurationHours').get(function() {
  return Math.round((this.duration.planned / 60) * 10) / 10;
});

// Virtual to get actual duration
sessionSchema.virtual('actualDurationHours').get(function() {
  if (!this.duration.actual) return null;
  return Math.round((this.duration.actual / 60) * 10) / 10;
});

// Virtual to get attendance count
sessionSchema.virtual('attendanceCount').get(function() {
  return {
    total: this.attendance.length,
    present: this.attendance.filter(a => a.status === 'Present').length,
    absent: this.attendance.filter(a => a.status === 'Absent').length,
    late: this.attendance.filter(a => a.status === 'Late').length
  };
});

// Virtual to get attendance percentage
sessionSchema.virtual('attendancePercentage').get(function() {
  if (this.attendance.length === 0) return 0;
  const presentCount = this.attendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
  return Math.round((presentCount / this.attendance.length) * 100);
});

// Virtual to get session completion status
sessionSchema.virtual('completionStatus').get(function() {
  if (this.status !== 'Completed') return this.status;
  
  const completedObjectives = this.objectives.filter(obj => obj.achieved).length;
  const totalObjectives = this.objectives.length;
  
  if (totalObjectives === 0) return 'Completed';
  
  const completionRate = (completedObjectives / totalObjectives) * 100;
  
  if (completionRate >= 90) return 'Fully Completed';
  if (completionRate >= 70) return 'Mostly Completed';
  if (completionRate >= 50) return 'Partially Completed';
  return 'Minimally Completed';
});

// Virtual to get average student engagement
sessionSchema.virtual('averageEngagement').get(function() {
  const engagementScores = this.attendance
    .filter(a => a.participation.level !== 'Not Assessed')
    .map(a => {
      switch (a.participation.level) {
        case 'Excellent': return 5;
        case 'Good': return 4;
        case 'Fair': return 3;
        case 'Poor': return 2;
        default: return 0;
      }
    });
  
  if (engagementScores.length === 0) return 0;
  return Math.round((engagementScores.reduce((sum, score) => sum + score, 0) / engagementScores.length) * 10) / 10;
});

// Indexes for better query performance
sessionSchema.index({ program: 1, date: 1 });
sessionSchema.index({ tutor: 1, date: 1 });
sessionSchema.index({ date: 1 });
sessionSchema.index({ status: 1 });
sessionSchema.index({ 'attendance.student': 1 });

sessionSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Session', sessionSchema);