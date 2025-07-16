import { useState, useEffect } from 'react';
import { studentsAPI, programsAPI, sessionsAPI } from '../../services/api';
import { Users, BookOpen, Calendar, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalPrograms: 0,
    todaySessions: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [studentsRes, programsRes, sessionsRes] = await Promise.all([
        studentsAPI.getAll(),
        programsAPI.getAll(),
        sessionsAPI.getAll({ date: new Date().toISOString().split('T')[0] })
      ]);

      setStats({
        totalStudents: studentsRes.data.students.length,
        totalPrograms: programsRes.data.programs.length,
        todaySessions: sessionsRes.data.sessions.length,
        activeUsers: studentsRes.data.students.filter(s => s.isActive).length
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600">Overview of Class Measures Hub</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Students"
          value={stats.totalStudents}
          color="bg-blue-500"
        />
        <StatCard
          icon={BookOpen}
          title="Active Programs"
          value={stats.totalPrograms}
          color="bg-green-500"
        />
        <StatCard
          icon={Calendar}
          title="Today's Sessions"
          value={stats.todaySessions}
          color="bg-purple-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Active Users"
          value={stats.activeUsers}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">New student registered</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Session completed</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Attendance marked</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md">
              Add New Student
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-md">
              Create Program
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-md">
              Schedule Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
