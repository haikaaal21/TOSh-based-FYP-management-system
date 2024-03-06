import './App.css'
import LandingPage from './routes/landing_page/landing_page';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Custom404 from './routes/404/no-page';
import LoginPage from "./routes/login/login_page";
import RegisterPage from './routes/register/register';
import { lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './utils/RequireAuth';


const StudentDashboard = lazy(() => import('./routes/student/dashboard'));
const StaffDashboard = lazy(() => import('./routes/staff/dashboard'));

function App() {
  
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Custom404 />} />

              {/* Private Routes */}
              <Route element={<RequireAuth />} >
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/staff/dashboard" element={<StaffDashboard />} />
              </Route>
            </Routes>
          </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
