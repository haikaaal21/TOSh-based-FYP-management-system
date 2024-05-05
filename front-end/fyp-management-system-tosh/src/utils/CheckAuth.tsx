import { useLocation, Navigate, Outlet } from 'react-router'
import AuthUser from '../context/AuthUserContext'
import { useContext, useEffect, useState } from 'react'

function CheckAuth() {
    const { loginUser, user } = useContext(AuthUser)
    const location = useLocation()
    const [hasLocalStorage, setHasLocalStorage] = useState(false)

    const checkLocalStorage = () => {
        if(Object.keys(user).length === 0) {
            const localUser = JSON.parse(localStorage.getItem('user') as string);
            const localRole = JSON.parse(localStorage.getItem('role') as string);
            const localAuth = localStorage.getItem('auth')

            console.log(localUser, localRole, localAuth);

            if (localUser && localRole && localAuth === 'true') {
                loginUser(localUser, localRole)
                setHasLocalStorage(true)
                console.log('Actual User Context', user);
            }
        }
    }

    useEffect(() => {
        checkLocalStorage()
    }, [])


    return hasLocalStorage || Object.keys(user).length>0 ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location.pathname }} />
    )
}

export default CheckAuth
