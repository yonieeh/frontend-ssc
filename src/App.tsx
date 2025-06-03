//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AboutUs from './pages/AboutUs';
import LandingPage from './pages/landing';
import Chat from './pages/chat';
import InstructionPage from './pages/instruction';
import LoginPage from './pages/login.tsx';
import RegisterPage from './pages/register';
import './App.css'
import './index.css'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<Chat />} />
		    <Route path="/instructions" element={<InstructionPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};

export default App;