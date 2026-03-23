import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Users, CheckCircle } from 'lucide-react';

const TeacherDashboard = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-400 rounded-lg">
          <Users size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teacher Portal</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your classroom attendance and grades.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 border border-gray-200 dark:border-gray-700 text-center">
        <CheckCircle size={48} className="mx-auto text-secondary mb-4" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Daily Roll Call (Coming Soon)</h2>
        <p className="text-gray-500 mt-2">Here you will see a list of your students to mark them present or absent.</p>
      </div>
    </div>
  );
};

export default TeacherDashboard;