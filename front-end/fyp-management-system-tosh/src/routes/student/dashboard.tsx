import Sidebar from '../../components/dashboard/Sidebar'
import '../../styles/dashboardStyle.css'
import { useEffect } from 'react'
import { Route, Routes } from 'react-router'
import { Breadcrumbs } from '@mui/material'
import { useLocation } from 'react-router'
import '../../styles/breadcrumbStyle.css'
import SparesLogoS from '../../components/svgcomponents/spares_logo_s'

//? Routes (Use lazy loading on production)
import ComplaintsPage from '../../components/dashboard/panels/ComplaintsPage'
import EventsPage from '../../components/dashboard/panels/EventsPage'
import ProjectsPage from '../../components/dashboard/panels/ProjectsPage'
import MainPage from '../../components/dashboard/panels/MainPage'
import DeadlinesPage from '../../components/dashboard/panels/DeadlinesPage'
import YourProjectPage from '../../components/dashboard/panels/YourProjectPage'
import ProfilePage from '../../components/dashboard/panels/ProfilePage'

/**
 *
 * TODO:
 */
const studentDashboard = () => {
    const location = useLocation()
    const pathnames = location.pathname.split('/').filter((x) => x)

    useEffect(() => {
        document.title = 'SPARES'
    })

    return (
        <div className="dashboard">
            <Sidebar student={true} />
            <main className="dashboard-contents">
                <Breadcrumbs className="bread">
                    {/*Fix this*/}
                    <div style={{ width: '100%', height: '100%' }}>
                        <SparesLogoS />
                    </div>
                    {pathnames.map((value, index) => {
                        const first = index === 0
                        const to = `/${pathnames.slice(0, index + 1).join('/')}`
                        return first ? (
                            <a href={to} key={to}>
                                home
                            </a>
                        ) : (
                            <a href={to} key={to}>
                                {value}
                            </a>
                        )
                    })}
                </Breadcrumbs>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    {/*Make a logic switcher if the user already has a project or not*/}
                    <Route path="/project/*" element={<ProjectsPage />} />
                    <Route
                        path="/project/:projectid/*"
                        element={<YourProjectPage />}
                    />
                    <Route path="/deadlines/*" element={<DeadlinesPage />} />
                    <Route path="/events/*" element={<EventsPage />} />
                    <Route path="/complaints/*" element={<ComplaintsPage />} />
                    <Route path="/profile/:id" element={<ProfilePage />} />
                </Routes>
            </main>
            <div id="mobile-separator" style={{ height: '3.8rem' }}></div>
        </div>
    )
}

export default studentDashboard
