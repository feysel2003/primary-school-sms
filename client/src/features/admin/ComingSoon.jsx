import { Settings } from 'lucide-react';

const ComingSoon = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 mb-6 shadow-inner">
        <Settings size={40} className="animate-[spin_4s_linear_infinite]" />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{title}</h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">
        This enterprise module is currently under construction. It will be available in the next system update!
      </p>
    </div>
  );
};

export default ComingSoon;