import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import TutorDashboard from './TutorDashboard';
import ParentDashboard from './ParentDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-dark">Loading dashboard...</p>
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
          <div className="min-h-screen flex items-center justify-center bg-light">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-dark mb-2">Access Denied</h2>
              <p className="text-gray-600">You don't have permission to access this dashboard.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-light">
      {/* ✅ Padding for fixed navigation header */}
      <main className="pt-20">
        {renderDashboardContent()}
      </main>
    </div>
  );
};

export default Dashboard;