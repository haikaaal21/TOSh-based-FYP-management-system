import './App.css';
import LandingPage from './routes/landing_page/landing_page';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Custom404 from './routes/404/no-page';
import LoginPage from './routes/login/login_page';
import RegisterPage from './routes/register/register';
import { lazy } from 'react';
import { AuthUserProvider } from './context/AuthUserContext';
import RequireAuth from './utils/RequireAuth';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CheckAuth from './utils/CheckAuth';
import VerificationPage from './routes/verify';
import ForgotPassword from './routes/ForgotPassword';

const StaffDashboard = lazy(() => import('./routes/staff/dashboard'));
const StudentDashboard = lazy(() => import('./routes/student/dashboard'));
const KalPage = lazy(() => import('./components/KalPage'));


function App() {
  return (
    <>
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AuthUserProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="*" element={<Custom404 />} />
              <Route path="/verify" element={<VerificationPage />} />
              <Route path="/tinkermyalreadyfragilemind" element={<KalPage />} />

              <Route element={<CheckAuth />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgotPassword" element={<ForgotPassword />} />
              </Route>
              {/* Private Routes */}
              <Route element={<RequireAuth allowedRoles={['10601']} />}>
                <Route path="student/*" element={<StudentDashboard />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={['10602']} />}>
                <Route path="staff/*" element={<StaffDashboard />} />
              </Route>
            </Routes>
          </AuthUserProvider>
        </LocalizationProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
