import { BiBook, BiSolidBookBookmark } from 'react-icons/bi';
import { FaCalendar } from 'react-icons/fa';
import SparesWhite from '../../../assets/svg/s_white.svg';
import { useContext } from 'react';
import AuthUser from '../../../context/AuthUserContext';
import { MdPeople } from 'react-icons/md';
import { FaFileCircleExclamation } from 'react-icons/fa6';

interface SupervisorDiv {
  changeActive: (e: any) => void;
}

const SupervisorDiv: React.FC<SupervisorDiv> = (props) => {
  const { auth } = useContext(AuthUser);

  return (
    <div id="student" className="sb-contents">
      <button
        id=""
        name="home"
        className="nav-button"
        onClick={props.changeActive}>
        <span>
          <img
            style={{
              aspectRatio: '1/1',
              scale: '0.7',
              objectFit: 'contain',
            }}
            src={SparesWhite}
            alt="Spares"
          />
        </span>
        <p>Home</p>
      </button>
      {auth.user.role.includes('Supervisor') ? (
        <button
          id="projects"
          className="nav-button"
          onClick={props.changeActive}>
          <span>
            <BiBook />
          </span>
          <p>Projects</p>
        </button>
      ) : null}
      <button
        id="deadlines"
        className="nav-button"
        onClick={props.changeActive}>
        <span>
          <BiSolidBookBookmark />
        </span>
        <p>Deadlines</p>
      </button>
      <button id="events" className="nav-button " onClick={props.changeActive}>
        <span>
          <FaCalendar />
        </span>
        <p>Events</p>
      </button>
      {auth.user.role.includes('Coordinator') ? (
        <>
          <button
            id="batch"
            className="nav-button "
            onClick={props.changeActive}>
            <span>
              <MdPeople />
            </span>
            <p>Batch</p>
          </button>
          <button
            id="complaints"
            className="nav-button "
            onClick={props.changeActive}>
            <span>
              <FaFileCircleExclamation />
            </span>
            <p>Complaints</p>
          </button>
        </>
      ) : null}
    </div>
  );
};

export default SupervisorDiv;
