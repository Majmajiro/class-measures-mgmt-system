import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import StudentList from '../students/StudentList';
import SessionList from "../sessions/SessionList";
import ResourceList from "../resources/ResourceList";
import ProgramList from '../programs/ProgramList';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  // Class Measures Brand Colors
  const colors = {
    primary: '#c55c5c',    // Red/Coral from logo
    secondary: '#f4c842',   // Golden Yellow from logo
    dark: '#1e1e3c',       // Dark Navy from logo
    light: '#f8fafc',      // Light background
    white: '#ffffff',
    gray: '#6b7280',
    lightGray: '#f3f4f6'
  };

  const handleLogout = () => {
    logout();
  };

  const renderContent = () => {
    switch (activeView) {
      case 'students':
        return <StudentList />;
      case 'programs':
        return <ProgramList />;
      case 'resources':
        return <ResourceList />;
      case 'sessions':
        return <SessionList />;
      default:
        return (
          <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: colors.light }}>
            {/* Hero Section with Real Logo */}
            <div style={{ 
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.dark} 100%)`,
              color: colors.white,
              padding: '3rem 2rem', 
              borderRadius: '1rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                <img 
                  src="/class-measures-logo.png" 
                  alt="Class Measures Logo" 
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                  }}
                />
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
                  Class Measures Hub
                </h1>
              </div>
              <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                Welcome back, {user.name}!
              </p>
              <div style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                backgroundColor: colors.secondary,
                color: colors.dark,
                borderRadius: '2rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                {user.role} Dashboard
              </div>
            </div>

            <div style={{ 
              backgroundColor: colors.white, 
              padding: '2rem', 
              borderRadius: '1rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem', color: colors.dark }}>
                Quick Actions
              </h2>
              <p style={{ color: colors.gray, marginBottom: '2rem' }}>
                Manage your educational business efficiently
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <button
                  onClick={() => setActiveView('students')}
                  style={{ 
                    padding: '2rem', 
                    background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primary}25)`,
                    border: `2px solid ${colors.primary}30`,
                    borderRadius: '1rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-4px)';
                    e.target.style.boxShadow = `0 8px 25px ${colors.primary}30`;
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: colors.primary,
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>👥</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.dark, marginBottom: '0.5rem' }}>
                    Manage Students
                  </h3>
                  <p style={{ color: colors.gray, fontSize: '0.875rem', lineHeight: '1.5' }}>
                    Add, view, and edit student information across all programs
                  </p>
                </button>

                <button
                  onClick={() => setActiveView('programs')}
                  style={{ 
                    padding: '2rem', 
                    background: `linear-gradient(135deg, ${colors.secondary}15, ${colors.secondary}25)`,
                    border: `2px solid ${colors.secondary}30`,
                    borderRadius: '1rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-4px)';
                    e.target.style.boxShadow = `0 8px 25px ${colors.secondary}30`;
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: colors.secondary,
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>🎓</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.dark, marginBottom: '0.5rem' }}>
                    Manage Programs
                  </h3>
                  <p style={{ color: colors.gray, fontSize: '0.875rem', lineHeight: '1.5' }}>
                    Create and manage Coding, Chess, Robotics, French, and Reading programs
                  </p>
                </button>

                <button
                  onClick={() => setActiveView('resources')}
                  style={{ 
                    padding: '2rem', 
                    background: `linear-gradient(135deg, #f59e0b15, #f59e0b25)`,
                    border: `2px solid #f59e0b30`,
                    borderRadius: '1rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-4px)';
                    e.target.style.boxShadow = `0 8px 25px #f59e0b30`;
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#f59e0b',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>📚</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.dark, marginBottom: '0.5rem' }}>
                    Resource Catalog
                  </h3>
                  <p style={{ color: colors.gray, fontSize: '0.875rem', lineHeight: '1.5' }}>
                    Manage French books, English books, platforms with multi-tier pricing
                  </p>
                </button>

                <button
                  onClick={() => setActiveView('sessions')}
                  style={{ 
                    padding: '2rem', 
                    background: `linear-gradient(135deg, ${colors.dark}15, ${colors.dark}25)`,
                    border: `2px solid ${colors.dark}30`,
                    borderRadius: '1rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-4px)';
                    e.target.style.boxShadow = `0 8px 25px ${colors.dark}30`;
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: colors.dark,
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>📅</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.dark, marginBottom: '0.5rem' }}>
                    Sessions & Attendance
                  </h3>
                  <p style={{ color: colors.gray, fontSize: '0.875rem', lineHeight: '1.5' }}>
                    Schedule sessions and track student attendance
                  </p>
                </button>
              </div>

              {/* Statistics Section */}
              <div style={{ 
                marginTop: '3rem',
                padding: '2rem',
                background: `linear-gradient(135deg, ${colors.lightGray}, ${colors.white})`,
                borderRadius: '1rem',
                border: `1px solid ${colors.primary}20`
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.dark, marginBottom: '1.5rem', textAlign: 'center' }}>
                  🎉 Class Measures Hub - Complete Business Platform! 🎉
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.primary }}>✅</div>
                    <div style={{ fontSize: '0.875rem', color: colors.gray }}>Students Ready</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.secondary }}>🎓</div>
                    <div style={{ fontSize: '0.875rem', color: colors.gray }}>5 Programs</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>📚</div>
                    <div style={{ fontSize: '0.875rem', color: colors.gray }}>Resource Catalog</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.dark }}>🚀</div>
                    <div style={{ fontSize: '0.875rem', color: colors.gray }}>Business Ready</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.light }}>
      {/* Navigation with Real Logo */}
      <nav style={{
        backgroundColor: colors.white,
        borderBottom: `3px solid ${colors.primary}`,
        padding: '1rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {/* Logo and Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img 
                src="/class-measures-logo.png" 
                alt="Class Measures" 
                style={{
                  width: '50px',
                  height: '50px',
                  objectFit: 'contain'
                }}
              />
              <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.dark }}>
                Class Measures Hub
              </h1>
            </div>
            
            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setActiveView('dashboard')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: activeView === 'dashboard' ? colors.primary : 'transparent',
                  color: activeView === 'dashboard' ? colors.white : colors.gray,
                  border: activeView === 'dashboard' ? 'none' : `1px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                Dashboard
              </button>
              
              {(user.role === 'admin' || user.role === 'tutor') && (
                <button
                  onClick={() => setActiveView('students')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: activeView === 'students' ? colors.primary : 'transparent',
                    color: activeView === 'students' ? colors.white : colors.gray,
                    border: activeView === 'students' ? 'none' : `1px solid ${colors.lightGray}`,
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                >
                  Students
                </button>
              )}
              
              {user.role === 'admin' && (
                <>
                  <button
                    onClick={() => setActiveView('programs')}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: activeView === 'programs' ? colors.secondary : 'transparent',
                      color: activeView === 'programs' ? colors.dark : colors.gray,
                      border: activeView === 'programs' ? 'none' : `1px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    Programs
                  </button>
                  
                  <button
                    onClick={() => setActiveView('resources')}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: activeView === 'resources' ? '#f59e0b' : 'transparent',
                      color: activeView === 'resources' ? colors.white : colors.gray,
                      border: activeView === 'resources' ? 'none' : `1px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    Resources
                  </button>
                  
                  <button
                    onClick={() => setActiveView('sessions')}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: activeView === 'sessions' ? colors.dark : 'transparent',
                      color: activeView === 'sessions' ? colors.white : colors.gray,
                      border: activeView === 'sessions' ? 'none' : `1px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    Sessions
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* User Info & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              padding: '0.5rem 1rem',
              backgroundColor: colors.lightGray,
              borderRadius: '2rem',
              fontSize: '0.875rem',
              color: colors.dark
            }}>
              {user.name} • {user.role}
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: colors.primary,
                color: colors.white,
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#a04545'}
              onMouseOut={(e) => e.target.style.backgroundColor = colors.primary}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
