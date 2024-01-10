import './App.css'
import LandingPage from './routes/landing_page/landing_page'
import {BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
