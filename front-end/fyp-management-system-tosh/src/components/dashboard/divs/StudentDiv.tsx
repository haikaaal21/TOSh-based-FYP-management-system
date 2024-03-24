import { MdPeopleAlt } from 'react-icons/md'
import { BiSolidBookBookmark } from 'react-icons/bi'
import { FaCalendar } from 'react-icons/fa'
import { FaFileCircleExclamation } from 'react-icons/fa6'

interface StudentDivProps {
    changeActive: (e: any) => void
}

const StudentDiv: React.FC<StudentDivProps> = (props) => {
    return (
        <div id="student" className="sb-contents">
            <button
                id=""
                name="home"
                className="nav-button"
                onClick={props.changeActive}
            >
                <span>Icon Here</span>
                <p>Icon name here</p>
            </button>
            <button
                id="project"
                className="nav-button"
                onClick={props.changeActive}
            >
                <span>
                    <MdPeopleAlt />
                </span>
                <p>Project</p>
            </button>
            <button
                id="deadlines"
                className="nav-button"
                onClick={props.changeActive}
            >
                <span>
                    <BiSolidBookBookmark />
                </span>
                <p>Deadlines</p>
            </button>
            <button
                id="events"
                className="nav-button "
                onClick={props.changeActive}
            >
                <span>
                    <FaCalendar />
                </span>
                <p>Events</p>
            </button>
            <button
                id="complaints"
                className="nav-button "
                onClick={props.changeActive}
            >
                <span>
                    <FaFileCircleExclamation />
                </span>
                <p>Complaints</p>
            </button>
        </div>
    )
}

export default StudentDiv
