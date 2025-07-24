import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Toaster } from 'react-hot-toast';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Page Components
import Dashboard from './components/dashboard/Dashboard';
import StudentList from './components/students/StudentList';
import SessionList from './components/sessions/SessionList';
import SessionCalendar from './components/sessions/SessionCalendar';
import ResourceList from './components/resources/ResourceList';
import ProgramList from './components/programs/ProgramList';
import BusinessAnalytics from './components/analytics/BusinessAnalytics';
import TestTextarea from './pages/TestTextarea';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="App">
            {/* NO NAVIGATION - Clean interface */}
            
            <Toaster 
              position="top-right"
              toastOptions={{
                style: {
                  background: '#ffffff',
                  color: '#1e1e3c',
                  border: '2px solid #c55c5c',
                  borderRadius: '0.75rem',
                  fontWeight: '500'
                },
                success: {
                  iconTheme: {
                    primary: '#c55c5c',
                    secondary: '#ffffff'
                  }
                }
              }}
            />
            
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/test-textarea" element={<TestTextarea />} />
              
              {/* Protected Routes - No pt-20 padding needed */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/students" 
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-light">
                      <StudentList />
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/sessions" 
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-light">
                      <SessionList />
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/sessions/calendar" 
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-light">
                      <SessionCalendar />
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/resources" 
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-light">
                      <ResourceList />
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/programs" 
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-light">
                      <ProgramList />
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-light">
                      <BusinessAnalytics />
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/attendance" 
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-light p-6">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-dark mb-4">📋 Attendance Management</h2>
                        <p className="text-gray-600">Attendance management interface coming soon...</p>
                      </div>
                    </div>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;