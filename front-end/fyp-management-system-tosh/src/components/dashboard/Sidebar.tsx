import '../../styles/sidebar.css';
import { IoPerson } from 'react-icons/io5';
import StudentDiv from './divs/StudentDiv';
import { useNavigate, useLocation } from 'react-router';
import { useEffect, useContext } from 'react';
import AuthUser from '../../context/AuthUserContext';
import SupervisorDiv from './divs/SupervisorDiv';
import { BiAlignJustify } from 'react-icons/bi';
import { Drawer, Fab } from '@mui/material';

interface SidebarProps {
  student: boolean;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const goto = useNavigate();
  const current = '';
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const { auth } = useContext(AuthUser);

  const changeActive = (e: any) => {
    e.preventDefault();
    [...document.getElementsByClassName('nav-button')].forEach(
      (element: any) => {
        element.classList.remove('active');
      }
    );
    e.currentTarget.classList.add('active');
    goto(current + e.currentTarget.id);
  };

  useEffect(() => {
    if (pathnames.length === 1)
      document.getElementsByName('home')[0].classList.add('active');
    else {
      document.getElementById(pathnames[1])?.classList.add('active');
    }
  }, []);

  return (
    <div className="sidebar">
      {props.student ? (
        <StudentDiv changeActive={changeActive} />
      ) : (
        <SupervisorDiv changeActive={changeActive} />
      )}
      <div className="sb-contents"></div>
      <button
        id={`profile/${auth.user.id}`}
        className="nav-button profile-item"
        onClick={changeActive}>
        <span>
          <IoPerson />
        </span>
        <div className="profile">
          <h3 style={{ fontWeight: 'normal' }}>Profile</h3>
          <p>
            {auth.user.firstName} {auth.user.lastName}
          </p>
        </div>
      </button>
      <Fab
        className="drawer-button"
        onClick={(event) => {
          changeActive(event);
          goto(current + 'profile/' + auth.user.id);
        }}>
        <IoPerson />
      </Fab>
    </div>
  );
};

export default Sidebar;
