import { useLocation, Navigate, Outlet } from 'react-router'
import useAuth from '../hooks/auth/useAuth'

function RequireAuth({ allowedRoles }: { allowedRoles?: string[] }) {
    const { auth } = useAuth()
    const location = useLocation()

    return auth?.accessToken || auth.refreshToken ? (
        auth?.role?.find((role: string) => allowedRoles?.includes(role)) ? (
            <Outlet />
        ) : (
            <Navigate to="/404" />
        )
    ) : (
        <Navigate to="/login" state={{ from: location.pathname }} />
    )
}

export default RequireAuth
