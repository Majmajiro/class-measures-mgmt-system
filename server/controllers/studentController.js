import Student from '../models/Student.js';
import User from '../models/User.js';

export const createStudent = async (req, res) => {
  try {
    const { name, age, parentId, emergencyContact } = req.body;
    
    // If parentId is provided, verify parent exists
    if (parentId && parentId.trim() !== '') {
      const parent = await User.findById(parentId);
      if (!parent || parent.role !== 'parent') {
        return res.status(400).json({ message: 'Valid parent required' });
      }
    }

    const studentData = {
      name,
      age,
      emergencyContact
    };

    // Only add parent if parentId is provided and not empty
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
};

export const getStudents = async (req, res) => {
  try {
    let filter = { isActive: true };
    
    // If user is a parent, only show their children
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
};

export const getStudent = async (req, res) => {
  try {
    let filter = { _id: req.params.id };
    
    if (req.user.role === 'parent') {
      filter.parent = req.user._id;
    }

    const student = await Student.findOne(filter)
      .populate('parent', 'name email phone')
      .populate('programs', 'name description');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json({ student });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { name, age, emergencyContact, programs } = req.body;
    
    let filter = { _id: req.params.id };
    
    if (req.user.role === 'parent') {
      filter.parent = req.user._id;
    }

    const updateData = { name, age, emergencyContact };
    if (programs) {
      updateData.programs = programs;
    }
    
    const student = await Student.findOneAndUpdate(
      filter,
      updateData,
      { new: true, runValidators: true }
    ).populate('parent', 'name email')
     .populate('programs', 'name description');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found or access denied' });
    }
    
    res.json({ message: 'Student updated successfully', student });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
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
};

// Get all parents for dropdown selection
export const getParents = async (req, res) => {
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
};
