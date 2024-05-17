import { useLocation, Navigate, Outlet } from 'react-router';
import useAuth from '../hooks/auth/useAuth';

function RequireAuth({ allowedRoles }: { allowedRoles?: string[] }) {
  const { auth } = useAuth();
  const location = useLocation();

  return auth.auth ? (
    allowedRoles?.includes(auth.role) ? (
      <Outlet />
    ) : (
      <Navigate to="/404" /> //! Change this to forbidden!
    )
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} />
  );
}

export default RequireAuth;
