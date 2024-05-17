import { BiBook, BiSolidBookBookmark } from 'react-icons/bi';
import { FaCalendar } from 'react-icons/fa';
import { MdPeople } from 'react-icons/md';

interface SupervisorDiv {
  changeActive: (e: any) => void;
}

const SupervisorDiv: React.FC<SupervisorDiv> = (props) => {
  return (
    <div id="student" className="sb-contents">
      <button
        id=""
        name="home"
        className="nav-button"
        onClick={props.changeActive}>
        <span>Icon Here</span>
        <p>Icon name here</p>
      </button>
      <button
        id=""
        name="batches"
        className="nav-button"
        onClick={props.changeActive}>
        <span>
          <MdPeople />
        </span>
        <p>Batches</p>
      </button>
      <button id="project" className="nav-button" onClick={props.changeActive}>
        <span>
          <BiBook />
        </span>
        <p>Projects</p>
      </button>
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
    </div>
  );
};

export default SupervisorDiv;
