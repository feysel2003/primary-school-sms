import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
  // Grab the user and auth status from our Redux store
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // 1. If they are not logged in, kick them to the login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If this route requires specific roles (e.g., only PARENT), check it
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If a parent tries to access the Admin page, send them back to their dashboard
    return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
  }

  // 3. If they pass all checks, let them see the page! (<Outlet /> renders the child component)
  return <Outlet />;
};

export default ProtectedRoute;