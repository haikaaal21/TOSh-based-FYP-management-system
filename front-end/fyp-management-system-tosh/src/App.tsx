import './App.css'
import React from 'react';
import LandingPage from './routes/landing_page/landing_page';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Custom404 from './routes/404/no-page';
import LoginPage from "./routes/login/login_page";
import RegisterPage from './routes/register/register';
import { lazy } from 'react';

const StudentDashboard = lazy(() => import('./routes/student/dashboard'));
const StaffDashboard = lazy(() => import('./routes/staff/dashboard'));


export const AuthContext = React.createContext({});

function App() {

  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Custom404 />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user/dashboard" element={<StudentDashboard />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
