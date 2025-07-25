import Program from '../models/Program.js';

export const createProgram = async (req, res) => {
  try {
    const { name, description, ageGroup, tutor, schedule } = req.body;
    
    const program = await Program.create({
      name,
      description,
      ageGroup,
      tutor,
      schedule
    });

    await program.populate('tutor', 'name email');
    res.status(201).json({ message: 'Program created successfully', program });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPrograms = async (req, res) => {
  try {
    const programs = await Program.find({ isActive: true })
      .populate('tutor', 'name email');
    
    res.json({ programs });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id)
      .populate('tutor', 'name email');
    
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    
    res.json({ program });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProgram = async (req, res) => {
  try {
    const { name, description, ageGroup, tutor, schedule } = req.body;
    
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { name, description, ageGroup, tutor, schedule },
      { new: true, runValidators: true }
    ).populate('tutor', 'name email');
    
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    
    res.json({ message: 'Program updated successfully', program });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    
    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
