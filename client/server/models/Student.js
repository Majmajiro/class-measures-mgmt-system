import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  // Basic Information (always required)
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [4, 'Age must be at least 4'],
    max: [18, 'Age must be at most 18']
  },

  // Parent Information (new nested structure, optional for backward compatibility)
  parentInfo: {
    parentName: {
      type: String,
      trim: true
    },
    parentPhone: {
      type: String,
      trim: true
    },
    parentEmail: {
      type: String,
      trim: true,
      lowercase: true
    },
    // Reference to User model (if parent is registered in system)
    parentUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },

  // Legacy parent fields (for backward compatibility with existing data)
  parentName: {
    type: String,
    trim: true
  },
  parentPhone: {
    type: String,
    trim: true
  },

  // Address Information (optional)
  address: {
    area: {
      type: String,
      trim: true
    },
    county: {
      type: String,
      trim: true
    }
  },

  // Emergency Contact (support both old string format and new object format)
  emergencyContact: {
    type: mongoose.Schema.Types.Mixed, // Allows both String and Object
    default: ''
  },

  // Medical Information (optional)
  medicalInfo: {
    allergies: {
      type: String,
      trim: true
    },
    medications: {
      type: String,
      trim: true
    },
    conditions: {
      type: String,
      trim: true
    }
  },

  // Academic Information (optional)
  academicInfo: {
    school: {
      type: String,
      trim: true
    },
    gradeLevel: {
      type: String,
      enum: ['kindergarten', 'grade1', 'grade2', 'grade3', 'grade4', 'grade5', 
             'grade6', 'grade7', 'grade8', 'form1', 'form2', 'form3', 'form4', ''],
      default: ''
    }
  },

  // Program Enrollments
  programs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program'
  }],

  // Additional fields for tracking
  membershipStatus: {
    type: String,
    enum: ['Member', 'Non-Member'],
    default: 'Non-Member'
  },

  enrollments: [{
    program: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    enrolledDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Completed'],
      default: 'Active'
    },
    lastTransfer: Date
  }],

  // Payment Information
  paymentStatus: {
    type: String,
    enum: ['Paid Up', 'Outstanding', 'Overdue'],
    default: 'Outstanding'
  },
  lastPayment: Date,
  amountOwed: {
    type: Number,
    default: 0
  },

  // Attendance Tracking
  attendance: {
    present: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },

  // Academic Progress
  academicProgress: {
    type: Map,
    of: {
      grade: String,
      skills: [String],
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    }
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// VIRTUAL: Backwards compatibility for parent info
studentSchema.virtual('compatibleParentInfo').get(function() {
  // Return new structure if it exists, otherwise use legacy fields
  if (this.parentInfo && (this.parentInfo.parentName || this.parentInfo.parentPhone)) {
    return this.parentInfo;
  } else {
    return {
      parentName: this.parentName || 'Unknown Parent',
      parentPhone: this.parentPhone || this.emergencyContact || '0700000000',
      parentEmail: ''
    };
  }
});

// VIRTUAL: Backwards compatibility for emergency contact
studentSchema.virtual('compatibleEmergencyContact').get(function() {
  // If emergencyContact is an object, return it
  if (typeof this.emergencyContact === 'object' && this.emergencyContact !== null) {
    return this.emergencyContact;
  } else {
    // If it's a string (legacy format), parse it
    const contactStr = this.emergencyContact || '';
    return {
      name: contactStr.split(' - ')[0] || '',
      phone: contactStr.split(' - ')[1] || contactStr || '',
      relationship: 'family_friend'
    };
  }
});

// PRE-SAVE HOOK: Migrate legacy data to new structure
studentSchema.pre('save', function(next) {
  // Migrate legacy parent fields to new structure if needed
  if ((this.parentName || this.parentPhone) && !this.parentInfo.parentName && !this.parentInfo.parentPhone) {
    this.parentInfo = {
      parentName: this.parentName || 'Unknown Parent',
      parentPhone: this.parentPhone || this.emergencyContact || '0700000000',
      parentEmail: this.parentInfo.parentEmail || ''
    };
  }
  
  next();
});

// Indexes for better query performance
studentSchema.index({ 'parentInfo.parentName': 1 });
studentSchema.index({ 'parentInfo.parentPhone': 1 });
studentSchema.index({ parentName: 1 }); // Legacy index
studentSchema.index({ name: 1 });
studentSchema.index({ membershipStatus: 1 });
studentSchema.index({ paymentStatus: 1 });

// Virtual to get current enrollment count
studentSchema.virtual('currentEnrollments').get(function() {
  return this.enrollments ? this.enrollments.filter(e => e.status === 'Active').length : 0;
});

// Virtual to get attendance percentage
studentSchema.virtual('attendancePercentage').get(function() {
  if (!this.attendance || !this.attendance.total) return 0;
  return Math.round((this.attendance.present / this.attendance.total) * 100);
});

studentSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Student', studentSchema);