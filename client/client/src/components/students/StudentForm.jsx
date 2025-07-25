import { useState, useEffect } from 'react';
import { studentsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { X, Save, User, Phone, MapPin, Heart, GraduationCap } from 'lucide-react';

const StudentForm = ({ student = null, onClose, onStudentSaved }) => {
  const isEditing = !!student;
  const [loading, setLoading] = useState(false);
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

  const colors = {
    primary: '#c55c5c',
    secondary: '#f4c842',
    dark: '#1e1e3c',
    white: '#ffffff',
    gray: '#6b7280',
    lightGray: '#f3f4f6'
  };

  useEffect(() => {
    if (isEditing && student) {
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
  }, [isEditing, student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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

      if (!formData.age || formData.age < 1) {
        toast.error('Valid age is required');
        setLoading(false);
        return;
      }

      if (!formData.parentInfo.parentName.trim()) {
        toast.error('Parent name is required');
        setLoading(false);
        return;
      }

      if (!formData.parentInfo.parentPhone.trim()) {
        toast.error('Parent phone is required');
        setLoading(false);
        return;
      }

      const submitData = {
        ...formData,
        age: parseInt(formData.age)
      };

      console.log('Submitting student data:', submitData);

      if (isEditing) {
        await studentsAPI.update(student._id, submitData);
        toast.success('👨‍🎓 Student updated successfully!');
      } else {
        await studentsAPI.create(submitData);
        toast.success('🎉 Student created successfully!');
      }
      
      onStudentSaved();
    } catch (error) {
      console.error('Save student error:', error);
      toast.error(error.response?.data?.message || 'Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: colors.white,
        borderRadius: '1rem',
        padding: '0',
        width: '100%',
        maxWidth: '56rem',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        border: `3px solid ${colors.primary}20`
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: `2px solid ${colors.lightGray}`,
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.dark})`,
          color: colors.white
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {isEditing ? '✏️ Edit Student' : '👨‍🎓 Add New Student'}
              </h2>
              <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                {isEditing ? `Update "${student?.name}"` : 'Add a new student to your Class Measures Hub'}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                cursor: 'pointer',
                color: colors.white
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div style={{ maxHeight: 'calc(90vh - 140px)', overflow: 'auto', padding: '2rem' }}>
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
                <User size={18} style={{ color: colors.primary }} />
                Basic Information
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Student Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      transition: 'border-color 0.2s'
                    }}
                    placeholder="Enter student's full name"
                    onFocus={(e) => e.target.style.borderColor = colors.primary}
                    onBlur={(e) => e.target.style.borderColor = colors.lightGray}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Age *
                  </label>
                  <select
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: colors.white
                    }}
                  >
                    <option value="">Select age</option>
                    {Array.from({length: 13}, (_, i) => i + 6).map(age => (
                      <option key={age} value={age}>
                        {age} years old
                      </option>
                    ))}
                  </select>
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
                <Phone size={18} style={{ color: colors.secondary }} />
                Parent Information
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Parent Name *
                  </label>
                  <input
                    type="text"
                    name="parentInfo.parentName"
                    value={formData.parentInfo.parentName}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    placeholder="Parent's full name"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Parent Phone *
                  </label>
                  <input
                    type="tel"
                    name="parentInfo.parentPhone"
                    value={formData.parentInfo.parentPhone}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    placeholder="+254712345678"
                  />
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: colors.dark, 
                  marginBottom: '0.5rem' 
                }}>
                  Parent Email
                </label>
                <input
                  type="email"
                  name="parentInfo.parentEmail"
                  value={formData.parentInfo.parentEmail}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
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
                <MapPin size={18} style={{ color: '#10b981' }} />
                Address
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Area/Estate
                  </label>
                  <input
                    type="text"
                    name="address.area"
                    value={formData.address.area}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    placeholder="e.g., Tigoni, Runda"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    County
                  </label>
                  <input
                    type="text"
                    name="address.county"
                    value={formData.address.county}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    placeholder="e.g., Kiambu, Nairobi"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
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
                <Heart size={18} style={{ color: '#ef4444' }} />
                Emergency Contact
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Contact Name
                  </label>
                  <input
                    type="text"
                    name="emergencyContact.name"
                    value={formData.emergencyContact.name}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    placeholder="Emergency contact name"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="emergencyContact.phone"
                    value={formData.emergencyContact.phone}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    placeholder="+254798765432"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Relationship
                  </label>
                  <select
                    name="emergencyContact.relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: colors.white
                    }}
                  >
                    <option value="">Select relationship</option>
                    <option value="grandparent">Grandparent</option>
                    <option value="aunt">Aunt</option>
                    <option value="uncle">Uncle</option>
                    <option value="family_friend">Family Friend</option>
                    <option value="sibling">Sibling</option>
                    <option value="other">Other</option>
                  </select>
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
                <GraduationCap size={18} style={{ color: '#8b5cf6' }} />
                Academic Information
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    School
                  </label>
                  <input
                    type="text"
                    name="academicInfo.school"
                    value={formData.academicInfo.school}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    placeholder="Current school name"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Grade Level
                  </label>
                  <select
                    name="academicInfo.gradeLevel"
                    value={formData.academicInfo.gradeLevel}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: colors.white
                    }}
                  >
                    <option value="">Select grade</option>
                    <option value="kindergarten">Kindergarten</option>
                    <option value="grade1">Grade 1</option>
                    <option value="grade2">Grade 2</option>
                    <option value="grade3">Grade 3</option>
                    <option value="grade4">Grade 4</option>
                    <option value="grade5">Grade 5</option>
                    <option value="grade6">Grade 6</option>
                    <option value="grade7">Grade 7</option>
                    <option value="grade8">Grade 8</option>
                    <option value="form1">Form 1</option>
                    <option value="form2">Form 2</option>
                    <option value="form3">Form 3</option>
                    <option value="form4">Form 4</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Medical Information */}
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
                ❤️ Medical Information
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Allergies
                  </label>
                  <textarea
                    name="medicalInfo.allergies"
                    value={formData.medicalInfo.allergies}
                    onChange={handleChange}
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      resize: 'vertical'
                    }}
                    placeholder="List any known allergies..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: colors.dark, 
                      marginBottom: '0.5rem' 
                    }}>
                      Current Medications
                    </label>
                    <textarea
                      name="medicalInfo.medications"
                      value={formData.medicalInfo.medications}
                      onChange={handleChange}
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `2px solid ${colors.lightGray}`,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        resize: 'vertical'
                      }}
                      placeholder="List current medications..."
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: colors.dark, 
                      marginBottom: '0.5rem' 
                    }}>
                      Medical Conditions
                    </label>
                    <textarea
                      name="medicalInfo.conditions"
                      value={formData.medicalInfo.conditions}
                      onChange={handleChange}
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `2px solid ${colors.lightGray}`,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        resize: 'vertical'
                      }}
                      placeholder="Any medical conditions to note..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.5rem 2rem',
          borderTop: `2px solid ${colors.lightGray}`,
          backgroundColor: colors.white,
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              border: `2px solid ${colors.lightGray}`,
              backgroundColor: colors.white,
              color: colors.gray,
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
            onClick={handleSubmit}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.dark})`,
              color: colors.white,
              border: 'none',
              borderRadius: '0.5rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              opacity: loading ? 0.7 : 1
            }}
          >
            <Save size={16} />
            {loading ? 'Saving...' : (isEditing ? 'Update Student' : 'Create Student')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;