import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentsAPI, programsAPI, sessionsAPI, resourcesAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  Package, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  Edit,
  Eye,
  DollarSign,
  Clock,
  Award,
  Target,
  RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalPrograms: 6, // Coding, Robotics, Chess, Reading, French, Entrepreneurship
    totalSessions: 0,
    totalRevenue: 0,
    todaysSessions: 3,
    weeklyRevenue: 125000,
    studentsToday: 15,
    bootcampRevenue: 485000, // 97 students × KSh 5,000
    upcomingSessions: []
  });
  const [loading, setLoading] = useState(true);

  const colors = {
    primary: '#c55c5c',
    secondary: '#f4c842',
    dark: '#1e1e3c',
    white: '#ffffff',
    gray: '#6b7280',
    lightGray: '#f3f4f6'
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [studentsRes, sessionsRes] = await Promise.all([
        studentsAPI.getAll().catch(() => ({ students: [] })),
        sessionsAPI.getAll().catch(() => ({ sessions: [] }))
      ]);

      const students = studentsRes.students || studentsRes.data?.students || [];
      const sessions = sessionsRes.sessions || sessionsRes.data?.sessions || [];

      setStats(prev => ({
        ...prev,
        totalStudents: students.length,
        totalSessions: sessions.length,
        totalRevenue: students.length * 3500, // Average fee per student
        upcomingSessions: sessions.slice(0, 3)
      }));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const programs = [
    { name: 'Coding', students: 24, icon: '💻', color: '#3b82f6' },
    { name: 'Robotics', students: 18, icon: '🤖', color: '#8b5cf6' },
    { name: 'Chess', students: 32, icon: '♟️', color: '#10b981' },
    { name: 'Reading', students: 28, icon: '📚', color: '#f59e0b' },
    { name: 'French Classes', students: 35, icon: '🇫🇷', color: '#ef4444' },
    { name: 'Entrepreneurship', students: 15, icon: '💡', color: '#06b6d4' }
  ];

  const platforms = [
    { name: 'Scholastic Learning Zone', active: true, icon: '📖' },
    { name: 'EducationCity', active: true, icon: '🏛️' },
    { name: 'PurpleMash', active: true, icon: '🟣' },
    { name: 'Rising Stars Assessments', active: true, icon: '⭐' }
  ];

  const todaysSchedule = [
    { time: '9:00 AM', program: 'French A1 - Beginners', students: 8, room: 'Main Classroom' },
    { time: '11:00 AM', program: 'Coding - Scratch', students: 12, room: 'Computer Lab' },
    { time: '1:30 PM', program: 'Chess - Intermediate', students: 10, room: 'Activity Room' },
    { time: '3:00 PM', program: 'Robotics Workshop', students: 6, room: 'STEM Lab' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{
          animation: 'spin 1s linear infinite',
          borderRadius: '50%',
          height: '3rem',
          width: '3rem',
          border: `2px solid ${colors.lightGray}`,
          borderBottom: `2px solid ${colors.primary}`
        }}></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: colors.lightGray, minHeight: '100vh' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* Welcome Header */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.secondary}, #f39c12)`,
          borderRadius: '1.5rem',
          padding: '2rem',
          marginBottom: '2rem',
          color: colors.dark,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Welcome Back, {user?.name}! 👋
            </h1>
            <p style={{ fontSize: '1.125rem', opacity: 0.8 }}>
              Here's what's happening at Class Measures Hub today
            </p>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
              <div>
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.studentsToday}</span>
                <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>Students Today</p>
              </div>
              <div>
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.todaysSessions}</span>
                <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>Sessions Today</p>
              </div>
              <div>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>KSh {stats.bootcampRevenue.toLocaleString()}</span>
                <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>August Bootcamp Potential</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Bootcamp Banner */}
        <div style={{
          background: `linear-gradient(135deg, #8b5cf6, #7c3aed)`,
          borderRadius: '1.5rem',
          padding: '2rem',
          marginBottom: '2rem',
          color: colors.white,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '3rem' }}>🏕️</div>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  August Boot Camp 2025
                </h2>
                <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>
                  Chess • Coding • Robotics | 4th-15th August
                </p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>KSh 5,000</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Registration Fee</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>12 Days</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Intensive Training</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Kimuchu Complex</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>4th Floor, RM D2</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>0729 875 998</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Registration Contact</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{
          backgroundColor: colors.white,
          borderRadius: '1.5rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.dark, marginBottom: '1.5rem' }}>
            🚀 Quick Actions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { icon: Users, label: 'Add Student', path: '/students', color: colors.primary },
              { icon: Calendar, label: 'Create Session', path: '/sessions', color: colors.secondary },
              { icon: BookOpen, label: 'Add Program', path: '/programs', color: colors.dark },
              { icon: Package, label: 'Add Resource', path: '/resources', color: '#10b981' }
            ].map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Link
                  key={index}
                  to={action.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: `${action.color}10`,
                    border: `2px solid ${action.color}20`,
                    borderRadius: '1rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 25px ${action.color}20`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '0.75rem',
                    backgroundColor: action.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComponent size={20} style={{ color: colors.white }} />
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.dark }}>
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Stats Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Total Students */}
          <div style={{
            background: `linear-gradient(135deg, ${colors.primary}, #dc2626)`,
            borderRadius: '1.5rem',
            padding: '2rem',
            color: colors.white,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '120px',
              height: '120px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%'
            }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Users size={32} />
                <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>Total Count</span>
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {stats.totalStudents}
              </div>
              <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                Active Students
              </div>
            </div>
          </div>

          {/* Programs */}
          <div style={{
            background: `linear-gradient(135deg, ${colors.secondary}, #f39c12)`,
            borderRadius: '1.5rem',
            padding: '2rem',
            color: colors.dark,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '120px',
              height: '120px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%'
            }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <BookOpen size={32} />
                <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>Running</span>
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {stats.totalPrograms}
              </div>
              <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                Active Programs
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div style={{
            background: `linear-gradient(135deg, ${colors.dark}, #4c1d95)`,
            borderRadius: '1.5rem',
            padding: '2rem',
            color: colors.white,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '120px',
              height: '120px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%'
            }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <DollarSign size={32} />
                <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>Monthly</span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                KSh {stats.totalRevenue.toLocaleString()}
              </div>
              <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                Total Revenue
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule & Program Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          
          {/* Today's Schedule */}
          <div style={{
            backgroundColor: colors.white,
            borderRadius: '1.5rem',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.dark }}>
                📅 Today's Schedule
              </h3>
              <Clock size={20} style={{ color: colors.gray }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {todaysSchedule.map((session, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: colors.lightGray,
                  borderRadius: '0.75rem',
                  border: `2px solid ${colors.primary}10`
                }}>
                  <div style={{
                    width: '4rem',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: colors.primary
                  }}>
                    {session.time}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.dark }}>
                      {session.program}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: colors.gray }}>
                      {session.students} students • {session.room}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div style={{
            backgroundColor: colors.white,
            borderRadius: '1.5rem',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.dark }}>
                🎪 Upcoming Events
              </h3>
              <Target size={20} style={{ color: colors.gray }} />
            </div>
            
            <div style={{
              background: `linear-gradient(135deg, #8b5cf6, #7c3aed)`,
              borderRadius: '1rem',
              padding: '1.5rem',
              color: colors.white,
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>🏕️</div>
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>August Boot Camp</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>4th - 15th August 2025</div>
                </div>
              </div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '1rem' }}>
                🎯 Activities: Chess, Coding, Robotics
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>KSh 5,000</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Registration Fee</div>
                </div>
                <div style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  REGISTER NOW
                </div>
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${colors.secondary}15, ${colors.primary}15)`,
              borderRadius: '1rem',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.dark }}>
                📞 Contact for Registration
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: colors.primary }}>
                0729 875 998
              </div>
            </div>
          </div>
        </div>

        {/* Program Overview */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            backgroundColor: colors.white,
            borderRadius: '1.5rem',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.dark }}>
                🎓 Program Enrollment Overview
              </h3>
              <Award size={20} style={{ color: colors.gray }} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {programs.map((program, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.5rem',
                  backgroundColor: colors.lightGray,
                  borderRadius: '1rem',
                  border: `2px solid ${program.color}20`
                }}>
                  <div style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: '1rem',
                    backgroundColor: program.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    {program.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: colors.dark, marginBottom: '0.25rem' }}>
                      {program.name}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: colors.gray }}>
                      {program.students} students enrolled
                    </div>
                  </div>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: program.color
                  }}>
                    {program.students}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platforms & Business Hours */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* Learning Platforms */}
          <div style={{
            backgroundColor: colors.white,
            borderRadius: '1.5rem',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.dark, marginBottom: '1.5rem' }}>
              🌐 Learning Platforms
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {platforms.map((platform, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem',
                  backgroundColor: colors.lightGray,
                  borderRadius: '0.5rem'
                }}>
                  <span style={{ fontSize: '1.125rem' }}>{platform.icon}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.dark, flex: 1 }}>
                    {platform.name}
                  </span>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: platform.active ? '#10b981' : '#ef4444'
                  }}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Business Info */}
          <div style={{
            backgroundColor: colors.white,
            borderRadius: '1.5rem',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.dark, marginBottom: '1.5rem' }}>
              🏢 Business Information
            </h3>
            
            <div style={{ 
              background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`,
              padding: '1.5rem',
              borderRadius: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>🏫</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: colors.dark, marginBottom: '0.5rem', textAlign: 'center' }}>
                Class Measures Hub
              </div>
              <div style={{ fontSize: '1rem', color: colors.gray, marginBottom: '0.5rem', textAlign: 'center' }}>
                📍 Kimuchu Complex, 4th Floor RM D2
              </div>
              <div style={{ fontSize: '1rem', color: colors.gray, marginBottom: '1rem', textAlign: 'center' }}>
                📞 0729 875 998
              </div>
            </div>

            <div style={{ 
              background: `linear-gradient(135deg, ${colors.secondary}15, ${colors.primary}15)`,
              padding: '1rem',
              borderRadius: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: colors.dark, marginBottom: '0.5rem' }}>
                Operating Hours
              </div>
              <div style={{ fontSize: '0.875rem', color: colors.gray }}>
                Monday - Saturday: 9:00 AM - 3:30 PM
              </div>
              <div style={{ fontSize: '0.75rem', color: colors.primary, fontWeight: '600', marginTop: '0.5rem' }}>
                After School Programs • Saturday Classes • Bootcamps
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;