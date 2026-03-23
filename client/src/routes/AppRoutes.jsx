import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../features/auth/Login';

// Placeholder dashboards (We will build these later)
const AdminDashboard = () => <div className="p-10 text-2xl font-bold dark:text-white">Admin Dashboard (Coming Soon)</div>;
const ParentDashboard = () => <div className="p-10 text-2xl font-bold dark:text-white">Parent Dashboard (Coming Soon)</div>;

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes (Placeholders for now) */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/parent" element={<ParentDashboard />} />

        {/* Default fallback: Redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;