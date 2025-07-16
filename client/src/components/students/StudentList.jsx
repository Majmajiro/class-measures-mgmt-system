import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentsAPI } from '../../services/api';
import StudentForm from './StudentForm';
import { toast } from 'react-hot-toast';
import { User, UserPlus, Edit, Trash2, Users, Star, Calendar, Phone, Mail, MapPin, Search, Filter, RefreshCw } from 'lucide-react';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const { user } = useAuth();

  const colors = {
    primary: '#c55c5c',
    secondary: '#f4c842',
    dark: '#1e1e3c',
    white: '#ffffff',
    gray: '#6b7280',
    lightGray: '#f3f4f6'
  };

  useEffect(() => {
    loadStudents();
  }, [searchQuery, ageFilter]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (ageFilter) params.age = ageFilter;
      
      const response = await studentsAPI.getAll(params);
      console.log('Students API response:', response);
      
      // Fix: Handle different response structures
      let studentsData = [];
      if (response.students) {
        studentsData = response.students;
      } else if (response.data && response.data.students) {
        studentsData = response.data.students;
      } else if (Array.isArray(response)) {
        studentsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        studentsData = response.data;
      }
      
      setStudents(studentsData);
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Failed to load students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentsAPI.delete(id);
        toast.success('Student deleted successfully');
        loadStudents();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete student');
      }
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleStudentSaved = () => {
    loadStudents();
    setShowForm(false);
    setEditingStudent(null);
  };

  const createTestStudent = async () => {
    try {
      const testStudentData = {
        name: `Test Student ${Date.now()}`,
        age: Math.floor(Math.random() * 10) + 8,
        parentInfo: {
          parentName: 'Test Parent',
          parentPhone: '+254712345678',
          parentEmail: 'test@example.com'
        },
        address: {
          area: 'Limuru',
          county: 'Kiambu'
        },
        emergencyContact: {
          name: 'Emergency Contact',
          phone: '+254798765432',
          relationship: 'Uncle'
        },
        medicalInfo: {
          allergies: 'None',
          medications: 'None',
          conditions: 'None'
        },
        academicInfo: {
          school: 'Test School',
          gradeLevel: 'Grade 5'
        }
      };

      const response = await studentsAPI.create(testStudentData);
      console.log('Test student created:', response);
      
      if (response.student || response.message) {
        toast.success('🧪 Test student created successfully!');
        loadStudents();
      } else {
        toast.error('Failed to create test student');
      }
    } catch (error) {
      console.error('Test student error:', error);
      toast.error('Failed to create test student');
    }
  };

  const getAgeColor = (age) => {
    if (age <= 10) return '#10b981';
    if (age <= 14) return '#f59e0b';
    return '#8b5cf6';
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchQuery || 
      student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.parentInfo?.parentName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAge = !ageFilter || 
      (ageFilter === 'young' && student.age <= 10) ||
      (ageFilter === 'middle' && student.age > 10 && student.age <= 14) ||
      (ageFilter === 'teen' && student.age > 14);
    
    return matchesSearch && matchesAge;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ 
          animation: 'spin 1s linear infinite', 
          borderRadius: '50%', 
          height: '2rem', 
          width: '2rem', 
          border: `2px solid ${colors.lightGray}`, 
          borderBottom: `2px solid ${colors.primary}` 
        }}></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: colors.lightGray, minHeight: '100vh' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: colors.white,
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          border: `2px solid ${colors.primary}20`
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: colors.dark,
              marginBottom: '0.5rem'
            }}>
              👨‍🎓 Student Management
            </h1>
            <p style={{ color: colors.gray, fontSize: '1rem' }}>
              Manage student profiles, contact information, and academic details
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={loadStudents}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: colors.lightGray,
                color: colors.gray,
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            {user.role === 'admin' && (
              <>
                <button
                  onClick={createTestStudent}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: colors.secondary,
                    color: colors.dark,
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  🧪 Test Student
                </button>
                
                <button
                  onClick={handleAddNew}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.875rem 1.5rem',
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.dark})`,
                    color: colors.white,
                    border: 'none',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    boxShadow: `0 4px 12px ${colors.primary}30`
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <UserPlus size={18} />
                  Add Student
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div style={{
          backgroundColor: colors.white,
          padding: '1.5rem',
          borderRadius: '1rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
                placeholder="Search by student name or parent name..."
              />
            </div>

            <div>
              <select
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: colors.white
                }}
              >
                <option value="">All Ages</option>
                <option value="young">Young (≤10)</option>
                <option value="middle">Middle (11-14)</option>
                <option value="teen">Teen (15+)</option>
              </select>
            </div>

            <div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setAgeFilter('');
                }}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: colors.lightGray,
                  color: colors.gray,
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          <div style={{
            backgroundColor: colors.white,
            padding: '4rem 2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            <User size={64} style={{ color: colors.gray, margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: colors.dark, marginBottom: '0.5rem' }}>
              {searchQuery || ageFilter ? 'No students match your criteria' : 'No students yet'}
            </h3>
            <p style={{ color: colors.gray, fontSize: '1rem', marginBottom: '2rem' }}>
              {searchQuery || ageFilter 
                ? 'Try adjusting your search terms or filters'
                : 'Start building your student database'
              }
            </p>
            {user.role === 'admin' && (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={createTestStudent}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: colors.secondary,
                    color: colors.dark,
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  🧪 Create Test Student
                </button>
                <button
                  onClick={handleAddNew}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: colors.primary,
                    color: colors.white,
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  Add Your First Student
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {filteredStudents.map((student) => (
              <div 
                key={student._id} 
                style={{
                  backgroundColor: colors.white,
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  border: `2px solid ${colors.lightGray}`,
                  transition: 'all 0.2s'
                }}
              >
                {/* Student Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    backgroundColor: `${getAgeColor(student.age)}20`,
                    border: `2px solid ${getAgeColor(student.age)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: getAgeColor(student.age)
                  }}>
                    {student.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: '700', 
                      color: colors.dark,
                      marginBottom: '0.25rem'
                    }}>
                      {student.name || 'Unknown Student'}
                    </h3>
                    <span style={{
                      padding: '0.125rem 0.5rem',
                      backgroundColor: `${getAgeColor(student.age)}20`,
                      color: getAgeColor(student.age),
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      Age {student.age || 'Unknown'}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div style={{ 
                  backgroundColor: colors.lightGray, 
                  padding: '1rem', 
                  borderRadius: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.dark, marginBottom: '0.5rem' }}>
                    👨‍👩‍👧‍👦 Parent Information
                  </h4>
                  
                  {student.parentInfo?.parentName && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <User size={14} style={{ color: colors.gray }} />
                      <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                        {student.parentInfo.parentName}
                      </span>
                    </div>
                  )}
                  
                  {student.parentInfo?.parentPhone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Phone size={14} style={{ color: colors.gray }} />
                      <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                        {student.parentInfo.parentPhone}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {user.role === 'admin' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(student)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        backgroundColor: `${colors.primary}10`,
                        color: colors.primary,
                        border: `1px solid ${colors.primary}30`,
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student._id)}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Student Form Modal */}
        {showForm && (
          <StudentForm
            student={editingStudent}
            onClose={handleFormClose}
            onStudentSaved={handleStudentSaved}
          />
        )}
      </div>
    </div>
  );
};

export default StudentList;
