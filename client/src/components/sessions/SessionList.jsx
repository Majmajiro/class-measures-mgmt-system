import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sessionsAPI } from '../../services/api';
import SessionForm from './SessionForm';
import { toast } from 'react-hot-toast';
import { 
  Calendar, Clock, Users, MapPin, Plus, Edit, Trash2, RefreshCw, Search, Filter,
  Download, Grid, List, ChevronDown, ChevronUp, Eye, UserCheck, UserX, MessageCircle,
  CheckCircle, XCircle, AlertTriangle, BookOpen, User, Target, TrendingUp, Award,
  PlayCircle, PauseCircle, RotateCw, Copy, Bell, PhoneCall, Activity, BarChart3,
  Timer, CalendarDays, GraduationCap, ClipboardList, Zap, FileText, Star
} from 'lucide-react';

const SessionList = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [instructorFilter, setInstructorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, calendar
  const [showStats, setShowStats] = useState(true);
  const [showAttendanceStats, setShowAttendanceStats] = useState(false);
  const { user } = useAuth();

  const colors = {
    primary: '#c55c5c',
    secondary: '#f4c842',
    dark: '#1e1e3c',
    white: '#ffffff',
    gray: '#6b7280',
    lightGray: '#f3f4f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6'
  };

  // Session configuration
  const programs = ['Coding', 'Robotics', 'Chess', 'Reading', 'French Classes', 'Entrepreneurship'];
  const sessionTypes = ['Regular Class', 'Assessment', 'Workshop', 'Practice', 'Exam Prep', 'Review', 'Field Trip'];
  const sessionStatuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Postponed'];
  const dateFilters = ['Today', 'This Week', 'This Month', 'Upcoming', 'Past'];

  // Load sessions from API
  const loadSessions = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      console.log('🔄 Loading sessions...');
      const response = await sessionsAPI.getAll();
      console.log('📥 Sessions API response:', response);
      
      // Handle different response structures
      let sessionsData = [];
      if (response.sessions) {
        sessionsData = response.sessions;
      } else if (response.data && response.data.sessions) {
        sessionsData = response.data.sessions;
      } else if (Array.isArray(response)) {
        sessionsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        sessionsData = response.data;
      }
      
      console.log('🎯 Final sessionsData to set:', sessionsData);
      setSessions(sessionsData);
      
    } catch (error) {
      console.error('❌ Error loading sessions:', error);
      toast.error('Failed to load sessions');
      setSessions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  // Handle successful session save
  const handleSessionSaved = () => {
    setShowForm(false);
    setEditingSession(null);
    loadSessions(true);
  };

  // Handle edit session
  const handleEditSession = (session) => {
    setEditingSession(session);
    setShowForm(true);
  };

  // Handle delete session
  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return;
    }

    try {
      await sessionsAPI.delete(sessionId);
      toast.success('🗑️ Session deleted successfully!');
      loadSessions(true);
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
    }
  };

  // Duplicate session
  const handleDuplicateSession = async (session) => {
    try {
      const duplicatedSession = {
        ...session,
        title: `${session.title} (Copy)`,
        _id: undefined,
        status: 'Scheduled',
        schedule: {
          ...session.schedule,
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Next week
        }
      };
      
      const response = await sessionsAPI.create(duplicatedSession);
      if (response.session || response.message) {
        toast.success('📋 Session duplicated successfully!');
        loadSessions(true);
      }
    } catch (error) {
      console.error('Error duplicating session:', error);
      toast.error('Failed to duplicate session');
    }
  };

  // Mark attendance
  const handleMarkAttendance = async (session) => {
    if (user.role !== 'admin' && user.role !== 'tutor') {
      toast.error('Only instructors can mark attendance');
      return;
    }

    try {
      // Simple attendance marking - in real app this would open an attendance modal
      const updatedSession = {
        ...session,
        status: 'Completed',
        attendance: {
          present: Math.floor(Math.random() * (session.students?.length || 10)),
          total: session.students?.length || 10,
          markedAt: new Date().toISOString(),
          markedBy: user.name
        }
      };
      
      await sessionsAPI.update(session._id, updatedSession);
      toast.success('✅ Attendance marked successfully!');
      loadSessions(true);
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error('Failed to mark attendance');
    }
  };

  // Change session status
  const handleStatusChange = async (session, newStatus) => {
    if (user.role !== 'admin' && user.role !== 'tutor') {
      toast.error('Only instructors can change session status');
      return;
    }

    try {
      const updatedSession = { ...session, status: newStatus };
      await sessionsAPI.update(session._id, updatedSession);
      toast.success(`Session ${newStatus.toLowerCase()} successfully!`);
      loadSessions(true);
    } catch (error) {
      console.error('Error updating session status:', error);
      toast.error('Failed to update session status');
    }
  };

  // Create test session with realistic data
  const createTestSession = async () => {
    try {
      const testSessions = [
        {
          title: 'Chess Strategy Workshop',
          program: 'Chess',
          sessionType: 'Workshop',
          schedule: {
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            startTime: '14:00',
            endTime: '15:30',
            duration: 90,
            dayOfWeek: 'Wednesday'
          },
          location: 'Main Classroom',
          instructor: 'Ms. Wanjiku',
          maxStudents: 12,
          enrolledStudents: Math.floor(Math.random() * 12),
          status: 'Scheduled',
          description: 'Advanced chess strategies and opening principles',
          materials: ['Chess sets', 'Strategy books', 'Demo board'],
          objectives: ['Learn advanced openings', 'Practice tactical combinations'],
          notes: 'Bring chess notation books',
          students: ['Aisha Mwangi', 'Brian Kiprotich', 'Cynthia Wanjiku']
        },
        {
          title: 'Python Fundamentals',
          program: 'Coding',
          sessionType: 'Regular Class',
          schedule: {
            date: new Date().toISOString().split('T')[0],
            startTime: '16:00',
            endTime: '18:00',
            duration: 120,
            dayOfWeek: 'Tuesday'
          },
          location: 'Computer Lab',
          instructor: 'Mr. Kiprotich',
          maxStudents: 15,
          enrolledStudents: Math.floor(Math.random() * 15),
          status: 'In Progress',
          description: 'Introduction to Python programming basics',
          materials: ['Laptops', 'Python IDE', 'Course materials'],
          objectives: ['Variables and data types', 'Control structures', 'Functions'],
          notes: 'Ensure all laptops are charged',
          students: ['David Mwangi', 'Grace Kiprotich', 'James Otieno']
        },
        {
          title: 'Robotics Assembly Session',
          program: 'Robotics',
          sessionType: 'Practice',
          schedule: {
            date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            startTime: '10:00',
            endTime: '12:00',
            duration: 120,
            dayOfWeek: 'Saturday'
          },
          location: 'Robotics Lab',
          instructor: 'Eng. Mwangi',
          maxStudents: 10,
          enrolledStudents: Math.floor(Math.random() * 10),
          status: 'Scheduled',
          description: 'Hands-on robot building and programming',
          materials: ['LEGO kits', 'Arduino boards', 'Sensors'],
          objectives: ['Build basic robot', 'Program movement', 'Test sensors'],
          notes: 'Small groups of 2-3 students',
          students: ['Peter Wanjiku', 'Sarah Njeri', 'Michael Otieno']
        },
        {
          title: 'French Conversation Practice',
          program: 'French Classes',
          sessionType: 'Assessment',
          schedule: {
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            startTime: '15:00',
            endTime: '16:30',
            duration: 90,
            dayOfWeek: 'Monday'
          },
          location: 'Language Lab',
          instructor: 'Mme. Akinyi',
          maxStudents: 18,
          enrolledStudents: 16,
          status: 'Completed',
          description: 'Oral assessment of French conversation skills',
          materials: ['Audio equipment', 'Assessment sheets'],
          objectives: ['Evaluate pronunciation', 'Test vocabulary', 'Assess fluency'],
          notes: 'Individual assessments - 5 minutes each',
          students: ['Marie Dubois', 'Jean Pierre', 'Amelie Laurent'],
          attendance: { present: 14, total: 16, markedAt: new Date().toISOString() }
        }
      ];

      const randomSession = testSessions[Math.floor(Math.random() * testSessions.length)];
      
      const testSessionData = {
        ...randomSession,
        title: `${randomSession.title} - ${new Date().toLocaleDateString()}`
      };

      const response = await sessionsAPI.create(testSessionData);
      
      if (response.session || response.message) {
        toast.success('🧪 Test session created successfully!');
        loadSessions(true);
      } else {
        toast.error('Failed to create test session');
      }
    } catch (error) {
      console.error('Test session error:', error);
      toast.error('Failed to create test session');
    }
  };

  // Get session type color
  const getSessionTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'regular class': return colors.info;
      case 'assessment': return colors.warning;
      case 'workshop': return colors.success;
      case 'practice': return '#8b5cf6';
      case 'exam prep': return colors.danger;
      case 'review': return '#06b6d4';
      case 'field trip': return '#84cc16';
      default: return colors.gray;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled': return colors.info;
      case 'in progress': return colors.warning;
      case 'completed': return colors.success;
      case 'cancelled': return colors.danger;
      case 'postponed': return colors.gray;
      default: return colors.gray;
    }
  };

  // Get enrollment percentage
  const getEnrollmentPercentage = (enrolled, max) => {
    if (!max || max === 0) return 0;
    return Math.min(Math.round((enrolled / max) * 100), 100);
  };

  // Get attendance percentage
  const getAttendancePercentage = (attendance) => {
    if (!attendance || !attendance.total) return 0;
    return Math.round((attendance.present / attendance.total) * 100);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time
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

  // Get unique instructors for filter
  const uniqueInstructors = [...new Set(sessions.map(s => s.instructor).filter(Boolean))];

  // Filter sessions
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = !searchQuery || 
      session.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.instructor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProgram = !programFilter || session.program === programFilter;
    const matchesInstructor = !instructorFilter || session.instructor === instructorFilter;
    const matchesStatus = !statusFilter || session.status === statusFilter;
    const matchesType = !typeFilter || session.sessionType === typeFilter;
    
    const matchesDate = !dateFilter || (() => {
      const sessionDate = new Date(session.schedule?.date);
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      switch (dateFilter) {
        case 'Today': return sessionDate.toDateString() === new Date().toDateString();
        case 'This Week': return sessionDate >= startOfWeek;
        case 'This Month': return sessionDate >= startOfMonth;
        case 'Upcoming': return sessionDate >= new Date();
        case 'Past': return sessionDate < new Date();
        default: return true;
      }
    })();
    
    return matchesSearch && matchesProgram && matchesInstructor && matchesStatus && matchesType && matchesDate;
  });

  // Calculate stats
  const totalSessions = sessions.length;
  const scheduledSessions = sessions.filter(s => s.status === 'Scheduled').length;
  const completedSessions = sessions.filter(s => s.status === 'Completed').length;
  const inProgressSessions = sessions.filter(s => s.status === 'In Progress').length;
  const totalEnrollments = sessions.reduce((sum, s) => sum + (s.enrolledStudents || 0), 0);
  const totalCapacity = sessions.reduce((sum, s) => sum + (s.maxStudents || 0), 0);
  const averageAttendance = sessions.filter(s => s.attendance?.total).length > 0 ?
    Math.round(sessions.filter(s => s.attendance?.total).reduce((sum, s) => sum + getAttendancePercentage(s.attendance), 0) / sessions.filter(s => s.attendance?.total).length) : 0;

  // Export sessions data (admin only)
  const exportSessions = () => {
    if (user.role !== 'admin') {
      toast.error('Only administrators can export data');
      return;
    }
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Session Title,Program,Type,Date,Time,Instructor,Location,Status,Enrolled,Capacity\n" +
      sessions.map(s => 
        `"${s.title}","${s.program}","${s.sessionType}","${s.schedule?.date}","${s.schedule?.startTime}-${s.schedule?.endTime}","${s.instructor}","${s.location}","${s.status}","${s.enrolledStudents || 0}","${s.maxStudents}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sessions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Sessions data exported successfully!');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            animation: 'spin 1s linear infinite', 
            borderRadius: '50%', 
            height: '3rem', 
            width: '3rem', 
            border: `2px solid ${colors.lightGray}`, 
            borderBottom: `2px solid ${colors.primary}`,
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: colors.gray }}>Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: colors.lightGray, minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Enhanced Header with Stats */}
        <div style={{
          backgroundColor: colors.white,
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          {/* Title and Quick Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: colors.dark, margin: 0 }}>
                📅 Sessions Management
              </h2>
              <p style={{ color: colors.gray, fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                Schedule sessions, track attendance and manage your teaching calendar
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {/* View Toggle */}
              <div style={{ display: 'flex', backgroundColor: colors.lightGray, borderRadius: '0.5rem', padding: '0.25rem' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: viewMode === 'grid' ? colors.white : 'transparent',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    color: viewMode === 'grid' ? colors.dark : colors.gray
                  }}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: viewMode === 'list' ? colors.white : 'transparent',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    color: viewMode === 'list' ? colors.dark : colors.gray
                  }}
                >
                  <List size={16} />
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: viewMode === 'calendar' ? colors.white : 'transparent',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    color: viewMode === 'calendar' ? colors.dark : colors.gray
                  }}
                >
                  <CalendarDays size={16} />
                </button>
              </div>

              {/* Export Button (Admin Only) */}
              {user.role === 'admin' && (
                <button
                  onClick={exportSessions}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: colors.info,
                    color: colors.white,
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}
                >
                  <Download size={14} />
                  Export
                </button>
              )}

              <button
                onClick={createTestSession}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: `${colors.secondary}20`,
                  color: colors.dark,
                  border: `2px solid ${colors.secondary}`,
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}
              >
                🧪 Test
              </button>
              
              <button
                onClick={() => setShowForm(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
                  color: colors.dark,
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}
              >
                <Plus size={14} />
                Add Session
              </button>
            </div>
          </div>

          {/* Stats Dashboard */}
          {showStats && (
            <div style={{
              backgroundColor: colors.lightGray,
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              {/* Main Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.primary }}>{totalSessions}</div>
                  <div style={{ fontSize: '0.85rem', color: colors.gray }}>Total Sessions</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.info }}>{scheduledSessions}</div>
                  <div style={{ fontSize: '0.85rem', color: colors.gray }}>Scheduled</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.warning }}>{inProgressSessions}</div>
                  <div style={{ fontSize: '0.85rem', color: colors.gray }}>In Progress</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.success }}>{completedSessions}</div>
                  <div style={{ fontSize: '0.85rem', color: colors.gray }}>Completed</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.secondary }}>{Math.round((totalEnrollments/totalCapacity)*100) || 0}%</div>
                  <div style={{ fontSize: '0.85rem', color: colors.gray }}>Capacity Used</div>
                </div>
              </div>

              {/* Attendance Section (Collapsible) */}
              <div>
                <button
                  onClick={() => setShowAttendanceStats(!showAttendanceStats)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: colors.gray,
                    fontSize: '0.85rem',
                    fontWeight: '500'
                  }}
                >
                  {showAttendanceStats ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  Attendance Analytics
                </button>
                
                {showAttendanceStats && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${colors.gray}30` }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.success }}>{averageAttendance}%</div>
                      <div style={{ fontSize: '0.85rem', color: colors.gray }}>Average Attendance</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.info }}>{uniqueInstructors.length}</div>
                      <div style={{ fontSize: '0.85rem', color: colors.gray }}>Active Instructors</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.warning }}>{totalEnrollments}</div>
                      <div style={{ fontSize: '0.85rem', color: colors.gray }}>Total Enrollments</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Advanced Search and Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: colors.gray
              }} />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  backgroundColor: colors.white
                }}
              />
            </div>

            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              style={{
                padding: '0.75rem',
                border: `2px solid ${colors.lightGray}`,
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                backgroundColor: colors.white
              }}
            >
              <option value="">All Programs</option>
              {programs.map(program => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>

            <select
              value={instructorFilter}
              onChange={(e) => setInstructorFilter(e.target.value)}
              style={{
                padding: '0.75rem',
                border: `2px solid ${colors.lightGray}`,
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                backgroundColor: colors.white
              }}
            >
              <option value="">All Instructors</option>
              {uniqueInstructors.map(instructor => (
                <option key={instructor} value={instructor}>{instructor}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.75rem',
                border: `2px solid ${colors.lightGray}`,
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                backgroundColor: colors.white
              }}
            >
              <option value="">All Status</option>
              {sessionStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchQuery('');
                setProgramFilter('');
                setInstructorFilter('');
                setStatusFilter('');
                setTypeFilter('');
                setDateFilter('');
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

          {/* Additional Filters Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', marginTop: '1rem' }}>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                padding: '0.75rem',
                border: `2px solid ${colors.lightGray}`,
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                backgroundColor: colors.white
              }}
            >
              <option value="">All Types</option>
              {sessionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{
                padding: '0.75rem',
                border: `2px solid ${colors.lightGray}`,
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                backgroundColor: colors.white
              }}
            >
              <option value="">All Dates</option>
              {dateFilters.map(filter => (
                <option key={filter} value={filter}>{filter}</option>
              ))}
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: colors.gray }}>
              Showing {filteredSessions.length} of {totalSessions} sessions
            </div>
          </div>
        </div>

        {/* Sessions Grid/List */}
        {filteredSessions.length === 0 ? (
          <div style={{
            backgroundColor: colors.white,
            borderRadius: '1rem',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <Calendar size={64} style={{ color: colors.gray, margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.dark, marginBottom: '0.5rem' }}>
              {sessions.length === 0 ? 'No sessions scheduled' : 'No sessions match your filters'}
            </h3>
            <p style={{ color: colors.gray, marginBottom: '1.5rem' }}>
              {sessions.length === 0 
                ? 'Create your first session to get started'
                : 'Try adjusting your search terms or filters'
              }
            </p>
            {sessions.length === 0 && (user.role === 'admin' || user.role === 'tutor') && (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={createTestSession}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: colors.secondary,
                    color: colors.dark,
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  🧪 Create Test Session
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
                    color: colors.dark,
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  <Plus size={16} />
                  Schedule First Session
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(420px, 1fr))' : '1fr', 
            gap: '1.5rem' 
          }}>
            {filteredSessions.map((session) => {
              const enrollmentPercentage = getEnrollmentPercentage(session.enrolledStudents || 0, session.maxStudents);
              const attendancePercentage = getAttendancePercentage(session.attendance);
              const isCompleted = session.status === 'Completed';
              const isUpcoming = new Date(session.schedule?.date) > new Date();
              
              return (
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
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 25px ${getSessionTypeColor(session.sessionType)}20`;
                    e.currentTarget.style.borderColor = getSessionTypeColor(session.sessionType);
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = colors.lightGray;
                  }}
                >
                  {/* Enhanced Session Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: colors.dark, margin: 0 }}>
                          {session.title || 'Untitled Session'}
                        </h3>
                        <div style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: `${getStatusColor(session.status)}20`,
                          color: getStatusColor(session.status),
                          borderRadius: '1rem',
                          fontSize: '0.7rem',
                          fontWeight: '600'
                        }}>
                          {session.status || 'Unknown'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <div style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          backgroundColor: `${getSessionTypeColor(session.sessionType)}20`,
                          color: getSessionTypeColor(session.sessionType),
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {session.sessionType || 'Regular Class'}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                          {session.program}
                        </span>
                      </div>
                    </div>

                    {(user.role === 'admin' || user.role === 'tutor') && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleDuplicateSession(session)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: `${colors.info}20`,
                            border: `2px solid ${colors.info}`,
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Duplicate Session"
                        >
                          <Copy size={14} style={{ color: colors.info }} />
                        </button>
                        <button
                          onClick={() => handleEditSession(session)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: `${colors.secondary}20`,
                            border: `2px solid ${colors.secondary}`,
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Edit size={14} style={{ color: colors.secondary }} />
                        </button>
                        <button
                          onClick={() => handleDeleteSession(session._id)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#fee2e2',
                            border: '2px solid #ef4444',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Trash2 size={14} style={{ color: '#ef4444' }} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Enrollment Progress Bar */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: colors.gray, fontWeight: '500' }}>
                        Enrollment: {session.enrolledStudents || 0}/{session.maxStudents} students
                      </span>
                      <span style={{ fontSize: '0.8rem', color: colors.gray, fontWeight: '600' }}>
                        {enrollmentPercentage}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '0.5rem',
                      backgroundColor: colors.lightGray,
                      borderRadius: '0.25rem',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${enrollmentPercentage}%`,
                        height: '100%',
                        backgroundColor: enrollmentPercentage >= 100 ? colors.danger : enrollmentPercentage > 80 ? colors.warning : colors.success,
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>

                  {/* Attendance Progress Bar (for completed sessions) */}
                  {isCompleted && session.attendance && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: colors.gray, fontWeight: '500' }}>
                          Attendance: {session.attendance.present}/{session.attendance.total}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: colors.gray, fontWeight: '600' }}>
                          {attendancePercentage}%
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '0.5rem',
                        backgroundColor: colors.lightGray,
                        borderRadius: '0.25rem',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${attendancePercentage}%`,
                          height: '100%',
                          backgroundColor: attendancePercentage >= 90 ? colors.success : attendancePercentage >= 70 ? colors.warning : colors.danger,
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>
                  )}

                  {/* Session Details */}
                  <div style={{ 
                    backgroundColor: colors.lightGray, 
                    padding: '1rem', 
                    borderRadius: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={14} style={{ color: colors.gray }} />
                        <span style={{ fontSize: '0.8rem', color: colors.dark }}>
                          {session.schedule?.date ? formatDate(session.schedule.date) : 'No date set'}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={14} style={{ color: colors.gray }} />
                        <span style={{ fontSize: '0.8rem', color: colors.dark }}>
                          {session.schedule?.startTime ? 
                            `${formatTime(session.schedule.startTime)} - ${formatTime(session.schedule.endTime)}` : 
                            'No time set'
                          }
                        </span>
                      </div>
                      
                      {session.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <MapPin size={14} style={{ color: colors.gray }} />
                          <span style={{ fontSize: '0.8rem', color: colors.dark }}>
                            {session.location}
                          </span>
                        </div>
                      )}
                      
                      {session.instructor && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <User size={14} style={{ color: colors.gray }} />
                          <span style={{ fontSize: '0.8rem', color: colors.dark }}>
                            {session.instructor}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {session.schedule?.duration && (
                      <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: `1px solid ${colors.gray}30` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Timer size={14} style={{ color: colors.gray }} />
                          <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                            Duration: {session.schedule.duration} minutes
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Session Description */}
                  {session.description && (
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: colors.gray, 
                      marginBottom: '1rem',
                      lineHeight: '1.4'
                    }}>
                      {session.description.length > 100 
                        ? `${session.description.substring(0, 100)}...` 
                        : session.description
                      }
                    </p>
                  )}

                  {/* Quick Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => {/* View session details */}}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        backgroundColor: `${colors.info}10`,
                        color: colors.info,
                        border: `1px solid ${colors.info}30`,
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Eye size={12} />
                      Details
                    </button>
                    
                    {(user.role === 'admin' || user.role === 'tutor') && (
                      <>
                        {session.status === 'Scheduled' && !isCompleted && (
                          <button
                            onClick={() => handleMarkAttendance(session)}
                            style={{
                              flex: 1,
                              padding: '0.5rem',
                              backgroundColor: `${colors.success}10`,
                              color: colors.success,
                              border: `1px solid ${colors.success}30`,
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.25rem'
                            }}
                          >
                            <UserCheck size={12} />
                            Attendance
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleEditSession(session)}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            backgroundColor: `${colors.primary}10`,
                            color: colors.primary,
                            border: `1px solid ${colors.primary}30`,
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <Edit size={12} />
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Session Form Modal */}
        {showForm && (
          <SessionForm
            session={editingSession}
            onClose={() => {
              setShowForm(false);
              setEditingSession(null);
            }}
            onSessionSaved={handleSessionSaved}
          />
        )}
      </div>
    </div>
  );
};

export default SessionList;