import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  Settings,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { icon: Home, label: 'Dashboard', href: '#' },
    ];

    if (user.role === 'admin') {
      return [
        ...baseItems,
        { icon: Users, label: 'Students', href: '#students' },
        { icon: BookOpen, label: 'Programs', href: '#programs' },
        { icon: Users, label: 'Tutors', href: '#tutors' },
        { icon: Calendar, label: 'Sessions', href: '#sessions' },
        { icon: BarChart3, label: 'Reports', href: '#reports' },
        { icon: Settings, label: 'Settings', href: '#settings' },
      ];
    }

    if (user.role === 'tutor') {
      return [
        ...baseItems,
        { icon: Calendar, label: 'My Sessions', href: '#sessions' },
        { icon: Users, label: 'My Students', href: '#students' },
        { icon: BarChart3, label: 'Attendance', href: '#attendance' },
      ];
    }

    if (user.role === 'parent') {
      return [
        ...baseItems,
        { icon: Users, label: 'My Children', href: '#children' },
        { icon: Calendar, label: 'Schedule', href: '#schedule' },
        { icon: BarChart3, label: 'Progress', href: '#progress' },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div>
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 20
          }}
          onClick={onClose}
        />
      )}

      <div style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '16rem',
        backgroundColor: 'white',
        borderRight: '1px solid #e5e7eb',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 30
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Menu</h2>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              borderRadius: '0.375rem',
              color: '#4b5563',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <nav style={{ marginTop: '1.5rem', padding: '0 1rem' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <li key={index} style={{ marginBottom: '0.5rem' }}>
                  
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      color: '#4b5563',
                      textDecoration: 'none',
                      borderRadius: '0.375rem',
                      transition: 'all 0.2s'
                    }}
                    onClick={onClose}
                  >
                    <IconComponent size={20} style={{ marginRight: '0.75rem' }} />
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
