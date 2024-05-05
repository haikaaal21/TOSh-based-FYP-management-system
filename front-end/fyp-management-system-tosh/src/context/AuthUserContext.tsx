import { createContext, useEffect, useState } from 'react'
import User from '../types/userType'

const AuthUser = createContext({} as any)

const getInitialAuth = () => {
    const auth = localStorage.getItem('Auth');
    console.log(auth);
    if (auth) {
        return JSON.parse(auth);
    } else {
        return {
            auth: false,
            role: '',
            user: {} as User
        }
    }
}

export const AuthUserProvider = ({ children }: any) => {
    const [auth, setAuth] = useState(getInitialAuth);

    useEffect(() => {
        if(Object.keys(auth.user).length > 0) {
            localStorage.setItem('Auth', JSON.stringify(auth));
        } else if (Object.keys(auth.user).length === 0) {
            localStorage.removeItem('Auth');
        }
    }, [auth]);

    const loginUser = (newUserData: any, role: string) => {
        console.log(newUserData);
        setAuth({
            auth: true,
            role: role,
            user: newUserData as User
        });
    }

    const logoutUser = () => {
        setAuth({
            auth: false,
            role: '',
            user: {} as User
        })
    }

    return (
        <AuthUser.Provider value={{ auth, loginUser, logoutUser }}>
            {children}
        </AuthUser.Provider>
    )
}

export default AuthUser
