//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AboutUs } from './pages/AboutUs';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/about-us" element={<AboutUs />} />

        <Route
          path="/"
          element={
            <div className="min-h-screen flex items-center justify-center bg-blue-500 text-white text-3xl">
              Tailwind is working!
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;