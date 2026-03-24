import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useTheme } from '../hooks/ThemeContext';
import { 
  LayoutDashboard, Users, GraduationCap, BookOpen, 
  Wallet, MessageSquare, FileText, Settings, 
  LogOut, Menu, Sun, Moon, User, ShieldAlert, Building2, CreditCard
} from 'lucide-react';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  const user = useSelector((state) => state.auth.user);
  const isSuperAdmin = user?.role === 'SUPER_ADMIN'; // <-- MAGIC: Detect the role!

  const [isMobileOpen, setIsMobileOpen] = useState(false); 
  const[isCollapsed, setIsCollapsed] = useState(false);   
  const [isProfileOpen, setIsProfileOpen] = useState(false); 

  const profileRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  },[]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // ==========================================
  // DYNAMIC SAAS MENUS
  // ==========================================
  
  // Menu for the PRINCIPAL (Manages 1 School)
  const schoolAdminMenu =[
    { name: 'Dashboard & MoE', icon: LayoutDashboard, path: '/school_admin', exact: true },
    { name: 'Admissions', icon: GraduationCap, path: '/school_admin/admissions' },
    { name: 'Student Directory', icon: Users, path: '/school_admin/students' },
    { name: 'Staff & HR', icon: Users, path: '/school_admin/staff' },
    { name: 'Academics', icon: BookOpen, path: '/school_admin/academics' },
    { name: 'Finance & Fees', icon: Wallet, path: '/school_admin/finance' },
    { name: 'Reports', icon: FileText, path: '/school_admin/reports' },
    { name: 'School Settings', icon: Settings, path: '/school_admin/settings' },
  ];

  // Menu for YOU (Manages 500 Schools)
  const superAdminMenu =[
    { name: 'Platform Overview', icon: ShieldAlert, path: '/admin', exact: true },
    { name: 'Manage Tenants (Schools)', icon: Building2, path: '/admin/schools' },
    { name: 'SaaS Subscriptions', icon: CreditCard, path: '/admin/billing' },
    { name: 'Global Configurations', icon: Settings, path: '/admin/settings' },
  ];

  // Automatically select the correct menu based on who logged in!
  const menuItems = isSuperAdmin ? superAdminMenu : schoolAdminMenu;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex overflow-hidden transition-colors duration-300">
      
      {isMobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'} ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-center overflow-hidden">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-md text-lg ${isSuperAdmin ? 'bg-red-500' : 'bg-primary'}`}>
              {isSuperAdmin ? 'SA' : 'S'}
            </div>
            {!isCollapsed && (
              <span className="font-extrabold text-xl ml-3 text-gray-900 dark:text-white tracking-tight whitespace-nowrap">
                {isSuperAdmin ? 'System Owner' : 'Admin Console'}
              </span>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2 custom-scrollbar overflow-x-hidden">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center px-3 py-3 rounded-xl font-semibold transition-all duration-200 group
                ${isActive 
                  ? (isSuperAdmin ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 shadow-sm' : 'bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-400 shadow-sm')
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'}
                ${isCollapsed ? 'justify-center' : 'justify-start space-x-3'}
              `}
              title={isCollapsed ? item.name : ""}
            >
              <item.icon size={22} className={`shrink-0 ${isCollapsed ? 'group-hover:scale-110 transition-transform' : ''}`} />
              {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl font-bold transition-all">
            <LogOut size={20} className="shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-30">
          <div className="flex items-center">
            <button onClick={() => setIsMobileOpen(true)} className="p-2 mr-3 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg lg:hidden"><Menu size={24} /></button>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:flex p-2 mr-4 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"><Menu size={20} /></button>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white hidden sm:block truncate max-w-[200px] md:max-w-md">
              {isSuperAdmin ? 'Global SaaS Platform' : 'Hilawe Primary & Secondary School'}
            </h2>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-5 relative">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="relative" ref={profileRef}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 p-1 pr-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-full hover:shadow-md transition">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner ${isSuperAdmin ? 'bg-gradient-to-tr from-red-600 to-orange-400' : 'bg-gradient-to-tr from-primary to-blue-400'}`}>
                  {isSuperAdmin ? 'SA' : 'AD'}
                </div>
                <span className="hidden sm:block text-sm font-bold text-gray-700 dark:text-gray-200">
                  {isSuperAdmin ? 'System Owner' : 'School Admin'}
                </span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{isSuperAdmin ? 'Super Admin' : 'School Admin'}</p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate mt-0.5">{user?.phone}</p>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 flex items-center space-x-2 transition">
                      <LogOut size={16} /> <span>Sign Out safely</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-slate-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;