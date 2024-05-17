import { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import AuthUserContext from '../context/AuthUserContext';
import Loading from '../components/Loading';

function CheckAuth() {
  const { auth } = useContext(AuthUserContext);
  const [whereto, setWhereto] = useState<string>('');

  useEffect(() => {
    console.log('auth', auth);
    if (auth.role === '10601') setWhereto('/student');
    else if (auth.role === '10602') setWhereto('/staff');
  }, []);

  useEffect(() => {}, [auth]);

  return auth.auth ? (
    whereto !== '' ? (
      <Navigate to={whereto} />
    ) : (
      <Loading />
    )
  ) : (
    <Outlet />
  );
}

export default CheckAuth;
