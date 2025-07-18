import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sessionsAPI } from '../../services/api';
import SessionForm from './SessionForm';
import { toast } from 'react-hot-toast';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

const SessionList = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
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
    loadSessions();
  }, [searchQuery, filterType]);

  const loadSessions = async () => {
    console.log("🔄 SessionList: Starting to load sessions...");
    console.log("🔑 Token exists:", !!localStorage.getItem("token"));
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (filterType) params.type = filterType;
      
      console.log("📡 Calling sessionsAPI.getAll with params:", params);
      const response = await sessionsAPI.getAll(params);
      console.log("📥 Got response from API:", response);
      console.log("🔄 Setting sessions to:", response.sessions || []);
      setSessions(response.sessions || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast.error('Failed to load sessions');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await sessionsAPI.delete(id);
        toast.success('Session deleted successfully');
        loadSessions();
      } catch (error) {
        console.error('Delete error:', error);
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
    console.log('💾 Session saved, reloading list...');
    setTimeout(() => {
      loadSessions();
    }, 500);
    setShowForm(false);
    setEditingSession(null);
  };
  const createTestSession = async () => {
    try {
      const testSessionData = {
        title: `Demo Session ${Date.now()}`,
        schedule: {
          date: new Date().toISOString().split('T')[0],
          startTime: '14:00',
          endTime: '15:00',
          duration: 60,
          dayOfWeek: 'Saturday'
        },
        location: 'Main Classroom',
        sessionType: 'Regular Class',
        notes: 'This is a demo session created for testing'
      };

      const response = await sessionsAPI.create(testSessionData);
      
      if (response.session || response.message) {
        toast.success('🧪 Demo session created successfully!');
        loadSessions();
      } else {
        toast.error('Failed to create demo session');
      }
    } catch (error) {
      console.error('Demo session error:', error);
      toast.error('Failed to create demo session');
    }
  };

  const getSessionTypeColor = (type) => {
    switch (type) {
      case 'Regular Class': return '#10b981';
      case 'Assessment': return '#f59e0b';
      case 'Workshop': return '#8b5cf6';
      case 'Practice': return '#06b6d4';
      case 'Exam Prep': return '#ef4444';
      case 'Review': return '#84cc16';
      default: return colors.gray;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = !searchQuery || 
      session.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = !filterType || session.sessionType === filterType;
    
    return matchesSearch && matchesType;
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
              📅 Session Management
            </h1>
            <p style={{ color: colors.gray, fontSize: '1rem' }}>
              Schedule, manage, and track your educational sessions
            </p>
            <p style={{ color: colors.primary, fontSize: '0.875rem', fontWeight: '600' }}>
              Total Sessions: {sessions.length} | Displayed: {filteredSessions.length}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={loadSessions}
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
              <>
                <button
                  onClick={createTestSession}
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
                  🧪 Demo Session
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
                  <Plus size={18} />
                  New Session
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
                placeholder="Search sessions by title or location..."
              />
            </div>

            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: colors.white
                }}
              >
                <option value="">All Types</option>
                <option value="Regular Class">Regular Class</option>
                <option value="Assessment">Assessment</option>
                <option value="Workshop">Workshop</option>
                <option value="Practice">Practice</option>
                <option value="Exam Prep">Exam Prep</option>
                <option value="Review">Review</option>
              </select>
            </div>

            <div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('');
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

        {/* Sessions Grid */}
        {filteredSessions.length === 0 ? (
          <div style={{
            backgroundColor: colors.white,
            padding: '4rem 2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            <Calendar size={64} style={{ color: colors.gray, margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: colors.dark, marginBottom: '0.5rem' }}>
              {sessions.length === 0 ? 'No sessions scheduled' : 'No sessions match your criteria'}
            </h3>
            <p style={{ color: colors.gray, fontSize: '1rem', marginBottom: '2rem' }}>
              {sessions.length === 0 
                ? 'Start by creating your first session'
                : 'Try adjusting your search terms or filters'
              }
            </p>
            {(user.role === 'admin' || user.role === 'tutor') && sessions.length === 0 && (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={createTestSession}
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
                  🧪 Create Demo Session
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
                  Create Your First Session
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {filteredSessions.map((session) => (
              <div 
                key={session._id} 
                style={{
                  backgroundColor: colors.white,
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  border: `2px solid ${colors.lightGray}`,
                  transition: 'all 0.2s'
                }}
              >
                {/* Session Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '700', 
                      color: colors.dark,
                      marginBottom: '0.5rem'
                    }}>
                      {session.title || 'Untitled Session'}
                    </h3>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: `${getSessionTypeColor(session.sessionType)}20`,
                      color: getSessionTypeColor(session.sessionType),
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {session.sessionType || 'Regular Class'}
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
                  {/* Date & Time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Calendar size={16} style={{ color: colors.gray }} />
                    <span style={{ fontSize: '0.875rem', color: colors.dark }}>
                      {session.schedule?.date ? formatDate(session.schedule.date) : 'No date set'}
                    </span>
                  </div>
                  
                  {/* Time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Clock size={16} style={{ color: colors.gray }} />
                    <span style={{ fontSize: '0.875rem', color: colors.dark }}>
                      {session.schedule?.startTime ? 
                        `${formatTime(session.schedule.startTime)} - ${formatTime(session.schedule.endTime)}` : 
                        'No time set'
                      }
                    </span>
                  </div>
                  
                  {/* Location */}
                  {session.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <MapPin size={16} style={{ color: colors.gray }} />
                      <span style={{ fontSize: '0.875rem', color: colors.dark }}>
                        {session.location}
                      </span>
                    </div>
                  )}
                  
                  {/* Students */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={16} style={{ color: colors.gray }} />
                    <span style={{ fontSize: '0.875rem', color: colors.dark }}>
                      {session.students?.length || 0} students enrolled
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {session.notes && (
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: colors.gray,
                      fontStyle: 'italic',
                      lineHeight: '1.4'
                    }}>
                      "{session.notes}"
                    </p>
                  </div>
                )}

                {/* Actions */}
                {(user.role === 'admin' || user.role === 'tutor') && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(session)}
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
                  </div>
                )}
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
      </div>
    </div>
  );
};

export default SessionList;
