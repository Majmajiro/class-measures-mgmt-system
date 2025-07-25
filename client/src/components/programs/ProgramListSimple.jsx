import { useState } from 'react';

const ProgramListSimple = () => {
  const [programs, setPrograms] = useState([
    { 
      id: 1, 
      name: 'Chess Mastery Program', 
      description: 'Comprehensive chess training from beginner to advanced levels',
      duration: '3 months',
      capacity: 40,
      enrolled: 32,
      fee: 'KSh 8,000',
      category: 'Strategy',
      status: 'Active'
    },
    { 
      id: 2, 
      name: 'Coding Bootcamp', 
      description: 'Full-stack web development using modern technologies',
      duration: '6 months',
      capacity: 30,
      enrolled: 24,
      fee: 'KSh 15,000',
      category: 'Technology',
      status: 'Active'
    },
    { 
      id: 3, 
      name: 'Robotics Engineering', 
      description: 'Build and program robots using Arduino and sensors',
      duration: '4 months',
      capacity: 25,
      enrolled: 18,
      fee: 'KSh 12,000',
      category: 'Engineering',
      status: 'Active'
    },
    { 
      id: 4, 
      name: 'French Language Course', 
      description: 'Conversational French for beginners and intermediate learners',
      duration: '5 months',
      capacity: 20,
      enrolled: 15,
      fee: 'KSh 6,000',
      category: 'Language',
      status: 'Active'
    },
    { 
      id: 5, 
      name: 'Young Entrepreneurs Workshop', 
      description: 'Business skills and entrepreneurship for young minds',
      duration: '2 months',
      capacity: 15,
      enrolled: 12,
      fee: 'KSh 5,000',
      category: 'Business',
      status: 'Active'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    capacity: '',
    fee: '',
    category: '',
    status: 'Active'
  });

  const colors = {
    primary: '#8B4513',
    secondary: '#B8860B', 
    accent: '#D2691E',
    white: '#FEFEFE',
    lightBg: '#FAF8F5',
    textGray: '#5D4E37',
    success: '#228B22'
  };

  const categories = ['Strategy', 'Technology', 'Engineering', 'Language', 'Business', 'Arts', 'Science'];
  const statuses = ['Active', 'Inactive', 'Full', 'Coming Soon'];

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Add new program
  const handleAddProgram = () => {
    if (formData.name && formData.description && formData.capacity && formData.fee) {
      const newProgram = {
        id: Date.now(),
        ...formData,
        capacity: parseInt(formData.capacity),
        enrolled: 0
      };
      setPrograms([...programs, newProgram]);
      setFormData({ name: '', description: '', duration: '', capacity: '', fee: '', category: '', status: 'Active' });
      setShowAddForm(false);
    }
  };

  // Start editing program
  const handleEditProgram = (program) => {
    setEditingProgram(program.id);
    setFormData({
      name: program.name,
      description: program.description,
      duration: program.duration,
      capacity: program.capacity.toString(),
      fee: program.fee,
      category: program.category,
      status: program.status
    });
  };

  // Save edited program
  const handleSaveEdit = () => {
    setPrograms(programs.map(program => 
      program.id === editingProgram 
        ? { ...program, ...formData, capacity: parseInt(formData.capacity) }
        : program
    ));
    setEditingProgram(null);
    setFormData({ name: '', description: '', duration: '', capacity: '', fee: '', category: '', status: 'Active' });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingProgram(null);
    setFormData({ name: '', description: '', duration: '', capacity: '', fee: '', category: '', status: 'Active' });
  };

  // Delete program
  const handleDeleteProgram = (programId) => {
    if (window.confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
      setPrograms(programs.filter(program => program.id !== programId));
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return colors.success;
      case 'Inactive': return '#6b7280';
      case 'Full': return colors.accent;
      case 'Coming Soon': return colors.secondary;
      default: return colors.textGray;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: colors.lightBg, 
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ 
          background: colors.white, 
          padding: '2rem', 
          borderRadius: '1rem', 
          marginBottom: '2rem',
          boxShadow: '0 4px 12px rgba(139,69,19,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '700', color: colors.primary, marginBottom: '0.5rem' }}>
                🎓 Program Management
              </h1>
              <p style={{ color: colors.textGray }}>Manage educational programs, courses, and curricula</p>
            </div>
            <a 
              href="/dashboard" 
              style={{ 
                padding: '0.75rem 1.5rem', 
                background: colors.accent, 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '0.5rem',
                fontWeight: '600'
              }}
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>

        {/* Program Stats Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: colors.white,
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 12px rgba(139,69,19,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '2rem', fontWeight: '700', color: colors.primary }}>
              {programs.length}
            </h3>
            <p style={{ color: colors.textGray, fontWeight: '500' }}>Total Programs</p>
          </div>
          
          <div style={{
            background: colors.white,
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 12px rgba(139,69,19,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '2rem', fontWeight: '700', color: colors.success }}>
              {programs.filter(p => p.status === 'Active').length}
            </h3>
            <p style={{ color: colors.textGray, fontWeight: '500' }}>Active Programs</p>
          </div>
          
          <div style={{
            background: colors.white,
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 12px rgba(139,69,19,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '2rem', fontWeight: '700', color: colors.secondary }}>
              {programs.reduce((sum, p) => sum + p.enrolled, 0)}
            </h3>
            <p style={{ color: colors.textGray, fontWeight: '500' }}>Total Enrolled</p>
          </div>
          
          <div style={{
            background: colors.white,
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 12px rgba(139,69,19,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '2rem', fontWeight: '700', color: colors.accent }}>
              {programs.reduce((sum, p) => sum + p.capacity, 0)}
            </h3>
            <p style={{ color: colors.textGray, fontWeight: '500' }}>Total Capacity</p>
          </div>
        </div>

        {/* Add Program Form */}
        {showAddForm && (
          <div style={{ 
            background: colors.white, 
            borderRadius: '1rem', 
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 12px rgba(139,69,19,0.1)',
            border: `2px solid ${colors.success}30`
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: colors.success, marginBottom: '1.5rem' }}>
              ➕ Add New Program
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="text"
                name="name"
                placeholder="Program Name"
                value={formData.name}
                onChange={handleInputChange}
                style={{
                  padding: '0.75rem',
                  border: `2px solid ${colors.primary}20`,
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
              <input
                type="text"
                name="duration"
                placeholder="Duration (e.g., 3 months)"
                value={formData.duration}
                onChange={handleInputChange}
                style={{
                  padding: '0.75rem',
                  border: `2px solid ${colors.primary}20`,
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
              <input
                type="number"
                name="capacity"
                placeholder="Maximum Capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                style={{
                  padding: '0.75rem',
                  border: `2px solid ${colors.primary}20`,
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
              <input
                type="text"
                name="fee"
                placeholder="Program Fee (e.g., KSh 10,000)"
                value={formData.fee}
                onChange={handleInputChange}
                style={{
                  padding: '0.75rem',
                  border: `2px solid ${colors.primary}20`,
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{
                  padding: '0.75rem',
                  border: `2px solid ${colors.primary}20`,
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                style={{
                  padding: '0.75rem',
                  border: `2px solid ${colors.primary}20`,
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <textarea
              name="description"
              placeholder="Program Description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `2px solid ${colors.primary}20`,
                borderRadius: '0.5rem',
                fontSize: '1rem',
                marginBottom: '1.5rem',
                resize: 'vertical'
              }}
            />
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={handleAddProgram}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: colors.success,
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✅ Add Program
              </button>
              <button 
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ name: '', description: '', duration: '', capacity: '', fee: '', category: '', status: 'Active' });
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        )}

        {/* Programs Grid */}
        <div style={{ 
          background: colors.white, 
          borderRadius: '1rem', 
          padding: '2rem',
          boxShadow: '0 4px 12px rgba(139,69,19,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: colors.primary }}>
              All Programs ({programs.length})
            </h3>
            {!showAddForm && (
              <button 
                onClick={() => setShowAddForm(true)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: colors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                + Add New Program
              </button>
            )}
          </div>

          {/* Programs Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {programs.map((program) => {
              const enrollmentPercentage = Math.round((program.enrolled / program.capacity) * 100);
              const isEditing = editingProgram === program.id;
              
              return (
                <div key={program.id} style={{
                  border: `2px solid ${colors.primary}15`,
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  background: `${colors.primary}02`,
                  transition: 'all 0.2s'
                }}>
                  
                  {isEditing ? (
                    // Edit Mode
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: `1px solid ${colors.primary}30`,
                          borderRadius: '0.25rem',
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          marginBottom: '0.5rem'
                        }}
                      />
                      
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="2"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: `1px solid ${colors.primary}30`,
                          borderRadius: '0.25rem',
                          marginBottom: '1rem',
                          resize: 'vertical'
                        }}
                      />
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                        <input
                          type="text"
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          placeholder="Duration"
                          style={{
                            padding: '0.5rem',
                            border: `1px solid ${colors.primary}30`,
                            borderRadius: '0.25rem'
                          }}
                        />
                        <input
                          type="number"
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleInputChange}
                          placeholder="Capacity"
                          style={{
                            padding: '0.5rem',
                            border: `1px solid ${colors.primary}30`,
                            borderRadius: '0.25rem'
                          }}
                        />
                        <input
                          type="text"
                          name="fee"
                          value={formData.fee}
                          onChange={handleInputChange}
                          placeholder="Fee"
                          style={{
                            padding: '0.5rem',
                            border: `1px solid ${colors.primary}30`,
                            borderRadius: '0.25rem'
                          }}
                        />
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          style={{
                            padding: '0.5rem',
                            border: `1px solid ${colors.primary}30`,
                            borderRadius: '0.25rem'
                          }}
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={handleSaveEdit}
                          style={{
                            padding: '0.5rem 1rem',
                            background: colors.success,
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                          }}
                        >
                          ✅ Save
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                          }}
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: colors.primary, margin: 0 }}>
                          {program.name}
                        </h4>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          background: getStatusColor(program.status),
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {program.status}
                        </span>
                      </div>
                      
                      <p style={{ color: colors.textGray, fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                        {program.description}
                      </p>
                      
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.textGray }}>
                            Enrollment Progress
                          </span>
                          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.primary }}>
                            {program.enrolled}/{program.capacity} ({enrollmentPercentage}%)
                          </span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '8px',
                          background: `${colors.primary}15`,
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${enrollmentPercentage}%`,
                            height: '100%',
                            background: `linear-gradient(90deg, ${colors.secondary}, ${colors.primary})`,
                            borderRadius: '4px',
                            transition: 'width 0.5s ease'
                          }}></div>
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '0.5rem', 
                        marginBottom: '1rem',
                        fontSize: '0.875rem',
                        color: colors.textGray
                      }}>
                        <div><strong>Duration:</strong> {program.duration}</div>
                        <div><strong>Category:</strong> {program.category}</div>
                        <div><strong>Fee:</strong> {program.fee}</div>
                        <div><strong>Available:</strong> {program.capacity - program.enrolled} spots</div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleEditProgram(program)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: colors.secondary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            flex: 1
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProgram(program.id)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            flex: 1
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {programs.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem',
              color: colors.textGray 
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Programs Yet</h3>
              <p>Create your first educational program to get started!</p>
            </div>
          )}

          <div style={{ 
            marginTop: '2rem', 
            textAlign: 'center', 
            color: colors.textGray,
            fontSize: '0.9rem',
            padding: '1rem',
            background: `${colors.success}05`,
            borderRadius: '0.5rem',
            border: `1px solid ${colors.success}20`
          }}>
            📊 Total Programs: {programs.length} | ✅ Full CRUD Operations | 🎓 Program Management System
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramListSimple;
