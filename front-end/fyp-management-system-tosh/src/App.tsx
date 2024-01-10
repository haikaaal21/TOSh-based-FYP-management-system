import './App.css'
import LandingPage from './routes/landing_page/landing_page'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import LoginPage from './routes/login/LoginPage';
import Custom404 from './routes/404/no-page';

function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Custom404 />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
