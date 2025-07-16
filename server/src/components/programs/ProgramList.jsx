import { useState, useEffect } from 'react';
import { programsAPI, studentsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Clock, 
  MapPin, 
  DollarSign,
  GraduationCap,
  UserPlus,
  UserMinus,
  Target
} from 'lucide-react';

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const { user } = useAuth();

  // Class Measures Brand Colors
  const colors = {
    primary: '#c55c5c',
    secondary: '#f4c842',
    dark: '#1e1e3c',
    white: '#ffffff',
    gray: '#6b7280',
    lightGray: '#f3f4f6'
  };

  // Program colors for visual distinction
  const programColors = {
    'Coding': { bg: '#dbeafe', border: '#3b82f6', icon: '💻' },
    'Chess': { bg: '#f3e8ff', border: '#8b5cf6', icon: '♟️' },
    'Robotics': { bg: '#ecfdf5', border: '#10b981', icon: '🤖' },
    'French': { bg: '#fef3c7', border: '#f59e0b', icon: '🇫🇷' }
  };

  useEffect(() => {
    loadPrograms();
    loadStudents();
  }, []);

  const loadPrograms = async () => {
    try {
      const response = await programsAPI.getAll();
      setPrograms(response.data.programs);
    } catch (error) {
      toast.error('Failed to load programs');
      console.error('Error loading programs:', error);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await studentsAPI.getAll();
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await programsAPI.delete(id);
        toast.success('Program deleted successfully');
        loadPrograms();
      } catch (error) {
        toast.error('Failed to delete program');
      }
    }
  };

  const handleEnrollStudent = (program) => {
    setSelectedProgram(program);
    setShowEnrollModal(true);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
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
    <div style={{ padding: '2rem', backgroundColor: colors.white, minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
              Program Management
            </h1>
            <p style={{ color: colors.gray, fontSize: '1rem' }}>
              Manage Class Measures educational programs: Coding, Chess, Robotics, and French
            </p>
          </div>
          
          {user.role === 'admin' && (
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.5rem',
                background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
                color: colors.dark,
                border: 'none',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                transition: 'all 0.2s',
                boxShadow: `0 4px 12px ${colors.secondary}30`
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <Plus size={18} />
              Add New Program
            </button>
          )}
        </div>

        {/* Programs Grid */}
        {programs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: colors.white,
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: `2px dashed ${colors.lightGray}`
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1.5rem',
              borderRadius: '50%',
              backgroundColor: `${colors.secondary}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <GraduationCap size={40} style={{ color: colors.primary }} />
            </div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: colors.dark, 
              marginBottom: '0.5rem' 
            }}>
              No programs found
            </h3>
            <p style={{ color: colors.gray, fontSize: '1rem', marginBottom: '2rem' }}>
              Start by creating your first educational program
            </p>
            {user.role === 'admin' && (
              <button
                onClick={() => setShowAddForm(true)}
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
                Create Your First Program
              </button>
            )}
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
            gap: '2rem' 
          }}>
            {programs.map((program) => {
              const programColor = programColors[program.name] || programColors['Coding'];
              
              return (
                <div 
                  key={program._id} 
                  style={{
                    backgroundColor: colors.white,
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    border: `2px solid ${programColor.border}20`,
                    transition: 'all 0.2s',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 12px 25px ${programColor.border}20`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                  }}
                >
                  {/* Program Header */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: `1px solid ${colors.lightGray}`
                  }}>
                    <div style={{
                      width: '3.5rem',
                      height: '3.5rem',
                      borderRadius: '1rem',
                      backgroundColor: programColor.bg,
                      border: `2px solid ${programColor.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem',
                      fontSize: '1.5rem'
                    }}>
                      {programColor.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '700', 
                        color: colors.dark,
                        marginBottom: '0.25rem'
                      }}>
                        {program.name}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: colors.gray }}>
                        {program.ageGroup}
                      </p>
                    </div>
                  </div>

                  {/* Program Details */}
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: colors.dark,
                      lineHeight: '1.5',
                      marginBottom: '1rem'
                    }}>
                      {program.description}
                    </p>

                    {/* Quick Info Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                      {/* Schedule */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={16} style={{ color: programColor.border }} />
                        <div>
                          <p style={{ fontSize: '0.75rem', color: colors.gray, fontWeight: '500' }}>Schedule</p>
                          <p style={{ fontSize: '0.8rem', color: colors.dark }}>
                            {program.schedule?.day} {program.schedule?.startTime}-{program.schedule?.endTime}
                          </p>
                        </div>
                      </div>

                      {/* Price */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <DollarSign size={16} style={{ color: programColor.border }} />
                        <div>
                          <p style={{ fontSize: '0.75rem', color: colors.gray, fontWeight: '500' }}>Price</p>
                          <p style={{ fontSize: '0.8rem', color: colors.dark, fontWeight: '600' }}>
                            KSh {program.price?.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Enrollment */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={16} style={{ color: programColor.border }} />
                        <div>
                          <p style={{ fontSize: '0.75rem', color: colors.gray, fontWeight: '500' }}>Enrolled</p>
                          <p style={{ fontSize: '0.8rem', color: colors.dark }}>
                            {program.enrolledStudents?.length || 0}/{program.capacity}
                          </p>
                        </div>
                      </div>

                      {/* Location */}
                      {program.schedule?.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <MapPin size={16} style={{ color: programColor.border }} />
                          <div>
                            <p style={{ fontSize: '0.75rem', color: colors.gray, fontWeight: '500' }}>Location</p>
                            <p style={{ fontSize: '0.8rem', color: colors.dark }}>
                              {program.schedule.location}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Tutor */}
                    {program.tutor && (
                      <div style={{ 
                        backgroundColor: `${programColor.border}08`,
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem'
                      }}>
                        <p style={{ fontSize: '0.75rem', color: colors.gray, fontWeight: '500', marginBottom: '0.25rem' }}>
                          Tutor
                        </p>
                        <p style={{ fontSize: '0.875rem', color: colors.dark, fontWeight: '600' }}>
                          {program.tutor.name}
                        </p>
                      </div>
                    )}

                    {/* Enrollment Progress Bar */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '0.25rem'
                      }}>
                        <span style={{ fontSize: '0.75rem', color: colors.gray, fontWeight: '500' }}>
                          Enrollment Progress
                        </span>
                        <span style={{ fontSize: '0.75rem', color: colors.dark }}>
                          {Math.round(((program.enrolledStudents?.length || 0) / program.capacity) * 100)}%
                        </span>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '6px', 
                        backgroundColor: colors.lightGray, 
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${((program.enrolledStudents?.length || 0) / program.capacity) * 100}%`,
                          height: '100%',
                          backgroundColor: programColor.border,
                          borderRadius: '3px',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>

                    {/* Learning Objectives */}
                    {program.objectives && program.objectives.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <Target size={14} style={{ color: programColor.border }} />
                          <span style={{ fontSize: '0.75rem', color: colors.gray, fontWeight: '500' }}>
                            Learning Objectives
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {program.objectives.slice(0, 3).map((objective, index) => (
                            <span
                              key={index}
                              style={{
                                padding: '0.125rem 0.5rem',
                                backgroundColor: `${programColor.border}15`,
                                color: programColor.border,
                                borderRadius: '1rem',
                                fontSize: '0.6rem',
                                fontWeight: '500'
                              }}
                            >
                              {objective}
                            </span>
                          ))}
                          {program.objectives.length > 3 && (
                            <span style={{ fontSize: '0.6rem', color: colors.gray }}>
                              +{program.objectives.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {user.role === 'admin' && (
                    <div style={{ 
                      display: 'flex', 
                      gap: '0.5rem', 
                      paddingTop: '1rem',
                      borderTop: `1px solid ${colors.lightGray}`
                    }}>
                      <button
                        onClick={() => handleEnrollStudent(program)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          backgroundColor: `${programColor.border}15`,
                          color: programColor.border,
                          border: `1px solid ${programColor.border}30`,
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
                        <UserPlus size={14} />
                        Enroll
                      </button>
                      <button
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
                        onClick={() => handleDelete(program._id)}
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
              );
            })}
          </div>
        )}

        {/* Add Program Modal */}
        {showAddForm && (
          <AddProgramModal
            onClose={() => setShowAddForm(false)}
            onProgramAdded={() => {
              loadPrograms();
              setShowAddForm(false);
            }}
          />
        )}

        {/* Enroll Student Modal */}
        {showEnrollModal && selectedProgram && (
          <EnrollStudentModal
            program={selectedProgram}
            students={students}
            onClose={() => {
              setShowEnrollModal(false);
              setSelectedProgram(null);
            }}
            onEnrollmentChanged={() => {
              loadPrograms();
              setShowEnrollModal(false);
              setSelectedProgram(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Add Program Modal Component
const AddProgramModal = ({ onClose, onProgramAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ageGroup: '',
    tutorId: '',
    schedule: {
      day: 'Saturday',
      startTime: '09:00',
      endTime: '12:30',
      location: ''
    },
    capacity: 20,
    price: '',
    materials: [],
    objectives: []
  });
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const [newMaterial, setNewMaterial] = useState('');
  const [newObjective, setNewObjective] = useState('');

  const colors = {
    primary: '#c55c5c',
    secondary: '#f4c842',
    dark: '#1e1e3c',
    white: '#ffffff',
    gray: '#6b7280',
    lightGray: '#f3f4f6'
  };

  useEffect(() => {
    loadTutors();
  }, []);

  const loadTutors = async () => {
    try {
      const response = await programsAPI.getTutors();
      setTutors(response.data.tutors || []);
    } catch (error) {
      console.error('Error loading tutors:', error);
      setTutors([]);
    } finally {
      setLoadingTutors(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('schedule.')) {
      const scheduleField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          [scheduleField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addMaterial = () => {
    if (newMaterial.trim()) {
      setFormData(prev => ({
        ...prev,
        materials: [...prev.materials, newMaterial.trim()]
      }));
      setNewMaterial('');
    }
  };

  const removeMaterial = (index) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (index) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        price: parseFloat(formData.price)
      };

      if (!formData.tutorId) {
        delete submitData.tutorId;
      }

      console.log('Submitting program data:', submitData);
      
      await programsAPI.create(submitData);
      toast.success('🎉 Program created successfully!');
      onProgramAdded();
    } catch (error) {
      console.error('Error creating program:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create program';
      toast.error(errorMessage);
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
        padding: '2rem',
        width: '100%',
        maxWidth: '42rem',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        border: `3px solid ${colors.primary}20`
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: colors.dark,
            marginBottom: '0.5rem'
          }}>
            Create New Program
          </h2>
          <p style={{ color: colors.gray, fontSize: '0.875rem' }}>
            Add a new educational program to Class Measures
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: colors.dark, 
                marginBottom: '0.5rem' 
              }}>
                Program Name *
              </label>
              <select
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
                  backgroundColor: colors.white
                }}
              >
                <option value="">Select a program</option>
                <option value="Coding">Coding</option>
                <option value="Chess">Chess</option>
                <option value="Robotics">Robotics</option>
                <option value="French">French</option>
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: colors.dark, 
                marginBottom: '0.5rem' 
              }}>
                Age Group *
              </label>
              <input
                type="text"
                name="ageGroup"
                value={formData.ageGroup}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
                placeholder="e.g., 4-16 years"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: colors.dark, 
              marginBottom: '0.5rem' 
            }}>
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `2px solid ${colors.lightGray}`,
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                resize: 'vertical'
              }}
              placeholder="Describe what this program offers..."
            />
          </div>

          {/* Schedule */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: colors.dark, marginBottom: '0.75rem' }}>
              Schedule
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: colors.gray, marginBottom: '0.25rem', display: 'block' }}>
                  Day
                </label>
                <select
                  name="schedule.day"
                  value={formData.schedule.day}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: '0.375rem',
                    fontSize: '0.8rem'
                  }}
                >
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: colors.gray, marginBottom: '0.25rem', display: 'block' }}>
                  Start Time
                </label>
                <input
                  type="time"
                  name="schedule.startTime"
                  value={formData.schedule.startTime}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: '0.375rem',
                    fontSize: '0.8rem'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: colors.gray, marginBottom: '0.25rem', display: 'block' }}>
                  End Time
                </label>
                <input
                  type="time"
                  name="schedule.endTime"
                  value={formData.schedule.endTime}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: '0.375rem',
                    fontSize: '0.8rem'
                  }}
                />
              </div>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <label style={{ fontSize: '0.8rem', color: colors.gray, marginBottom: '0.25rem', display: 'block' }}>
                Location
              </label>
              <input
                type="text"
                name="schedule.location"
                value={formData.schedule.location}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: `1px solid ${colors.lightGray}`,
                  borderRadius: '0.375rem',
                  fontSize: '0.8rem'
                }}
                placeholder="e.g., Room 101, Main Building"
              />
            </div>
          </div>

          {/* Capacity, Price, Tutor */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: colors.dark, 
                marginBottom: '0.5rem' 
              }}>
                Capacity *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                max="50"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
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
                Price (KSh) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
                placeholder="0.00"
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
                Tutor (Optional)
              </label>
              {loadingTutors ? (
                <div style={{ 
                  padding: '0.75rem', 
                  color: colors.gray, 
                  fontSize: '0.875rem',
                  textAlign: 'center',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem'
                }}>
                  Loading...
                </div>
              ) : (
                <select
                  name="tutorId"
                  value={formData.tutorId}
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
                  <option value="">No tutor assigned</option>
                  {tutors.map((tutor) => (
                    <option key={tutor._id} value={tutor._id}>
                      {tutor.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Materials */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: colors.dark, 
              marginBottom: '0.5rem' 
            }}>
              Required Materials
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: `1px solid ${colors.lightGray}`,
                  borderRadius: '0.375rem',
                  fontSize: '0.8rem'
                }}
                placeholder="Add a material..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
              />
              <button
                type="button"
                onClick={addMaterial}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: colors.secondary,
                  color: colors.dark,
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {formData.materials.map((material, index) => (
                <span
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: `${colors.secondary}20`,
                    color: colors.dark,
                    borderRadius: '1rem',
                    fontSize: '0.75rem'
                  }}
                >
                  {material}
                  <button
                    type="button"
                    onClick={() => removeMaterial(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: colors.gray,
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Learning Objectives */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: colors.dark, 
              marginBottom: '0.5rem' 
            }}>
              Learning Objectives
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: `1px solid ${colors.lightGray}`,
                  borderRadius: '0.375rem',
                  fontSize: '0.8rem'
                }}
                placeholder="Add a learning objective..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
              />
              <button
                type="button"
                onClick={addObjective}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: colors.primary,
                  color: colors.white,
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {formData.objectives.map((objective, index) => (
                <span
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: `${colors.primary}15`,
                    color: colors.primary,
                    borderRadius: '1rem',
                    fontSize: '0.75rem'
                  }}
                >
                  {objective}
                  <button
                    type="button"
                    onClick={() => removeObjective(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: colors.gray,
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
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
              disabled={loading}
              style={{
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
              {loading ? 'Creating Program...' : 'Create Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Enroll Student Modal Component
const EnrollStudentModal = ({ program, students, onClose, onEnrollmentChanged }) => {
  const [loading, setLoading] = useState(false);
  
  const colors = {
    primary: '#c55c5c',
    secondary: '#f4c842',
    dark: '#1e1e3c',
    white: '#ffffff',
    gray: '#6b7280',
    lightGray: '#f3f4f6'
  };

  const enrolledStudentIds = program.enrolledStudents?.map(s => s._id) || [];
  const availableStudents = students.filter(student => !enrolledStudentIds.includes(student._id));
  const enrolledStudents = students.filter(student => enrolledStudentIds.includes(student._id));

  const handleEnroll = async (studentId) => {
    setLoading(true);
    try {
      await programsAPI.enrollStudent(program._id, studentId);
      toast.success('Student enrolled successfully!');
      onEnrollmentChanged();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to enroll student');
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (studentId) => {
    setLoading(true);
    try {
      await programsAPI.unenrollStudent(program._id, studentId);
      toast.success('Student removed from program');
      onEnrollmentChanged();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove student');
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
        padding: '2rem',
        width: '100%',
        maxWidth: '36rem',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        border: `3px solid ${colors.primary}20`
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: colors.dark,
            marginBottom: '0.5rem'
          }}>
            Manage Enrollment - {program.name}
          </h2>
          <p style={{ color: colors.gray, fontSize: '0.875rem' }}>
            Enroll or remove students from this program
          </p>
        </div>

        {/* Currently Enrolled Students */}
        {enrolledStudents.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: colors.dark, marginBottom: '1rem' }}>
              Currently Enrolled ({enrolledStudents.length}/{program.capacity})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {enrolledStudents.map((student) => (
                <div
                  key={student._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    backgroundColor: `${colors.primary}08`,
                    borderRadius: '0.5rem',
                    border: `1px solid ${colors.primary}20`
                  }}
                >
                  <div>
                    <p style={{ fontWeight: '500', color: colors.dark }}>{student.name}</p>
                    <p style={{ fontSize: '0.8rem', color: colors.gray }}>{student.age} years old</p>
                  </div>
                  <button
                    onClick={() => handleUnenroll(student._id)}
                    disabled={loading}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      border: '1px solid #fecaca',
                      borderRadius: '0.375rem',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <UserMinus size={14} />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Students */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: colors.dark, marginBottom: '1rem' }}>
            Available Students ({availableStudents.length})
          </h3>
          {availableStudents.length === 0 ? (
            <p style={{ color: colors.gray, fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>
              All students are already enrolled in this program
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '20rem', overflow: 'auto' }}>
              {availableStudents.map((student) => (
                <div
                  key={student._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    backgroundColor: colors.lightGray,
                    borderRadius: '0.5rem',
                    border: `1px solid ${colors.gray}20`
                  }}
                >
                  <div>
                    <p style={{ fontWeight: '500', color: colors.dark }}>{student.name}</p>
                    <p style={{ fontSize: '0.8rem', color: colors.gray }}>{student.age} years old</p>
                  </div>
                  <button
                    onClick={() => handleEnroll(student._id)}
                    disabled={loading || program.enrolledStudents?.length >= program.capacity}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: program.enrolledStudents?.length >= program.capacity ? colors.lightGray : `${colors.primary}15`,
                      color: program.enrolledStudents?.length >= program.capacity ? colors.gray : colors.primary,
                      border: `1px solid ${program.enrolledStudents?.length >= program.capacity ? colors.gray : colors.primary}30`,
                      borderRadius: '0.375rem',
                      cursor: (loading || program.enrolledStudents?.length >= program.capacity) ? 'not-allowed' : 'pointer',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <UserPlus size={14} />
                    {program.enrolledStudents?.length >= program.capacity ? 'Full' : 'Enroll'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgramList;
