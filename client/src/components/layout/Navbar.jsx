import { useAuth } from '../../context/AuthContext';

const Navbar = ({ activeView, setActiveView }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white border-b-3 border-primary shadow-sm">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <img 
                src="/class-measures-logo.png" 
                alt="Class Measures" 
                className="w-12 h-12 object-contain"
              />
              <h1 className="text-xl font-bold text-dark">
                Class Measures Hub
              </h1>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeView === 'dashboard' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </button>
              
              {(user.role === 'admin' || user.role === 'tutor') && (
                <button
                  onClick={() => setActiveView('students')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeView === 'students' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Students
                </button>
              )}
              
              {user.role === 'admin' && (
                <>
                  <button
                    onClick={() => setActiveView('programs')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      activeView === 'programs' 
                        ? 'bg-secondary text-dark' 
                        : 'text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    Programs
                  </button>
                  
                  <button
                    onClick={() => setActiveView('resources')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      activeView === 'resources' 
                        ? 'bg-yellow-500 text-white' 
                        : 'text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    Resources
                  </button>
                  
                  <button
                    onClick={() => setActiveView('sessions')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      activeView === 'sessions' 
                        ? 'bg-dark text-white' 
                        : 'text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    Sessions
                  </button>

                  <button
                    onClick={() => setActiveView('analytics')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      activeView === 'analytics' 
                        ? 'bg-yellow-500 text-white' 
                        : 'text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    Analytics
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-gray-100 rounded-full text-sm text-dark">
              {user.name} • {user.role}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
