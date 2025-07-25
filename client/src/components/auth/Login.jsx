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

  const colors = {
    primary: '#c55c5c',
    secondary: '#f4c842',
    dark: '#1e1e3c',
    white: '#ffffff',
    gray: '#6b7280',
    lightGray: '#f3f4f6'
  };

  const handleAdminLogin = () => {
    localStorage.setItem('token', 'temp-admin-token-12345');
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      email: 'admin@admin.com',
      name: 'Temp Admin',
      role: 'admin'
    }));
    
    toast.success('🔧 Admin Access Granted!');
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #c55c5c15 0%, #f4c84215 50%, #1e1e3c15 100%)'
    }}>
      <div style={{
        maxWidth: '28rem',
        width: '100%',
        padding: '2.5rem',
        backgroundColor: colors.white,
        borderRadius: '1rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        margin: '0 1rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.dark }}>
            Class Measures Hub
          </h2>
          <p style={{ fontSize: '0.875rem', color: colors.gray }}>Admin Access</p>
        </div>
        
        <button
          type="button"
          onClick={handleAdminLogin}
          style={{
            width: '100%',
            padding: '1rem',
            background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(255,107,53,0.3)'
          }}
        >
          🔧 CLICK HERE - ADMIN ACCESS
        </button>
        
        <p style={{ 
          textAlign: 'center',
          fontSize: '0.8rem', 
          color: '#ff6b35', 
          marginTop: '1rem'
        }}>
          Simplified login - bypasses all authentication
        </p>
      </div>
    </div>
  );
};

export default Login;
