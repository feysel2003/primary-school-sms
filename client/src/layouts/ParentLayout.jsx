import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/ThemeContext';
import { LogOut, Sun, Moon, User } from 'lucide-react';

const ParentLayout = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get the logged-in user from Redux
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout()); // Clears Redux and LocalStorage
    navigate('/login'); // Sends them back to the login screen
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">
      
      {/* TOP NAVIGATION BAR */}
      <nav className="bg-white dark:bg-slate-800 shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo / Title */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="font-bold text-xl text-primary dark:text-blue-400 hidden sm:block">
                Digital School
              </span>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-4">
              
              {/* Quick Theme Toggle */}
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* User Profile Info */}
              <div className="flex items-center space-x-2 bg-gray-50 dark:bg-slate-700 py-1 px-3 rounded-full border border-gray-200 dark:border-gray-600">
                <User size={16} className="text-gray-500 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.phone || 'Parent'}
                </span>
              </div>

              {/* LOGOUT BUTTON */}
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 px-3 py-2 rounded-lg transition font-medium text-sm"
              >
                <LogOut size={18} />
                <span className="hidden sm:block">Logout</span>
              </button>

            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* <Outlet /> is where the actual dashboard content will be injected! */}
        <Outlet />
      </main>

    </div>
  );
};

export default ParentLayout;