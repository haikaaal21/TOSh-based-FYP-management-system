import './App.css'
import LandingPage from './routes/landing_page/landing_page'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Custom404 from './routes/404/no-page';
import LoginPage from "./routes/login/login_page";
import RegisterPage from './routes/register/register';
import { lazy } from 'react';

function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Custom404 />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
