import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { LogOut, Settings } from 'lucide-react';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* ADMIN BLACK NAVIGATION BAR */}
      <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Settings className="text-secondary" />
              <span className="font-bold text-xl">School Admin Console</span>
            </div>
            <button onClick={handleLogout} className="flex items-center space-x-1 text-red-400 hover:bg-gray-800 px-3 py-2 rounded-lg transition">
              <LogOut size={18} /> <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;