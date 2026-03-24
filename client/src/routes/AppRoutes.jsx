import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../features/auth/Login';
import ProtectedRoute from './ProtectedRoute';
import ParentLayout from '../layouts/ParentLayout';
import AdminLayout from '../layouts/AdminLayout';
import SuperAdminDashboard from '../features/super-admin/SuperAdminDashboard';
import Academics from '../features/admin/Academics';

// Feature Pages
import ParentDashboard from '../features/students/ParentDashboard';
import TeacherDashboard from '../features/attendance/TeacherDashboard';
import AdminDashboard from '../features/moe-report/AdminDashboard'; // Dashboard & MoE
import StudentRegistration from '../features/admin/StudentRegistration'; // Admissions
import UserManagement from '../features/admin/UserManagement'; // Staff
import ComingSoon from '../features/admin/ComingSoon'; // For the empty tabs!

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* PARENT ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['PARENT']} />}>
          <Route path="/parent" element={<ParentLayout />}>
            <Route index element={<ParentDashboard />} />
          </Route>
        </Route>

        {/* TEACHER ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
          <Route path="/teacher" element={<ParentLayout />}>
            <Route index element={<TeacherDashboard />} />
          </Route>
        </Route>

{/* === SUPER ADMIN ROUTES (System Owner) === */}
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="schools" element={<ComingSoon title="Tenant Management" />} />
            <Route path="billing" element={<ComingSoon title="SaaS Subscriptions" />} />
            <Route path="settings" element={<ComingSoon title="Global Settings" />} />
          </Route>
        </Route>

        {/* === SCHOOL ADMIN ROUTES (With Sidebar!) === */}
        <Route element={<ProtectedRoute allowedRoles={['SCHOOL_ADMIN']} />}>
          <Route path="/school_admin" element={<AdminLayout />}>
            {/* Matches "/school_admin" exactly */}
            <Route index element={<AdminDashboard />} /> 
            
            {/* Matches "/school_admin/admissions" */}
            <Route path="admissions" element={<StudentRegistration />} /> 
            
            {/* Matches "/school_admin/staff" */}
            <Route path="staff" element={<UserManagement />} /> 

            {/* "Coming Soon" Placeholders for the rest of the SaaS menu */}
            <Route path="students" element={<ComingSoon title="Student Directory" />} />
            <Route path="academics" element={<Academics />} />
            <Route path="finance" element={<ComingSoon title="Finance & Fee Management" />} />
            <Route path="messages" element={<ComingSoon title="Communications Hub" />} />
            <Route path="reports" element={<ComingSoon title="Advanced Reporting" />} />
            <Route path="settings" element={<ComingSoon title="System Settings" />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;