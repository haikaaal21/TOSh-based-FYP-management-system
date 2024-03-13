import './App.css'
import LandingPage from './routes/landing_page/landing_page';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Custom404 from './routes/404/no-page';
import LoginPage from "./routes/login/login_page";
import RegisterPage from './routes/register/register';
import { lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './utils/RequireAuth';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

/** TODO:
 * 10/03/2024 (Log update)
 * 1. Clear up the Registration Page
 * 2. Implement a cookie refresh backend session
 * 3. Implement an autonavigate if user is already logged in
 * 4. Implement a session timeout
 * 5. Make the Dashboard
 * 6. Use Motion framer for the animations
 * 
 * 11/03/2024 (Log update)
 * 1. Rombak Login Front-end
 */

const StudentDashboard = lazy(() => import('./routes/student/dashboard'));
const StaffDashboard = lazy(() => import('./routes/staff/dashboard'));

function App() {

  return (
    <>
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
            <Routes>
              {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<Custom404 />} />

              {/* Private Routes */}
                <Route element={<RequireAuth allowedRoles={["10601"]}/>}>
                  <Route path="student/*" element={<StudentDashboard />} />
                </Route>
                <Route element={<RequireAuth allowedRoles={["10602"]}/>}>
                  <Route path="staff/*" element={<StaffDashboard />} />
                </Route>
            </Routes>
          </AuthProvider>
        </LocalizationProvider>
      </BrowserRouter>
    </>
  )
}

export default App
