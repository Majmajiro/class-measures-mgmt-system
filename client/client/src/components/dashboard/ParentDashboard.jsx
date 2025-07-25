import { User, Calendar, TrendingUp } from 'lucide-react';

const ParentDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Parent Dashboard</h2>
        <p className="text-gray-600">Track your child's progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <User size={24} className="text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Enrolled Children</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Calendar size={24} className="text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Week's Sessions</p>
              <p className="text-2xl font-bold text-gray-900">6</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp size={24} className="text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900">95%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Children's Progress</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-medium">John Doe</h4>
            <p className="text-sm text-gray-600">Coding Program - Beginner Level</p>
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-medium">Jane Doe</h4>
            <p className="text-sm text-gray-600">Chess Program - Intermediate Level</p>
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
