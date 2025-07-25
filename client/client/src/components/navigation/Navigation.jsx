import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/students', label: 'Students', icon: '👨‍🎓' },
    { path: '/sessions', label: 'Sessions', icon: '📅' },
    { path: '/sessions/calendar', label: 'Calendar', icon: '🗓️' },
    { path: '/programs', label: 'Programs', icon: '📚' },
    { path: '/resources', label: 'Resources', icon: '📖' },
    { path: '/attendance', label: 'Attendance', icon: '✅' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/test-textarea', label: 'Test Area', icon: '🧪' }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Hide navigation on login/register pages
  const hideOnPages = ['/login', '/register'];
  if (hideOnPages.includes(location.pathname)) {
    return null;
  }

  return (
    <>
      {/* Top Header with Hamburger */}
      <header className="bg-white shadow-md border-b-3 border-primary fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CM</span>
                </div>
                <h1 className="text-xl font-bold text-dark">
                  Class <span className="text-primary">Measures</span> <span className="text-secondary">Hub</span>
                </h1>
              </Link>
            </div>

            {/* Hamburger Button */}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-dark hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon */}
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`bg-dark block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                <span className={`bg-dark block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`bg-dark block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-dark bg-opacity-50 z-40 transition-opacity"
          onClick={closeMenu}
        ></div>
      )}

      {/* Slide-out Menu */}
      <nav className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Menu Header */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Navigation Menu</h2>
            <button
              onClick={closeMenu}
              className="text-white hover:text-yellow-200 transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={`flex items-center px-6 py-4 text-base font-medium transition-colors border-l-4 ${
                  isActive
                    ? 'bg-primary/10 text-primary border-primary'
                    : 'text-dark hover:bg-light hover:text-primary border-transparent hover:border-primary/30'
                }`}
              >
                <span className="mr-4 text-xl">{item.icon}</span>
                {item.label}
                {isActive && (
                  <span className="ml-auto">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-light border-t">
          <div className="text-sm text-gray-600 text-center">
            <span className="text-primary font-medium">Class Measures Hub</span>
            <br />
            <span className="text-xs">Education Management System</span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;