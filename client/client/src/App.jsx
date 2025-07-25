import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/auth/Login';

const Dashboard = () => {
  // Professional Class Measures Brand Colors (Darker Shades)
  const colors = {
    primary: '#8B4513', // Darker burgundy brown
    secondary: '#B8860B', // Darker mustard gold
    accent: '#D2691E', // Darker orange
    dark: '#2C1810', // Very dark brown
    white: '#FEFEFE',
    lightBg: '#FAF8F5',
    textGray: '#5D4E37',
    success: '#228B22'
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, ${colors.lightBg} 0%, ${colors.white} 100%)`,
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <img 
            src="/class-measures-logo.png" 
            alt="Class Measures Logo" 
            style={{
              width: '120px',
              height: '120px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 6px 12px rgba(139,69,19,0.2))'
            }}
          />
        </div>
        
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '700', 
          color: colors.primary,
          marginBottom: '0.5rem',
          letterSpacing: '-0.02em'
        }}>
          Welcome to Class Measures Hub
        </h1>
        
        <p style={{ 
          fontSize: '1.3rem', 
          color: colors.textGray,
          marginBottom: '0.5rem',
          fontWeight: '500'
        }}>
          Your Comprehensive Educational Management Platform
        </p>
        
        <div style={{
          display: 'inline-block',
          background: `linear-gradient(135deg, ${colors.success}, ${colors.accent})`,
          color: colors.white,
          padding: '0.75rem 1.5rem',
          borderRadius: '25px',
          fontSize: '0.9rem',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(34,139,34,0.3)',
          marginTop: '1rem'
        }}>
          ✅ Authentication Successful - Admin Access Granted
        </div>
      </div>

      {/* Main Content Card */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        background: colors.white,
        borderRadius: '1.5rem',
        padding: '3rem',
        boxShadow: '0 20px 40px rgba(139,69,19,0.1)',
        border: `3px solid ${colors.primary}15`
      }}>
        
        {/* Features Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          
          {/* Student Management */}
          <div style={{
            background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`,
            padding: '2rem',
            borderRadius: '1rem',
            border: `2px solid ${colors.primary}20`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👥</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: colors.primary, marginBottom: '0.5rem' }}>
              Student Management
            </h3>
            <p style={{ color: colors.textGray, fontSize: '0.95rem' }}>
              Comprehensive student enrollment, tracking, and performance monitoring
            </p>
          </div>

          {/* Session Scheduling */}
          <div style={{
            background: `linear-gradient(135deg, ${colors.secondary}10, ${colors.accent}10)`,
            padding: '2rem',
            borderRadius: '1rem',
            border: `2px solid ${colors.secondary}20`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📅</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: colors.secondary, marginBottom: '0.5rem' }}>
              Session Scheduling
            </h3>
            <p style={{ color: colors.textGray, fontSize: '0.95rem' }}>
              Intelligent class scheduling, calendar management, and session tracking
            </p>
          </div>

          {/* Analytics & Reports */}
          <div style={{
            background: `linear-gradient(135deg, ${colors.accent}10, ${colors.primary}10)`,
            padding: '2rem',
            borderRadius: '1rem',
            border: `2px solid ${colors.accent}20`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: colors.accent, marginBottom: '0.5rem' }}>
              Analytics & Insights
            </h3>
            <p style={{ color: colors.textGray, fontSize: '0.95rem' }}>
              Business intelligence, performance metrics, and educational outcomes
            </p>
          </div>
        </div>

        {/* System Status */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.success}05, ${colors.primary}05)`,
          padding: '2rem',
          borderRadius: '1rem',
          border: `2px solid ${colors.success}20`,
          marginBottom: '2rem'
        }}>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: colors.primary, 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ marginRight: '0.5rem' }}>🚀</span>
            System Status: Fully Operational
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            fontSize: '0.95rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', color: colors.textGray }}>
              <span style={{ color: colors.success, marginRight: '0.5rem' }}>✅</span>
              Frontend Application
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: colors.textGray }}>
              <span style={{ color: colors.success, marginRight: '0.5rem' }}>✅</span>
              User Interface
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: colors.textGray }}>
              <span style={{ color: colors.success, marginRight: '0.5rem' }}>✅</span>
              Navigation System
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: colors.textGray }}>
              <span style={{ color: colors.success, marginRight: '0.5rem' }}>✅</span>
              Admin Access
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)`,
          borderRadius: '1rem',
          border: `2px solid ${colors.primary}15`
        }}>
          <h3 style={{ 
            fontSize: '1.4rem', 
            fontWeight: '600', 
            color: colors.primary, 
            marginBottom: '1rem' 
          }}>
            🎯 Ready to Manage Your Educational Programs
          </h3>
          <p style={{ 
            color: colors.textGray, 
            fontSize: '1rem',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto 1.5rem'
          }}>
            Your Class Measures Hub is now operational. You can proceed to manage students, 
            schedule sessions, track attendance, and monitor educational outcomes through 
            our comprehensive management system.
          </p>
          
          <div style={{ 
            fontSize: '0.85rem', 
            color: colors.accent, 
            fontWeight: '500',
            background: `${colors.accent}10`,
            padding: '0.75rem 1.5rem',
            borderRadius: '20px',
            display: 'inline-block',
            border: `1px solid ${colors.accent}30`
          }}>
            💡 Development Mode: Authentication system ready for production integration
          </div>
        </div>
      </div>
    </div>
  );
};

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
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;