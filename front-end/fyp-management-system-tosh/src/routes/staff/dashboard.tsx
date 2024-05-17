import '../../styles/dashboardStyle.css';
import '../../styles/breadcrumbStyle.css';
import Sidebar from '../../components/dashboard/Sidebar';
import { Breadcrumbs } from '@mui/material';
import { Route, Routes, useLocation } from 'react-router';
import SparesLogoS from '../../components/svgcomponents/spares_logo_s';
import ProfilePage from '../../components/dashboard/panels/ProfilePage';
import StaffMainPage from '../../components/dashboard/panels/StaffMainPage';
import DeadlinesPage from '../../components/dashboard/panels/DeadlinesPage';
import EventsPage from '../../components/dashboard/panels/EventsPage';

const staffDashboard = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className="dashboard">
      <Sidebar student={false} />
      <main className="dashboard-contents">
        <Breadcrumbs className="bread">
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
          <Route path="/" element={<StaffMainPage />} />
          <Route path="deadlines/*" element={<DeadlinesPage />} />
          <Route path="/events/*" element={<EventsPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  );
};

export default staffDashboard;
