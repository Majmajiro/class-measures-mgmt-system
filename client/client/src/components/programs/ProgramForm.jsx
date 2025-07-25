import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { X, Save, Plus, Minus } from 'lucide-react';

const ProgramForm = ({ program, onClose, onProgramSaved }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Coding',
    duration: '',
    price: '',
    maxStudents: '',
    currentEnrollment: 0,
    ageRange: { min: 6, max: 16 },
    schedule: { days: [], time: '' },
    instructor: '',
    prerequisites: '',
    objectives: [''],
    materials: [''],
    isActive: true
  });

  const [loading, setLoading] = useState(false);

  const colors = {
    primary: '#c55c5c',
    secondary: '#f4c842',
    dark: '#1e1e3c',
    white: '#ffffff',
    gray: '#6b7280',
    lightGray: '#f3f4f6',
    success: '#10b981',
    danger: '#ef4444'
  };

  const categories = ['Coding', 'Robotics', 'Chess', 'Reading', 'French Classes', 'Entrepreneurship'];
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const instructors = ['Mr. Kiprotich', 'Ms. Wanjiku', 'Eng. Mwangi', 'Mme. Akinyi', 'Mrs. Njeri', 'Mr. Otieno'];

  useEffect(() => {
    if (program) {
      setFormData({
        name: program.name || '',
        description: program.description || '',
        category: program.category || 'Coding',
        duration: program.duration || '',
        price: program.price || '',
        maxStudents: program.maxStudents || '',
        currentEnrollment: program.currentEnrollment || 0,
        ageRange: program.ageRange || { min: 6, max: 16 },
        schedule: program.schedule || { days: [], time: '' },
        instructor: program.instructor || '',
        prerequisites: program.prerequisites || '',
        objectives: program.objectives || [''],
        materials: program.materials || [''],
        isActive: program.isActive !== undefined ? program.isActive : true
      });
    }
  }, [program]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleDayToggle = (day) => {
    const currentDays = formData.schedule.days || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    handleNestedChange('schedule', 'days', newDays);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Program name is required');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Program description is required');
      return false;
    }
    if (!formData.duration.trim()) {
      toast.error('Program duration is required');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Valid price is required');
      return false;
    }
    if (!formData.maxStudents || parseInt(formData.maxStudents) <= 0) {
      toast.error('Valid maximum students number is required');
      return false;
    }
    if (!formData.instructor.trim()) {
      toast.error('Instructor is required');
      return false;
    }
    if (formData.ageRange.min >= formData.ageRange.max) {
      toast.error('Minimum age must be less than maximum age');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Get existing programs from localStorage
      const existingPrograms = JSON.parse(localStorage.getItem('programs') || '[]');
      
      // Clean up form data
      const cleanedData = {
        ...formData,
        price: parseFloat(formData.price),
        maxStudents: parseInt(formData.maxStudents),
        currentEnrollment: parseInt(formData.currentEnrollment) || 0,
        objectives: formData.objectives.filter(obj => obj.trim()),
        materials: formData.materials.filter(mat => mat.trim()),
        _id: program?._id || Date.now().toString(),
        createdAt: program?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      let updatedPrograms;
      if (program) {
        // Edit existing program
        updatedPrograms = existingPrograms.map(p => 
          p._id === program._id ? cleanedData : p
        );
        toast.success('✅ Program updated successfully!');
      } else {
        // Add new program
        updatedPrograms = [...existingPrograms, cleanedData];
        toast.success('✅ Program created successfully!');
      }

      // Save to localStorage
      localStorage.setItem('programs', JSON.stringify(updatedPrograms));
      
      // Call the parent callback
      onProgramSaved();
      
    } catch (error) {
      console.error('Error saving program:', error);
      toast.error('Failed to save program');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: colors.white,
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.dark, margin: 0 }}>
              {program ? 'Edit Program' : 'Create New Program'}
            </h2>
            <p style={{ color: colors.gray, fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
              {program ? 'Update program details' : 'Add a new educational program'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: colors.gray
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: colors.dark, marginBottom: '1rem' }}>
              Basic Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.dark, marginBottom: '0.5rem' }}>
                  Program Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                  placeholder="e.g., Python Programming Basics"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.dark, marginBottom: '0.5rem' }}>
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    backgroundColor: colors.white
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.dark, marginBottom: '0.5rem' }}>
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                  minHeight: '100px'
                }}
                placeholder="Describe what students will learn..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.dark, marginBottom: '0.5rem' }}>
                  Duration *
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                  placeholder="e.g., 3 months"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.dark, marginBottom: '0.5rem' }}>
                  Price (KSh) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                  placeholder="5000"
                  min="0"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.dark, marginBottom: '0.5rem' }}>
                  Max Students *
                </label>
                <input
                  type="number"
                  value={formData.maxStudents}
                  onChange={(e) => handleInputChange('maxStudents', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                  placeholder="15"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Age Range */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: colors.dark, marginBottom: '1rem' }}>
              Age Range
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.dark, marginBottom: '0.5rem' }}>
                  Minimum Age
                </label>
                <input
                  type="number"
                  value={formData.ageRange.min}
                  onChange={(e) => handleNestedChange('ageRange', 'min', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                  min="3"
                  max="18"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.dark, marginBottom: '0.5rem' }}>
                  Maximum Age
                </label>
                <input
                  type="number"
                  value={formData.ageRange.max}
                  onChange={(e) => handleNestedChange('ageRange', 'max', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                  min="3"
                  max="18"
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: colors.dark, marginBottom: '1rem' }}>
              Schedule
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.dark, marginBottom: '0.5rem' }}>
                Days of Week
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {weekDays.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: `2px solid ${formData.schedule.days?.includes(day) ? colors.primary : colors.lightGray}`,
                      backgroundColor: formData.schedule.days?.includes(day) ? `${colors.primary}20` : colors.white,
                      color: formData.schedule.days?.includes(day) ? colors.primary : colors.gray,
                      borderRadius: '0.5rem',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.dark, marginBottom: '0.5rem' }}>
                Time
              </label>
              <input
                type="text"
                value={formData.schedule.time}
                onChange={(e) => handleNestedChange('schedule', 'time', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
                placeholder="e.g., 4:00 PM - 6:00 PM"
              />
            </div>
          </div>

          {/* Instructor */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: colors.dark, marginBottom: '1rem' }}>
              Instructor & Requirements
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.dark, marginBottom: '0.5rem' }}>
                  Instructor *
                </label>
                <select
                  value={formData.instructor}
                  onChange={(e) => handleInputChange('instructor', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    backgroundColor: colors.white
                  }}
                >
                  <option value="">Select Instructor</option>
                  {instructors.map(instructor => (
                    <option key={instructor} value={instructor}>{instructor}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.dark, marginBottom: '0.5rem' }}>
                  Status
                </label>
                <select
                  value={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.value === 'true')}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    backgroundColor: colors.white
                  }}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.dark, marginBottom: '0.5rem' }}>
                Prerequisites
              </label>
              <textarea
                value={formData.prerequisites}
                onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                  minHeight: '80px'
                }}
                placeholder="What students should know before joining..."
              />
            </div>
          </div>

          {/* Learning Objectives */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: colors.dark, marginBottom: '1rem' }}>
              Learning Objectives
            </h3>
            {formData.objectives.map((objective, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                  placeholder={`Learning objective ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => addArrayItem('objectives')}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: colors.success,
                    color: colors.white,
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} />
                </button>
                {formData.objectives.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('objectives', index)}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: colors.danger,
                      color: colors.white,
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Minus size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Materials */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: colors.dark, marginBottom: '1rem' }}>
              Required Materials
            </h3>
            {formData.materials.map((material, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => handleArrayChange('materials', index, e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                  placeholder={`Material ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => addArrayItem('materials')}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: colors.success,
                    color: colors.white,
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} />
                </button>
                {formData.materials.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('materials', index)}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: colors.danger,
                      color: colors.white,
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Minus size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Submit Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: `1px solid ${colors.lightGray}` }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: colors.lightGray,
                color: colors.gray,
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 2rem',
                background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
                color: colors.dark,
                border: 'none',
                borderRadius: '0.5rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Save size={16} />
              {loading ? 'Saving...' : (program ? 'Update Program' : 'Create Program')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgramForm;