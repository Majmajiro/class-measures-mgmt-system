import express from 'express';
import Program from '../models/Program.js';
import Student from '../models/Student.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/programs - Get all programs
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      category, 
      isActive, 
      tutor,
      availability,
      search,
      sortBy = 'name',
      sortOrder = 'asc',
      limit = 50,
      page = 1 
    } = req.query;

    // Build query
    let query = {};
    
    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Filter by tutor
    if (tutor) {
      query.tutor = tutor;
    }

    // Filter by availability
    if (availability === 'available') {
      // Programs that are not full
      query.$expr = { $lt: [{ $size: '$enrolledStudents' }, '$maxEnrollment'] };
    } else if (availability === 'full') {
      query.$expr = { $gte: [{ $size: '$enrolledStudents' }, '$maxEnrollment'] };
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with population
    const programs = await Program.find(query)
      .populate('tutor', 'name email role')
      .populate('enrolledStudents', 'name age')
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await Program.countDocuments(query);

    res.json({
      success: true,
      programs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get programs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch programs',
      error: error.message
    });
  }
});

// GET /api/programs/:id - Get single program
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const program = await Program.findById(req.params.id)
      .populate('tutor', 'name email phone role')
      .populate('enrolledStudents', 'name age parentInfo membershipStatus');

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    res.json({
      success: true,
      program
    });
  } catch (error) {
    console.error('Get program error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch program',
      error: error.message
    });
  }
});

// POST /api/programs - Create new program
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const programData = req.body;

    // Validate required fields
    if (!programData.name || !programData.description || !programData.category) {
      return res.status(400).json({
        success: false,
        message: 'Program name, description, and category are required'
      });
    }

    if (!programData.tutor) {
      return res.status(400).json({
        success: false,
        message: 'Program tutor is required'
      });
    }

    // Check if program with same name already exists
    const existingProgram = await Program.findOne({ name: programData.name });
    if (existingProgram) {
      return res.status(400).json({
        success: false,
        message: 'A program with this name already exists'
      });
    }

    // Validate age group
    if (programData.ageGroup && programData.ageGroup.min >= programData.ageGroup.max) {
      return res.status(400).json({
        success: false,
        message: 'Minimum age must be less than maximum age'
      });
    }

    // Create program
    const program = new Program(programData);
    await program.save();

    // Populate references before sending response
    await program.populate('tutor', 'name email role');

    res.status(201).json({
      success: true,
      program,
      message: 'Program created successfully'
    });
  } catch (error) {
    console.error('Create program error:', error);
    
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
      message: 'Failed to create program',
      error: error.message
    });
  }
});

// PUT /api/programs/:id - Update program
router.put('/:id', authenticateToken, authorizeRole('admin', 'tutor'), async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    // Check if tutor can only edit their own programs
    if (req.user.role === 'tutor' && program.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Tutors can only edit their own programs'
      });
    }

    const updateData = req.body;

    // Validate age group if provided
    if (updateData.ageGroup && updateData.ageGroup.min >= updateData.ageGroup.max) {
      return res.status(400).json({
        success: false,
        message: 'Minimum age must be less than maximum age'
      });
    }

    // Update program
    const updatedProgram = await Program.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('tutor', 'name email role');

    res.json({
      success: true,
      program: updatedProgram,
      message: 'Program updated successfully'
    });
  } catch (error) {
    console.error('Update program error:', error);
    
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
      message: 'Failed to update program',
      error: error.message
    });
  }
});

// DELETE /api/programs/:id - Delete program
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    // Check if program has enrolled students
    if (program.enrolledStudents && program.enrolledStudents.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete program with enrolled students. Please unenroll students first.',
        enrolledCount: program.enrolledStudents.length
      });
    }

    // Soft delete - mark as inactive instead of removing
    program.isActive = false;
    await program.save();

    res.json({
      success: true,
      message: 'Program deactivated successfully'
    });
  } catch (error) {
    console.error('Delete program error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete program',
      error: error.message
    });
  }
});

// POST /api/programs/:id/enroll - Enroll student in program
router.post('/:id/enroll', authenticateToken, authorizeRole('admin', 'tutor'), async (req, res) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if program is full
    if (program.isFull) {
      return res.status(400).json({
        success: false,
        message: 'Program is currently full'
      });
    }

    // Check if student is already enrolled
    if (program.enrolledStudents.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Student is already enrolled in this program'
      });
    }

    // Add student to program
    program.enrolledStudents.push(studentId);
    await program.save();

    // Add program enrollment to student
    const enrollment = {
      program: program.name,
      level: 'Beginner',
      enrolledDate: new Date(),
      status: 'Active'
    };

    student.enrollments = student.enrollments || [];
    student.enrollments.push(enrollment);
    await student.save();

    res.json({
      success: true,
      program,
      message: `${student.name} enrolled in ${program.name} successfully`
    });
  } catch (error) {
    console.error('Enroll student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll student',
      error: error.message
    });
  }
});

// DELETE /api/programs/:id/unenroll - Unenroll student from program
router.delete('/:id/unenroll', authenticateToken, authorizeRole('admin', 'tutor'), async (req, res) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Remove student from program
    program.enrolledStudents = program.enrolledStudents.filter(
      id => id.toString() !== studentId
    );
    await program.save();

    // Update student enrollment status
    if (student.enrollments) {
      student.enrollments = student.enrollments.map(enrollment =>
        enrollment.program === program.name
          ? { ...enrollment, status: 'Inactive' }
          : enrollment
      );
      await student.save();
    }

    res.json({
      success: true,
      program,
      message: `${student.name} unenrolled from ${program.name} successfully`
    });
  } catch (error) {
    console.error('Unenroll student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unenroll student',
      error: error.message
    });
  }
});

// GET /api/programs/stats - Get program statistics (admin only)
router.get('/admin/stats', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const stats = await Program.aggregate([
      {
        $group: {
          _id: null,
          totalPrograms: { $sum: 1 },
          activePrograms: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          totalEnrollments: {
            $sum: { $size: '$enrolledStudents' }
          },
          averageEnrollment: {
            $avg: { $size: '$enrolledStudents' }
          },
          fullPrograms: {
            $sum: {
              $cond: [
                { $gte: [{ $size: '$enrolledStudents' }, '$maxEnrollment'] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Get category breakdown
    const categoryStats = await Program.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalEnrollments: { $sum: { $size: '$enrolledStudents' } }
        }
      }
    ]);

    const result = {
      ...stats[0],
      categoryBreakdown: categoryStats,
      averageEnrollment: Math.round((stats[0]?.averageEnrollment || 0) * 10) / 10
    };

    res.json({
      success: true,
      stats: result
    });
  } catch (error) {
    console.error('Get program stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch program statistics',
      error: error.message
    });
  }
});

export default router;