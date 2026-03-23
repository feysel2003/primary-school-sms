import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../features/auth/Login';
import ProtectedRoute from './ProtectedRoute';
import ParentLayout from '../layouts/ParentLayout';
import AdminLayout from '../layouts/AdminLayout';
import ParentDashboard from '../features/students/ParentDashboard';
import TeacherDashboard from '../features/attendance/TeacherDashboard';

// A temporary placeholder for the Admin Dashboard
const AdminDashboard = () => (
  <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow text-center">
    <h1 className="text-2xl font-bold dark:text-white">Admin Statistics Here</h1>
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* === PARENT ROUTES === */}
        <Route element={<ProtectedRoute allowedRoles={['PARENT']} />}>
          <Route path="/parent" element={<ParentLayout />}>
            <Route index element={<ParentDashboard />} />
          </Route>
        </Route>

        {/* === TEACHER ROUTES === */}
        <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
          <Route path="/teacher" element={<ParentLayout />}> {/* Reusing ParentLayout for top nav for now */}
            <Route index element={<TeacherDashboard />} />
          </Route>
        </Route>

        {/* === SCHOOL ADMIN ROUTES === */}
        <Route element={<ProtectedRoute allowedRoles={['SCHOOL_ADMIN']} />}>
          <Route path="/school_admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;