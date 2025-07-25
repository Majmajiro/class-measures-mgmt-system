import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/auth/Login';
import StudentListSimple from './components/students/StudentListSimple';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const colors = {
    primary: '#8B4513',
    secondary: '#B8860B', 
    accent: '#D2691E',
    dark: '#2C1810',
    white: '#FEFEFE',
    lightBg: '#FAF8F5',
    textGray: '#5D4E37',
    success: '#228B22'
  };

  // Sample data for stats and enrollment
  const stats = {
    totalStudents: 47,
    totalPrograms: 5,
    activeSessions: 12,
    totalRevenue: 'KSh 45,000',
    enrollmentData: [
      { program: 'Chess', enrolled: 32, capacity: 40, color: colors.primary },
      { program: 'Coding', enrolled: 24, capacity: 30, color: colors.secondary },
      { program: 'Robotics', enrolled: 18, capacity: 25, color: colors.accent },
      { program: 'French Classes', enrolled: 15, capacity: 20, color: colors.success },
      { program: 'Entrepreneurship', enrolled: 12, capacity: 15, color: colors.dark }
    ]
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, ${colors.lightBg} 0%, ${colors.white} 100%)`,
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem' }}>
          <img 
            src="/class-measures-logo.png" 
            alt="Class Measures Logo" 
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 6px 12px rgba(139,69,19,0.2))'
            }}
          />
        </div>
        
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          color: colors.primary,
          marginBottom: '0.5rem',
          letterSpacing: '-0.02em'
        }}>
          Class Measures Hub Dashboard
        </h1>
        
        <p style={{ 
          fontSize: '1.1rem', 
          color: colors.textGray,
          marginBottom: '0.5rem',
          fontWeight: '500'
        }}>
          Educational Management Overview
        </p>
        
        <div style={{
          display: 'inline-block',
          background: `linear-gradient(135deg, ${colors.success}, ${colors.accent})`,
          color: colors.white,
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: '600',
          boxShadow: '0 3px 8px rgba(34,139,34,0.3)'
        }}>
          ✅ Admin Access
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          
          <div style={{
            background: colors.white,
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 12px rgba(139,69,19,0.1)',
            border: `3px solid ${colors.primary}20`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
            <h3 style={{ fontSize: '2rem', fontWeight: '700', color: colors.primary, marginBottom: '0.25rem' }}>
              {stats.totalStudents}
            </h3>
            <p style={{ color: colors.textGray, fontSize: '0.9rem', fontWeight: '500' }}>Total Students</p>
          </div>

          <div style={{
            background: colors.white,
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 12px rgba(184,134,11,0.1)',
            border: `3px solid ${colors.secondary}20`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎓</div>
            <h3 style={{ fontSize: '2rem', fontWeight: '700', color: colors.secondary, marginBottom: '0.25rem' }}>
              {stats.totalPrograms}
            </h3>
            <p style={{ color: colors.textGray, fontSize: '0.9rem', fontWeight: '500' }}>Active Programs</p>
          </div>

          <div style={{
            background: colors.white,
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 12px rgba(210,105,30,0.1)',
            border: `3px solid ${colors.accent}20`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
            <h3 style={{ fontSize: '2rem', fontWeight: '700', color: colors.accent, marginBottom: '0.25rem' }}>
              {stats.activeSessions}
            </h3>
            <p style={{ color: colors.textGray, fontSize: '0.9rem', fontWeight: '500' }}>Active Sessions</p>
          </div>

          <div style={{
            background: colors.white,
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 12px rgba(34,139,34,0.1)',
            border: `3px solid ${colors.success}20`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.success, marginBottom: '0.25rem' }}>
              {stats.totalRevenue}
            </h3>
            <p style={{ color: colors.textGray, fontSize: '0.9rem', fontWeight: '500' }}>Total Revenue</p>
          </div>
        </div>

        {/* Program Enrollment Overview */}
        <div style={{
          background: colors.white,
          borderRadius: '1.5rem',
          padding: '2.5rem',
          marginBottom: '3rem',
          boxShadow: '0 8px 20px rgba(139,69,19,0.1)',
          border: `3px solid ${colors.primary}15`
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: colors.primary, 
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '0.5rem' }}>📊</span>
            Program Enrollment Status
          </h2>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {stats.enrollmentData.map((program, index) => {
              const percentage = Math.round((program.enrolled / program.capacity) * 100);
              return (
                <div key={index} style={{
                  padding: '1.5rem',
                  background: `${program.color}05`,
                  borderRadius: '0.75rem',
                  border: `2px solid ${program.color}20`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: program.color }}>
                      {program.program}
                    </h3>
                    <span style={{ 
                      fontSize: '0.9rem', 
                      fontWeight: '600', 
                      color: colors.textGray 
                    }}>
                      {program.enrolled}/{program.capacity} students ({percentage}%)
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div style={{
                    width: '100%',
                    height: '12px',
                    background: `${program.color}15`,
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${program.color}, ${program.color}dd)`,
                      borderRadius: '6px',
                      transition: 'width 0.5s ease'
                    }}></div>
                  </div>
                  
                  <div style={{ 
                    marginTop: '0.5rem', 
                    fontSize: '0.8rem', 
                    color: colors.textGray 
                  }}>
                    {program.capacity - program.enrolled} spots available
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: colors.white,
          borderRadius: '1.5rem',
          padding: '2.5rem',
          boxShadow: '0 8px 20px rgba(139,69,19,0.1)',
          border: `3px solid ${colors.primary}15`
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: colors.primary, 
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            🚀 Management Modules
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem'
          }}>
            
            {/* Student Management */}
            <div 
              onClick={() => navigate('/students')}
              style={{
                background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`,
                padding: '1.8rem',
                borderRadius: '1rem',
                border: `2px solid ${colors.primary}20`,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(139,69,19,0.15)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>👥</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: colors.primary, marginBottom: '0.5rem' }}>
                Student Management
              </h3>
              <p style={{ color: colors.textGray, fontSize: '0.85rem' }}>
                Full CRUD Operations ✅
              </p>
            </div>

            {/* Program Management */}
            <div 
              onClick={() => navigate('/programs')}
              style={{
                background: `linear-gradient(135deg, ${colors.secondary}10, ${colors.accent}10)`,
                padding: '1.8rem',
                borderRadius: '1rem',
                border: `2px solid ${colors.secondary}20`,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(184,134,11,0.15)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>🎓</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: colors.secondary, marginBottom: '0.5rem' }}>
                Program Management
              </h3>
              <p style={{ color: colors.textGray, fontSize: '0.85rem' }}>
                Coming Next! 🚧
              </p>
            </div>

            {/* Session Management */}
            <div 
              onClick={() => navigate('/sessions')}
              style={{
                background: `linear-gradient(135deg, ${colors.accent}10, ${colors.success}10)`,
                padding: '1.8rem',
                borderRadius: '1rem',
                border: `2px solid ${colors.accent}20`,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(210,105,30,0.15)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>📅</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: colors.accent, marginBottom: '0.5rem' }}>
                Session Management
              </h3>
              <p style={{ color: colors.textGray, fontSize: '0.85rem' }}>
                Coming Next! 🚧
              </p>
            </div>

            {/* Resource Management */}
            <div 
              onClick={() => navigate('/resources')}
              style={{
                background: `linear-gradient(135deg, ${colors.success}10, ${colors.primary}10)`,
                padding: '1.8rem',
                borderRadius: '1rem',
                border: `2px solid ${colors.success}20`,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(34,139,34,0.15)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>📚</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: colors.success, marginBottom: '0.5rem' }}>
                Resource Management
              </h3>
              <p style={{ color: colors.textGray, fontSize: '0.85rem' }}>
                Coming Next! 🚧
              </p>
            </div>

            {/* Analytics */}
            <div 
              onClick={() => navigate('/analytics')}
              style={{
                background: `linear-gradient(135deg, ${colors.dark}15, ${colors.primary}10)`,
                padding: '1.8rem',
                borderRadius: '1rem',
                border: `2px solid ${colors.dark}20`,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(44,24,16,0.15)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>📊</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: colors.dark, marginBottom: '0.5rem' }}>
                Analytics & Insights
              </h3>
              <p style={{ color: colors.textGray, fontSize: '0.85rem' }}>
                Coming Next! 🚧
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder pages for now
import ProgramListSimple from "./components/programs/ProgramListSimple";

const ProgramsPage = ProgramListSimple;
const SessionsPage = () => <div style={{padding: '2rem', textAlign: 'center'}}><h1>Session Management CRUD - Coming Next!</h1><a href="/dashboard">← Back to Dashboard</a></div>;
const ResourcesPage = () => <div style={{padding: '2rem', textAlign: 'center'}}><h1>Resource Management CRUD - Coming Next!</h1><a href="/dashboard">← Back to Dashboard</a></div>;
const AnalyticsPage = () => <div style={{padding: '2rem', textAlign: 'center'}}><h1>Analytics & Insights - Coming Next!</h1><a href="/dashboard">← Back to Dashboard</a></div>;

function App() {
  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#FEFEFE',
            color: '#2C1810',
            border: '2px solid #8B4513',
            borderRadius: '0.75rem',
            fontWeight: '500'
          },
          success: {
            iconTheme: {
              primary: '#228B22',
              secondary: '#FEFEFE'
            }
          }
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<StudentListSimple />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
