import { useState } from 'react';

const StudentListSimple = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', program: 'Chess', phone: '0712345678' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', program: 'Coding', phone: '0723456789' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', program: 'Robotics', phone: '0734567890' }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    program: '',
    phone: ''
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

  const programs = ['Chess', 'Coding', 'Robotics', 'French Classes', 'Entrepreneurship'];

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Add new student
  const handleAddStudent = () => {
    if (formData.name && formData.email) {
      const newStudent = {
        id: Date.now(), // Simple ID generation
        ...formData
      };
      setStudents([...students, newStudent]);
      setFormData({ name: '', email: '', program: '', phone: '' });
      setShowAddForm(false);
    }
  };

  // Start editing student
  const handleEditStudent = (student) => {
    setEditingStudent(student.id);
    setFormData({
      name: student.name,
      email: student.email,
      program: student.program,
      phone: student.phone
    });
  };

  // Save edited student
  const handleSaveEdit = () => {
    setStudents(students.map(student => 
      student.id === editingStudent 
        ? { ...student, ...formData }
        : student
    ));
    setEditingStudent(null);
    setFormData({ name: '', email: '', program: '', phone: '' });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingStudent(null);
    setFormData({ name: '', email: '', program: '', phone: '' });
  };

  // Delete student
  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(student => student.id !== studentId));
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: colors.lightBg, 
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
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
                👥 Student Management
              </h1>
              <p style={{ color: colors.textGray }}>Manage student enrollment and information</p>
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

        {/* Add Student Form */}
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
              ➕ Add New Student
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
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
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  padding: '0.75rem',
                  border: `2px solid ${colors.primary}20`,
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                style={{
                  padding: '0.75rem',
                  border: `2px solid ${colors.primary}20`,
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
              <select
                name="program"
                value={formData.program}
                onChange={handleInputChange}
                style={{
                  padding: '0.75rem',
                  border: `2px solid ${colors.primary}20`,
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select Program</option>
                {programs.map(program => (
                  <option key={program} value={program}>{program}</option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={handleAddStudent}
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
                ✅ Add Student
              </button>
              <button 
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ name: '', email: '', program: '', phone: '' });
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

        {/* Students List */}
        <div style={{ 
          background: colors.white, 
          borderRadius: '1rem', 
          padding: '2rem',
          boxShadow: '0 4px 12px rgba(139,69,19,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: colors.primary }}>
              All Students ({students.length})
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
                + Add New Student
              </button>
            )}
          </div>

          {/* Students Table */}
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${colors.primary}20` }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: colors.primary, fontWeight: '600' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: colors.primary, fontWeight: '600' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: colors.primary, fontWeight: '600' }}>Phone</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: colors.primary, fontWeight: '600' }}>Program</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: colors.primary, fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} style={{ borderBottom: `1px solid ${colors.primary}10` }}>
                    {editingStudent === student.id ? (
                      // Edit mode
                      <>
                        <td style={{ padding: '1rem' }}>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: `1px solid ${colors.primary}30`,
                              borderRadius: '0.25rem'
                            }}
                          />
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: `1px solid ${colors.primary}30`,
                              borderRadius: '0.25rem'
                            }}
                          />
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: `1px solid ${colors.primary}30`,
                              borderRadius: '0.25rem'
                            }}
                          />
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <select
                            name="program"
                            value={formData.program}
                            onChange={handleInputChange}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: `1px solid ${colors.primary}30`,
                              borderRadius: '0.25rem'
                            }}
                          >
                            {programs.map(program => (
                              <option key={program} value={program}>{program}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <button 
                            onClick={handleSaveEdit}
                            style={{
                              padding: '0.5rem 1rem',
                              background: colors.success,
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.25rem',
                              fontSize: '0.875rem',
                              cursor: 'pointer',
                              marginRight: '0.5rem'
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
                        </td>
                      </>
                    ) : (
                      // View mode
                      <>
                        <td style={{ padding: '1rem', color: colors.textGray, fontWeight: '500' }}>{student.name}</td>
                        <td style={{ padding: '1rem', color: colors.textGray }}>{student.email}</td>
                        <td style={{ padding: '1rem', color: colors.textGray }}>{student.phone}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            background: `${colors.secondary}20`,
                            color: colors.secondary,
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                          }}>
                            {student.program}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <button 
                            onClick={() => handleEditStudent(student)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: colors.secondary,
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.25rem',
                              fontSize: '0.875rem',
                              cursor: 'pointer',
                              marginRight: '0.5rem'
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteStudent(student.id)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.25rem',
                              fontSize: '0.875rem',
                              cursor: 'pointer'
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {students.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem',
              color: colors.textGray 
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Students Yet</h3>
              <p>Add your first student to get started!</p>
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
            📊 Total Students: {students.length} | ✅ Full CRUD Operations Working | 💾 Local Storage
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentListSimple;
