import { useState, useEffect } from 'react';
import { studentsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { X, User, Phone, Mail, MapPin, GraduationCap, Heart, AlertTriangle } from 'lucide-react';

const StudentForm = ({ student, onClose, onStudentSaved }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    parentInfo: {
      parentName: '',
      parentPhone: '',
      parentEmail: ''
    },
    address: {
      area: '',
      county: ''
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    medicalInfo: {
      allergies: '',
      medications: '',
      conditions: ''
    },
    academicInfo: {
      school: '',
      gradeLevel: ''
    }
  });
  
  const [loading, setLoading] = useState(false);

  const colors = {
    primary: '#c55c5c',
    secondary: '#f4c842',
    dark: '#1e1e3c',
    white: '#ffffff',
    gray: '#6b7280',
    lightGray: '#f3f4f6'
  };

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        age: student.age || '',
        parentInfo: {
          parentName: student.parentInfo?.parentName || '',
          parentPhone: student.parentInfo?.parentPhone || '',
          parentEmail: student.parentInfo?.parentEmail || ''
        },
        address: {
          area: student.address?.area || '',
          county: student.address?.county || ''
        },
        emergencyContact: {
          name: student.emergencyContact?.name || '',
          phone: student.emergencyContact?.phone || '',
          relationship: student.emergencyContact?.relationship || ''
        },
        medicalInfo: {
          allergies: student.medicalInfo?.allergies || '',
          medications: student.medicalInfo?.medications || '',
          conditions: student.medicalInfo?.conditions || ''
        },
        academicInfo: {
          school: student.academicInfo?.school || '',
          gradeLevel: student.academicInfo?.gradeLevel || ''
        }
      });
    }
  }, [student]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!formData.name.trim()) {
        toast.error('Student name is required');
        setLoading(false);
        return;
      }

      if (!formData.age || formData.age < 1 || formData.age > 25) {
        toast.error('Please enter a valid age (1-25)');
        setLoading(false);
        return;
      }

      if (!formData.parentInfo.parentName.trim()) {
        toast.error('Parent name is required');
        setLoading(false);
        return;
      }

      let response;
      if (student) {
        response = await studentsAPI.update(student._id, formData);
      } else {
        response = await studentsAPI.create(formData);
      }

      console.log('Student save response:', response);

      if (response.student || response.message) {
        toast.success(student ? 'Student updated successfully!' : 'Student created successfully!');
        onStudentSaved();
      } else {
        throw new Error('Failed to save student');
      }
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error(student ? 'Failed to update student' : 'Failed to create student');
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
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: `2px solid ${colors.lightGray}`
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: colors.dark,
            margin: 0
          }}>
            {student ? '✏️ Edit Student' : '👨‍🎓 Add New Student'}
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              backgroundColor: colors.lightGray,
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} style={{ color: colors.gray }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: colors.dark, 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <User size={20} style={{ color: colors.primary }} />
              Basic Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: colors.dark, 
                  marginBottom: '0.5rem' 
                }}>
                  Student Name *
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
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  placeholder="Enter student's full name"
                  required
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: colors.dark, 
                  marginBottom: '0.5rem' 
                }}>
                  Age *
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  placeholder="Age"
                  min="1"
                  max="25"
                  required
                />
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: colors.dark, 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Phone size={20} style={{ color: colors.secondary }} />
              Parent Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: colors.dark, 
                  marginBottom: '0.5rem' 
                }}>
                  Parent Name *
                </label>
                <input
                  type="text"
                  value={formData.parentInfo.parentName}
                  onChange={(e) => handleNestedInputChange('parentInfo', 'parentName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  placeholder="Parent/Guardian name"
                  required
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: colors.dark, 
                  marginBottom: '0.5rem' 
                }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.parentInfo.parentPhone}
                  onChange={(e) => handleNestedInputChange('parentInfo', 'parentPhone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  placeholder="+254 7XX XXX XXX"
                />
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: colors.dark, 
                marginBottom: '0.5rem' 
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={formData.parentInfo.parentEmail}
                onChange={(e) => handleNestedInputChange('parentInfo', 'parentEmail', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
                placeholder="parent@example.com"
              />
            </div>
          </div>

          {/* Address Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: colors.dark, 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <MapPin size={20} style={{ color: '#10b981' }} />
              Address Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: colors.dark, 
                  marginBottom: '0.5rem' 
                }}>
                  Area/Estate
                </label>
                <input
                  type="text"
                  value={formData.address.area}
                  onChange={(e) => handleNestedInputChange('address', 'area', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  placeholder="e.g., Limuru, Kikuyu"
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: colors.dark, 
                  marginBottom: '0.5rem' 
                }}>
                  County
                </label>
                <input
                  type="text"
                  value={formData.address.county}
                  onChange={(e) => handleNestedInputChange('address', 'county', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  placeholder="e.g., Kiambu, Nairobi"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: colors.dark, 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <GraduationCap size={20} style={{ color: '#8b5cf6' }} />
              Academic Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: colors.dark, 
                  marginBottom: '0.5rem' 
                }}>
                  Current School
                </label>
                <input
                  type="text"
                  value={formData.academicInfo.school}
                  onChange={(e) => handleNestedInputChange('academicInfo', 'school', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  placeholder="Name of current school"
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: colors.dark, 
                  marginBottom: '0.5rem' 
                }}>
                  Grade Level
                </label>
                <select
                  value={formData.academicInfo.gradeLevel}
                  onChange={(e) => handleNestedInputChange('academicInfo', 'gradeLevel', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    backgroundColor: colors.white
                  }}
                >
                  <option value="">Select Grade</option>
                  <option value="PP1">PP1</option>
                  <option value="PP2">PP2</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Form 1">Form 1</option>
                  <option value="Form 2">Form 2</option>
                  <option value="Form 3">Form 3</option>
                  <option value="Form 4">Form 4</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'flex-end',
            paddingTop: '1rem',
            borderTop: `1px solid ${colors.lightGray}`
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
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
                padding: '0.75rem 1.5rem',
                backgroundColor: loading ? colors.gray : colors.primary,
                color: colors.white,
                border: 'none',
                borderRadius: '0.5rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? 'Saving...' : (student ? 'Update Student' : 'Create Student')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
