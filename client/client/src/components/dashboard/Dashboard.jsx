import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import TutorDashboard from './TutorDashboard';
import ParentDashboard from './ParentDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  // Updated colors to match your logo
  const colors = {
    primary: '#c55c5c',      // Logo red
    secondary: '#f4c842',    // Logo gold/yellow  
    dark: '#1e1e3c',         // Logo navy
    white: '#ffffff',
    gray: '#6b7280',
    lightGray: '#f3f4f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6'
  };

  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: colors.lightGray 
      }}>
        <div style={{ textAlign: 'center' }}>
          {/* Loading with your logo design */}
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 2rem',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: `conic-gradient(from 0deg, ${colors.primary} 0deg 180deg, ${colors.secondary} 180deg 360deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              animation: 'spin 2s linear infinite'
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                background: colors.dark,
                borderRadius: '0 50% 50% 50%',
                transform: 'rotate(45deg)',
                position: 'absolute',
                right: '15px'
              }}></div>
              <div style={{
                width: '20px',
                height: '20px',
                background: colors.white,
                borderRadius: '50%',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                color: colors.dark
              }}>
                CM
              </div>
            </div>
          </div>
          
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: colors.dark, 
            marginBottom: '0.5rem'
          }}>
            Class Measures Hub
          </h2>
          <p style={{ color: colors.gray }}>Loading your dashboard...</p>
          <p style={{ 
            color: colors.gray, 
            fontSize: '0.85rem', 
            marginTop: '0.5rem',
            fontStyle: 'italic'
          }}>
            Preparing your 21st-century education platform
          </p>
        </div>
      </div>
    );
  }

  const renderDashboardContent = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'tutor':
        return <TutorDashboard />;
      case 'parent':
        return <ParentDashboard />;
      default:
        return (
          <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: colors.lightGray 
          }}>
            <div style={{ 
              textAlign: 'center',
              backgroundColor: colors.white,
              padding: '3rem',
              borderRadius: '1rem',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              border: `3px solid ${colors.danger}20`
            }}>
              {/* Logo for error state */}
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 1.5rem',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: `conic-gradient(from 0deg, ${colors.gray} 0deg 180deg, ${colors.lightGray} 180deg 360deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    background: colors.dark,
                    borderRadius: '0 50% 50% 50%',
                    transform: 'rotate(45deg)',
                    position: 'absolute',
                    right: '15px'
                  }}></div>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    background: colors.white,
                    borderRadius: '50%',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    color: colors.dark
                  }}>
                    ❌
                  </div>
                </div>
              </div>
              
              <h2 style={{ 
                fontSize: '1.8rem', 
                fontWeight: 'bold', 
                color: colors.danger, 
                marginBottom: '1rem' 
              }}>
                Access Denied
              </h2>
              <p style={{ 
                color: colors.gray, 
                marginBottom: '0.5rem',
                fontSize: '1rem'
              }}>
                You don't have permission to access this dashboard.
              </p>
              <p style={{ 
                color: colors.gray, 
                fontSize: '0.85rem',
                fontStyle: 'italic'
              }}>
                Please contact your administrator for access to Class Measures Hub.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.lightGray }}>
      {/* ✅ Padding for fixed navigation header */}
      <main style={{ paddingTop: '5rem' }}>
        {/* Welcome Header with Logo */}
        <div style={{
          backgroundColor: colors.white,
          padding: '2rem',
          margin: '0 2rem 2rem 2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          textAlign: 'center',
          background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.lightGray} 100%)`,
          border: `3px solid ${colors.primary}20`
        }}>
          {/* Class Measures Hub Logo */}
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1rem',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: `conic-gradient(from 0deg, ${colors.primary} 0deg 180deg, ${colors.secondary} 180deg 360deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 6px 20px ${colors.primary}40`,
              position: 'relative'
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                background: colors.dark,
                borderRadius: '0 50% 50% 50%',
                transform: 'rotate(45deg)',
                position: 'absolute',
                right: '15px'
              }}></div>
              <div style={{
                width: '20px',
                height: '20px',
                background: colors.white,
                borderRadius: '50%',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                color: colors.dark
              }}>
                CM
              </div>
            </div>
            
            {/* Small accent badge */}
            <div style={{
              position: 'absolute',
              top: '2px',
              right: '10px',
              width: '24px',
              height: '24px',
              background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              boxShadow: `0 3px 10px ${colors.secondary}60`
            }}>
              ⚡
            </div>
          </div>
          
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem',
            letterSpacing: '-0.01em'
          }}>
            Welcome back, {user?.name}!
          </h1>
          
          <p style={{ 
            fontSize: '1.1rem', 
            color: colors.dark,
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            🎯 Ready to inspire the next generation with 21st-century skills?
          </p>
          
          <p style={{ 
            fontSize: '0.95rem', 
            color: colors.gray,
            fontStyle: 'italic'
          }}>
            {user?.role === 'admin' && "Manage students, programs, platforms & resources across your education hub"}
            {user?.role === 'tutor' && "Track student progress and deliver engaging coding, chess, and digital literacy lessons"}
            {user?.role === 'parent' && "Monitor your child's journey through our innovative skill-building programs"}
          </p>

          {/* Role-specific quick info */}
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: user?.role === 'admin' ? `${colors.primary}15` : 
                             user?.role === 'tutor' ? `${colors.secondary}15` : `${colors.info}15`,
            borderRadius: '2rem',
            display: 'inline-block',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: user?.role === 'admin' ? colors.primary : 
                   user?.role === 'tutor' ? colors.dark : colors.info
          }}>
            {user?.role === 'admin' && "🔧 Administrator Dashboard"}
            {user?.role === 'tutor' && "📚 Educator Dashboard"}  
            {user?.role === 'parent' && "👨‍👩‍👧‍👦 Parent Dashboard"}
          </div>
        </div>
        
        {renderDashboardContent()}
      </main>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;