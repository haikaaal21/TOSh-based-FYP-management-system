import '../../styles/sidebar.css'
import { IoPerson } from 'react-icons/io5'
import StudentDiv from './divs/StudentDiv'
import { useNavigate, useLocation } from 'react-router'
import { useEffect } from 'react'

interface SidebarProps {
    student: boolean
}

const Sidebar: React.FC<SidebarProps> = (props) => {
    const goto = useNavigate()
    const current = ''
    const location = useLocation()
    const pathnames = location.pathname.split('/').filter((x) => x)

    /**TODO:
     * 2. Place Icons (50%)
     * 3. Place Icon Names (50%)
     * 4. Make the buttons clickable
     * 5. Make the sidebar identify on what type of sidebar it is
     * 6. Make the navigation work
     */

    const changeActive = (e: any) => {
        e.preventDefault()
        ;[...document.getElementsByClassName('nav-button')].forEach(
            (element: any) => {
                element.classList.remove('active')
            }
        )
        e.currentTarget.classList.add('active')
        goto(current + e.currentTarget.id)
    }

    useEffect(() => {
        if (pathnames.length === 1)
            document.getElementsByName('home')[0].classList.add('active')
        else {
            document.getElementById(pathnames[1])?.classList.add('active')
        }
    }, [])

    return (
        <div className="sidebar">
            {props.student ? <StudentDiv changeActive={changeActive} /> : <></>}
            <div className="sb-contents">
                <button
                    id="profile"
                    className="nav-button"
                    onClick={changeActive}
                >
                    <span>
                        <IoPerson />
                    </span>
                    <div className="profile">
                        <h3 style={{ fontWeight: 'normal' }}>Profile</h3>
                        <p>Profile Name</p>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default Sidebar
