import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { programsAPI, studentsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, Users, Clock, MapPin, DollarSign } from 'lucide-react';

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
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
    loadPrograms();
    loadStudents();
    if (user.role === 'admin') {
      loadTutors();
    }
  }, [user.role]);

  const loadPrograms = async () => {
    try {
      const response = await programsAPI.getAll();
      console.log('Programs response:', response);
      // Fix: Handle both response.programs and response.data.programs
      const programsData = response.programs || response.data?.programs || [];
      setPrograms(programsData);
    } catch (error) {
      console.error('Error loading programs:', error);
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await studentsAPI.getAll();
      console.log('Students response:', response);
      // Fix: Handle both response.students and response.data.students
      const studentsData = response.students || response.data?.students || [];
      setStudents(studentsData);
    } catch (error) {
      console.error('Error loading students:', error);
      setStudents([]);
    }
  };

  const loadTutors = async () => {
    try {
      const response = await programsAPI.getTutors();
      console.log('Tutors response:', response);
      // Fix: Handle both response.tutors and response.data.tutors
      const tutorsData = response.tutors || response.data?.tutors || [];
      setTutors(tutorsData);
    } catch (error) {
      console.error('Error loading tutors:', error);
      setTutors([]);
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

  const handleEdit = (program) => {
    setEditingProgram(program);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingProgram(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProgram(null);
  };

  const handleProgramSaved = () => {
    loadPrograms();
    setShowForm(false);
    setEditingProgram(null);
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
    <div style={{ padding: '2rem', backgroundColor: colors.lightGray, minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: colors.white,
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.dark, marginBottom: '0.5rem' }}>
              🎓 Program Management
            </h1>
            <p style={{ color: colors.gray, fontSize: '1rem' }}>
              Manage your 5 core programs: French, Coding, Chess, and Robotics
            </p>
          </div>
          
          {user.role === 'admin' && (
            <button
              onClick={handleAddNew}
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
            >
              <Plus size={18} />
              Add Program
            </button>
          )}
        </div>

        {/* Programs Grid */}
        {programs.length === 0 ? (
          <div style={{
            backgroundColor: colors.white,
            padding: '4rem 2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: colors.dark, marginBottom: '0.5rem' }}>
              No programs yet
            </h3>
            <p style={{ color: colors.gray, fontSize: '1rem', marginBottom: '2rem' }}>
              Start by adding your first program to the Class Measures Hub
            </p>
            {user.role === 'admin' && (
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
                Add Your First Program
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {programs.map((program) => (
              <div 
                key={program._id} 
                style={{
                  backgroundColor: colors.white,
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  border: `2px solid ${colors.lightGray}`,
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.dark, marginBottom: '0.5rem' }}>
                    {program.name}
                  </h3>
                  <p style={{ color: colors.gray, fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {program.description}
                  </p>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '1rem', 
                  marginBottom: '1rem',
                  padding: '1rem',
                  backgroundColor: colors.lightGray,
                  borderRadius: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={16} style={{ color: colors.primary }} />
                    <span style={{ fontSize: '0.875rem', color: colors.dark }}>
                      {program.enrolledStudents?.length || 0} students
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <DollarSign size={16} style={{ color: colors.secondary }} />
                    <span style={{ fontSize: '0.875rem', color: colors.dark }}>
                      KSh {program.price}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} style={{ color: colors.gray }} />
                    <span style={{ fontSize: '0.875rem', color: colors.dark }}>
                      {program.schedule?.day} {program.schedule?.startTime}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} style={{ color: colors.gray }} />
                    <span style={{ fontSize: '0.875rem', color: colors.dark }}>
                      {program.schedule?.location}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: colors.gray, fontWeight: '500' }}>Age Group</span>
                  <p style={{ fontSize: '0.875rem', color: colors.dark, fontWeight: '600' }}>
                    {program.ageGroup}
                  </p>
                </div>

                {program.tutor && (
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: colors.gray, fontWeight: '500' }}>Tutor</span>
                    <p style={{ fontSize: '0.875rem', color: colors.dark, fontWeight: '600' }}>
                      {program.tutor.name}
                    </p>
                  </div>
                )}

                {user.role === 'admin' && (
                  <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem', borderTop: `1px solid ${colors.lightGray}` }}>
                    <button
                      onClick={() => handleEdit(program)}
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
            ))}
          </div>
        )}

        {/* Simple Program Form */}
        {showForm && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
          }}>
            <div style={{
              backgroundColor: colors.white,
              borderRadius: '1rem',
              padding: '2rem',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: colors.dark }}>
                {editingProgram ? 'Edit Program' : 'Add New Program'}
              </h2>
              
              <ProgramForm 
                program={editingProgram}
                tutors={tutors}
                onSave={handleProgramSaved}
                onCancel={handleFormClose}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Program Form Component
const ProgramForm = ({ program, tutors, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: program?.name || '',
    description: program?.description || '',
    ageGroup: program?.ageGroup || '',
    tutorId: program?.tutor?._id || '',
    schedule: {
      day: program?.schedule?.day || 'Saturday',
      startTime: program?.schedule?.startTime || '09:00',
      endTime: program?.schedule?.endTime || '10:00',
      location: program?.schedule?.location || 'Main Classroom'
    },
    capacity: program?.capacity || 20,
    price: program?.price || 0,
    materials: program?.materials || [],
    objectives: program?.objectives || []
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Submitting program data:', formData);
      
      const submitData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        price: parseFloat(formData.price),
        materials: formData.materials.filter(m => m.trim() !== ''),
        objectives: formData.objectives.filter(o => o.trim() !== '')
      };

      if (program) {
        await programsAPI.update(program._id, submitData);
        toast.success('Program updated successfully!');
      } else {
        await programsAPI.create(submitData);
        toast.success('Program created successfully!');
      }
      
      onSave();
    } catch (error) {
      console.error('Save program error:', error);
      toast.error(error.response?.data?.message || 'Failed to save program');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: colors.dark, marginBottom: '0.5rem' }}>
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
              fontSize: '0.875rem'
            }}
          >
            <option value="">Select a program</option>
            <option value="French">French</option>
            <option value="English">English</option>
            <option value="Coding">Coding</option>
            <option value="Chess">Chess</option>
            <option value="Robotics">Robotics</option>
            <option value="Reading">Reading</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: colors.dark, marginBottom: '0.5rem' }}>
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
            placeholder="Describe the program..."
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: colors.dark, marginBottom: '0.5rem' }}>
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
              placeholder="e.g., 8-12 years"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: colors.dark, marginBottom: '0.5rem' }}>
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
              placeholder="3000"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: colors.dark, marginBottom: '0.5rem' }}>
              Schedule Day *
            </label>
            <select
              name="schedule.day"
              value={formData.schedule.day}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `2px solid ${colors.lightGray}`,
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
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
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: colors.dark, marginBottom: '0.5rem' }}>
              Start Time *
            </label>
            <input
              type="time"
              name="schedule.startTime"
              value={formData.schedule.startTime}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `2px solid ${colors.lightGray}`,
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '0.75rem',
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
              flex: 1,
              padding: '0.75rem',
              backgroundColor: colors.primary,
              color: colors.white,
              border: 'none',
              borderRadius: '0.5rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Saving...' : (program ? 'Update Program' : 'Create Program')}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProgramList;
