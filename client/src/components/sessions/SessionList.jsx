import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sessionsAPI, programsAPI, studentsAPI } from '../../services/api';
import SessionForm from './SessionForm';
import AttendanceTracker from './AttendanceTracker';
import { toast } from 'react-hot-toast';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  UserCheck,
  BookOpen,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';

const SessionList = () => {
  const [sessions, setSessions] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    program: '',
    status: '',
    date: ''
  });
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

  // Session status colors
  const statusColors = {
    'scheduled': { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
    'ongoing': { bg: '#ecfdf5', border: '#10b981', text: '#047857' },
    'completed': { bg: '#f3e8ff', border: '#8b5cf6', text: '#6d28d9' },
    'cancelled': { bg: '#fee2e2', border: '#ef4444', text: '#dc2626' }
  };

  // Location icons
  const locationIcons = {
    'Main Classroom': '🏫',
    'Computer Lab': '💻',
    'Library': '📚',
    'Online': '🌐',
    'Chess Room': '♟️',
    'Robotics Lab': '🤖'
  };

  useEffect(() => {
    loadSessions();
    loadPrograms();
  }, [filters, searchQuery]);

  const loadSessions = async () => {
    try {
      const params = {};
      if (searchQuery) params.q = searchQuery;
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });
      
      const response = await sessionsAPI.getAll(params);
      console.log('Sessions response:', response);
      
      const sessionsData = response.sessions || [];
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPrograms = async () => {
    try {
      const response = await programsAPI.getAll();
      const programsData = response.programs || response.data?.programs || [];
      setPrograms(programsData);
    } catch (error) {
      console.error('Error loading programs:', error);
      setPrograms([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await sessionsAPI.delete(id);
        toast.success('Session deleted successfully');
        loadSessions();
      } catch (error) {
        toast.error('Failed to delete session');
      }
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingSession(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingSession(null);
  };

  const handleSessionSaved = () => {
    loadSessions();
    setShowForm(false);
    setEditingSession(null);
  };

  const handleAttendance = (session) => {
    setSelectedSession(session);
    setShowAttendance(true);
  };

  const handleAttendanceClose = () => {
    setShowAttendance(false);
    setSelectedSession(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isToday = (dateString) => {
    const today = new Date();
    const sessionDate = new Date(dateString);
    return today.toDateString() === sessionDate.toDateString();
  };

  const getStatusDisplay = (status) => {
    const statusStyle = statusColors[status] || statusColors.scheduled;
    return (
      <span style={{
        padding: '0.25rem 0.75rem',
        backgroundColor: statusStyle.bg,
        color: statusStyle.text,
        border: `1px solid ${statusStyle.border}30`,
        borderRadius: '1rem',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'capitalize'
      }}>
        {status}
      </span>
    );
  };

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
              📅 Session Management
            </h1>
            <p style={{ color: colors.gray, fontSize: '1rem' }}>
              Schedule classes and track attendance for all your programs
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => loadSessions()}
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

            {(user.role === 'admin' || user.role === 'tutor') && (
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
                <Plus size={18} />
                Schedule Session
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: colors.white,
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: `2px solid ${colors.primary}20`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Calendar size={24} style={{ color: colors.primary }} />
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.dark }}>
                  {sessions.length}
                </h3>
                <p style={{ fontSize: '0.875rem', color: colors.gray }}>
                  Total Sessions
                </p>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: colors.white,
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: `2px solid ${colors.secondary}20`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Clock size={24} style={{ color: colors.secondary }} />
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.dark }}>
                  {sessions.filter(s => isToday(s.schedule.date)).length}
                </h3>
                <p style={{ fontSize: '0.875rem', color: colors.gray }}>
                  Today's Sessions
                </p>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: colors.white,
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: `2px solid #10b98120`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <CheckCircle size={24} style={{ color: '#10b981' }} />
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.dark }}>
                  {sessions.filter(s => s.status === 'completed').length}
                </h3>
                <p style={{ fontSize: '0.875rem', color: colors.gray }}>
                  Completed
                </p>
              </div>
            </div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Search size={18} style={{ color: colors.gray }} />
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: colors.dark }}>
              Search & Filter Sessions
            </h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
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
                placeholder="Search sessions by title..."
              />
            </div>

            <div>
              <select
                value={filters.program}
                onChange={(e) => setFilters(prev => ({ ...prev, program: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: colors.white
                }}
              >
                <option value="">All Programs</option>
                {programs.map(program => (
                  <option key={program._id} value={program._id}>
                    {program.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: colors.white
                }}
              >
                <option value="">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                style={{
                  padding: '0.75rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: colors.white
                }}
              />
            </div>

            <div>
              <button
                onClick={() => {
                  setFilters({ program: '', status: '', date: '' });
                  setSearchQuery('');
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

        {/* Sessions List */}
        {sessions.length === 0 ? (
          <div style={{
            backgroundColor: colors.white,
            padding: '4rem 2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            <Calendar size={64} style={{ color: colors.gray, margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: colors.dark, marginBottom: '0.5rem' }}>
              No sessions found
            </h3>
            <p style={{ color: colors.gray, fontSize: '1rem', marginBottom: '2rem' }}>
              Start by scheduling your first class session
            </p>
            {(user.role === 'admin' || user.role === 'tutor') && (
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
                <Plus size={16} style={{ marginRight: '0.5rem' }} />
                Schedule First Session
              </button>
            )}
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {sessions.map((session) => (
              <div 
                key={session._id} 
                style={{
                  backgroundColor: colors.white,
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  border: `2px solid ${colors.lightGray}`,
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                }}
              >
                {/* Session Header */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '700', 
                      color: colors.dark,
                      marginBottom: '0.25rem'
                    }}>
                      {session.title}
                    </h3>
                    {getStatusDisplay(session.status)}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <BookOpen size={16} style={{ color: colors.primary }} />
                    <span style={{ fontSize: '0.875rem', color: colors.gray, fontWeight: '500' }}>
                      {session.program?.name || 'Unknown Program'}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={16} style={{ color: colors.secondary }} />
                    <span style={{ fontSize: '0.875rem', color: colors.gray }}>
                      {session.instructor?.name || 'Unknown Instructor'}
                    </span>
                  </div>
                </div>

                {/* Session Details */}
                <div style={{ 
                  backgroundColor: colors.lightGray, 
                  padding: '1rem', 
                  borderRadius: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Calendar size={16} style={{ color: colors.primary }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.dark }}>
                      {formatDate(session.schedule.date)}
                    </span>
                    {isToday(session.schedule.date) && (
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        backgroundColor: colors.secondary,
                        color: colors.dark,
                        borderRadius: '1rem',
                        fontSize: '0.7rem',
                        fontWeight: '600'
                      }}>
                        TODAY
                      </span>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Clock size={16} style={{ color: colors.secondary }} />
                    <span style={{ fontSize: '0.875rem', color: colors.gray }}>
                      {formatTime(session.schedule.startTime)} - {formatTime(session.schedule.endTime)}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} style={{ color: '#10b981' }} />
                    <span style={{ fontSize: '0.875rem', color: colors.gray }}>
                      {locationIcons[session.location] || '📍'} {session.location}
                    </span>
                  </div>
                </div>

                {/* Students Info */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Users size={16} style={{ color: colors.gray }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.dark }}>
                      Students ({session.students?.length || 0})
                    </span>
                  </div>
                  
                  {session.students?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {session.students.slice(0, 3).map((enrollment, index) => (
                        <span key={index} style={{
                          padding: '0.125rem 0.5rem',
                          backgroundColor: `${colors.primary}10`,
                          color: colors.primary,
                          borderRadius: '1rem',
                          fontSize: '0.7rem',
                          fontWeight: '500'
                        }}>
                          {enrollment.student?.name || 'Unknown Student'}
                        </span>
                      ))}
                      {session.students.length > 3 && (
                        <span style={{
                          padding: '0.125rem 0.5rem',
                          backgroundColor: `${colors.gray}10`,
                          color: colors.gray,
                          borderRadius: '1rem',
                          fontSize: '0.7rem',
                          fontWeight: '500'
                        }}>
                          +{session.students.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleAttendance(session)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      backgroundColor: `${colors.secondary}15`,
                      color: colors.dark,
                      border: `1px solid ${colors.secondary}30`,
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
                    <UserCheck size={14} />
                    Attendance
                  </button>
                  
                  {(user.role === 'admin' || user.role === 'tutor') && (
                    <>
                      <button
                        onClick={() => handleEdit(session)}
                        style={{
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
                          justifyContent: 'center'
                        }}
                      >
                        <Edit size={14} />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(session._id)}
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
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Session Form Modal */}
        {showForm && (
          <SessionForm
            session={editingSession}
            onClose={handleFormClose}
            onSessionSaved={handleSessionSaved}
          />
        )}

        {/* Attendance Tracker Modal */}
        {showAttendance && selectedSession && (
          <AttendanceTracker
            session={selectedSession}
            onClose={handleAttendanceClose}
          />
        )}
      </div>
    </div>
  );
};

export default SessionList;
