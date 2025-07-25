import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, LogIn, Shield } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Class Measures Brand Colors
  const colors = {
    primary: '#c55c5c',
    secondary: '#f4c842',
    dark: '#1e1e3c',
    white: '#ffffff',
    gray: '#6b7280',
    lightGray: '#f3f4f6'
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Simple fake login for testing
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Fake login - just show error for now
    setTimeout(() => {
      toast.error('Use the orange admin button instead!');
      setLoading(false);
    }, 1000);
  };

  // 🔧 ADMIN BYPASS FUNCTION  
  const handleAdminLogin = () => {
    const adminUser = {
      id: 1,
      email: 'admin@admin.com',
      name: 'Temp Admin',
      role: 'admin'
    };
    
    localStorage.setItem('token', 'temp-admin-token-12345');
    localStorage.setItem('user', JSON.stringify(adminUser));
    
    toast.success('🔧 Admin Access Granted!');
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 50%, ${colors.dark}15 100%)`
    }}>
      <div style={{
        maxWidth: '28rem',
        width: '100%',
        padding: '2.5rem',
        backgroundColor: colors.white,
        borderRadius: '1rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        margin: '0 1rem',
        border: `3px solid ${colors.primary}20`
      }}>
        {/* Logo and Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 1rem',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            color: colors.white
          }}>
            📚
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.dark, marginBottom: '0.5rem' }}>
            Class Measures Hub
          </h2>
          <p style={{ fontSize: '0.875rem', color: colors.gray }}>Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.dark, marginBottom: '0.5rem' }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `2px solid ${colors.lightGray}`,
                borderRadius: '0.5rem',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
                backgroundColor: colors.white
              }}
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = colors.lightGray}
              placeholder="Enter your email"
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.dark, marginBottom: '0.5rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  paddingRight: '3rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = colors.primary}
                onBlur={(e) => e.target.style.borderColor = colors.lightGray}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: colors.gray
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0.875rem 1rem',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.dark})`,
              color: colors.white,
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {loading ? (
              <div style={{
                animation: 'spin 1s linear infinite',
                borderRadius: '50%',
                height: '1rem',
                width: '1rem',
                border: '2px solid transparent',
                borderBottom: `2px solid ${colors.white}`
              }}></div>
            ) : (
              <>
                <LogIn size={16} style={{ marginRight: '0.5rem' }} />
                Sign In (Disabled - Use Orange Button)
              </>
            )}
          </button>
        </form>

        {/* 🔧 ADMIN BYPASS SECTION */}
        <div style={{ margin: '2rem 0', textAlign: 'center' }}>
          <div style={{ 
            height: '1px', 
            background: colors.lightGray, 
            margin: '1.5rem 0',
            position: 'relative'
          }}>
            <span style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: colors.white,
              padding: '0 1rem',
              fontSize: '0.75rem',
              color: colors.gray,
              fontWeight: '500'
            }}>SIMPLIFIED MODE</span>
          </div>
          
          <button
            type="button"
            onClick={handleAdminLogin}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '1rem',
              background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
              color: colors.white,
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(255,107,53,0.3)',
              marginBottom: '0.5rem'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(255,107,53,0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(255,107,53,0.3)';
            }}
          >
            <Shield size={18} style={{ marginRight: '0.5rem' }} />
            🔧 CLICK HERE - ADMIN ACCESS
          </button>
          
          <p style={{ 
            fontSize: '0.75rem', 
            color: '#ff6b35', 
            fontWeight: '500',
            margin: '0'
          }}>
            ⚠️ This bypasses all authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;