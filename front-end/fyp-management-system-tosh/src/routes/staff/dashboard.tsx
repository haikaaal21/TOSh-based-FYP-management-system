import '../../styles/dashboardStyle.css';
import '../../styles/breadcrumbStyle.css';
import Sidebar from '../../components/dashboard/Sidebar';
import { Breadcrumbs } from '@mui/material';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import ProfilePage from '../../components/dashboard/panels/ProfilePage';
import StaffMainPage from '../../components/dashboard/panels/StaffMainPage';
import TransitionHOC from '../../hooks/transition/TransitionHOC';
import MyProjectsPage from '../../components/dashboard/panels/MyProjectsPage';
import CreateProject from '../../components/dashboard/panels/CreateProject';
import { useContext, useEffect } from 'react';
import YourProjectPage from '../../components/dashboard/panels/YourProjectPage';
import StaffEventsPage from '../../components/dashboard/panels/StaffEventsPage';
import SparesLogoColored from '../../assets/images/s_colored.png';
import '../../styles/panels.css';
import AuthUser from '../../context/AuthUserContext';
import BatchesPage from '../../components/dashboard/panels/BatchesPage';
import CreateBatch from '../../components/dashboard/panels/CreateBatch';
import BatchPage from '../../components/dashboard/panels/BatchPage';
import ProjectApprovalPage from '../../components/dashboard/panels/ProjectApprovalPage';
import CreateItemPage from '../../components/dashboard/panels/CreateItemPage';
import { TaskContextProvider } from '../../context/TaskContext';
import { EventContextProvider } from '../../context/EventContext';
import ComplaintPage from '../../components/dashboard/panels/ComplaintPage';
import ComplaintsPage from '../../components/dashboard/panels/ComplaintsPage';
import StaffDeadlinesPage from '../../components/dashboard/panels/StaffDeadlinesPage';
import TaskPage from '../../components/dashboard/panels/TaskPage';
import EventPage from '../../components/dashboard/panels/EventPage';
import NoPage from '../../components/dashboard/panels/NoPagePanel';
import RequestsPage from '../../components/dashboard/panels/RequestsPage';
import Attendance from '../../components/dashboard/panels/Attendance';

const staffDashboard = () => {
  useEffect(() => {
    document.title = 'SPARES | Staff';
  }, []);

  const { auth } = useContext(AuthUser);
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className="dashboard">
      <Sidebar student={false} />
      <main className="dashboard-contents">
        <Breadcrumbs className="bread">
          <img
            style={{
              width: '20px',
              aspectRatio: '1/1',
              objectFit: 'contain',
            }}
            src={SparesLogoColored}
          />
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
          <Route path="/" element={TransitionHOC(StaffMainPage)} />
          <Route
            path="deadlines/*"
            element={TransitionHOC(StaffDeadlinesPage)}
          />
          <Route path="/events/*" element={TransitionHOC(StaffEventsPage)} />
          <Route path="/profile/:id" element={TransitionHOC(ProfilePage)} />
          <Route
            path="/projects/:projectid"
            element={TransitionHOC(YourProjectPage)}
          />
          {/**Supervisor Exclusives */}
          {auth.user.role.includes('Supervisor') ? (
            <>
              <Route
                path="/projects/"
                element={TransitionHOC(MyProjectsPage)}
              />
              <Route
                path="/projects/:projectid/requests"
                element={TransitionHOC(RequestsPage)}
              />
              <Route
                path="/projects/create"
                element={TransitionHOC(CreateProject)}
              />
            </>
          ) : null}
          {/**Coordinator Exclusives */}
          {auth.user.role.includes('Coordinator') ? (
            <>
              <Route path="/batch/" element={TransitionHOC(BatchesPage)} />
              <Route
                path="/batch/create"
                element={TransitionHOC(CreateBatch)}
              />
              <Route
                path="/batch/:batchid"
                element={TransitionHOC(BatchPage)}
              />
              <Route
                path="/projects/approval/:batchid"
                element={TransitionHOC(ProjectApprovalPage)}
              />
              <Route
                path="/complaints/"
                element={TransitionHOC(ComplaintsPage)}
              />
              <Route
                path="/complaint/:complaintid"
                element={TransitionHOC(ComplaintPage)}
              />
            </>
          ) : null}
          <Route
            path="/create"
            element={
              <EventContextProvider>
                <TaskContextProvider>
                  {TransitionHOC(CreateItemPage)}
                </TaskContextProvider>
              </EventContextProvider>
            }
          />
          <Route path="/task/:taskid" element={TransitionHOC(TaskPage)} />
          <Route path='/event/:eventid/attendance' element={TransitionHOC(Attendance)} />
          <Route path="/event/:eventid" element={TransitionHOC(EventPage)} />
          <Route path="/event" element={<Navigate to="../events" />} />
          <Route path="/task" element={<Navigate to="../deadlines" />} />
          <Route path="/complaint" element={<Navigate to="../complaints" />} />
          <Route path="/profile" element={<Navigate to="../" />} />
          <Route path="*" element={TransitionHOC(NoPage)} />
        </Routes>
      </main>
      <div style={{ height: '3.8rem' }}></div>
      <p style={{marginBottom:'1.5rem'}} className='subtitle'>Unstable build - Beta 1.0</p>
      <div id="mobile-separator" style={{ height: '3.8rem' }}></div>
    </div>
  );
};

export default staffDashboard;
