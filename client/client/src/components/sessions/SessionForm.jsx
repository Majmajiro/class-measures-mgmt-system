import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sessionsAPI, studentsAPI, programsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  X, 
  Save, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  FileText,
  AlertCircle
} from 'lucide-react';

const SessionForm = ({ session = null, onClose, onSessionSaved }) => {
  const isEditing = !!session;
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    programId: '',
    schedule: {
      date: '',
      startTime: '',
      endTime: '',
      duration: 60,
      dayOfWeek: ''
    },
    location: 'Main Classroom',
    sessionType: 'Regular Class',
    capacity: 20,
    students: [],
    notes: '',
    materials: [],
    objectives: []
  });

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
    loadPrograms();
    
    if (isEditing && session) {
      setFormData({
        title: session.title || '',
        programId: session.programId || '',
        schedule: {
          date: session.schedule?.date || '',
          startTime: session.schedule?.startTime || '',
          endTime: session.schedule?.endTime || '',
          duration: session.schedule?.duration || 60,
          dayOfWeek: session.schedule?.dayOfWeek || ''
        },
        location: session.location || 'Main Classroom',
        sessionType: session.sessionType || 'Regular Class',
        capacity: session.capacity || 20,
        students: session.students?.map(s => s._id || s) || [],
        notes: session.notes || '',
        materials: session.materials || [],
        objectives: session.objectives || []
      });
    }
  }, [isEditing, session]);

  const loadStudents = async () => {
    try {
      const response = await studentsAPI.getAll();
      const studentsData = response.students || response.data?.students || [];
      setStudents(studentsData);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const loadPrograms = async () => {
    try {
      const response = await programsAPI.getAll();
      const programsData = response.programs || response.data?.programs || [];
      setPrograms(programsData);
    } catch (error) {
      console.error('Error loading programs:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleStudentToggle = (studentId) => {
    setFormData(prev => ({
      ...prev,
      students: prev.students.includes(studentId)
        ? prev.students.filter(id => id !== studentId)
        : [...prev.students, studentId]
    }));
  };

  const calculateEndTime = (startTime, duration) => {
    if (!startTime || !duration) return '';
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate.getTime() + duration * 60000);
    
    return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  };

  const getDayOfWeek = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  useEffect(() => {
    if (formData.schedule.startTime && formData.schedule.duration) {
      const endTime = calculateEndTime(formData.schedule.startTime, formData.schedule.duration);
      setFormData(prev => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          endTime
        }
      }));
    }
  }, [formData.schedule.startTime, formData.schedule.duration]);

  useEffect(() => {
    if (formData.schedule.date) {
      const dayOfWeek = getDayOfWeek(formData.schedule.date);
      setFormData(prev => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          dayOfWeek
        }
      }));
    }
  }, [formData.schedule.date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!formData.title.trim()) {
        toast.error('Session title is required');
        setLoading(false);
        return;
      }

      if (!formData.schedule.date) {
        toast.error('Session date is required');
        setLoading(false);
        return;
      }

      if (!formData.schedule.startTime) {
        toast.error('Start time is required');
        setLoading(false);
        return;
      }

      const submitData = {
        ...formData,
        capacity: parseInt(formData.capacity) || 20,
        schedule: {
          ...formData.schedule,
          duration: parseInt(formData.schedule.duration) || 60
        }
      };

      console.log('Submitting session data:', submitData);

      if (isEditing) {
        await sessionsAPI.update(session._id, submitData);
        toast.success('📅 Session updated successfully!');
      } else {
        await sessionsAPI.create(submitData);
        toast.success('🎉 Session created successfully!');
      }
      
      onSessionSaved();
    } catch (error) {
      console.error('Save session error:', error);
      toast.error(error.response?.data?.message || 'Failed to save session');
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
        maxWidth: '48rem',
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
                {isEditing ? '✏️ Edit Session' : '📅 Create New Session'}
              </h2>
              <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                {isEditing ? `Update "${session?.title}"` : 'Schedule a new educational session'}
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
                <FileText size={18} style={{ color: colors.primary }} />
                Session Details
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
                    Session Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
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
                    placeholder="e.g., French A1 - Lesson 5"
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
                    Session Type *
                  </label>
                  <select
                    name="sessionType"
                    value={formData.sessionType}
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
                    <option value="Regular Class">📚 Regular Class</option>
                    <option value="Assessment">📝 Assessment</option>
                    <option value="Workshop">🔧 Workshop</option>
                    <option value="Practice">💪 Practice</option>
                    <option value="Exam Prep">🎯 Exam Prep</option>
                    <option value="Review">🔄 Review</option>
                  </select>
                </div>
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
                    Program
                  </label>
                  <select
                    name="programId"
                    value={formData.programId}
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
                    <option value="">Select Program (Optional)</option>
                    {programs.map(program => (
                      <option key={program._id} value={program._id}>
                        {program.name}
                      </option>
                    ))}
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
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    max="50"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    placeholder="20"
                  />
                </div>
              </div>
            </div>

            {/* Schedule Information */}
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
                <Calendar size={18} style={{ color: colors.secondary }} />
                Schedule & Timing
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    name="schedule.date"
                    value={formData.schedule.date}
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

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
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

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Duration (minutes)
                  </label>
                  <select
                    name="schedule.duration"
                    value={formData.schedule.duration}
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
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
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
                    End Time (Auto-calculated)
                  </label>
                  <input
                    type="time"
                    value={formData.schedule.endTime}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: colors.lightGray,
                      color: colors.gray
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
                    Day of Week (Auto-calculated)
                  </label>
                  <input
                    type="text"
                    value={formData.schedule.dayOfWeek}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: colors.lightGray,
                      color: colors.gray
                    }}
                    placeholder="Select date first"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
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
                Location
              </h3>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: colors.dark, 
                  marginBottom: '0.5rem' 
                }}>
                  Session Location
                </label>
                <select
                  name="location"
                  value={formData.location}
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
                  <option value="Main Classroom">Main Classroom</option>
                  <option value="Computer Lab">Computer Lab</option>
                  <option value="Library">Library</option>
                  <option value="Activity Room">Activity Room</option>
                  <option value="Online">Online Session</option>
                  <option value="Outdoor Area">Outdoor Area</option>
                </select>
              </div>
            </div>

            {/* Student Selection */}
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
                <Users size={18} style={{ color: '#8b5cf6' }} />
                Student Enrollment ({formData.students.length} selected)
              </h3>
              
              <div style={{ 
                maxHeight: '200px', 
                overflow: 'auto', 
                border: `2px solid ${colors.lightGray}`, 
                borderRadius: '0.5rem',
                padding: '1rem'
              }}>
                {students.length === 0 ? (
                  <p style={{ color: colors.gray, textAlign: 'center', padding: '1rem' }}>
                    No students available. Add students first.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                    {students.map(student => (
                      <label key={student._id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        backgroundColor: formData.students.includes(student._id) ? `${colors.primary}15` : colors.lightGray,
                        border: `2px solid ${formData.students.includes(student._id) ? colors.primary : 'transparent'}`,
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}>
                        <input
                          type="checkbox"
                          checked={formData.students.includes(student._id)}
                          onChange={() => handleStudentToggle(student._id)}
                          style={{ margin: 0 }}
                        />
                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.dark }}>
                          {student.name}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: colors.gray }}>
                          (Age {student.age})
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: colors.dark, 
                marginBottom: '0.5rem' 
              }}>
                Session Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  resize: 'vertical'
                }}
                placeholder="Add any special notes, objectives, or materials needed for this session..."
              />
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
            {loading ? 'Saving...' : (isEditing ? 'Update Session' : 'Create Session')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionForm;