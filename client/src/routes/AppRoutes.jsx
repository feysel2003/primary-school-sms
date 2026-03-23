import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../features/auth/Login';
import ProtectedRoute from './ProtectedRoute';
import ParentLayout from '../layouts/ParentLayout';

// A temporary placeholder for the actual dashboard content
const ParentDashboardContent = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 border border-gray-200 dark:border-gray-700 text-center">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Welcome to your Dashboard!</h2>
    <p className="text-gray-500 dark:text-gray-400">Your child's attendance and grades will appear here soon.</p>
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTE */}
        <Route path="/login" element={<Login />} />
        
        {/* PROTECTED ROUTES (Requires Login) */}
        <Route element={<ProtectedRoute allowedRoles={['PARENT']} />}>
          
          {/* PARENT ROUTES (Uses the Parent Navbar) */}
          <Route path="/parent" element={<ParentLayout />}>
            {/* The "index" route means this loads at exactly "/parent" */}
            <Route index element={<ParentDashboardContent />} />
            {/* We will add /parent/grades and /parent/attendance here later! */}
          </Route>

        </Route>

        {/* DEFAULT FALLBACK: If URL is unknown, send to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;