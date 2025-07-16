import { Calendar, Users, CheckCircle } from 'lucide-react';

const TutorDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tutor Dashboard</h2>
        <p className="text-gray-600">Manage your sessions and students</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Calendar size={24} className="text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Sessions</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users size={24} className="text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">My Students</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircle size={24} className="text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900">92%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div>
              <p className="font-medium">Coding - Beginner</p>
              <p className="text-sm text-gray-600">10:00 AM - 11:30 AM</p>
            </div>
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Today</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div>
              <p className="font-medium">Chess - Intermediate</p>
              <p className="text-sm text-gray-600">2:00 PM - 3:30 PM</p>
            </div>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
