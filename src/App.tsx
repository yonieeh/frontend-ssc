//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AboutUs } from './pages/AboutUs';
import LandingPage from './pages/landing';
import './App.css'
import './index.css'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;