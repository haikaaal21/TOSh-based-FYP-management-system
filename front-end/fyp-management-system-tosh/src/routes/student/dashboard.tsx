import Sidebar from '../../components/dashboard/Sidebar';
import '../../styles/dashboardStyle.css';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import { Breadcrumbs } from '@mui/material';
import { useLocation } from 'react-router';
import '../../styles/breadcrumbStyle.css';
import SparesLogoS from '../../components/svgcomponents/spares_logo_s';

//? Routes (Use lazy loading on production)
import ComplaintsPage from '../../components/dashboard/panels/ComplaintsPage';
import EventsPage from '../../components/dashboard/panels/EventsPage';
import ProjectsPage from '../../components/dashboard/panels/ProjectsPage';
import MainPage from '../../components/dashboard/panels/MainPage';
import DeadlinesPage from '../../components/dashboard/panels/DeadlinesPage';
import YourProjectPage from '../../components/dashboard/panels/YourProjectPage';
import ProfilePage from '../../components/dashboard/panels/ProfilePage';
import TaskPage from '../../components/dashboard/panels/TaskPage';
import EventPage from '../../components/dashboard/panels/EventPage';
import CreateComplaint from '../../components/dashboard/CreateComplaint';
import ComplaintPage from '../../components/dashboard/panels/ComplaintPage';
import TransitionHOC from '../../hooks/transition/TransitionHOC';
import CheckProject from '../../utils/CheckProject';
import NoPage from '../../components/dashboard/panels/NoPagePanel';
import UserProject from '../../components/dashboard/panels/UserProjectPage';

/**
 *
 * TODO:
 */
const studentDashboard = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  useEffect(() => {
    document.title = 'SPARES | Student';
  }, []);

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
            const first = index === 0;
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            return first ? (
              <a href={to} key={to}>
                home
              </a>
            ) : (
              <a href={to} key={to}>
                {value}
              </a>
            );
          })}
        </Breadcrumbs>
        <Routes>
          <Route path="/" element={TransitionHOC(MainPage)} />
          <Route
            path="/project/:projectid/*"
            element={TransitionHOC(YourProjectPage)}
          />
          <Route path="/project/*" element={TransitionHOC(ProjectsPage)} />
          <Route
            path="/project/yourproject/:projectid"
            element={TransitionHOC(YourProjectPage)}
          />
          <Route path="/deadlines/*" element={TransitionHOC(DeadlinesPage)} />
          <Route path="/events/*" element={TransitionHOC(EventsPage)} />
          <Route path="/complaints/*" element={TransitionHOC(ComplaintsPage)} />
          <Route path="/profile/:id" element={TransitionHOC(ProfilePage)} />
          <Route path="/event/:eventid" element={TransitionHOC(EventPage)} />
          <Route path="/task/:taskid" element={TransitionHOC(TaskPage)} />
          <Route
            path="/complaints/create"
            element={TransitionHOC(CreateComplaint)}
          />
          <Route path="*" element={TransitionHOC(NoPage)} />
          <Route
            path="/complaint/:complaintid"
            element={TransitionHOC(ComplaintPage)}
          />
          <Route path="/MyProject" element={TransitionHOC(UserProject)} />
        </Routes>
      </main>
      <div style={{ height: '3.8rem' }}></div>
      <p style={{marginBottom:'1.5rem'}} className='subtitle'>Unstable build - Beta 1.0</p>
      <div id="mobile-separator" style={{ height: '3.8rem' }}></div>
    </div>
  );
};

export default studentDashboard;
