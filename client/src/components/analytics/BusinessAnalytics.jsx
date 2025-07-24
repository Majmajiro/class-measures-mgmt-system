import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentsAPI, programsAPI, resourcesAPI, sessionsAPI } from '../../services/api';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  BookOpen,
  Target,
  Award,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

const BusinessAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalStudents: 0,
      totalPrograms: 0,
      totalSessions: 0,
      totalRevenue: 0
    },
    students: {
      byAge: [],
      byProgram: [],
      enrollmentTrend: []
    },
    programs: {
      popularity: [],
      revenue: []
    },
    resources: {
      inventory: [],
      lowStock: []
    },
    sessions: {
      attendance: [],
      completion: []
    }
  });
  const [loading, setLoading] = useState(true);
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
    if (user.role === 'admin') {
      loadAnalytics();
    }
  }, [user.role]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [studentsRes, programsRes, resourcesRes, sessionsRes] = await Promise.all([
        studentsAPI.getAll(),
        programsAPI.getAll(),
        resourcesAPI.getAnalytics(),
        sessionsAPI.getAll()
      ]);

      // Process students data
      const students = studentsRes.students || studentsRes.data?.students || [];
      const programs = programsRes.programs || programsRes.data?.programs || [];
      const sessions = sessionsRes.sessions || sessionsRes.data?.sessions || [];
      const resourceAnalytics = resourcesRes.summary || resourcesRes.data?.summary || {};

      // Calculate overview metrics
      const totalRevenue = programs.reduce((sum, program) => sum + (program.price * (program.enrolledStudents?.length || 0)), 0);

      // Age distribution
      const ageGroups = students.reduce((acc, student) => {
        const ageGroup = student.age <= 10 ? 'Young (≤10)' : 
                        student.age <= 14 ? 'Middle (11-14)' : 'Teen (15+)';
        acc[ageGroup] = (acc[ageGroup] || 0) + 1;
        return acc;
      }, {});

      // Program popularity
      const programPopularity = programs.map(program => ({
        name: program.name,
        students: program.enrolledStudents?.length || 0,
        revenue: program.price * (program.enrolledStudents?.length || 0)
      }));

      setAnalytics({
        overview: {
          totalStudents: students.length,
          totalPrograms: programs.length,
          totalSessions: sessions.length,
          totalRevenue
        },
        students: {
          byAge: Object.entries(ageGroups).map(([age, count]) => ({ age, count })),
          byProgram: programPopularity,
          enrollmentTrend: [] // Would need historical data
        },
        programs: {
          popularity: programPopularity.sort((a, b) => b.students - a.students),
          revenue: programPopularity.sort((a, b) => b.revenue - a.revenue)
        },
        resources: {
          inventory: resourceAnalytics.typeBreakdown || [],
          lowStock: resourceAnalytics.lowStockItems || []
        },
        sessions: {
          attendance: [], // Would need attendance data
          completion: [] // Would need completion data
        }
      });

    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user.role !== 'admin') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <AlertTriangle size={48} style={{ color: colors.gray, margin: '0 auto 1rem' }} />
        <h2 style={{ color: colors.dark, marginBottom: '0.5rem' }}>Access Restricted</h2>
        <p style={{ color: colors.gray }}>Analytics are only available to administrators.</p>
      </div>
    );
  }

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
              📊 Business Analytics
            </h1>
            <p style={{ color: colors.gray, fontSize: '1rem' }}>
              Comprehensive insights into your Class Measures business performance
            </p>
          </div>
          
          <button
            onClick={loadAnalytics}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: colors.primary,
              color: colors.white,
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            <RefreshCw size={16} />
            Refresh Data
          </button>
        </div>

        {/* Overview Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '0.75rem',
                backgroundColor: `${colors.primary}15`,
                border: `2px solid ${colors.primary}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={20} style={{ color: colors.primary }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: colors.dark, marginBottom: '0.25rem' }}>
                  Total Students
                </h3>
                <p style={{ fontSize: '0.875rem', color: colors.gray }}>
                  Active enrollments
                </p>
              </div>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: colors.primary }}>
              {analytics.overview.totalStudents}
            </div>
          </div>

          <div style={{
            backgroundColor: colors.white,
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: `2px solid ${colors.secondary}20`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '0.75rem',
                backgroundColor: `${colors.secondary}15`,
                border: `2px solid ${colors.secondary}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BookOpen size={20} style={{ color: colors.secondary }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: colors.dark, marginBottom: '0.25rem' }}>
                  Active Programs
                </h3>
                <p style={{ fontSize: '0.875rem', color: colors.gray }}>
                  Running courses
                </p>
              </div>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: colors.secondary }}>
              {analytics.overview.totalPrograms}
            </div>
          </div>

          <div style={{
            backgroundColor: colors.white,
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: `2px solid #10b98120`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '0.75rem',
                backgroundColor: '#10b98115',
                border: '2px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Calendar size={20} style={{ color: '#10b981' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: colors.dark, marginBottom: '0.25rem' }}>
                  Total Sessions
                </h3>
                <p style={{ fontSize: '0.875rem', color: colors.gray }}>
                  Scheduled classes
                </p>
              </div>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>
              {analytics.overview.totalSessions}
            </div>
          </div>

          <div style={{
            backgroundColor: colors.white,
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: `2px solid ${colors.dark}20`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '0.75rem',
                backgroundColor: `${colors.dark}15`,
                border: `2px solid ${colors.dark}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DollarSign size={20} style={{ color: colors.dark }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: colors.dark, marginBottom: '0.25rem' }}>
                  Total Revenue
                </h3>
                <p style={{ fontSize: '0.875rem', color: colors.gray }}>
                  From enrollments
                </p>
              </div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.dark }}>
              KSh {analytics.overview.totalRevenue.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Charts and Detailed Analytics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* Student Age Distribution */}
          <div style={{
            backgroundColor: colors.white,
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.dark, marginBottom: '1rem' }}>
              👥 Student Age Distribution
            </h3>
            {analytics.students.byAge.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {analytics.students.byAge.map((group, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ minWidth: '100px', fontSize: '0.875rem', color: colors.dark }}>
                      {group.age}
                    </div>
                    <div style={{ flex: 1, backgroundColor: colors.lightGray, borderRadius: '0.5rem', height: '1.5rem', position: 'relative' }}>
                      <div style={{
                        width: `${(group.count / Math.max(...analytics.students.byAge.map(g => g.count))) * 100}%`,
                        height: '100%',
                        backgroundColor: colors.primary,
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.white,
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {group.count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: colors.gray, textAlign: 'center', padding: '2rem' }}>
                No student data available
              </p>
            )}
          </div>

          {/* Program Popularity */}
          <div style={{
            backgroundColor: colors.white,
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.dark, marginBottom: '1rem' }}>
              🎓 Program Popularity
            </h3>
            {analytics.programs.popularity.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {analytics.programs.popularity.slice(0, 5).map((program, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ minWidth: '80px', fontSize: '0.875rem', color: colors.dark }}>
                      {program.name}
                    </div>
                    <div style={{ flex: 1, backgroundColor: colors.lightGray, borderRadius: '0.5rem', height: '1.5rem', position: 'relative' }}>
                      <div style={{
                        width: `${(program.students / Math.max(...analytics.programs.popularity.map(p => p.students))) * 100}%`,
                        height: '100%',
                        backgroundColor: colors.secondary,
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.dark,
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {program.students}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: colors.gray, textAlign: 'center', padding: '2rem' }}>
                No program data available
              </p>
            )}
          </div>
        </div>

        {/* Resource Inventory Status */}
        <div style={{
          backgroundColor: colors.white,
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.dark, marginBottom: '1rem' }}>
            📚 Resource Inventory Overview
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {analytics.resources.inventory.length > 0 ? (
              analytics.resources.inventory.map((item, index) => (
                <div key={index} style={{
                  padding: '1rem',
                  backgroundColor: colors.lightGray,
                  borderRadius: '0.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.primary, marginBottom: '0.5rem' }}>
                    {item.count || 0}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: colors.dark }}>
                    {item.type || item._id}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                <BookOpen size={48} style={{ color: colors.gray, margin: '0 auto 1rem' }} />
                <p style={{ color: colors.gray }}>No resource data available</p>
              </div>
            )}
          </div>

          {/* Low Stock Alert */}
          {analytics.resources.lowStock.length > 0 && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', border: '2px solid #f59e0b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <AlertTriangle size={20} style={{ color: '#f59e0b' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#92400e' }}>
                  Low Stock Alert
                </h4>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#92400e' }}>
                {analytics.resources.lowStock.length} items need restocking
              </p>
            </div>
          )}
        </div>

        {/* Performance Summary */}
        <div style={{
          backgroundColor: colors.white,
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          textAlign: 'center'
        }}>
          <Award size={48} style={{ color: colors.primary, margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.dark, marginBottom: '1rem' }}>
            🎉 Class Measures Business Performance
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.primary }}>
                {analytics.overview.totalStudents}
              </div>
              <div style={{ fontSize: '0.875rem', color: colors.gray }}>Happy Students</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.secondary }}>
                {analytics.overview.totalPrograms}
              </div>
              <div style={{ fontSize: '0.875rem', color: colors.gray }}>Quality Programs</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                {analytics.overview.totalSessions}
              </div>
              <div style={{ fontSize: '0.875rem', color: colors.gray }}>Learning Sessions</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.dark }}>
                KSh {analytics.overview.totalRevenue.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: colors.gray }}>Revenue Generated</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessAnalytics;