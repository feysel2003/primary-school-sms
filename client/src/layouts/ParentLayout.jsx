import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useTheme } from '../hooks/ThemeContext';
import { Home, Wallet, MessageSquare, CalendarClock, LogOut, Sun, Moon, Bell } from 'lucide-react';

const ParentLayout = () => {
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // The Bottom Nav Tabs for the Parent Super-App
  const navItems =[
    { name: 'Dashboard', icon: Home, path: '/parent', exact: true },
    { name: 'Finance', icon: Wallet, path: '/parent/finance' },
    { name: 'Leave', icon: CalendarClock, path: '/parent/leave' },
    { name: 'Messages', icon: MessageSquare, path: '/parent/messages' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20 md:pb-0 md:pt-16 transition-colors duration-300">
      
      {/* ========================================== */}
      {/* DESKTOP/TABLET TOP NAVIGATION              */}
      {/* ========================================== */}
      <nav className="hidden md:block fixed top-0 w-full bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold shadow-md">S</div>
              <span className="font-extrabold text-xl text-gray-900 dark:text-white">Family Portal</span>
            </div>

            {/* Desktop Center Links */}
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) => `
                    flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all
                    ${isActive ? 'bg-blue-50 text-primary dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700'}
                  `}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
              </button>
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={handleLogout} className="flex items-center space-x-2 text-red-500 font-bold hover:bg-red-50 px-3 py-2 rounded-lg transition">
                <LogOut size={18} />
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ========================================== */}
      {/* MOBILE TOP HEADER                          */}
      {/* ========================================== */}
      <header className="md:hidden bg-white dark:bg-slate-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold shadow-md">S</div>
          <span className="font-extrabold text-lg text-gray-900 dark:text-white">Family Portal</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-500 bg-gray-100 dark:bg-slate-700 rounded-full relative">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-700"></span>
          </button>
          <button onClick={handleLogout} className="p-2 text-red-500 bg-red-50 dark:bg-red-900/30 rounded-full">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* ========================================== */}
      {/* MAIN CONTENT AREA                          */}
      {/* ========================================== */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* ========================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR               */}
      {/* ========================================== */}
   <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `
                flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200
                ${isActive ? 'text-primary dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'}
              `}
            >
              {/* WE PASS THE FUNCTION HERE INSTEAD OF THE ICON! */}
              {({ isActive }) => (
                <>
                  <item.icon size={24} className={isActive ? 'fill-blue-50 dark:fill-blue-900/30' : ''} />
                  <span className="text-[10px] font-bold">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

    </div>
  );
};

export default ParentLayout;