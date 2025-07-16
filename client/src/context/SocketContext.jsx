import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io('http://localhost:5000', {
        auth: {
          userId: user.id,
          userRole: user.role
        }
      });

      newSocket.on('connect', () => {
        console.log('✅ Connected to server:', newSocket.id);
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Disconnected from server');
        setIsConnected(false);
      });

      newSocket.on('notification', (notification) => {
        console.log('🔔 New notification:', notification);
        setNotifications(prev => [notification, ...prev].slice(0, 10));
      });

      newSocket.on('attendance_marked', (data) => {
        setNotifications(prev => [{
          id: Date.now(),
          type: 'attendance',
          message: `Attendance marked for ${data.sessionName}`,
          timestamp: new Date()
        }, ...prev].slice(0, 10));
      });

      newSocket.on('session_created', (data) => {
        setNotifications(prev => [{
          id: Date.now(),
          type: 'session',
          message: `New session created: ${data.sessionName}`,
          timestamp: new Date()
        }, ...prev].slice(0, 10));
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    socket,
    isConnected,
    notifications,
    clearNotifications
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
