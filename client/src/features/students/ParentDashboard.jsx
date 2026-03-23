import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GraduationCap, CalendarCheck, FileText, User } from 'lucide-react';

const ParentDashboard = () => {
  const { t } = useTranslation();
  
  // Grab the user (and their children) from Redux!
  const user = useSelector((state) => state.auth.user);
  const children = user?.children ||[];

  return (
    <div className="space-y-6">
      
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Welcome back!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here is the latest update on your children.
        </p>
      </div>

      {/* Children Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.length > 0 ? (
          children.map((child) => (
            <div key={child.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-t-4 border-secondary overflow-hidden hover:shadow-xl transition-shadow duration-300">
              
              {/* Card Header (Student Name & Grade) */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-4">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-secondary rounded-full flex items-center justify-center">
                  <User size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    {child.firstName} {child.lastName}
                  </h2>
                  <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 space-x-1">
                    <GraduationCap size={16} />
                    <span>{child.grade}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Coming Soon) */}
              <div className="bg-gray-50 dark:bg-slate-700/50 p-4 grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:bg-blue-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-gray-600 transition text-primary dark:text-blue-400">
                  <CalendarCheck size={20} className="mb-1" />
                  <span className="text-xs font-bold">Attendance</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:bg-green-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-gray-600 transition text-secondary">
                  <FileText size={20} className="mb-1" />
                  <span className="text-xs font-bold">Grades</span>
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm text-center border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No children linked to this account yet.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ParentDashboard;