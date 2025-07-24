import express from 'express';
import Student from '../models/Student.js';
// import Program from '../models/Program.js';
// import { authenticateToken, authorizeRole } from '../middleware/auth.js'; // Temporarily disabled

const router = express.Router();

// Helper function to normalize student data for frontend
const normalizeStudentData = (student) => {
  const studentObj = student.toObject();
  
  // Ensure parentInfo exists (using virtual or legacy data)
  if (!studentObj.parentInfo || (!studentObj.parentInfo.parentName && !studentObj.parentInfo.parentPhone)) {
    studentObj.parentInfo = {
      parentName: studentObj.parentName || 'Unknown Parent',
      parentPhone: studentObj.parentPhone || studentObj.emergencyContact || '0700000000',
      parentEmail: studentObj.parentInfo?.parentEmail || ''
    };
  }
  
  // Ensure address exists
  if (!studentObj.address) {
    studentObj.address = {
      area: '',
      county: ''
    };
  }
  
  // Normalize emergency contact to object format
  if (typeof studentObj.emergencyContact === 'string') {
    const contactStr = studentObj.emergencyContact || '';
    studentObj.emergencyContact = {
      name: contactStr.split(' - ')[0] || '',
      phone: contactStr.split(' - ')[1] || contactStr || '',
      relationship: 'family_friend'
    };
  } else if (!studentObj.emergencyContact) {
    studentObj.emergencyContact = {
      name: '',
      phone: '',
      relationship: ''
    };
  }
  
  // Ensure medicalInfo exists
  if (!studentObj.medicalInfo) {
    studentObj.medicalInfo = {
      allergies: '',
      medications: '',
      conditions: ''
    };
  }
  
  // Ensure academicInfo exists
  if (!studentObj.academicInfo) {
    studentObj.academicInfo = {
      school: '',
      gradeLevel: ''
    };
  }
  
  // Ensure other fields have defaults
  studentObj.membershipStatus = studentObj.membershipStatus || 'Non-Member';
  studentObj.enrollments = studentObj.enrollments || [];
  studentObj.paymentStatus = studentObj.paymentStatus || 'Outstanding';
  studentObj.amountOwed = studentObj.amountOwed || 0;
  studentObj.attendance = studentObj.attendance || { present: 0, total: 0 };
  studentObj.academicProgress = studentObj.academicProgress || {};
  
  return studentObj;
};

// GET /api/students - Get all students (NO AUTH FOR DEBUGGING)
router.get('/', async (req, res) => {
  try {
    console.log('📥 GET /api/students - received request');
    
    const { 
      search, 
      program, 
      level, 
      membershipStatus, 
      paymentStatus,
      limit = 50,
      page = 1 
    } = req.query;

    console.log('🔍 Query parameters:', { search, program, level, membershipStatus, paymentStatus, limit, page });

    // Build query
    let query = {};
    
    // Search by name, parent name, or phone (support both old and new structures)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'parentInfo.parentName': { $regex: search, $options: 'i' } },
        { 'parentInfo.parentPhone': { $regex: search, $options: 'i' } },
        { parentName: { $regex: search, $options: 'i' } }, // Legacy field
        { parentPhone: { $regex: search, $options: 'i' } }, // Legacy field
        { emergencyContact: { $regex: search, $options: 'i' } } // Legacy phone
      ];
    }

    // Filter by program enrollment
    if (program) {
      query['enrollments.program'] = program;
    }

    // Filter by skill level
    if (level) {
      query['enrollments.level'] = level;
    }

    // Filter by membership status
    if (membershipStatus) {
      query.membershipStatus = membershipStatus;
    }

    // Filter by payment status
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    console.log('🎯 Final query:', JSON.stringify(query, null, 2));

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    console.log('🔄 Executing database query...');
    const rawStudents = await Student.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    console.log(`📊 Found ${rawStudents.length} raw students`);

    // Normalize student data for frontend compatibility
    const students = rawStudents.map(normalizeStudentData);

    console.log(`✅ Normalized ${students.length} students for frontend`);

    // Get total count for pagination
    const total = await Student.countDocuments(query);
    console.log(`📈 Total count: ${total}`);

    const response = {
      success: true,
      students,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    };

    console.log('✅ Sending response with students:', students.map(s => ({ 
      name: s.name, 
      parentName: s.parentInfo?.parentName 
    })));

    res.json(response);
  } catch (error) {
    console.error('❌ Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// GET /api/students/:id - Get single student (NO AUTH FOR DEBUGGING)
router.get('/:id', async (req, res) => {
  try {
    console.log(`📥 GET /api/students/${req.params.id} - received request`);
    
    const rawStudent = await Student.findById(req.params.id);

    if (!rawStudent) {
      console.log('❌ Student not found');
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    console.log('✅ Raw student found:', rawStudent.name);

    // Normalize student data
    const student = normalizeStudentData(rawStudent);

    console.log('✅ Normalized student data for frontend');

    res.json({
      success: true,
      student
    });
  } catch (error) {
    console.error('❌ Get student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student',
      error: error.message
    });
  }
});

// POST /api/students - Create new student (NO AUTH FOR DEBUGGING)
router.post('/', async (req, res) => {
  try {
    console.log('📥 POST /api/students - received request');
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    
    const studentData = req.body;

    // Validate required fields (support both old and new formats)
    if (!studentData.name || !studentData.age) {
      console.log('❌ Validation failed: missing name or age');
      return res.status(400).json({
        success: false,
        message: 'Student name and age are required'
      });
    }

    // Handle parent info validation (support both formats)
    const hasNewParentInfo = studentData.parentInfo?.parentName || studentData.parentInfo?.parentPhone;
    const hasLegacyParentInfo = studentData.parentName || studentData.parentPhone;
    
    if (!hasNewParentInfo && !hasLegacyParentInfo) {
      console.log('❌ Validation failed: missing parent info');
      return res.status(400).json({
        success: false,
        message: 'Parent name and phone are required'
      });
    }

    // Create student with proper data structure
    const processedData = {
      ...studentData,
      age: parseInt(studentData.age)
    };

    // If legacy parent data is provided, move it to the new structure
    if (!hasNewParentInfo && hasLegacyParentInfo) {
      processedData.parentInfo = {
        parentName: studentData.parentName || 'Unknown Parent',
        parentPhone: studentData.parentPhone || studentData.emergencyContact || '0700000000',
        parentEmail: studentData.parentInfo?.parentEmail || ''
      };
    }

    console.log('🔄 Creating new student with processed data...');
    console.log('📋 Processed data:', JSON.stringify(processedData, null, 2));

    const student = new Student(processedData);
    await student.save();
    
    console.log('✅ Student created with ID:', student._id);

    // Normalize for response
    const normalizedStudent = normalizeStudentData(student);

    res.status(201).json({
      success: true,
      student: normalizedStudent,
      message: 'Student created successfully'
    });
  } catch (error) {
    console.error('❌ Create student error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      console.log('❌ Validation errors:', errors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create student',
      error: error.message
    });
  }
});

// PUT /api/students/:id - Update student (NO AUTH FOR DEBUGGING)
router.put('/:id', async (req, res) => {
  try {
    console.log(`📥 PUT /api/students/${req.params.id} - received request`);
    
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      console.log('❌ Student not found for update');
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const updateData = req.body;
    console.log('📝 Update data:', JSON.stringify(updateData, null, 2));

    // Convert age to number if provided
    if (updateData.age) {
      updateData.age = parseInt(updateData.age);
    }

    // Update student
    console.log('🔄 Updating student...');
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    );

    console.log('✅ Student updated:', updatedStudent.name);

    // Normalize for response
    const normalizedStudent = normalizeStudentData(updatedStudent);

    res.json({
      success: true,
      student: normalizedStudent,
      message: 'Student updated successfully'
    });
  } catch (error) {
    console.error('❌ Update student error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update student',
      error: error.message
    });
  }
});

// DELETE /api/students/:id - Delete student (NO AUTH FOR DEBUGGING)
router.delete('/:id', async (req, res) => {
  try {
    console.log(`📥 DELETE /api/students/${req.params.id} - received request`);
    
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      console.log('❌ Student not found for deletion');
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if student has active enrollments
    const activeEnrollments = student.enrollments?.filter(e => e.status === 'Active') || [];
    
    if (activeEnrollments.length > 0) {
      console.log('❌ Cannot delete student with active enrollments');
      return res.status(400).json({
        success: false,
        message: 'Cannot delete student with active enrollments. Please complete or withdraw enrollments first.',
        activeEnrollments: activeEnrollments.map(e => e.program)
      });
    }

    // Soft delete - mark as inactive instead of removing
    console.log('🔄 Soft deleting student...');
    student.isActive = false;
    await student.save();

    console.log('✅ Student deactivated:', student.name);

    res.json({
      success: true,
      message: 'Student deactivated successfully'
    });
  } catch (error) {
    console.error('❌ Delete student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete student',
      error: error.message
    });
  }
});

// Test endpoint
router.get('/test/ping', (req, res) => {
  console.log('📥 GET /api/students/test/ping - received request');
  res.json({
    success: true,
    message: 'Students API is working!',
    timestamp: new Date().toISOString(),
    studentsInDB: 'Check MongoDB for actual count'
  });
});

export default router;