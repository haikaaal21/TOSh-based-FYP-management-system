import { useContext } from 'react';
import AuthUser from '../context/AuthUserContext';
import { Outlet, useNavigate, useLocation } from 'react-router';

const CheckProject = () => {
  const { auth } = useContext(AuthUser);
  const goto = useNavigate();

  const location = useLocation();

  return (
    <>
      {auth.user.projectid !== null ? (
        goto(`${location.pathname}/yourproject/${auth.user.projectid}`)
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default CheckProject;
